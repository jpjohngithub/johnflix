import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

/*
 * JohnFlix Auth — banco de dados em Netlify Blobs (sem servico externo).
 * Seguranca: scrypt + salt, comparacao em tempo constante, bloqueio por conta,
 * rate limit por IP, sessao JWT HS256 em cookie HttpOnly/Secure/SameSite=Strict,
 * checagem de Origin + header anti-CSRF, validacao estrita de entrada,
 * respostas genericas contra enumeracao de usuarios e headers de seguranca.
 */

const COOKIE = '__Host-jf_session';
const COOKIE_DEV = 'jf_session';
const SESSION_TTL = 7 * 24 * 3600;
const MAX_BODY = 256 * 1024;
const COMMON = new Set(['password', '12345678', '123456789', '1234567890', 'qwertyuiop', 'senha12345', 'password1', 'iloveyou1', 'abc12345678']);

const b64u = (b) => Buffer.from(b).toString('base64url');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

const SEC_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};

const json = (status, body, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...SEC_HEADERS, ...extra } });

let secretCache = null;
async function getSecret() {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32) return process.env.AUTH_SECRET;
  if (secretCache) return secretCache;
  const cfg = getStore({ name: 'jf-config', consistency: 'strong' });
  let s = await cfg.get('secret');
  if (!s) {
    s = crypto.randomBytes(48).toString('hex');
    await cfg.set('secret', s);
  }
  secretCache = s;
  return s;
}

async function signJwt(payload) {
  const secret = await getSecret();
  const head = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(`${head}.${body}`).digest('base64url');
  return `${head}.${body}.${sig}`;
}

async function verifyJwt(token) {
  try {
    const [h, b, s] = String(token).split('.');
    if (!h || !b || !s) return null;
    const secret = await getSecret();
    const expect = crypto.createHmac('sha256', secret).update(`${h}.${b}`).digest('base64url');
    const a = Buffer.from(s);
    const e = Buffer.from(expect);
    if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return null;
    const p = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
    if (!p.exp || p.exp < Math.floor(Date.now() / 1000)) return null;
    return p;
  } catch (e) {
    return null;
  }
}

function scryptHash(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

const DUMMY_SALT = Buffer.alloc(16, 7);

function sessionCookie(token, maxAge, req) {
  const isHttps = !req || (req.headers.get('x-forwarded-proto') || req.url || '').startsWith('https');
  const name = isHttps ? COOKIE : COOKIE_DEV;
  const sec = isHttps ? '; Secure' : '';
  return `${name}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly${sec}; SameSite=Strict`;
}

function readCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

async function currentUser(req) {
  const tok = readCookie(req, COOKIE) || readCookie(req, COOKIE_DEV);
  if (!tok) return null;
  const p = await verifyJwt(tok);
  if (!p) return null;
  const users = getStore({ name: 'jf-users', consistency: 'strong' });
  const u = await users.get(`u:${p.sub}`, { type: 'json' });
  if (!u || (u.tokenVersion || 0) !== (p.tv || 0)) return null;
  return u;
}

async function startSession(user, req) {
  const now = Math.floor(Date.now() / 1000);
  const token = await signJwt({ sub: user.key, tv: user.tokenVersion || 0, iat: now, exp: now + SESSION_TTL });
  return { 'Set-Cookie': sessionCookie(token, SESSION_TTL, req) };
}

const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, provider: u.provider });

function clientIp(req) {
  return (req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown').trim();
}

async function rateLimit(req, action, limit, windowSec) {
  const store = getStore({ name: 'jf-ratelimit', consistency: 'strong' });
  const key = `${action}:${sha(clientIp(req))}`;
  const now = Date.now();
  let rec = await store.get(key, { type: 'json' });
  if (!rec || rec.reset < now) rec = { count: 0, reset: now + windowSec * 1000 };
  rec.count += 1;
  await store.setJSON(key, rec);
  return rec.count <= limit ? 0 : Math.ceil((rec.reset - now) / 1000);
}

function validEmail(e) {
  return typeof e === 'string' && e.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(e);
}

function passwordProblem(p) {
  if (typeof p !== 'string') return 'Senha inválida.';
  if (p.length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
  if (p.length > 128) return 'A senha é longa demais.';
  if (!/[a-zA-Z]/.test(p) || !/\d/.test(p)) return 'A senha deve conter letras e números.';
  if (COMMON.has(p.toLowerCase())) return 'Essa senha é muito comum. Escolha outra.';
  return null;
}

function cleanName(n) {
  return String(n || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 60);
}

async function readBody(req) {
  const txt = await req.text();
  if (txt.length > MAX_BODY) throw new Error('payload');
  if (!txt) return {};
  return JSON.parse(txt);
}

function originOk(req) {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch (e) {
    return false;
  }
}

async function verifyGoogleIdToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) return null;
  const d = await res.json();
  if (d.aud !== clientId) return null;
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(d.iss)) return null;
  if (d.email_verified !== 'true' && d.email_verified !== true) return null;
  if (Number(d.exp) < Math.floor(Date.now() / 1000)) return null;
  return { email: String(d.email).toLowerCase(), name: cleanName(d.name || d.given_name || ''), sub: d.sub };
}

async function handleRegister(req) {
  const wait = await rateLimit(req, 'register', 6, 3600);
  if (wait) return json(429, { error: `Muitas tentativas. Tente em ${Math.ceil(wait / 60)} min.` });
  const body = await readBody(req);
  const email = String(body.email || '').trim().toLowerCase();
  if (!validEmail(email)) return json(400, { error: 'Informe um e-mail válido.' });
  const problem = passwordProblem(body.password);
  if (problem) return json(400, { error: problem });

  const users = getStore({ name: 'jf-users', consistency: 'strong' });
  const key = sha(email);
  const existing = await users.get(`u:${key}`, { type: 'json' });
  if (existing) return json(409, { error: 'Não foi possível criar a conta com esses dados.' });

  const salt = crypto.randomBytes(16);
  const hash = await scryptHash(body.password, salt);
  const user = {
    id: crypto.randomUUID(),
    key,
    email,
    name: cleanName(body.name) || email.split('@')[0],
    provider: 'password',
    salt: salt.toString('hex'),
    hash: hash.toString('hex'),
    tokenVersion: 0,
    fails: 0,
    lockUntil: 0,
    createdAt: Date.now()
  };
  await users.setJSON(`u:${key}`, user);
  return json(201, { user: publicUser(user) }, await startSession(user, req));
}

async function handleLogin(req) {
  const wait = await rateLimit(req, 'login', 25, 600);
  if (wait) return json(429, { error: `Muitas tentativas. Tente em ${Math.ceil(wait / 60)} min.` });
  const body = await readBody(req);
  const email = String(body.email || '').trim().toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  const generic = () => json(401, { error: 'E-mail ou senha incorretos.' });
  if (!validEmail(email) || !password || password.length > 128) return generic();

  const users = getStore({ name: 'jf-users', consistency: 'strong' });
  const key = sha(email);
  const user = await users.get(`u:${key}`, { type: 'json' });

  if (!user || user.provider !== 'password') {
    await scryptHash(password, DUMMY_SALT);
    return generic();
  }
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return json(423, { error: 'Conta temporariamente bloqueada por tentativas incorretas. Tente novamente mais tarde.' });
  }

  const hash = await scryptHash(password, Buffer.from(user.salt, 'hex'));
  const ok = crypto.timingSafeEqual(hash, Buffer.from(user.hash, 'hex'));
  if (!ok) {
    user.fails = (user.fails || 0) + 1;
    if (user.fails >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
      user.fails = 0;
    }
    await users.setJSON(`u:${key}`, user);
    return generic();
  }
  if (user.fails || user.lockUntil) {
    user.fails = 0;
    user.lockUntil = 0;
    await users.setJSON(`u:${key}`, user);
  }
  return json(200, { user: publicUser(user) }, await startSession(user, req));
}

async function handleGoogle(req) {
  const wait = await rateLimit(req, 'google', 30, 600);
  if (wait) return json(429, { error: 'Muitas tentativas. Aguarde um pouco.' });
  const body = await readBody(req);
  if (typeof body.credential !== 'string' || body.credential.length > 4096) return json(400, { error: 'Credencial inválida.' });
  const g = await verifyGoogleIdToken(body.credential);
  if (!g) return json(401, { error: 'Não foi possível validar o login do Google.' });

  const users = getStore({ name: 'jf-users', consistency: 'strong' });
  const key = sha(g.email);
  let user = await users.get(`u:${key}`, { type: 'json' });
  if (!user) {
    user = { id: crypto.randomUUID(), key, email: g.email, name: g.name || g.email.split('@')[0], provider: 'google', googleSub: g.sub, tokenVersion: 0, createdAt: Date.now() };
    await users.setJSON(`u:${key}`, user);
  } else if (user.provider === 'password' && !user.googleSub) {
    user.googleSub = g.sub;
    await users.setJSON(`u:${key}`, user);
  } else if (user.googleSub && user.googleSub !== g.sub) {
    return json(401, { error: 'Não foi possível validar o login do Google.' });
  }
  return json(200, { user: publicUser(user) }, await startSession(user, req));
}

async function handleLogout(req) {
  const user = await currentUser(req);
  if (user) {
    const users = getStore({ name: 'jf-users', consistency: 'strong' });
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await users.setJSON(`u:${user.key}`, user);
  }
  return json(200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0, req) });
}

const DATA_KEYS = ['johnflix_mylist', 'johnflix_playlists', 'johnflix_cw', 'johnflix_custom'];

async function handleData(req) {
  const user = await currentUser(req);
  if (!user) return json(401, { error: 'Sessão expirada.' });
  const store = getStore({ name: 'jf-userdata', consistency: 'strong' });
  if (req.method === 'GET') {
    const data = (await store.get(`d:${user.key}`, { type: 'json' })) || {};
    return json(200, { data });
  }
  const body = await readBody(req);
  const incoming = body && typeof body.data === 'object' && body.data ? body.data : {};
  const clean = {};
  for (const k of DATA_KEYS) {
    if (typeof incoming[k] === 'string' && incoming[k].length < 150000) {
      JSON.parse(incoming[k]);
      clean[k] = incoming[k];
    }
  }
  await store.setJSON(`d:${user.key}`, clean);
  return json(200, { ok: true });
}

export default async (req) => {
  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').filter(Boolean).pop();

    if (req.method === 'GET' && action === 'config') {
      return json(200, { googleClientId: process.env.GOOGLE_CLIENT_ID || '' });
    }
    if (req.method === 'GET' && action === 'me') {
      const user = await currentUser(req);
      return user ? json(200, { user: publicUser(user) }) : json(401, { error: 'unauthenticated' });
    }
    if (req.method === 'GET' && action === 'data') return await handleData(req);

    if (req.method !== 'POST' && req.method !== 'PUT') return json(405, { error: 'Método não permitido.' });
    if (!originOk(req) || req.headers.get('x-requested-with') !== 'johnflix') return json(403, { error: 'Requisição bloqueada.' });
    const ct = req.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return json(415, { error: 'Tipo de conteúdo inválido.' });

    if (action === 'register') return await handleRegister(req);
    if (action === 'login') return await handleLogin(req);
    if (action === 'google') return await handleGoogle(req);
    if (action === 'logout') return await handleLogout(req);
    if (action === 'data') return await handleData(req);
    return json(404, { error: 'Not found' });
  } catch (err) {
    if (err instanceof SyntaxError) return json(400, { error: 'Requisição inválida.' });
    console.error('auth error', err && err.message);
    return json(500, { error: 'Erro interno. Tente novamente.' });
  }
};

export const config = { path: '/auth/*' };
