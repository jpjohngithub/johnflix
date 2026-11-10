const https = require('https');
const http = require('http');

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

function fetchJson(targetUrl, timeoutMs = 8000, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    if (redirectsLeft <= 0) return reject(new Error('Too many redirects'));
    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (e) {
      return reject(e);
    }
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

  let streamUrl = rawStream.url || null;
  let proxyUrl = null;
  let playType = 'direct';
  let sourceKind = 'direct';
  let sourceUrl = null;
  if (streamUrl) {
    if (streamUrl.startsWith('http://fenixflix.fenixhub.online/')) {
      streamUrl = streamUrl.replace('http://', 'https://');
    }
    const isHls = /\.m3u8(?:$|[?#])/i.test(streamUrl);
    playType = isHls ? 'hls' : 'direct';
    sourceKind = playType;
    proxyUrl = isHls ? `/api/hls-proxy?url=${encodeURIComponent(streamUrl)}` : `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
  } else if (rawStream.infoHash) {
    playType = 'unsupported';
    sourceKind = 'torrent';
    sourceUrl = `magnet:?xt=urn:btih:${rawStream.infoHash}`;
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
    embedUrl: null,
    infoHash: rawStream.infoHash ? rawStream.infoHash.toLowerCase() : null,
    fileIdx: rawStream.fileIdx !== undefined ? rawStream.fileIdx : null
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
              return { ...a, online: true, pingMs: Date.now() - t0 };
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
      const decodedId = decodeURIComponent(rawId);
      const encodedId = encodeURIComponent(decodedId);

      // Fetch only streams returned by the configured addon.
      const rawAddonResponses = await Promise.all(
        ADDONS.map(async (addon) => {
          let rawStreams = [];
          try {
            const data = await fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 7500);
            if (Array.isArray(data?.streams)) rawStreams = data.streams;
          } catch (e) {}

          return { addon, rawStreams };
        })
      );

      const addonResults = rawAddonResponses.map(({ addon, rawStreams }) => {
        const streams = rawStreams
          .map((s) => normalizeStream(s, addon))
          .filter(Boolean)
          .filter((s) => s.proxyUrl || s.sourceUrl);

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

      // Sort: Direct Cloud streams first (FenixFlix Zeus/Malfoy, FrostStream, BestCine), Dublado first, 4K first
      allStreams.sort((a, b) => {
        if (a.playType !== b.playType) return a.playType === 'direct' ? -1 : 1;
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? -1 : 1;
        return (b.seeds || 0) - (a.seeds || 0);
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: decodedId,
          type,
          totalStreams: allStreams.length,
          servers: addonResults,
          streams: allStreams
        })
      };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
