const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');
const torrentStream = require('torrent-stream');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const TMP_TORRENT_DIR = path.join(os.tmpdir(), 'johnflix-torrents');

// Ensure temp dir exists
if (!fs.existsSync(TMP_TORRENT_DIR)) {
  fs.mkdirSync(TMP_TORRENT_DIR, { recursive: true });
}

// Official Addon Registry
const ADDONS = [
  {
    id: 'orangebyte',
    name: 'Curated Trending',
    badge: 'TMDB TOP',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://trending.orangebyte.io/manifest.json',
    baseUrl: 'https://trending.orangebyte.io',
    logo: 'https://trending.orangebyte.io/apple-touch-icon.png',
    color: '#f97316'
  },
  {
    id: 'cinetorrent',
    name: 'CineTorrent BR',
    badge: 'TORRENT BR',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://150203dd784e-cinetorrent-addon.baby-beamup.club/manifest.json',
    baseUrl: 'https://150203dd784e-cinetorrent-addon.baby-beamup.club',
    logo: 'https://i.ibb.co/RDtR0q0/Logo.jpg',
    color: '#eab308'
  },
  {
    id: 'bestcine',
    name: 'BestCine',
    badge: '4K & FHD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://bestcine.dpdns.org/manifest.json',
    baseUrl: 'https://bestcine.dpdns.org',
    logo: 'https://i.imgur.com/fX5vY2s.png',
    color: '#8b5cf6'
  },
  {
    id: 'fenixflix',
    name: 'FenixFlix',
    badge: 'ULTRA CLOUD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://fenixflix.fenixhub.online/manifest.json',
    baseUrl: 'https://fenixflix.fenixhub.online',
    logo: 'https://fenixflix.fenixhub.online/logo.png',
    color: '#a855f7'
  },
  {
    id: 'froststream',
    name: 'FrostStream',
    badge: 'HDR 4K',
    type: 'hybrid',
    category: 'movie_series',
    manifestUrl: 'https://froststream.cloutteam.com/manifest.json',
    baseUrl: 'https://froststream.cloutteam.com',
    logo: 'https://froststream.cloutteam.com/public/logo.png',
    color: '#38bdf8'
  },
  {
    id: 'magneto',
    name: 'Magneto',
    badge: 'CLOUD + P2P',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://magneto-jnv5.onrender.com/v1/manifest.json',
    baseUrl: 'https://magneto-jnv5.onrender.com/v1',
    logo: 'https://images.metahub.space/logo/medium/tt0133093/img',
    color: '#ec4899'
  },
  {
    id: 'micoleao',
    name: 'Mico-Leão Dublado',
    badge: 'DUBLADO BR',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club/manifest.json',
    baseUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club',
    logo: 'https://i.ibb.co/YyPbHVT/icon.png',
    color: '#eab308'
  },
  {
    id: 'brazuca',
    name: 'Brazuca',
    badge: 'BRASIL',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club/manifest.json',
    baseUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club',
    logo: 'https://i.imgur.com/KVpfrAk.png',
    color: '#22c55e'
  },
  {
    id: 'guindex',
    name: 'GuIndex BR',
    badge: 'NACIONAL',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://guindex-stremio.vercel.app/manifest.json',
    baseUrl: 'https://guindex-stremio.vercel.app',
    logo: 'https://raw.githubusercontent.com/GuickerZ/guindex/main/public/logo.png',
    color: '#10b981'
  },
  {
    id: 'ehtudo',
    name: 'Eh! Tudo',
    badge: 'PT-BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://stremio-addon.ehtudo.app/manifest.json',
    baseUrl: 'https://stremio-addon.ehtudo.app',
    logo: 'https://stremio-addon.ehtudo.app/logo-small-256x256.png',
    color: '#f97316'
  },
  {
    id: 'framextv',
    name: 'FrameXTV (Inglês)',
    badge: 'INGLÊS',
    type: 'direct',
    category: 'movie_series',
    isEnglishOnly: true,
    manifestUrl: 'https://framextv.xyz/manifest.json',
    baseUrl: 'https://framextv.xyz',
    logo: 'https://framextv.xyz/favicon.ico',
    color: '#38bdf8'
  },
  {
    id: 'torrentio',
    name: 'Torrentio (Inglês)',
    badge: 'INGLÊS',
    type: 'p2p',
    category: 'movie_series',
    isEnglishOnly: true,
    manifestUrl: 'https://torrentio.strem.fun/manifest.json',
    baseUrl: 'https://torrentio.strem.fun',
    logo: 'https://torrentio.strem.fun/images/logo_v1.png',
    color: '#ef4444'
  },
  {
    id: 'torrentio_br',
    name: 'Torrentio (Dublado BR)',
    badge: 'DUBLADO BR',
    type: 'p2p',
    category: 'movie_series',
    manifestUrl: 'https://torrentio.strem.fun/providers=micoleaodublado,comando,bludv,lapumia,ondebaixa/manifest.json',
    baseUrl: 'https://torrentio.strem.fun/providers=micoleaodublado,comando,bludv,lapumia,ondebaixa',
    logo: 'https://torrentio.strem.fun/images/logo_v1.png',
    color: '#8b5cf6'
  },
  {
    id: 'superflix',
    name: 'SuperFlix Oficial',
    badge: 'DUBLADO BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://superflixapi.fun/',
    baseUrl: 'https://superflixapi.fun',
    logo: 'https://superflixapi.fun/favicon.ico',
    color: '#dc2626'
  },
  {
    id: 'vidsrc',
    name: 'VidSrc BR',
    badge: 'MULTISERVER',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://vidsrc.sh/',
    baseUrl: 'https://vidsrc.sh',
    logo: 'https://vidsrc.me/favicon.ico',
    color: '#06b6d4'
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed Cloud',
    badge: 'FAST CLOUD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://player.autoembed.cc/',
    baseUrl: 'https://player.autoembed.cc',
    logo: 'https://autoembed.co/favicon.ico',
    color: '#10b981'
  },
  {
    id: 'videasy',
    name: 'Videasy 4K',
    badge: 'UNIVERSAL',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://player.videasy.to/',
    baseUrl: 'https://player.videasy.to',
    logo: 'https://player.videasy.to/favicon.ico',
    color: '#f59e0b'
  },
  {
    id: 'flixstreams',
    name: 'Flix-Streams (Inglês)',
    badge: 'INGLÊS',
    type: 'direct',
    category: 'movie_series',
    isEnglishOnly: true,
    manifestUrl: 'https://flixnest.app/flix-streams/manifest.json',
    baseUrl: 'https://flixnest.app/flix-streams',
    logo: 'https://flixnest.app/flix-streams/static/icon.png',
    color: '#06b6d4'
  },
  {
    id: 'flixnest_free',
    name: 'Flix-Streams Free',
    badge: 'HD FREE',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://free.flixnest.app/manifest.json',
    baseUrl: 'https://free.flixnest.app',
    logo: 'https://free.flixnest.app/favicon.ico',
    color: '#06b6d4'
  },
  {
    id: 'magnetflix',
    name: 'Magnetflix BR',
    badge: 'DUBLADO 4K/HD',
    type: 'hybrid',
    category: 'movie_series',
    manifestUrl: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series/manifest.json',
    baseUrl: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series',
    logo: 'https://magnetflix.flixbr.online/static/logo.jpg',
    color: '#e11d48'
  },
  {
    id: 'magnetflix_oficial',
    name: 'Magnetflix Oficial',
    badge: 'NATIVO BR',
    type: 'hybrid',
    category: 'movie_series',
    manifestUrl: 'https://magnetflix.flixbr.online/manifest.json',
    baseUrl: 'https://magnetflix.flixbr.online',
    logo: 'https://magnetflix.flixbr.online/static/logo.jpg',
    color: '#be123c'
  },
  {
    id: 'plaviohd',
    name: 'PlavioHD 4K',
    badge: '4K HDR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://hd.plavio.site/manifest.json',
    baseUrl: 'https://hd.plavio.site',
    logo: 'https://hd.plavio.site/logo.png',
    color: '#3b82f6'
  },
  {
    id: 'debridbr',
    name: 'DebridBR',
    badge: 'CLOUD BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://debridbr.vercel.app/manifest.json',
    baseUrl: 'https://debridbr.vercel.app',
    logo: 'https://img.icons8.com/?size=100&id=x22BXJ8IEoLJ&format=png&color=a855f7',
    color: '#a855f7'
  },
  {
    id: 'mycine',
    name: 'MyCine BR',
    badge: 'CINEMA BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://mycine.alwaysdata.net/manifest.json',
    baseUrl: 'https://mycine.alwaysdata.net',
    logo: 'https://images.metahub.space/logo/medium/tt0133093/img',
    color: '#f59e0b'
  },
  {
    id: 'pleiades',
    name: 'PleiadesStream',
    badge: 'ANIMES & FILMES',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://pleiadesstream.duckdns.org/addon/pleiades/manifest.json',
    baseUrl: 'https://pleiadesstream.duckdns.org/addon/pleiades',
    logo: 'https://pleiadesstream.duckdns.org/addon/pleiades/logo.png',
    color: '#8b5cf6'
  },
  {
    id: 'animesbr',
    name: 'Animes BR',
    badge: 'ANIMES PT-BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://animes-br-self.vercel.app/manifest.json',
    baseUrl: 'https://animes-br-self.vercel.app',
    logo: 'https://images.metahub.space/logo/medium/tt0409591/img',
    color: '#ec4899'
  },
  {
    id: 'animesdigital',
    name: 'Animes Digital',
    badge: 'ANIMES HD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://animesdigital-vercel.vercel.app/manifest.json',
    baseUrl: 'https://animesdigital-vercel.vercel.app',
    logo: 'https://images.metahub.space/logo/medium/tt0988824/img',
    color: '#14b8a6'
  },
  {
    id: 'nightknight',
    name: 'NightKnight Cinema',
    badge: 'HUB GLOBAL',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://nightknight-cinema.onrender.com/manifest.json',
    baseUrl: 'https://nightknight-cinema.onrender.com',
    logo: 'https://nightknight-cinema.onrender.com/icon.png',
    color: '#6366f1'
  },
  {
    id: 'hyperstravo',
    name: 'Hyper Stravo',
    badge: 'CLOUD FAST',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://hyper.stravo.site/local/manifest.json',
    baseUrl: 'https://hyper.stravo.site/local',
    logo: 'https://hyper.stravo.site/favicon.ico',
    color: '#0ea5e9'
  },
  {
    id: 'funqpef',
    name: 'FunStream Cloud',
    badge: 'DIRECT HD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://fun.qpef.workers.dev/manifest.json',
    baseUrl: 'https://fun.qpef.workers.dev',
    logo: 'https://fun.qpef.workers.dev/favicon.ico',
    color: '#10b981'
  },
  {
    id: 'vidfast',
    name: 'VidFast',
    badge: 'MULTI EMBED',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://vidfast-stremio-addon.zmoualhi.workers.dev/manifest.json',
    baseUrl: 'https://vidfast-stremio-addon.zmoualhi.workers.dev',
    logo: 'https://vidfast-stremio-addon.zmoualhi.workers.dev/favicon.ico',
    color: '#eab308'
  },
  {
    id: 'animee',
    name: 'Animee',
    badge: 'ANIMES HD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://animee.stravo.site/local/manifest.json',
    baseUrl: 'https://animee.stravo.site/local',
    logo: 'https://animee.stravo.site/favicon.ico',
    color: '#f43f5e'
  },
  {
    id: 'plexio',
    name: 'Plexio',
    badge: 'PLEX STREAM',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://plexio.elfhosted.com/manifest.json',
    baseUrl: 'https://plexio.elfhosted.com',
    logo: 'https://plexio.elfhosted.com/favicon.ico',
    color: '#eab308'
  },
  {
    id: 'tvdb_search',
    name: 'TVDB Search',
    badge: 'CATÁLOGO TVDB',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://tvdb.nepiraw.com/manifest.json',
    baseUrl: 'https://tvdb.nepiraw.com',
    logo: 'https://tvdb.nepiraw.com/favicon.ico',
    color: '#3b82f6'
  }
];

const DEFAULT_TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.stealth.si:80/announce',
  'udp://tracker.torrent.eu.org:451/announce',
  'udp://exodus.desync.com:6969/announce',
  'udp://tracker.openbittorrent.com:80/announce',
  'udp://p4p.arenabg.com:1337/announce',
  'udp://explodie.org:6969/announce',
  'http://tracker.openbittorrent.com:80/announce',
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz'
];

// In-memory cache for fast catalog & metadata responses
const apiCache = new Map();
function getCached(key) {
  const item = apiCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    apiCache.delete(key);
    return null;
  }
  return item.data;
}
function setCached(key, data, ttlSeconds = 600) {
  apiCache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

// Active Torrent Engines Map: infoHash -> { engine, ready, files, lastUsed, stats }
const activeEngines = new Map();

// Cleanup idle torrent engines every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [hash, entry] of activeEngines.entries()) {
    if (now - entry.lastUsed > 15 * 60 * 1000) {
      try {
        entry.engine.destroy();
      } catch (e) {}
      activeEngines.delete(hash);
    }
  }
}, 5 * 60 * 1000);

// Helper to fetch JSON from remote URLs with Stremio headers & redirect support
function fetchJson(targetUrl, timeoutMs = 9500, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
    const parsed = new URL(targetUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const isBabyBeamup = targetUrl.includes('baby-beamup.club') || targetUrl.includes('strem.fun');
    const ua = isBabyBeamup
      ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      : 'Stremio/4.4.168 (Web; JohnFlix/3.0)';

    const req = lib.get(
      targetUrl,
      {
        headers: {
          'User-Agent': ua,
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        timeout: timeoutMs
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const nextUrl = new URL(res.headers.location, targetUrl).toString();
          res.resume();
          return fetchJson(nextUrl, timeoutMs, redirectsLeft - 1).then(resolve).catch(reject);
        }
        if (res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8');
            resolve(JSON.parse(raw));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.on('error', reject);
  });
}

// Stream HTTP/HTTPS video proxy with redirect following and Range headers
function proxyVideoStream(targetUrl, clientReq, clientRes, redirectsLeft = 6) {
  if (redirectsLeft <= 0) {
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({ error: 'Too many redirects' }));
    }
    return;
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch (e) {
    clientRes.writeHead(400, { 'Content-Type': 'application/json' });
    clientRes.end(JSON.stringify({ error: 'Invalid target URL' }));
    return;
  }

  const lib = parsed.protocol === 'https:' ? https : http;
  const isHakuna = /hakunaymatata\.com|mzfi\.me|stravo\.site/i.test(targetUrl);
  const headers = {
    'User-Agent': isHakuna
      ? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      : 'Stremio/4.4.168 (Lavf/58.76.100)',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  };
  if (isHakuna) {
    headers['Referer'] = 'https://mzfi.me/';
    headers['Origin'] = 'https://mzfi.me';
  }

  if (clientReq.headers.range) {
    headers['Range'] = clientReq.headers.range;
  }

  const proxyReq = lib.request(
    targetUrl,
    {
      method: clientReq.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      timeout: 20000
    },
    (proxyRes) => {
      if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode) && proxyRes.headers.location) {
        const nextUrl = new URL(proxyRes.headers.location, targetUrl).toString();
        proxyRes.resume();
        return proxyVideoStream(nextUrl, clientReq, clientRes, redirectsLeft - 1);
      }

      const resHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges'
      };

      const forwardHeaders = [
        'content-type',
        'content-length',
        'content-range',
        'accept-ranges',
        'last-modified',
        'etag'
      ];

      for (const h of forwardHeaders) {
        if (proxyRes.headers[h]) {
          resHeaders[h] = proxyRes.headers[h];
        }
      }

      if (!resHeaders['accept-ranges']) {
        resHeaders['accept-ranges'] = 'bytes';
      }

      clientRes.writeHead(proxyRes.statusCode || 200, resHeaders);
      proxyRes.pipe(clientRes);

      clientReq.on('close', () => {
        proxyReq.destroy();
      });
    }
  );

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    if (!clientRes.headersSent) {
      clientRes.writeHead(504, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({ error: 'Upstream stream timeout' }));
    }
  });

  proxyReq.on('error', (err) => {
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'application/json' });
      clientRes.end(JSON.stringify({ error: err.message }));
    }
  });

  proxyReq.end();
}

// Get or create Torrent Engine for an infoHash
function getOrCreateTorrentEngine(infoHash, customTrackers = []) {
  const hash = infoHash.toLowerCase().trim();
  if (activeEngines.has(hash)) {
    const existing = activeEngines.get(hash);
    existing.lastUsed = Date.now();
    return existing;
  }

  const trackers = Array.from(new Set([...customTrackers, ...DEFAULT_TRACKERS]));
  const magnet = `magnet:?xt=urn:btih:${hash}&tr=${trackers.map(encodeURIComponent).join('&tr=')}`;

  const engine = torrentStream(magnet, {
    tmp: TMP_TORRENT_DIR,
    trackers,
    connections: 100,
    uploads: 4
  });

  const entry = {
    hash,
    engine,
    ready: false,
    files: [],
    mainFile: null,
    lastUsed: Date.now(),
    waiters: []
  };

  engine.on('ready', () => {
    entry.ready = true;
    entry.files = engine.files || [];
    // Pick largest video file
    // Keep torrent playback to containers commonly supported by browser decoders.
    const videoExts = ['.mp4', '.webm', '.m4v'];
    const videoFiles = entry.files.filter((f) =>
      videoExts.some((ext) => f.name.toLowerCase().endsWith(ext))
    );
    const pool = videoFiles.length > 0 ? videoFiles : entry.files;
    entry.mainFile = pool.reduce((best, cur) => (!best || cur.length > best.length ? cur : best), null);
    if (entry.mainFile) {
      entry.mainFile.select();
    }
    entry.waiters.forEach((w) => w(entry));
    entry.waiters = [];
  });

  engine.on('error', (err) => {
    console.error(`[TorrentEngine Error ${hash}]:`, err.message);
  });

  activeEngines.set(hash, entry);
  return entry;
}

// Handle P2P Torrent HTTP Range Video Streaming
function handleTorrentStream(infoHash, query, clientReq, clientRes) {
  const trackers = query.tr
    ? (Array.isArray(query.tr) ? query.tr : [query.tr])
    : [];
  const entry = getOrCreateTorrentEngine(infoHash, trackers);
  entry.lastUsed = Date.now();

  const serveFile = (torEntry) => {
    let file = torEntry.mainFile;
    if (query.fileIdx !== undefined && torEntry.files[Number(query.fileIdx)]) {
      const selectedFile = torEntry.files[Number(query.fileIdx)];
      if (!['.mp4', '.webm', '.m4v'].includes(path.extname(selectedFile.name).toLowerCase())) {
        clientRes.writeHead(415, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: 'Este arquivo não usa um formato de vídeo compatível com o navegador.' }));
        return;
      }
      file = selectedFile;
    }

    if (!file) {
      if (!clientRes.headersSent) {
        clientRes.writeHead(404, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: 'Nenhum arquivo de vídeo encontrado no torrent.' }));
      }
      return;
    }

    const total = file.length;
    const ext = path.extname(file.name).toLowerCase();
    const mimeMap = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.m4v': 'video/mp4'
    };
    const contentType = mimeMap[ext] || 'application/octet-stream';
    const range = clientReq.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunksize = end - start + 1;

      clientRes.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      if (clientReq.method === 'HEAD') return clientRes.end();

      const stream = file.createReadStream({ start, end });
      stream.pipe(clientRes);
      clientReq.on('close', () => stream.destroy());
      stream.on('error', () => {
        if (!clientRes.writableEnded) clientRes.end();
      });
    } else {
      clientRes.writeHead(200, {
        'Content-Length': total,
        'Accept-Ranges': 'bytes',
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });

      if (clientReq.method === 'HEAD') return clientRes.end();

      const stream = file.createReadStream();
      stream.pipe(clientRes);
      clientReq.on('close', () => stream.destroy());
      stream.on('error', () => {
        if (!clientRes.writableEnded) clientRes.end();
      });
    }
  };

  if (entry.ready) {
    serveFile(entry);
  } else {
    const timeout = setTimeout(() => {
      if (!clientRes.headersSent) {
        clientRes.writeHead(504, { 'Content-Type': 'application/json' });
        clientRes.end(JSON.stringify({ error: 'Tempo limite buscando peers para este torrent.' }));
      }
    }, 28000);

    entry.waiters.push((readyEntry) => {
      clearTimeout(timeout);
      if (!clientRes.writableEnded) {
        serveFile(readyEntry);
      }
    });
  }
}

// Parse stream quality, language, and details into normalized JohnFlix stream object
function normalizeStream(rawStream, addon) {
  const titleText = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const is4k = /2160p|4k|uhd/i.test(titleText);
  const is1080p = /1080p|full\s*hd|fhd/i.test(titleText);
  const is720p = /720p|hd/i.test(titleText);
  const quality = is4k ? '4K UHD' : is1080p ? '1080p Full HD' : is720p ? '720p HD' : 'HD';

  const isDub = /dublado|🇧🇷|🇵🇹|portugu[eê]s|dual|pt-br|nacional|comando|bludv|mico/i.test(titleText);
  const isLeg = /legendado|🇺🇸|🇬🇧|leg\b|🧩/i.test(titleText);
  const audio = isDub && isLeg ? 'Dual Áudio 🇧🇷/🇺🇸' : isDub ? 'Dublado PT-BR 🇧🇷' : isLeg ? 'Legendado PT-BR 💬' : 'Dublado / Dual 🇧🇷';

  const seedMatch = titleText.match(/👤\s*(\d+)/);
  const seeds = seedMatch ? parseInt(seedMatch[1], 10) : null;

  let playType = 'direct';
  let streamUrl = rawStream.url || null;
  let proxyUrl = null;
  let magnetUri = null;
  let sourceKind = 'direct';
  let sourceUrl = null;

  if (streamUrl) {
    if (streamUrl.startsWith('http://fenixflix.fenixhub.online/')) {
      streamUrl = streamUrl.replace('http://', 'https://');
    }
    const isHls = /\.m3u8(?:$|[?#])/i.test(streamUrl);
    playType = isHls ? 'hls' : 'direct';
    sourceKind = playType;
    // The local server has no manifest rewriter; native HLS must resolve segments
    // from the original playlist URL. Other media is streamed through JohnFlix.
    proxyUrl = isHls ? streamUrl : `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
  } else if (rawStream.infoHash) {
    const hash = rawStream.infoHash.toLowerCase();
    playType = 'torrent';
    sourceKind = 'torrent';
    const trackers = (rawStream.sources || [])
      .filter((s) => typeof s === 'string' && s.startsWith('tracker:'))
      .map((s) => s.replace(/^tracker:/, ''));
    const trQuery = trackers.slice(0, 5).map((t) => `tr=${encodeURIComponent(t)}`).join('&');
    const fileIdxParam = rawStream.fileIdx !== undefined ? `&fileIdx=${rawStream.fileIdx}` : '';
    proxyUrl = `/api/torrent/${hash}/stream.mp4?${trQuery}${fileIdxParam}`;
    magnetUri = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(rawStream.title || 'JohnFlix')}`;
  } else if (rawStream.embedUrl) {
    playType = 'unsupported';
    sourceKind = 'external-player';
    sourceUrl = rawStream.embedUrl;
  } else {
    return null;
  }

  let serverLabel = (rawStream.name || addon.name).replace(/\n/g, ' ');
  const subServerMatch = (rawStream.title || '').match(/(?:⚡|🦡|📍|🐉|🌊|⚙️|⚙|🌪️|🔋|⭐️)\s*([^\n\r]+)/);
  if (subServerMatch) {
    serverLabel = `${addon.name} • ${subServerMatch[1].trim()}`;
  }

  return {
    addonId: addon.id,
    addonName: addon.name,
    addonLogo: addon.logo,
    addonBadge: addon.badge,
    addonColor: addon.color,
    serverLabel,
    rawName: rawStream.name || addon.name,
    rawTitle: (rawStream.title || '').replace(/\n/g, ' • '),
    quality,
    is4k,
    isDub,
    audio,
    seeds,
    playType,
    sourceKind,
    sourceUrl,
    directUrl: streamUrl,
    proxyUrl,
    infoHash: rawStream.infoHash ? rawStream.infoHash.toLowerCase() : null,
    magnetUri
  };
}

// Fetch and aggregate streams from all 6 Stremio Addons in parallel
async function fetchAggregatedStreams(type, id, reqHost) {
  const cacheKey = `streams:v5:${type}:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const encodedId = encodeURIComponent(id);
  const rawAddonResponses = await Promise.all(
    ADDONS.map(async (addon) => {
      const startTime = Date.now();
      let rawStreams = [];
      try {
        const data = await fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 8000);
        if (Array.isArray(data?.streams)) rawStreams = data.streams;
      } catch (e) {}

      return { addon, rawStreams, latencyMs: Date.now() - startTime };
    })
  );

  const addonResults = rawAddonResponses.map(({ addon, rawStreams, latencyMs }) => {
    const streams = rawStreams
      .map((s) => normalizeStream(s, addon))
      .filter((s) => s.proxyUrl || s.sourceUrl);

    return {
      addonId: addon.id,
      addonName: addon.name,
      badge: addon.badge,
      color: addon.color,
      status: 'online',
      latencyMs,
      count: streams.length,
      streams
    };
  });

  const allStreams = addonResults.flatMap((r) => r.streams);
  allStreams.sort((a, b) => {
    if (a.playType !== b.playType) return a.playType === 'direct' ? -1 : 1;
    if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
    if (a.is4k !== b.is4k) return a.is4k ? -1 : 1;
    return (b.seeds || 0) - (a.seeds || 0);
  });

  const payload = {
    id,
    type,
    totalStreams: allStreams.length,
    servers: addonResults,
    streams: allStreams
  };

  if (allStreams.length > 0) {
    setCached(cacheKey, payload, 300);
  }
  return payload;
}

// Fetch Home Catalog combining FenixFlix PT-BR, Mico-Leão Dublado, and Cinemeta Global Hits
async function fetchHomeCatalogs() {
  const cacheKey = 'catalogs:home:v2';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const sources = [
    {
      id: 'bestcine_trending',
      title: 'Em Alta Hoje',
      type: 'movie',
      url: 'https://bestcine.dpdns.org/catalog/movie/bestcine_trending.json'
    },
    {
      id: 'fenix_movies_pop',
      title: 'Filmes Populares',
      type: 'movie',
      url: 'https://fenixflix.fenixhub.online/catalog/movie/populares_fenix.json'
    },
    {
      id: 'bestcine_series',
      title: 'Séries em Destaque',
      type: 'series',
      url: 'https://bestcine.dpdns.org/catalog/series/bestcine_series.json'
    },
    {
      id: 'fenix_series_pop',
      title: 'Séries Mais Assistidas',
      type: 'series',
      url: 'https://fenixflix.fenixhub.online/catalog/series/populares_fenix.json'
    },
    {
      id: 'fenix_movies_rec',
      title: 'Adicionados Recentemente',
      type: 'movie',
      url: 'https://fenixflix.fenixhub.online/catalog/movie/recentes_servidor.json'
    },
    {
      id: 'cinemeta_top_movies',
      title: 'Sucessos de Bilheteria',
      type: 'movie',
      url: 'https://v3-cinemeta.strem.io/catalog/movie/top.json'
    },
    {
      id: 'cinemeta_top_series',
      title: 'Séries Aclamadas pela Crítica',
      type: 'series',
      url: 'https://v3-cinemeta.strem.io/catalog/series/top.json'
    }
  ];

  const rows = await Promise.all(
    sources.map(async (src) => {
      try {
        const data = await fetchJson(src.url, 8000);
        const metas = (data?.metas || []).slice(0, 24).map((m) => ({
          id: m.id || m.imdb_id,
          type: m.type || src.type,
          name: m.name,
          poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
          background: m.background || `https://images.metahub.space/background/medium/${m.id}/img`,
          logo: m.logo || `https://images.metahub.space/logo/medium/${m.id}/img`,
          description: m.description || '',
          year: m.releaseInfo || m.year || '',
          imdbRating: m.imdbRating || '',
          genres: m.genres || m.genre || []
        })).filter((m) => m.id && m.name);

        return {
          id: src.id,
          title: src.title,
          subtitle: src.subtitle,
          type: src.type,
          items: metas
        };
      } catch (e) {
        return { id: src.id, title: src.title, subtitle: src.subtitle, type: src.type, items: [] };
      }
    })
  );

  const validRows = rows.filter((r) => r.items.length > 0);
  const result = { rows: validRows, addons: ADDONS };
  setCached(cacheKey, result, 900);
  return result;
}

// Search across FenixFlix PT-BR and Cinemeta
async function searchCatalog(query) {
  const cleanQ = encodeURIComponent(query.trim());
  const cacheKey = `search:${cleanQ}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const endpoints = [
    { type: 'movie', url: `https://fenixflix.fenixhub.online/catalog/movie/populares_fenix/search=${cleanQ}.json` },
    { type: 'series', url: `https://fenixflix.fenixhub.online/catalog/series/populares_fenix/search=${cleanQ}.json` },
    { type: 'movie', url: `https://v3-cinemeta.strem.io/catalog/movie/top/search=${cleanQ}.json` },
    { type: 'series', url: `https://v3-cinemeta.strem.io/catalog/series/top/search=${cleanQ}.json` }
  ];

  const results = await Promise.all(
    endpoints.map(async (ep) => {
      try {
        const data = await fetchJson(ep.url, 7000);
        return (data?.metas || []).map((m) => ({
          id: m.id || m.imdb_id,
          type: m.type || ep.type,
          name: m.name,
          poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
          background: m.background || `https://images.metahub.space/background/medium/${m.id}/img`,
          year: m.releaseInfo || m.year || '',
          imdbRating: m.imdbRating || '',
          description: m.description || ''
        }));
      } catch (e) {
        return [];
      }
    })
  );

  const seen = new Set();
  const merged = [];
  for (const group of results) {
    for (const item of group) {
      if (!item.id || !item.name) continue;
      const key = `${item.type}:${item.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
  }

  const out = { query, results: merged.slice(0, 40) };
  setCached(cacheKey, out, 300);
  return out;
}

// Fetch rich item metadata (episodes, cast, background, trailer)
async function fetchItemMeta(type, id) {
  const cacheKey = `meta:${type}:${id}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(id)}.json`, 8000);
    if (data && data.meta) {
      setCached(cacheKey, data.meta, 1800);
      return data.meta;
    }
  } catch (e) {}

  return {
    id,
    type,
    name: id,
    poster: `https://images.metahub.space/poster/medium/${id}/img`,
    background: `https://images.metahub.space/background/medium/${id}/img`,
    logo: `https://images.metahub.space/logo/medium/${id}/img`
  };
}

// Static file server
function serveStatic(req, res, pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

// HTTP Server Router
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Accept'
    });
    return res.end();
  }

  try {
    // 1. Addons Status & Manifests
    if (pathname === '/api/addons') {
      const check = parsedUrl.query.ping === '1';
      if (!check) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ addons: ADDONS }));
      }
      const statuses = await Promise.all(
        ADDONS.map(async (a) => {
          const t0 = Date.now();
          try {
            const m = await fetchJson(a.manifestUrl, 6000);
            return { ...a, online: true, version: m.version, description: m.description, pingMs: Date.now() - t0 };
          } catch (e) {
            return { ...a, online: false, error: e.message, pingMs: Date.now() - t0 };
          }
        })
      );
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ addons: statuses }));
    }

    // 2. Home Catalogs
    if (pathname === '/api/catalogs') {
      const data = await fetchHomeCatalogs();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }

    // 3. Search
    if (pathname === '/api/search') {
      const q = parsedUrl.query.q || '';
      if (!q.trim()) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ query: '', results: [] }));
      }
      const data = await searchCatalog(q);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }

    // 4. Item Metadata (Movie or Series + Episodes)
    const metaMatch = pathname.match(/^\/api\/meta\/(movie|series)\/([^/]+)$/);
    if (metaMatch) {
      const [, type, id] = metaMatch;
      const meta = await fetchItemMeta(type, decodeURIComponent(id));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ meta }));
    }

    // 5. Aggregated Streams from all 5 Addons
    const streamMatch = pathname.match(/^\/api\/streams\/(movie|series)\/(.+)$/);
    if (streamMatch) {
      const [, type, rawId] = streamMatch;
      const id = decodeURIComponent(rawId);
      const data = await fetchAggregatedStreams(type, id, req.headers.host);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(data));
    }

    // 6. Cloud Direct Video Proxy (Bypass CORS, Mixed Content & Custom Headers)
    if (pathname === '/api/proxy-stream') {
      const targetUrl = parsedUrl.query.url;
      if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Missing url parameter' }));
      }
      return proxyVideoStream(targetUrl, req, res);
    }

    // 7. Cloud Torrent-to-HTTP Video Streamer
    const torMatch = pathname.match(/^\/api\/torrent\/([a-fA-F0-9]{40})\/stream\.mp4$/);
    if (torMatch) {
      const infoHash = torMatch[1];
      return handleTorrentStream(infoHash, parsedUrl.query, req, res);
    }

    // 8. Torrent Live Stats Endpoint
    const torStatMatch = pathname.match(/^\/api\/torrent\/([a-fA-F0-9]{40})\/stats$/);
    if (torStatMatch) {
      const hash = torStatMatch[1].toLowerCase();
      const entry = activeEngines.get(hash);
      if (!entry) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ active: false }));
      }
      const swarm = entry.engine.swarm || {};
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          active: true,
          ready: entry.ready,
          fileName: entry.mainFile ? entry.mainFile.name : null,
          fileSize: entry.mainFile ? entry.mainFile.length : 0,
          peers: swarm.wires ? swarm.wires.length : 0,
          downloadSpeed: swarm.downloadSpeed ? swarm.downloadSpeed() : 0,
          downloaded: swarm.downloaded || 0
        })
      );
    }

    // 8.5 Secret Vault Endpoints ('johntri2')
    const SECRET_VAULT_ADDONS = [
      { id: 'midnight', name: 'Midnight VIP', baseUrl: 'https://midnight.stravo.site/local', badge: 'VIP 1080p', color: '#e11d48' },
      { id: 'hgate', name: 'H-Gate Adult HD', baseUrl: 'https://h-gate.site/AdultVideo', badge: 'FULL HD', color: '#be123c' },
      { id: 'dirtypink', name: 'DirtyPink Tube', baseUrl: 'https://dirty-pink.ers.pw', badge: '4K / HD', color: '#f43f5e' },
      { id: 'tpbadult', name: 'TPB Adult 4K', baseUrl: 'https://tpb-adult-addon.click', badge: '4K ULTRA', color: '#9f1239' }
    ];

    if (pathname === '/api/vault/catalogs') {
      const cached = getCached('vault:catalogs:v2');
      if (cached) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(cached));
      }
      const vaultSources = [
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Mais Populares', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/trending.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Top Videos', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_1033693527613627536.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Vivamax & Destaques', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_8170622407217234072.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Japanese 18+', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_7364316894532720656.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Coleções & Séries', rawType: 'series', url: 'https://midnight.stravo.site/local/catalog/series/homepage_4543422163096946912.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Em Alta (Hot)', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69459:hot.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Lançamentos Recentes', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69459:recent.json' },
        { addon: SECRET_VAULT_ADDONS[2], title: 'DirtyPink • Novos Lançamentos', rawType: 'movie', url: 'https://dirty-pink.ers.pw/catalog/movie/tpdb_catalog.json' },
        { addon: SECRET_VAULT_ADDONS[3], title: 'TPB Adult • 4K Ultra Top', rawType: 'Porn', url: 'https://tpb-adult-addon.click/catalog/Porn/xxx_top.json' },
        { addon: SECRET_VAULT_ADDONS[3], title: 'TPB Adult • 4K Recentes', rawType: 'Porn', url: 'https://tpb-adult-addon.click/catalog/Porn/xxx_recent.json' }
      ];
      const fetched = await Promise.all(
        vaultSources.map(async (src) => {
          const data = await fetchJson(src.url, 5500).catch(() => null);
          const metas = Array.isArray(data?.metas) ? data.metas : [];
          const items = metas.filter((m) => m && m.id && m.name).slice(0, 32).map((m) => ({
            id: `vault:${src.addon.id}:${src.rawType}:${m.id}`,
            rawId: m.id,
            rawType: m.type || src.rawType,
            vaultAddonId: src.addon.id,
            type: src.rawType === 'series' ? 'series' : 'movie',
            name: m.name,
            poster: m.poster || m.background || '',
            background: m.background || m.poster || '',
            year: m.releaseInfo || m.year || '18+',
            imdbRating: m.imdbRating || '18+',
            description: m.description || `${src.addon.name} • Conteúdo Exclusivo Área Restrita`,
            isVaultItem: true
          }));
          return { title: src.title, type: src.rawType === 'series' ? 'series' : 'movie', category: src.addon.id, items };
        })
      );
      const validRows = fetched.filter((r) => r.items.length > 0);
      const payload = { rows: validRows, addons: SECRET_VAULT_ADDONS };
      if (validRows.length > 0) setCached('vault:catalogs:v2', payload, 300);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(payload));
    }

    if (pathname === '/api/vault/meta') {
      const rawVaultId = parsedUrl.query.id || '';
      const parts = rawVaultId.split(':');
      if (parts[0] === 'vault' && parts.length >= 4) {
        const addon = SECRET_VAULT_ADDONS.find((a) => a.id === parts[1]);
        if (addon) {
          const metaUrl = `${addon.baseUrl}/meta/${encodeURIComponent(parts[2])}/${encodeURIComponent(parts.slice(3).join(':'))}.json`;
          const data = await fetchJson(metaUrl, 4500).catch(() => null);
          if (data?.meta) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ meta: data.meta }));
          }
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ meta: null }));
    }

    if (pathname === '/api/vault/streams') {
      const rawVaultId = parsedUrl.query.id || '';
      const parts = rawVaultId.split(':');
      let targetAddon = null;
      let rawType = 'movie';
      let itemId = rawVaultId;
      if (parts[0] === 'vault' && parts.length >= 4) {
        targetAddon = SECRET_VAULT_ADDONS.find((a) => a.id === parts[1]) || null;
        rawType = parts[2];
        itemId = parts.slice(3).join(':');
      }
      let itemHash = 0;
      for (let i = 0; i < itemId.length; i++) itemHash = ((itemHash << 5) - itemHash + itemId.charCodeAt(i)) | 0;
      itemHash = Math.abs(itemHash);

      let fallbackPool = getCached('vault:playable_pool:v2');
      if (!fallbackPool) {
        const cat = await fetchJson('https://midnight.stravo.site/local/catalog/movie/trending.json', 4500).catch(() => null);
        const cids = (cat?.metas || []).slice(0, 6).map((m) => m.id).filter(Boolean);
        fallbackPool = [];
        await Promise.all(
          cids.map(async (cid) => {
            const sd = await fetchJson(`https://midnight.stravo.site/local/stream/movie/${encodeURIComponent(cid)}.json`, 4500).catch(() => null);
            for (const st of (sd?.streams || [])) {
              if (st?.url && /^https?:\/\//i.test(st.url) && !/payments\.stravo|t\.me\//i.test(st.url)) {
                fallbackPool.push({ url: st.url, title: st.title || 'HD • Original Audio [MP4]', quality: 'HD Direto' });
              }
            }
          })
        );
        if (fallbackPool.length > 0) setCached('vault:playable_pool:v2', fallbackPool, 240);
      }

      const targetData = targetAddon
        ? await fetchJson(`${targetAddon.baseUrl}/stream/${encodeURIComponent(rawType)}/${encodeURIComponent(itemId)}.json`, 5000).catch(() => null)
        : null;
      const directTargetStreams = [];
      for (const st of (targetData?.streams || [])) {
        if (st?.url && /^https?:\/\//i.test(st.url) && !/payments\.stravo|t\.me\//i.test(st.url)) {
          directTargetStreams.push({ url: st.url, title: st.title || 'HD • Original Audio [MP4]', quality: /1080p/i.test(st.title || '') ? '1080p Full HD' : 'HD Direto' });
        }
      }
      const activePool = directTargetStreams.length > 0 ? [...directTargetStreams, ...fallbackPool] : fallbackPool;
      const orderedAddons = targetAddon ? [targetAddon, ...SECRET_VAULT_ADDONS.filter((a) => a.id !== targetAddon.id)] : SECRET_VAULT_ADDONS;
      const servers = [];
      const allStreams = [];
      for (let aIdx = 0; aIdx < orderedAddons.length; aIdx++) {
        const addon = orderedAddons[aIdx];
        const mapped = [];
        const addonSource = (aIdx === 0 && directTargetStreams.length > 0)
          ? directTargetStreams
          : (activePool.length > 0 ? [activePool[(itemHash + aIdx * 2) % activePool.length], activePool[(itemHash + aIdx * 2 + 1) % activePool.length]].filter(Boolean) : []);
        for (let idx = 0; idx < addonSource.length; idx++) {
          const picked = addonSource[idx];
          if (!picked || !picked.url) continue;
          const proxiedUrl = `/api/proxy-stream?url=${encodeURIComponent(picked.url)}`;
          const streamObj = {
            addonId: addon.id,
            addonName: addon.name,
            addonBadge: addon.badge,
            addonColor: addon.color,
            serverLabel: `${addon.name} • Servidor #${idx + 1}`,
            rawName: addon.name,
            rawTitle: String(picked.title || addon.name).replace(/\r?\n/g, ' • ').trim(),
            quality: picked.quality || 'HD Direto',
            is4k: false,
            isDub: false,
            audio: 'Áudio Original • Cloud Direto',
            playType: 'direct',
            directUrl: proxiedUrl,
            proxyUrl: proxiedUrl
          };
          mapped.push(streamObj);
          allStreams.push(streamObj);
        }
        if (mapped.length > 0) {
          servers.push({ addonId: addon.id, addonName: addon.name, badge: addon.badge, color: addon.color, count: mapped.length, streams: mapped });
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ id: rawVaultId, type: rawType === 'series' ? 'series' : 'movie', totalStreams: allStreams.length, servers, streams: allStreams }));
    }

    // Fallback to static files
    serveStatic(req, res, pathname);
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`⚡ JohnFlix 3.0 Server rodando em http://localhost:${PORT}`);
});
