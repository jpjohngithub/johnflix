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
    id: 'bestcine',
    name: 'BestCine',
    badge: '4K / HD',
    type: 'direct',
    manifestUrl: 'https://bestcine.dpdns.org/manifest.json',
    baseUrl: 'https://bestcine.dpdns.org',
    logo: 'https://bestcine.dpdns.org/logo.png',
    color: '#c084fc'
  },
  {
    id: 'fenixflix',
    name: 'FenixFlix',
    badge: '4K / HD',
    type: 'direct',
    manifestUrl: 'https://fenixflix.fenixhub.online/manifest.json',
    baseUrl: 'https://fenixflix.fenixhub.online',
    logo: 'https://fenixflix.fenixhub.online/logo.png',
    color: '#a855f7'
  },
  {
    id: 'froststream',
    name: 'FrostStream',
    badge: '4K / HD',
    type: 'direct',
    manifestUrl: 'https://froststream.cloutteam.com/manifest.json',
    baseUrl: 'https://froststream.cloutteam.com',
    logo: 'https://i.imgur.com/yuG0ZIU.jpeg',
    color: '#38bdf8'
  },
  {
    id: 'magneto',
    name: 'Magneto',
    badge: 'CLOUD + P2P',
    type: 'p2p',
    manifestUrl: 'https://magneto-jnv5.onrender.com/v1/manifest.json',
    baseUrl: 'https://magneto-jnv5.onrender.com/v1',
    fallbackUrl: 'https://torrentio.strem.fun/providers=yts,eztv,rarbg,1337x,thepiratebay|language=portuguese',
    logo: 'https://images.metahub.space/logo/medium/tt0133093/img',
    color: '#ec4899'
  },
  {
    id: 'micoleao',
    name: 'Mico-Leão',
    badge: 'DUBLADO',
    type: 'p2p',
    manifestUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club/manifest.json',
    baseUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club',
    fallbackUrl: 'https://torrentio.strem.fun/providers=micoleaodublado,comando,bludv',
    logo: 'https://i.ibb.co/YyPbHVT/icon.png',
    color: '#eab308'
  },
  {
    id: 'brazuca',
    name: 'Brazuca',
    badge: 'BRASIL',
    type: 'p2p',
    manifestUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club/manifest.json',
    baseUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club',
    fallbackUrl: 'https://torrentio.strem.fun/providers=comando,bludv,lapumia,ondebaixa',
    logo: 'https://i.imgur.com/KVpfrAk.png',
    color: '#22c55e'
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
  const headers = {
    'User-Agent': 'Stremio/4.4.168 (Lavf/58.76.100)',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  };

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

      if (!resHeaders['content-type'] || resHeaders['content-type'].includes('text/plain') || resHeaders['content-type'].includes('octet-stream')) {
        resHeaders['content-type'] = 'video/mp4';
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
    const videoExts = ['.mp4', '.mkv', '.webm', '.avi', '.mov', '.m4v'];
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
      file = torEntry.files[Number(query.fileIdx)];
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
      '.mkv': 'video/x-matroska',
      '.webm': 'video/webm',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime'
    };
    const contentType = mimeMap[ext] || 'video/mp4';
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
function normalizeStream(rawStream, addon, fallbackDirectUrls = []) {
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

  if (streamUrl) {
    if (streamUrl.startsWith('http://fenixflix.fenixhub.online/')) {
      streamUrl = streamUrl.replace('http://', 'https://');
    }
    playType = 'direct';
    proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
  } else if (rawStream.infoHash) {
    const hash = rawStream.infoHash.toLowerCase();
    const matchingCloud = fallbackDirectUrls.find((f) => f.isDub === isDub && f.is4k === is4k)
      || fallbackDirectUrls.find((f) => f.isDub === isDub)
      || fallbackDirectUrls[0];

    if (matchingCloud && matchingCloud.directUrl) {
      playType = 'direct';
      streamUrl = matchingCloud.directUrl;
      proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
    } else {
      playType = 'torrent';
      const trackers = (rawStream.sources || [])
        .filter((s) => typeof s === 'string' && s.startsWith('tracker:'))
        .map((s) => s.replace(/^tracker:/, ''));
      const trQuery = trackers.slice(0, 5).map((t) => `tr=${encodeURIComponent(t)}`).join('&');
      const fileIdxParam = rawStream.fileIdx !== undefined ? `&fileIdx=${rawStream.fileIdx}` : '';
      proxyUrl = `/api/torrent/${hash}/stream.mp4?${trQuery}${fileIdxParam}`;
    }
    magnetUri = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(rawStream.title || 'JohnFlix')}`;
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
    directUrl: streamUrl,
    proxyUrl,
    infoHash: rawStream.infoHash ? rawStream.infoHash.toLowerCase() : null,
    magnetUri
  };
}

// Fetch and aggregate streams from all 6 Stremio Addons in parallel
async function fetchAggregatedStreams(type, id, reqHost) {
  const cacheKey = `streams:v3:${type}:${id}`;
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

      if (rawStreams.length === 0 && addon.fallbackUrl) {
        try {
          const fbData = await fetchJson(`${addon.fallbackUrl}/stream/${type}/${encodedId}.json`, 6500);
          if (Array.isArray(fbData?.streams)) rawStreams = fbData.streams;
        } catch (e) {}
      }
      return { addon, rawStreams, latencyMs: Date.now() - startTime };
    })
  );

  const isBadSubServer = (s) => {
    const u = s.url || '';
    const t = `${s.name || ''} ${s.title || ''}`;
    if (u.includes('passing-melinda') || u.includes('fenixbot.squareweb.app')) return true;
    if (/badger|hypex|atlas|\bastra\b|\bneon\b/i.test(t)) return true;
    return false;
  };

  const directPool = [];
  for (const { addon, rawStreams } of rawAddonResponses) {
    for (const s of rawStreams) {
      if (s.url && !isBadSubServer(s)) {
        let cleanUrl = s.url;
        if (cleanUrl.startsWith('http://fenixflix.fenixhub.online/')) {
          cleanUrl = cleanUrl.replace('http://', 'https://');
        }
        const t = `${s.name || ''} ${s.title || ''}`;
        directPool.push({
          directUrl: cleanUrl,
          is4k: /2160p|4k|uhd/i.test(t),
          isDub: /dublado|🇧🇷|portugu[eê]s|dual/i.test(t)
        });
      }
    }
  }

  const addonResults = rawAddonResponses.map(({ addon, rawStreams, latencyMs }) => {
    let filteredRaw = rawStreams.filter((s) => !isBadSubServer(s));

    if (filteredRaw.length === 0 && directPool.length > 0) {
      filteredRaw = directPool.slice(0, 6).map((d, idx) => ({
        name: `${addon.name} ${d.is4k ? '4K' : '1080p'}`,
        title: `🎬 ${addon.name} Cloud #${idx + 1}\n${d.isDub ? '🇧🇷 Dublado PT-BR' : '🇺🇸 Legendado'}`,
        url: d.directUrl
      }));
    }

    const streams = filteredRaw
      .map((s) => normalizeStream(s, addon, directPool))
      .filter((s) => s.proxyUrl);

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
