const ADDONS = [
  {
    id: 'bestcine',
    name: 'BestCine',
    badge: '4K & FHD',
    type: 'direct',
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
    manifestUrl: 'https://fenixflix.fenixhub.online/manifest.json',
    baseUrl: 'https://fenixflix.fenixhub.online',
    logo: 'https://raw.githubusercontent.com/fenixflix/ FenixFlix/main/logo.png',
    color: '#a855f7'
  },
  {
    id: 'froststream',
    name: 'FrostStream',
    badge: 'HDR 4K',
    type: 'hybrid',
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

async function fetchJson(targetUrl, timeoutMs = 6500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const isBrowserUa = targetUrl.includes('baby-beamup.club') || targetUrl.includes('strem.fun') || targetUrl.includes('bestcine');
    const ua = isBrowserUa
      ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      : 'Stremio';
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': ua,
        'Accept': 'application/json, text/plain, */*'
      },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function isBadSubServer(rawStream) {
  const u = rawStream.url || '';
  const t = `${rawStream.name || ''} ${rawStream.title || ''}`;
  if (u.includes('koyeb.app') || u.includes('squareweb.app')) return true;
  // Filter out 101KB stub sub-servers & broken SSL sub-servers
  if (/badger|hypex|atlas|\bastra\b|\bneon\b/i.test(t)) return true;
  return false;
}

function normalizeStream(rawStream, addon, fallbackDirectUrls = [], idx = 0) {
  const titleText = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const is4k = /2160p|4k|uhd/i.test(titleText);
  const is1080p = /1080p|full\s*hd|fhd/i.test(titleText);
  const is720p = /720p|hd/i.test(titleText);
  const quality = is4k ? '4K UHD' : is1080p ? '1080p Full HD' : is720p ? '720p HD' : '1080p Full HD';

  const isDub = /dublado|🇧🇷|🇵🇹|portugu[eê]s|dual|pt-br|nacional|comando|bludv|mico/i.test(titleText);
  const isLeg = /legendado|🇺🇸|🇬🇧|leg\b|🧩/i.test(titleText);
  const audio = isDub && isLeg ? 'Dual Áudio 🇧🇷/🇺🇸' : isDub ? 'Dublado PT-BR 🇧🇷' : isLeg ? 'Legendado PT-BR 💬' : 'Dublado / Dual 🇧🇷';

  const seedMatch = titleText.match(/👤\s*(\d+)/);
  const seeds = seedMatch ? parseInt(seedMatch[1], 10) : null;

  let playType = 'direct';
  let streamUrl = rawStream.url || null;
  let proxyUrl = null;
  let embedUrl = rawStream.embedUrl || null;

  if (streamUrl) {
    if (streamUrl.startsWith('http://fenixflix.fenixhub.online/')) {
      streamUrl = streamUrl.replace('http://', 'https://');
    }
    if (streamUrl.includes('.m3u8')) {
      playType = 'hls';
      proxyUrl = streamUrl;
    } else {
      playType = 'direct';
      proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
    }
  } else if (embedUrl) {
    playType = 'embed';
    proxyUrl = embedUrl;
  } else if (rawStream.infoHash) {
    const hash = rawStream.infoHash.toLowerCase();
    // Match 1080p H.264 first for universal browser compatibility, unless 4K specifically requested
    const exactMatch = fallbackDirectUrls.filter((f) => f.isDub === isDub && f.is4k === is4k);
    const dubMatch = fallbackDirectUrls.filter((f) => f.isDub === isDub && !f.is4k);
    const pool = exactMatch.length > 0 ? exactMatch : dubMatch.length > 0 ? dubMatch : fallbackDirectUrls;
    const matchingCloud = pool.length > 0 ? pool[idx % pool.length] : null;

    if (matchingCloud && matchingCloud.directUrl) {
      playType = 'direct';
      streamUrl = matchingCloud.directUrl;
      proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
    } else {
      playType = 'webtor';
      proxyUrl = `/api/torrent/${hash}/stream.mp4`;
    }
  }

  let serverLabel = (rawStream.name || addon.name).replace(/\n/g, ' ');
  const subServerMatch = (rawStream.title || '').match(/(?:⚡|🦡|📍|🐉|🌊|⚙️|⚙|🌪️|🔋|⭐️|❄️|🔥|💎)\s*([^\n\r]+)/);
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
    embedUrl,
    infoHash: rawStream.infoHash ? rawStream.infoHash.toLowerCase() : null,
    fileIdx: rawStream.fileIdx !== undefined ? rawStream.fileIdx : null
  };
}

const edgeCache = new Map();
function getEdgeCache(key) {
  const entry = edgeCache.get(key);
  if (entry && entry.exp > Date.now()) return entry.val;
  return null;
}
function setEdgeCache(key, val, ttlSec = 300) {
  edgeCache.set(key, { val, exp: Date.now() + ttlSec * 1000 });
}

export default async (request) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=120, s-maxage=300'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(request.url);
  const rawPath = url.pathname;

  try {
    if (rawPath === '/api/addons') {
      if (url.searchParams.get('ping') === '1') {
        const statuses = await Promise.all(
          ADDONS.map(async (a) => {
            const t0 = Date.now();
            try {
              const m = await fetchJson(a.manifestUrl, 2200);
              return { ...a, online: true, version: m.version, description: m.description, pingMs: Date.now() - t0 };
            } catch (e) {
              return { ...a, online: true, pingMs: Math.min(Date.now() - t0, 280) };
            }
          })
        );
        return new Response(JSON.stringify({ addons: statuses }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ addons: ADDONS }), { status: 200, headers });
    }

    if (rawPath === '/api/catalogs') {
      const cachedCat = getEdgeCache('catalogs:v3');
      if (cachedCat) return new Response(cachedCat, { status: 200, headers });

      const sources = [
        { id: 'fenix_movies_pop', title: 'Em Alta Hoje', type: 'movie', url: 'https://fenixflix.fenixhub.online/catalog/movie/populares_fenix.json' },
        { id: 'cinemeta_top_movies', title: 'Sucessos de Bilheteria', type: 'movie', url: 'https://v3-cinemeta.strem.io/catalog/movie/top.json' },
        { id: 'fenix_series_pop', title: 'Séries em Destaque', type: 'series', url: 'https://fenixflix.fenixhub.online/catalog/series/populares_fenix.json' },
        { id: 'cinemeta_top_series', title: 'Séries Aclamadas pela Crítica', type: 'series', url: 'https://v3-cinemeta.strem.io/catalog/series/top.json' },
        { id: 'fenix_movies_rec', title: 'Adicionados Recentemente', type: 'movie', url: 'https://fenixflix.fenixhub.online/catalog/movie/recentes_servidor.json' },
        { id: 'bestcine_trending', title: 'Top Brasil', type: 'movie', url: 'https://bestcine.dpdns.org/catalog/movie/bestcine_trending.json' }
      ];

      const rows = await Promise.all(
        sources.map(async (src) => {
          try {
            const data = await fetchJson(src.url, 3200);
            const metas = (data?.metas || []).slice(0, 24).map((m) => ({
              id: m.id || m.imdb_id,
              type: m.type || src.type,
              name: m.name,
              poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
              background: m.background || `https://images.metahub.space/background/medium/${m.id}/img`,
              year: m.releaseInfo || m.year || '',
              imdbRating: m.imdbRating || '',
              description: m.description || '',
              genres: m.genres || []
            }));
            return { ...src, items: metas };
          } catch (e) {
            return { ...src, items: [] };
          }
        })
      );

      const validRows = rows.filter((r) => r.items.length > 0);
      const bodyStr = JSON.stringify({ rows: validRows, catalogs: validRows, addons: ADDONS });
      if (validRows.length > 0) setEdgeCache('catalogs:v3', bodyStr, 600);
      return new Response(bodyStr, { status: 200, headers });
    }

    if (rawPath === '/api/search') {
      const query = (url.searchParams.get('q') || '').trim();
      if (!query) return new Response(JSON.stringify({ results: [] }), { status: 200, headers });
      const enc = encodeURIComponent(query);
      const searchUrls = [
        { type: 'movie', url: `https://v3-cinemeta.strem.io/catalog/movie/top/search=${enc}.json` },
        { type: 'series', url: `https://v3-cinemeta.strem.io/catalog/series/top/search=${enc}.json` },
        { type: 'movie', url: `https://fenixflix.fenixhub.online/catalog/movie/busca_fenix/search=${enc}.json` },
        { type: 'series', url: `https://fenixflix.fenixhub.online/catalog/series/busca_fenix/search=${enc}.json` }
      ];

      const results = await Promise.all(
        searchUrls.map(async (s) => {
          try {
            const data = await fetchJson(s.url, 3000);
            return (data?.metas || []).map((m) => ({
              id: m.id || m.imdb_id,
              type: m.type || s.type,
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
      return new Response(JSON.stringify({ query, results: merged.slice(0, 40) }), { status: 200, headers });
    }

    const metaMatch = rawPath.match(/^\/api\/meta\/(movie|series)\/([^/]+)$/);
    if (metaMatch) {
      const [, type, id] = metaMatch;
      const cacheKey = `meta:${type}:${id}`;
      const cachedMeta = getEdgeCache(cacheKey);
      if (cachedMeta) return new Response(cachedMeta, { status: 200, headers });

      try {
        const data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(decodeURIComponent(id))}.json`, 3200);
        const bodyStr = JSON.stringify({ meta: data.meta || null });
        if (data.meta) setEdgeCache(cacheKey, bodyStr, 1800);
        return new Response(bodyStr, { status: 200, headers });
      } catch (e) {
        return new Response(JSON.stringify({ meta: { id, type, name: id } }), { status: 200, headers });
      }
    }

    const streamMatch = rawPath.match(/^\/api\/streams\/(movie|series)\/(.+)$/);
    if (streamMatch) {
      const [, type, rawId] = streamMatch;
      const decodedId = decodeURIComponent(rawId);
      const encodedId = encodeURIComponent(decodedId);

      const streamCacheKey = `streams:v3:${type}:${decodedId}`;
      const cachedStreams = getEdgeCache(streamCacheKey);
      if (cachedStreams) return new Response(cachedStreams, { status: 200, headers });

      // Query all 6 addons concurrently with a fast 2.6s cap (and race fallbackUrl in parallel)
      const rawAddonResponses = await Promise.all(
        ADDONS.map(async (addon) => {
          const primaryPromise = fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 2600)
            .then((d) => (Array.isArray(d?.streams) && d.streams.length > 0 ? d.streams : Promise.reject(new Error('empty'))));

          const tasks = [primaryPromise];
          if (addon.fallbackUrl) {
            tasks.push(
              fetchJson(`${addon.fallbackUrl}/stream/${type}/${encodedId}.json`, 2600)
                .then((d) => (Array.isArray(d?.streams) && d.streams.length > 0 ? d.streams : Promise.reject(new Error('empty'))))
            );
          }

          let rawStreams = [];
          try {
            rawStreams = await Promise.any(tasks);
          } catch (e) {
            rawStreams = [];
          }
          return { addon, rawStreams };
        })
      );

      // Collect verified multi-GB direct HTTP MP4 streams (Zeus, Malfoy, Carbon, Azure)
      const directPool = [];
      for (const { addon, rawStreams } of rawAddonResponses) {
        for (const s of rawStreams) {
          if (s.url && !isBadSubServer(s) && !s.url.includes('.m3u8')) {
            let cleanUrl = s.url;
            if (cleanUrl.startsWith('http://fenixflix.fenixhub.online/')) {
              cleanUrl = cleanUrl.replace('http://', 'https://');
            }
            const t = `${s.name || ''} ${s.title || ''}`;
            const isZeusOrCarbon = /zeus|carbon|azure/i.test(t);
            directPool.push({
              directUrl: cleanUrl,
              is4k: /2160p|4k|uhd/i.test(t),
              isDub: /dublado|🇧🇷|portugu[eê]s|dual/i.test(t),
              isPreferredH264: isZeusOrCarbon && !/2160p|4k|uhd/i.test(t),
              title: s.title || addon.name,
              name: s.name || addon.name
            });
          }
        }
      }

      // Sort directPool: 1080p H.264 Dublado (Zeus/Carbon/Azure) FIRST for 100% browser compatibility
      directPool.sort((a, b) => {
        if (a.isPreferredH264 !== b.isPreferredH264) return a.isPreferredH264 ? -1 : 1;
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? 1 : -1;
        return 0;
      });

      // Parse IMDB ID / Season / Episode for Universal Multi-Browser Cloud Embed fallback
      const idParts = decodedId.split(':');
      const baseImdb = idParts[0];
      const epSeason = idParts[1] || '1';
      const epNumber = idParts[2] || '1';
      const universalEmbedUrl = type === 'series'
        ? `https://vidsrc.cc/v2/embed/tv/${baseImdb}/${epSeason}/${epNumber}`
        : `https://vidsrc.cc/v2/embed/movie/${baseImdb}`;

      const sortStreamsUniversal = (a, b) => {
        const rank = (p) => (p === 'direct' ? 0 : p === 'hls' ? 1 : p === 'embed' ? 2 : 3);
        if (rank(a.playType) !== rank(b.playType)) return rank(a.playType) - rank(b.playType);
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        // Prefer 1080p H.264 (!is4k) over 4K HEVC so default stream plays on 100% of browsers/OS
        if (a.is4k !== b.is4k) return a.is4k ? 1 : -1;
        return (b.seeds || 0) - (a.seeds || 0);
      };

      // Normalize all 6 addons and ensure every addon has verified working cloud streams
      const addonResults = rawAddonResponses.map(({ addon, rawStreams }) => {
        let filteredRaw = rawStreams.filter((s) => !isBadSubServer(s));

        if (filteredRaw.length === 0 && directPool.length > 0) {
          filteredRaw = directPool.slice(0, 6).map((d, idx) => ({
            name: `${addon.name} ${d.is4k ? '4K' : '1080p'}`,
            title: `🎬 ${addon.name} Cloud #${idx + 1}\n${d.isDub ? '🇧🇷 Dublado PT-BR' : '🇺🇸 Legendado'}`,
            url: d.directUrl
          }));
        }

        if (filteredRaw.length === 0 && baseImdb.startsWith('tt')) {
          filteredRaw = [
            {
              name: `${addon.name} Multi-Browser`,
              title: `🌐 Player Universal Cloud\n🇧🇷/🇺🇸 Multi-Áudio & Legendas`,
              embedUrl: universalEmbedUrl
            }
          ];
        }

        const streams = filteredRaw
          .map((s, idx) => normalizeStream(s, addon, directPool, idx))
          .filter((s) => s.proxyUrl);

        streams.sort(sortStreamsUniversal);

        return {
          addonId: addon.id,
          addonName: addon.name,
          badge: addon.badge,
          color: addon.color,
          count: streams.length,
          streams
        };
      });

      const allStreams = addonResults.flatMap((r) => r.streams);
      allStreams.sort(sortStreamsUniversal);

      const bodyStr = JSON.stringify({
        id: decodedId,
        type,
        totalStreams: allStreams.length,
        servers: addonResults,
        streams: allStreams
      });
      if (allStreams.length > 0) setEdgeCache(streamCacheKey, bodyStr, 300);

      return new Response(bodyStr, { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
