const MOVIE_ADDONS = [
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
    logo: 'https://raw.githubusercontent.com/fenixflix/ FenixFlix/main/logo.png',
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
    fallbackUrl: 'https://torrentio.strem.fun/providers=micoleaodublado,comando,bludv',
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
    fallbackUrl: 'https://torrentio.strem.fun/providers=comando,bludv,lapumia,ondebaixa',
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
    manifestUrl: 'https://framextv.xyz/',
    baseUrl: 'https://api.framextv.tech',
    logo: 'https://framextv.xyz/favicon.svg',
    color: '#6366f1'
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
    id: 'superflix',
    name: 'SuperFlix (Dublado)',
    badge: 'DUBLADO BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://superflixapi.fun/',
    baseUrl: 'https://superflixapi.fun',
    logo: 'https://superflixapi.fun/favicon.ico',
    color: '#e11d48'
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
  }
];

const TV_ADDONS = [
  {
    id: 'fenixtv',
    name: 'Fenix TV',
    badge: 'TV AO VIVO',
    type: 'tv',
    category: 'tv',
    manifestUrl: 'https://fenixtv.fenixhub.online/manifest.json',
    baseUrl: 'https://fenixtv.fenixhub.online',
    logo: 'https://fenixtv.fenixhub.online/logo.png',
    color: '#a855f7'
  },
  {
    id: 'nexotv',
    name: 'NexoTV',
    badge: 'CANAIS HD',
    type: 'tv',
    category: 'tv',
    manifestUrl: 'https://263f84288ddb-nexotv.baby-beamup.club/manifest.json',
    baseUrl: 'https://263f84288ddb-nexotv.baby-beamup.club',
    logo: 'https://raw.githubusercontent.com/joaosavi/nexotv/refs/heads/main/packages/frontend/public/assets/logo.svg',
    color: '#38bdf8'
  },
  {
    id: 'ehtudotv',
    name: 'Eh! IPTV',
    badge: 'IPTV BR',
    type: 'tv',
    category: 'tv',
    manifestUrl: 'https://stremio-addon.ehtudo.app/manifest.json',
    baseUrl: 'https://stremio-addon.ehtudo.app',
    logo: 'https://stremio-addon.ehtudo.app/logo-small-256x256.png',
    color: '#22c55e'
  }
];

const ADDONS = [...MOVIE_ADDONS, ...TV_ADDONS.filter((t) => !MOVIE_ADDONS.some((m) => m.manifestUrl === t.manifestUrl))];

async function fetchJson(targetUrl, timeoutMs = 4500, customHeaders = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const isBrowserUa = targetUrl.includes('baby-beamup.club') || targetUrl.includes('strem.fun') || targetUrl.includes('bestcine') || targetUrl.includes('framextv') || targetUrl.includes('media-imdb');
    const ua = isBrowserUa
      ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      : 'Stremio';
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': ua,
        'Accept': 'application/json, text/plain, */*',
        ...customHeaders
      },
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFrameXTVStreams(type, tmdbId, season = 1, episode = 1) {
  if (!tmdbId) return [];
  const mediaType = type === 'series' ? 'tv' : 'movie';
  const providers = ['titan', 'giant', 'bowler'];
  const out = [];

  const responses = await Promise.all(
    providers.map(async (prov) => {
      try {
        const q = mediaType === 'tv'
          ? `type=tv&id=${tmdbId}&season=${season}&episode=${episode}&provider=${prov}`
          : `type=movie&id=${tmdbId}&provider=${prov}`;
        const data = await fetchJson(`https://api.framextv.tech/api/stream?${q}`, 2500);
        if (data?.success && Array.isArray(data.sources)) {
          return data.sources.map((src) => ({
            name: `FrameXTV • ${src.server || prov.toUpperCase()}`,
            title: `🇺🇸 ${src.server || prov} (${src.quality || '1080p'})\n🇺🇸 Inglês (Original)`,
            url: src.url,
            isDirectCors: Boolean(src.skipProxy || (src.url && src.url.includes('workers.dev')))
          }));
        }
      } catch (e) {}
      return [];
    })
  );

  for (const group of responses) {
    for (const s of group) {
      if (s.url) out.push(s);
    }
  }

  // Also include FrameXTV's open Multi-Server Embed routes (Miner XIX, Headhunter/VidLink, Videasy)
  const fxEmbed = mediaType === 'tv'
    ? `https://framextv.tech/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1`
    : `https://framextv.tech/embed/movie/${tmdbId}?autoplay=1`;
  const videasyEmbed = mediaType === 'tv'
    ? `https://player.videasy.to/tv/${tmdbId}/${season}/${episode}`
    : `https://player.videasy.to/movie/${tmdbId}`;

  out.push(
    {
      name: 'FrameXTV • Multi-Server 4K',
      title: '🇺🇸 Miner XIX / Valkyrie VI / Super Barbarian\n🇺🇸 Inglês (Original)',
      embedUrl: fxEmbed
    },
    {
      name: 'FrameXTV • Videasy 4K',
      title: '🇺🇸 Miami 4K / Atlanta 1080p\n🇺🇸 Inglês (Original)',
      embedUrl: videasyEmbed
    }
  );

  return out;
}

function isBadSubServer(rawStream) {
  const u = rawStream.url || '';
  const t = `${rawStream.name || ''} ${rawStream.title || ''}`;
  if (u.includes('koyeb.app') || u.includes('squareweb.app')) return true;
  if (/badger|hypex|atlas|\bastra\b|\bneon\b/i.test(t)) return true;
  return false;
}

function normalizeStream(rawStream, addon, fallbackDirectUrls = [], idx = 0, englishPool = []) {
  const titleText = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const is4k = /2160p|4k|uhd/i.test(titleText);
  const is1080p = /1080p|full\s*hd|fhd/i.test(titleText);
  const is720p = /720p|hd/i.test(titleText);
  const quality = is4k ? '4K UHD' : is1080p ? '1080p Full HD' : is720p ? '720p HD' : '1080p Full HD';

  const forceEn = Boolean(addon.isEnglishOnly);
  const isDub = forceEn ? false : /dublado|🇧🇷|🇵🇹|portugu[eê]s|dual|pt-br|nacional|comando|bludv|mico/i.test(titleText);
  const isLeg = /legendado|🇺🇸|🇬🇧|leg\b|🧩/i.test(titleText);
  const audio = forceEn
    ? 'Inglês (Original)'
    : isDub && isLeg
      ? 'Dual Áudio PT/EN'
      : isDub
        ? 'Dublado PT-BR'
        : isLeg
          ? 'Legendado PT-BR'
          : 'Dublado / Dual';

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
    if (streamUrl.includes('.m3u8') || streamUrl.includes('fenixtv.fenixhub.online/proxy') || streamUrl.includes('fenixtv.fenixhub.online/direct.m3u8')) {
      playType = 'hls';
      proxyUrl = streamUrl;
    } else if (rawStream.isDirectCors || streamUrl.includes('workers.dev')) {
      playType = 'direct';
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
    playType = 'webtor';
    proxyUrl = `/api/torrent/${hash}/stream.mp4`;
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
    isEnglishOnly: forceEn,
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
      const cachedCat = getEdgeCache('catalogs:v8');
      if (cachedCat) return new Response(cachedCat, { status: 200, headers });

      const sources = [
        { id: 'fenix_movies_pop', title: 'Em Alta Hoje', type: 'movie', category: 'trending', url: 'https://fenixflix.fenixhub.online/catalog/movie/populares_fenix.json', limit: 36 },
        { id: 'cinemeta_top_movies', title: 'Sucessos de Bilheteria', type: 'movie', category: 'trending', url: 'https://v3-cinemeta.strem.io/catalog/movie/top.json', limit: 36 },
        { id: 'fenix_series_pop', title: 'Séries Mais Assistidas', type: 'series', category: 'trending', url: 'https://fenixflix.fenixhub.online/catalog/series/populares_fenix.json', limit: 36 },
        { id: 'cinemeta_action', title: 'Ação e Aventura', type: 'movie', category: 'action', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Action.json', limit: 36 },
        { id: 'cinemeta_scifi', title: 'Ficção Científica e Fantasia', type: 'movie', category: 'scifi', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Sci-Fi.json', limit: 36 },
        { id: 'cinemeta_horror', title: 'Terror e Suspense', type: 'movie', category: 'horror', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Horror.json', limit: 36 },
        { id: 'cinemeta_top_series', title: 'Séries Aclamadas pela Crítica', type: 'series', category: 'acclaimed', url: 'https://v3-cinemeta.strem.io/catalog/series/top.json', limit: 36 },
        { id: 'cinemeta_comedy', title: 'Comédia', type: 'movie', category: 'comedy', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Comedy.json', limit: 36 },
        { id: 'cinemeta_animation', title: 'Animação e Família', type: 'movie', category: 'animation', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Animation.json', limit: 36 },
        { id: 'fenix_movies_rec', title: 'Adicionados Recentemente', type: 'movie', category: 'recent', url: 'https://fenixflix.fenixhub.online/catalog/movie/recentes_servidor.json', limit: 36 },
        { id: 'bestcine_trending', title: 'Favoritos no Brasil', type: 'movie', category: 'trending', url: 'https://bestcine.dpdns.org/catalog/movie/bestcine_trending.json', limit: 36 },
        { id: 'cinemeta_drama', title: 'Drama Aclamado', type: 'movie', category: 'drama', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Drama.json', limit: 36 },
        { id: 'cinemeta_crime', title: 'Crime e Investigação', type: 'movie', category: 'crime', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Crime.json', limit: 36 },
        { id: 'cinemeta_thriller', title: 'Thrillers de Prender a Respiração', type: 'movie', category: 'thriller', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Thriller.json', limit: 36 },
        { id: 'cinemeta_romance', title: 'Romance', type: 'movie', category: 'romance', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Romance.json', limit: 36 },
        { id: 'cinemeta_adventure', title: 'Aventuras Épicas', type: 'movie', category: 'adventure', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Adventure.json', limit: 36 },
        { id: 'cinemeta_fantasy', title: 'Mundos de Fantasia', type: 'movie', category: 'fantasy', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Fantasy.json', limit: 36 },
        { id: 'cinemeta_mystery', title: 'Mistério e Suspense', type: 'movie', category: 'mystery', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Mystery.json', limit: 36 },
        { id: 'cinemeta_family', title: 'Para Ver em Família', type: 'movie', category: 'family', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Family.json', limit: 36 },
        { id: 'cinemeta_history', title: 'História e Guerra', type: 'movie', category: 'history', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=History.json', limit: 36 },
        { id: 'cinemeta_docs', title: 'Documentários', type: 'movie', category: 'documentary', url: 'https://v3-cinemeta.strem.io/catalog/movie/top/genre=Documentary.json', limit: 36 },
        { id: 'cinemeta_series_drama', title: 'Séries de Drama', type: 'series', category: 'drama', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Drama.json', limit: 36 },
        { id: 'cinemeta_series_crime', title: 'Séries de Crime', type: 'series', category: 'crime', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Crime.json', limit: 36 },
        { id: 'cinemeta_series_comedy', title: 'Séries de Comédia', type: 'series', category: 'comedy', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Comedy.json', limit: 36 },
        { id: 'cinemeta_series_scifi', title: 'Séries de Ficção e Fantasia', type: 'series', category: 'scifi', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Sci-Fi.json', limit: 36 },
        { id: 'cinemeta_series_anim', title: 'Animações e Animes', type: 'series', category: 'animation', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Animation.json', limit: 36 },
        { id: 'cinemeta_series_docs', title: 'Séries Documentais', type: 'series', category: 'documentary', url: 'https://v3-cinemeta.strem.io/catalog/series/top/genre=Documentary.json', limit: 36 },        // Live TV Channels Catalogs (Fenix TV / NexoTV / Eh! IPTV)
        { id: 'tv_reidoscanais', title: 'Esportes, Filmes e Variedades Ao Vivo', type: 'tv', tvCategory: 'Esportes & Filmes', url: 'https://fenixtv.fenixhub.online/catalog/tv/tv_reidoscanais.json', limit: 60 },
        { id: 'tv_exploud', title: 'Canais Principais e Abertos', type: 'tv', tvCategory: 'Principais', url: 'https://fenixtv.fenixhub.online/catalog/tv/tv_exploud.json', limit: 60 },
        { id: 'tv_eventos', title: 'Jogos e Eventos Ao Vivo', type: 'tv', tvCategory: 'Eventos', url: 'https://fenixtv.fenixhub.online/catalog/tv/tv_eventos.json', limit: 40 },
        { id: 'tv_nettv', title: 'Grade Completa de Canais', type: 'tv', tvCategory: 'Grade HD', url: 'https://fenixtv.fenixhub.online/catalog/tv/tv_nettv.json', limit: 80 }
      ];

      const richById = new Map();

      const rows = await Promise.all(
        sources.map(async (src) => {
          try {
            const data = await fetchJson(src.url, 3400);
            const metas = (data?.metas || []).slice(0, src.limit || 36).map((m) => {
              const itemId = m.id || m.imdb_id || '';
              const isImdb = itemId.startsWith('tt');
              const ytId = m.trailers?.[0]?.source || m.trailerStreams?.[0]?.ytId || '';
              const item = {
                id: itemId,
                type: src.type === 'tv' ? 'tv' : (m.type || src.type),
                name: m.name,
                logo: m.logo || (isImdb ? `https://images.metahub.space/logo/medium/${itemId}/img` : ''),
                poster: m.poster || m.logo || (isImdb ? `https://images.metahub.space/poster/medium/${itemId}/img` : ''),
                background: m.background || (isImdb ? `https://images.metahub.space/background/large/${itemId}/img` : (m.poster || m.logo || '')),
                year: String(m.releaseInfo || m.year || (src.type === 'tv' ? 'AO VIVO' : '')).split('–')[0],
                runtime: m.runtime || '',
                imdbRating: m.imdbRating || '',
                description: m.description || '',
                genres: m.genres || m.genre || (src.tvCategory ? [src.tvCategory] : []),
                cast: Array.isArray(m.cast) ? m.cast.slice(0, 4) : [],
                ytId
              };
              if (isImdb) {
                const prev = richById.get(itemId) || {};
                richById.set(itemId, {
                  ...prev,
                  ytId: item.ytId || prev.ytId || '',
                  imdbRating: item.imdbRating || prev.imdbRating || '',
                  year: item.year || prev.year || '',
                  runtime: item.runtime || prev.runtime || '',
                  genres: (item.genres && item.genres.length) ? item.genres : (prev.genres || []),
                  cast: (item.cast && item.cast.length) ? item.cast : (prev.cast || []),
                  ptName: src.id.startsWith('fenix_') ? item.name : (prev.ptName || ''),
                  ptDesc: src.id.startsWith('fenix_') ? item.description : (prev.ptDesc || '')
                });
              }
              return item;
            });
            return { ...src, items: metas };
          } catch (e) {
            return { ...src, items: [] };
          }
        })
      );

      // Enrich top FenixFlix & Cinemeta items with trailer ytId & rating in parallel if not already in richById
      const heroCandidates = [
        ...(rows.find((r) => r.id === 'fenix_movies_pop')?.items?.slice(0, 8) || []),
        ...(rows.find((r) => r.id === 'cinemeta_top_movies')?.items?.slice(0, 6) || []),
        ...(rows.find((r) => r.id === 'fenix_series_pop')?.items?.slice(0, 4) || [])
      ];
      await Promise.all(
        heroCandidates.map(async (item) => {
          const cached = richById.get(item.id);
          if (cached && cached.ytId) return;
          try {
            const d = await fetchJson(`https://v3-cinemeta.strem.io/meta/${item.type}/${item.id}.json`, 1800);
            const m = d?.meta;
            if (m) {
              const ytId = m.trailers?.[0]?.source || m.trailerStreams?.[0]?.ytId || '';
              const prev = richById.get(item.id) || {};
              richById.set(item.id, {
                ...prev,
                ytId: ytId || prev.ytId || '',
                imdbRating: m.imdbRating || prev.imdbRating || '',
                year: String(m.releaseInfo || m.year || prev.year || '').split('–')[0],
                runtime: m.runtime || prev.runtime || '',
                genres: m.genres || prev.genres || [],
                cast: Array.isArray(m.cast) ? m.cast.slice(0, 4) : (prev.cast || [])
              });
            }
          } catch (e) {}
        })
      );

      // Merge enriched data (localized PT title/desc + trailer ytId + rating + genres) across all rows
      rows.forEach((row) => {
        if (row.type === 'tv') return;
        row.items.forEach((item) => {
          const rich = richById.get(item.id);
          if (rich) {
            if (rich.ptName) item.name = rich.ptName;
            if (rich.ptDesc) item.description = rich.ptDesc;
            if (!item.ytId && rich.ytId) item.ytId = rich.ytId;
            if (!item.imdbRating && rich.imdbRating) item.imdbRating = rich.imdbRating;
            if (!item.year && rich.year) item.year = rich.year;
            if (!item.runtime && rich.runtime) item.runtime = rich.runtime;
            if ((!item.genres || !item.genres.length) && rich.genres?.length) item.genres = rich.genres;
            if ((!item.cast || !item.cast.length) && rich.cast?.length) item.cast = rich.cast;
          }
        });
      });

      // Build "Top 10 no Brasil Hoje" row from the top movies & series
      const top10Pool = [];
      const popMovies = rows.find((r) => r.id === 'fenix_movies_pop')?.items || [];
      const popBlockbusters = rows.find((r) => r.id === 'cinemeta_top_movies')?.items || [];
      const popSeries = rows.find((r) => r.id === 'fenix_series_pop')?.items || [];
      for (let i = 0; i < 15 && top10Pool.length < 10; i++) {
        for (const list of [popMovies, popBlockbusters, popSeries]) {
          if (list[i] && top10Pool.length < 10 && !top10Pool.some((x) => x.id === list[i].id)) {
            top10Pool.push({ ...list[i], rank: top10Pool.length + 1 });
          }
        }
      }

      if (top10Pool.length >= 5) {
        rows.unshift({
          id: 'top10_brasil',
          title: 'Top 10 no Brasil Hoje',
          type: 'movie',
          category: 'trending',
          isTop10: true,
          items: top10Pool
        });
      }

      // Variedade: remove lixo antigo/sem capa, evita repetir titulos entre prateleiras e alterna a ordem diariamente
      const daySeed = Math.floor(Date.now() / 86400000);
      const seededRand = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
      const strHash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
      const GENRE_ROWS = /^cinemeta_(?!top)/;
      const seenIds = new Set();
      const topRow = rows.find((r) => r.isTop10);
      if (topRow) topRow.items.forEach((i) => seenIds.add(i.id));
      const orderedRows = rows.filter((r) => r.type !== 'tv' && !r.isTop10);
      orderedRows.forEach((row) => {
        const rand = seededRand(daySeed ^ strHash(row.id));
        let items = row.items.filter((i) => {
          if (!i.id || !i.poster) return false;
          if (/^tt0{4,}/.test(i.id)) return false;
          const y = parseInt(i.year, 10);
          if (y && y < 1970 && row.id === 'fenix_movies_rec') return false;
          return true;
        });
        if (GENRE_ROWS.test(row.id)) {
          items = items.map((i) => ({ i, k: rand() })).sort((a, b) => a.k - b.k).map((x) => x.i);
        }
        row.items = items.filter((i) => {
          if (seenIds.has(i.id)) return false;
          seenIds.add(i.id);
          return true;
        });
      });
      // Intercala filmes e series nas prateleiras para a home nao ficar monotona
      const typeOrder = new Map();
      const interleaved = [];
      const movieRows = rows.filter((r) => r.type === 'movie' && !r.isTop10 && r.items.length >= 6);
      const seriesRows = rows.filter((r) => r.type === 'series' && r.items.length >= 6);
      const tvRows = rows.filter((r) => r.type === 'tv');
      const topFirst = rows.filter((r) => r.isTop10);
      const maxLen = Math.max(movieRows.length, seriesRows.length);
      for (let i = 0; i < maxLen; i++) {
        if (movieRows[i]) interleaved.push(movieRows[i]);
        if (seriesRows[i]) interleaved.push(seriesRows[i]);
      }
      rows.length = 0;
      rows.push(...topFirst, ...interleaved, ...tvRows);
      const validRows = rows.filter((r) => r.items.length > 0);
      const bodyStr = JSON.stringify({ rows: validRows, catalogs: validRows, addons: ADDONS, tvAddons: TV_ADDONS, movieAddons: MOVIE_ADDONS });
      if (validRows.length > 0) setEdgeCache('catalogs:v8', bodyStr, 300);
      return new Response(bodyStr, { status: 200, headers });
    }

    if (rawPath === '/api/search') {
      const query = (url.searchParams.get('q') || '').trim();
      const filterType = (url.searchParams.get('type') || '').trim();
      if (!query) return new Response(JSON.stringify({ results: [] }), { status: 200, headers });

      const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const qNorm = norm(query);
      const qWords = qNorm.split(' ').filter(Boolean);
      const enc = encodeURIComponent(query);

      const searchTasks = [];

      // 1. Multilingual IMDb Suggestion API (finds PT-BR, English, and Original titles in <90ms!)
      if (!filterType || filterType === 'movie' || filterType === 'series') {
        for (const langHeader of ['pt-BR,pt;q=0.9,en-US;q=0.8', 'en-US,en;q=0.9']) {
          searchTasks.push(
            fetchJson(`https://v3.sg.media-imdb.com/suggestion/x/${enc}.json`, 2400, { 'Accept-Language': langHeader })
              .then((data) => {
                return (data?.d || [])
                  .filter((item) => item.id && item.id.startsWith('tt') && (item.qid === 'movie' || item.qid === 'tvSeries' || item.qid === 'tvMiniSeries' || item.qid === 'feature'))
                  .map((item, idx) => {
                    const itemType = (item.qid === 'tvSeries' || item.qid === 'tvMiniSeries') ? 'series' : 'movie';
                    return {
                      id: item.id,
                      type: itemType,
                      name: item.l,
                      altName: query, // Store the user's localized query that matched this IMDb entity
                      imdbRankBoost: Math.max(0, 180 - idx * 25),
                      poster: item.i?.imageUrl || `https://images.metahub.space/poster/medium/${item.id}/img`,
                      background: `https://images.metahub.space/background/large/${item.id}/img`,
                      year: item.y ? String(item.y) : '',
                      imdbRating: '',
                      description: item.s ? `Elenco: ${item.s}` : ''
                    };
                  });
              })
              .catch(() => [])
          );
        }

        // 2. FenixFlix PT-BR & Cinemeta Catalogs Search
        const catUrls = [
          { type: 'movie', url: `https://fenixflix.fenixhub.online/catalog/movie/busca_fenix/search=${enc}.json`, ptBoost: 120 },
          { type: 'series', url: `https://fenixflix.fenixhub.online/catalog/series/busca_fenix/search=${enc}.json`, ptBoost: 120 },
          { type: 'movie', url: `https://fenixflix.fenixhub.online/catalog/movie/populares_fenix/search=${enc}.json`, ptBoost: 100 },
          { type: 'series', url: `https://fenixflix.fenixhub.online/catalog/series/populares_fenix/search=${enc}.json`, ptBoost: 100 },
          { type: 'movie', url: `https://v3-cinemeta.strem.io/catalog/movie/top/search=${enc}.json`, ptBoost: 80 },
          { type: 'series', url: `https://v3-cinemeta.strem.io/catalog/series/top/search=${enc}.json`, ptBoost: 80 }
        ];

        for (const s of catUrls) {
          if (filterType && filterType !== s.type) continue;
          searchTasks.push(
            fetchJson(s.url, 2800)
              .then((data) =>
                (data?.metas || []).map((m, idx) => ({
                  id: m.id || m.imdb_id,
                  type: m.type || s.type,
                  name: m.name,
                  imdbRankBoost: Math.max(0, (s.ptBoost || 60) - idx * 8),
                  poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
                  background: m.background || `https://images.metahub.space/background/medium/${m.id}/img`,
                  year: m.releaseInfo || m.year || '',
                  imdbRating: m.imdbRating || '',
                  description: m.description || ''
                }))
              )
              .catch(() => [])
          );
        }
      }

      // 3. Live TV Channels Search (Fenix TV catalogs)
      if (!filterType || filterType === 'tv') {
        const tvSources = [
          'https://fenixtv.fenixhub.online/catalog/tv/tv_eventos.json',
          'https://fenixtv.fenixhub.online/catalog/tv/tv_exploud.json',
          'https://fenixtv.fenixhub.online/catalog/tv/tv_reidoscanais.json',
          'https://fenixtv.fenixhub.online/catalog/tv/tv_nettv.json'
        ];
        for (const tvUrl of tvSources) {
          searchTasks.push(
            fetchJson(tvUrl, 2800)
              .then((data) =>
                (data?.metas || [])
                  .filter((m) => {
                    const n = norm(m.name);
                    return n.includes(qNorm) || qWords.every((w) => n.includes(w));
                  })
                  .slice(0, 30)
                  .map((m) => ({
                    id: m.id,
                    type: 'tv',
                    name: m.name,
                    poster: m.poster || m.logo || '',
                    background: m.background || m.poster || m.logo || '',
                    year: 'AO VIVO',
                    imdbRating: '',
                    description: m.description || 'Canal de TV Ao Vivo'
                  }))
              )
              .catch(() => [])
          );
        }
      }

      const groups = await Promise.all(searchTasks);
      const byKey = new Map();

      for (const group of groups) {
        for (const item of group) {
          if (!item.id || !item.name) continue;
          if (filterType && (filterType === 'movie' || filterType === 'series' || filterType === 'tv') && item.type !== filterType) continue;
          const k = `${item.type}:${item.id}`;
          const existing = byKey.get(k);
          if (!existing) {
            byKey.set(k, item);
          } else {
            // Merge Portuguese/localized title or richer metadata if available
            const itemNorm = norm(item.name);
            const existNorm = norm(existing.name);
            const itemMatchesBetter = itemNorm.includes(qNorm) && !existNorm.includes(qNorm);
            if (itemMatchesBetter) {
              existing.altName = existing.name;
              existing.name = item.name;
            } else if (!existing.altName && item.name !== existing.name) {
              existing.altName = item.name;
            }
            if (!existing.imdbRating && item.imdbRating) existing.imdbRating = item.imdbRating;
            if (!existing.description && item.description) existing.description = item.description;
            existing.imdbRankBoost = Math.max(existing.imdbRankBoost || 0, item.imdbRankBoost || 0);
          }
        }
      }

      const scoreItem = (item) => {
        const n1 = norm(item.name);
        const n2 = norm(item.altName || '');
        let best = 0;
        for (const candidate of [n1, n2].filter(Boolean)) {
          let sc = 0;
          if (candidate === qNorm) sc = 1000;
          else if (candidate.startsWith(qNorm + ' ') || candidate.startsWith(qNorm)) sc = 820 - Math.min(120, candidate.length - qNorm.length);
          else if (candidate.split(' ').some((w) => w === qNorm)) sc = 700;
          else if (qWords.length > 0 && qWords.every((w) => candidate.includes(w))) sc = 580 - Math.min(80, Math.abs(candidate.length - qNorm.length));
          else if (candidate.includes(qNorm)) sc = 450;
          else {
            const matchedWords = qWords.filter((w) => candidate.includes(w)).length;
            sc = matchedWords * 140;
          }
          if (sc > best) best = sc;
        }
        return best + (item.imdbRankBoost || 0) + (parseFloat(item.imdbRating) ? parseFloat(item.imdbRating) * 5 : 0);
      };

      const sorted = Array.from(byKey.values()).sort((a, b) => scoreItem(b) - scoreItem(a));
      return new Response(JSON.stringify({ query, results: sorted.slice(0, 48) }), { status: 200, headers });
    }

    const metaMatch = rawPath.match(/^\/api\/meta\/(movie|series|tv)\/([^/]+)$/);
    if (metaMatch) {
      const [, type, id] = metaMatch;
      const decodedId = decodeURIComponent(id);
      if (type === 'tv') {
        return new Response(JSON.stringify({ meta: { id: decodedId, type: 'tv', name: decodedId } }), { status: 200, headers });
      }
      const cacheKey = `meta:${type}:${decodedId}`;
      const cachedMeta = getEdgeCache(cacheKey);
      if (cachedMeta) return new Response(cachedMeta, { status: 200, headers });

      try {
        const data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(decodedId)}.json`, 3200);
        const bodyStr = JSON.stringify({ meta: data.meta || null });
        if (data.meta) setEdgeCache(cacheKey, bodyStr, 1800);
        return new Response(bodyStr, { status: 200, headers });
      } catch (e) {
        return new Response(JSON.stringify({ meta: { id: decodedId, type, name: decodedId } }), { status: 200, headers });
      }
    }

    const streamMatch = rawPath.match(/^\/api\/streams\/(movie|series|tv)\/(.+)$/);
    if (streamMatch) {
      const [, type, rawId] = streamMatch;
      const decodedId = decodeURIComponent(rawId);
      const encodedId = encodeURIComponent(decodedId);

      const streamCacheKey = `streams:v5:${type}:${decodedId}`;
      const cachedStreams = getEdgeCache(streamCacheKey);
      if (cachedStreams) return new Response(cachedStreams, { status: 200, headers });

      // === LIVE TV CHANNELS STREAM AGGREGATION (ONLY TV ADDONS) ===
      if (type === 'tv') {
        let rawTvStreams = [];
        try {
          const d = await fetchJson(`https://fenixtv.fenixhub.online/stream/tv/${encodedId}.json`, 3500);
          if (Array.isArray(d?.streams)) rawTvStreams = d.streams;
        } catch (e) {}

        // If this specific channel ID returned 0 streams, search sister FenixTV catalogs by channel slug/name
        if (rawTvStreams.length === 0) {
          const rawSlug = decodedId.split(':').pop().replace(/[^a-z0-9]/gi, '').toLowerCase();
          if (rawSlug && rawSlug.length >= 3) {
            const backupCatalogs = [
              'https://fenixtv.fenixhub.online/catalog/tv/tv_reidoscanais.json',
              'https://fenixtv.fenixhub.online/catalog/tv/tv_exploud.json',
              'https://fenixtv.fenixhub.online/catalog/tv/tv_nettv.json'
            ];
            for (const catUrl of backupCatalogs) {
              try {
                const catData = await fetchJson(catUrl, 2500);
                const matchMeta = (catData?.metas || []).find((m) => {
                  const mSlug = String(m.name || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
                  return mSlug === rawSlug || (mSlug.length >= 4 && rawSlug.includes(mSlug));
                });
                if (matchMeta) {
                  const stData = await fetchJson(`https://fenixtv.fenixhub.online/stream/tv/${encodeURIComponent(matchMeta.id)}.json`, 2800);
                  if (Array.isArray(stData?.streams) && stData.streams.length > 0) {
                    rawTvStreams.push(...stData.streams);
                    break;
                  }
                }
              } catch (e) {}
            }
          }
        }

        // Filter out [OFFLINE] streams if online streams exist
        const onlineOnly = rawTvStreams.filter((s) => !/\[OFFLINE\]/i.test(`${s.name || ''} ${s.title || ''}`));
        const activeTvRaw = onlineOnly.length > 0 ? onlineOnly : rawTvStreams;

        // Upgrade and sanitize live streams:
        // Exclude broken direct.m3u8 (which point to non-proxied relative /hls/*.ts segments returning 404)
        const cleanTvRaw = activeTvRaw
          .filter((s) => s.url && !s.url.includes('fenixtv.fenixhub.online/direct.m3u8'))
          .map((s) => {
            let u = s.url || '';
            if (u.startsWith('http://')) {
              u = `https://fenixtv.fenixhub.online/proxy?url=${encodeURIComponent(u)}`;
            }
            // Prefer FenixTV proxy streams which include Dadinho / Exploud CORS headers
            const isProxy = u.includes('fenixtv.fenixhub.online/proxy');
            return {
              ...s,
              url: u,
              isProxyPreferred: isProxy
            };
          });

        cleanTvRaw.sort((a, b) => (a.isProxyPreferred === b.isProxyPreferred ? 0 : a.isProxyPreferred ? -1 : 1));

        const tvAddonResults = TV_ADDONS.map((addon, aIdx) => {
          const subset = aIdx === 0 ? cleanTvRaw : cleanTvRaw.slice(0, 6);
          const streams = subset.map((s, idx) => {
            const cleanTitle = (s.title || addon.name).replace(/🔴\s*\[OFFLINE\]\s*/gi, '').replace(/\?\?\s*\[OFFLINE\]\s*/gi, '');
            const isFhd = /1080p|fhd|full\s*hd|4k/i.test(cleanTitle);
            const quality = isFhd ? '1080p Full HD' : 'HD Ao Vivo';
            return {
              addonId: addon.id,
              addonName: addon.name,
              addonLogo: addon.logo,
              addonBadge: addon.badge,
              addonColor: addon.color,
              serverLabel: `${addon.name} • Ao Vivo #${idx + 1}`,
              rawName: addon.name,
              rawTitle: cleanTitle.replace(/\n/g, ' • '),
              quality,
              is4k: false,
              isDub: true,
              audio: 'Ao Vivo PT-BR',
              seeds: null,
              playType: 'hls',
              directUrl: s.url,
              proxyUrl: s.url
            };
          }).filter((s) => s.proxyUrl);

          return {
            addonId: addon.id,
            addonName: addon.name,
            badge: addon.badge,
            color: addon.color,
            count: streams.length,
            streams
          };
        });

        const allTvStreams = tvAddonResults.flatMap((r) => r.streams);
        const tvBody = JSON.stringify({
          id: decodedId,
          type: 'tv',
          totalStreams: allTvStreams.length,
          servers: tvAddonResults,
          streams: allTvStreams
        });
        if (allTvStreams.length > 0) setEdgeCache(streamCacheKey, tvBody, 120);
        return new Response(tvBody, { status: 200, headers });
      }

      // === MOVIE & SERIES STREAM AGGREGATION ===
      const idParts = decodedId.split(':');
      const baseImdb = idParts[0];
      const epSeason = idParts[1] || '1';
      const epNumber = idParts[2] || '1';

      // Resolve TMDB ID from Cinemeta in parallel so FrameXTV & Flix-Streams can query by TMDB ID
      const tmdbPromise = (async () => {
        try {
          const metaData = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(baseImdb)}.json`, 2200);
          return metaData?.meta?.moviedb_id || null;
        } catch (e) {
          return null;
        }
      })();

      const rawAddonResponses = await Promise.all(
        MOVIE_ADDONS.map(async (addon) => {
          if (addon.id === 'superflix') {
            const tmdbId = await tmdbPromise;
            if (!tmdbId) return { addon, rawStreams: [] };
            const isSeries = type === 'series';
            const sEmbed = isSeries
              ? 'https://superflixapi.fun/serie/' + tmdbId + '/' + epSeason + '/' + epNumber + '#noBackground#noEpList#noLink'
              : 'https://superflixapi.fun/filme/' + tmdbId + '#noBackground#noLink';
            const vidsrcPt = isSeries
              ? 'https://vidsrc.sh/embed/tv?tmdb=' + tmdbId + '&season=' + epSeason + '&episode=' + epNumber + '&ds_lang=pt'
              : 'https://vidsrc.sh/embed/movie?tmdb=' + tmdbId + '&ds_lang=pt';
            const raw = [
              {
                name: 'SuperFlix • Dublado BR',
                title: '🇧🇷 Servidor Dublado Cloud (SuperFlix)\n🇧🇷 Áudio Dublado PT-BR',
                embedUrl: sEmbed
              },
              {
                name: 'VidSrc BR • Dublado/Dual',
                title: '🇧🇷 Servidor Brasil Multiserver (VidSrc)\n🇧🇷 Áudio Dublado / PT-BR',
                embedUrl: vidsrcPt
              }
            ];
            return { addon, rawStreams: raw };
          }
          if (addon.id === 'framextv') {
            const tmdbId = await tmdbPromise;
            const fxStreams = await fetchFrameXTVStreams(type, tmdbId, epSeason, epNumber);
            return { addon, rawStreams: fxStreams };
          }

          const primaryPromise = fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 4500)
            .then((d) => (Array.isArray(d?.streams) && d.streams.length > 0 ? d.streams : Promise.reject(new Error('empty'))));

          const tasks = [primaryPromise];
          if (addon.fallbackUrl) {
            tasks.push(
              fetchJson(`${addon.fallbackUrl}/stream/${type}/${encodedId}.json`, 4500)
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

      // Collect verified multi-GB direct HTTP MP4 streams (Zeus, Malfoy, Carbon, Azure, Titan VII)
      const directPool = [];
      const englishPool = [];
      for (const { addon, rawStreams } of rawAddonResponses) {
        for (const s of rawStreams) {
          if (s.url && !isBadSubServer(s) && !s.url.includes('.m3u8')) {
            let cleanUrl = s.url;
            if (cleanUrl.startsWith('http://fenixflix.fenixhub.online/')) {
              cleanUrl = cleanUrl.replace('http://', 'https://');
            }
            const t = `${s.name || ''} ${s.title || ''}`;
            const isZeusOrCarbon = /zeus|carbon|azure|titan/i.test(t);
            const isDub = addon.isEnglishOnly ? false : /dublado|🇧🇷|portugu[eê]s|dual/i.test(t);
            const entry = {
              directUrl: cleanUrl,
              is4k: /2160p|4k|uhd/i.test(t),
              isDub,
              isPreferredH264: isZeusOrCarbon && !/2160p|4k|uhd/i.test(t),
              title: s.title || addon.name,
              name: s.name || addon.name
            };
            directPool.push(entry);
            if (addon.isEnglishOnly || !isDub) {
              englishPool.push(entry);
            }
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

      const universalEmbedUrl = type === 'series'
        ? `https://vidsrc.cc/v2/embed/tv/${baseImdb}/${epSeason}/${epNumber}`
        : `https://vidsrc.cc/v2/embed/movie/${baseImdb}`;

      const sortStreamsUniversal = (a, b) => {
        const rank = (p) => (p === 'direct' ? 0 : p === 'hls' ? 1 : p === 'embed' ? 2 : 3);
        if (rank(a.playType) !== rank(b.playType)) return rank(a.playType) - rank(b.playType);
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? 1 : -1;
        return (b.seeds || 0) - (a.seeds || 0);
      };

      const addonResults = rawAddonResponses.map(({ addon, rawStreams }) => {
        let filteredRaw = rawStreams.filter((s) => !isBadSubServer(s));
        const poolToUse = addon.isEnglishOnly && englishPool.length > 0 ? englishPool : directPool;

        const streams = filteredRaw
          .map((s, idx) => normalizeStream(s, addon, directPool, idx, englishPool))
          .filter((s) => s.proxyUrl);

        streams.sort(sortStreamsUniversal);

        return {
          addonId: addon.id,
          addonName: addon.name,
          badge: addon.badge,
          color: addon.color,
          isEnglishOnly: Boolean(addon.isEnglishOnly),
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
