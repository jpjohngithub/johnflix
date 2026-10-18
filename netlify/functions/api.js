const https = require('https');
const http = require('http');

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
    badge: 'P2P',
    type: 'p2p',
    manifestUrl: 'https://magneto-jnv5.onrender.com/v1/manifest.json',
    baseUrl: 'https://magneto-jnv5.onrender.com/v1',
    logo: 'https://images.metahub.space/logo/medium/tt0133093/img',
    color: '#ec4899'
  },
  {
    id: 'micoleao',
    name: 'Mico-Leão',
    badge: 'HD',
    type: 'p2p',
    manifestUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club/manifest.json',
    baseUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club',
    logo: 'https://i.ibb.co/YyPbHVT/icon.png',
    color: '#eab308'
  },
  {
    id: 'brazuca',
    name: 'Brazuca',
    badge: 'P2P',
    type: 'p2p',
    manifestUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club/manifest.json',
    baseUrl: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club',
    logo: 'https://i.imgur.com/KVpfrAk.png',
    color: '#22c55e'
  }
];

function fetchJson(targetUrl, timeoutMs = 8500, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
    const parsed = new URL(targetUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.get(
      targetUrl,
      {
        headers: {
          'User-Agent': 'Stremio/4.4.168 (Web; JohnFlix/3.0)',
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
            resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
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

function resolveRedirectUrl(targetUrl, redirectsLeft = 4) {
  return new Promise((resolve) => {
    if (redirectsLeft <= 0) return resolve(targetUrl);
    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (e) {
      return resolve(targetUrl);
    }
    const lib = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(
      targetUrl,
      {
        method: 'HEAD',
        headers: { 'User-Agent': 'Stremio/4.4.168 (Lavf/58.76.100)' },
        timeout: 4500
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const next = new URL(res.headers.location, targetUrl).toString();
          return resolveRedirectUrl(next, redirectsLeft - 1).then(resolve);
        }
        resolve(targetUrl);
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve(targetUrl);
    });
    req.on('error', () => resolve(targetUrl));
    req.end();
  });
}

function normalizeStream(rawStream, addon) {
  const titleText = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const is4k = /2160p|4k|uhd/i.test(titleText);
  const is1080p = /1080p|full\s*hd|fhd/i.test(titleText);
  const is720p = /720p|hd/i.test(titleText);
  const quality = is4k ? '4K UHD' : is1080p ? '1080p Full HD' : is720p ? '720p HD' : 'HD';

  const isDub = /dublado|🇧🇷|portugu[eê]s|dual|pt-br|nacional/i.test(titleText);
  const isLeg = /legendado|🇺🇸|leg\b|🧩/i.test(titleText);
  const audio = isDub && isLeg ? 'Dual Áudio 🇧🇷/🇺🇸' : isDub ? 'Dublado PT-BR 🇧🇷' : isLeg ? 'Legendado PT-BR 💬' : 'Áudio Original';

  const seedMatch = titleText.match(/👤\s*(\d+)/);
  const seeds = seedMatch ? parseInt(seedMatch[1], 10) : null;

  let playType = 'direct';
  let streamUrl = rawStream.url || null;
  let proxyUrl = null;

  if (streamUrl) {
    playType = 'direct';
    proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
  } else if (rawStream.infoHash) {
    playType = 'torrent';
    const hash = rawStream.infoHash.toLowerCase();
    proxyUrl = `magnet:?xt=urn:btih:${hash}`;
  }

  let serverLabel = (rawStream.name || addon.name).replace(/\n/g, ' ');
  const subServerMatch = (rawStream.title || '').match(/(?:⚡|🦡|📍|🐉|🌊)\s*([^\n\r]+)/);
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
    infoHash: rawStream.infoHash || null
  };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const rawPath = event.path.replace(/^\/\.netlify\/functions\/api/, '/api');
  const q = event.queryStringParameters || {};

  try {
    if (rawPath === '/api/addons') {
      if (q.ping === '1') {
        const statuses = await Promise.all(
          ADDONS.map(async (a) => {
            const t0 = Date.now();
            try {
              const m = await fetchJson(a.manifestUrl, 5000);
              return { ...a, online: true, version: m.version, description: m.description, pingMs: Date.now() - t0 };
            } catch (e) {
              return { ...a, online: false, error: e.message, pingMs: Date.now() - t0 };
            }
          })
        );
        return { statusCode: 200, headers, body: JSON.stringify({ addons: statuses }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ addons: ADDONS }) };
    }

    if (rawPath === '/api/catalogs') {
      const sources = [
        { id: 'bestcine_trending', title: 'Em Alta Hoje', type: 'movie', url: 'https://bestcine.dpdns.org/catalog/movie/bestcine_trending.json' },
        { id: 'fenix_movies_pop', title: 'Filmes Populares', type: 'movie', url: 'https://fenixflix.fenixhub.online/catalog/movie/populares_fenix.json' },
        { id: 'bestcine_series', title: 'Séries em Destaque', type: 'series', url: 'https://bestcine.dpdns.org/catalog/series/bestcine_series.json' },
        { id: 'fenix_series_pop', title: 'Séries Mais Assistidas', type: 'series', url: 'https://fenixflix.fenixhub.online/catalog/series/populares_fenix.json' },
        { id: 'fenix_movies_rec', title: 'Adicionados Recentemente', type: 'movie', url: 'https://fenixflix.fenixhub.online/catalog/movie/recentes_servidor.json' },
        { id: 'cinemeta_top_movies', title: 'Sucessos de Bilheteria', type: 'movie', url: 'https://v3-cinemeta.strem.io/catalog/movie/top.json' },
        { id: 'cinemeta_top_series', title: 'Séries Aclamadas pela Crítica', type: 'series', url: 'https://v3-cinemeta.strem.io/catalog/series/top.json' }
      ];

      const rows = await Promise.all(
        sources.map(async (src) => {
          try {
            const data = await fetchJson(src.url, 7500);
            const metas = (data?.metas || []).slice(0, 24).map((m) => ({
              id: m.id || m.imdb_id,
              type: m.type || src.type,
              name: m.name,
              poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
              background: m.background || `https://images.metahub.space/background/medium/${m.id}/img`,
              description: m.description || '',
              year: m.releaseInfo || m.year || '',
              imdbRating: m.imdbRating || ''
            })).filter((m) => m.id && m.name);
            return { id: src.id, title: src.title, type: src.type, items: metas };
          } catch (e) {
            return { id: src.id, title: src.title, type: src.type, items: [] };
          }
        })
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rows: rows.filter((r) => r.items.length > 0), addons: ADDONS })
      };
    }

    if (rawPath === '/api/search') {
      const query = (q.q || '').trim();
      if (!query) return { statusCode: 200, headers, body: JSON.stringify({ query: '', results: [] }) };
      const cleanQ = encodeURIComponent(query);
      const endpoints = [
        { type: 'movie', url: `https://fenixflix.fenixhub.online/catalog/movie/populares_fenix/search=${cleanQ}.json` },
        { type: 'series', url: `https://fenixflix.fenixhub.online/catalog/series/populares_fenix/search=${cleanQ}.json` },
        { type: 'movie', url: `https://v3-cinemeta.strem.io/catalog/movie/top/search=${cleanQ}.json` },
        { type: 'series', url: `https://v3-cinemeta.strem.io/catalog/series/top/search=${cleanQ}.json` }
      ];

      const results = await Promise.all(
        endpoints.map(async (ep) => {
          try {
            const data = await fetchJson(ep.url, 6500);
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
          const k = `${item.type}:${item.id}`;
          if (!seen.has(k)) {
            seen.add(k);
            merged.push(item);
          }
        }
      }
      return { statusCode: 200, headers, body: JSON.stringify({ query, results: merged.slice(0, 40) }) };
    }

    const metaMatch = rawPath.match(/^\/api\/meta\/(movie|series)\/([^/]+)$/);
    if (metaMatch) {
      const [, type, id] = metaMatch;
      try {
        const data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(decodeURIComponent(id))}.json`, 7000);
        return { statusCode: 200, headers, body: JSON.stringify({ meta: data.meta || null }) };
      } catch (e) {
        return { statusCode: 200, headers, body: JSON.stringify({ meta: { id, type, name: id } }) };
      }
    }

    const streamMatch = rawPath.match(/^\/api\/streams\/(movie|series)\/(.+)$/);
    if (streamMatch) {
      const [, type, rawId] = streamMatch;
      const encodedId = encodeURIComponent(decodeURIComponent(rawId));
      const addonResults = await Promise.all(
        ADDONS.map(async (addon) => {
          try {
            const data = await fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 7500);
            const rawStreams = Array.isArray(data?.streams) ? data.streams : [];
            const streams = rawStreams.map((s) => normalizeStream(s, addon)).filter((s) => s.proxyUrl);
            return { addonId: addon.id, addonName: addon.name, badge: addon.badge, color: addon.color, count: streams.length, streams };
          } catch (e) {
            return { addonId: addon.id, addonName: addon.name, badge: addon.badge, color: addon.color, count: 0, streams: [] };
          }
        })
      );

      const allStreams = addonResults.flatMap((r) => r.streams);
      allStreams.sort((a, b) => {
        if (a.playType !== b.playType) return a.playType === 'direct' ? -1 : 1;
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? -1 : 1;
        return (b.seeds || 0) - (a.seeds || 0);
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ id: rawId, type, totalStreams: allStreams.length, servers: addonResults, streams: allStreams })
      };
    }

    if (rawPath === '/api/proxy-stream' && q.url) {
      const resolved = await resolveRedirectUrl(q.url);
      return {
        statusCode: 302,
        headers: {
          'Location': resolved,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        },
        body: ''
      };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
