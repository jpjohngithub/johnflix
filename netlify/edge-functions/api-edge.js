const MOVIE_ADDONS = [
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
    id: 'flixstreams',
    name: 'Flix-Streams (Inglês)',
    badge: 'INGLÊS',
    type: 'direct',
    category: 'movie_series',
    isEnglishOnly: true,
    manifestUrl: 'https://flixnest.app/flix-streams/manifest.json',
    baseUrl: 'https://flixnest.app/flix-streams/e30=',
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

const ADDONS = MOVIE_ADDONS;


function strHash(str) {
  let h = 2166136261;
  for (let i = 0; i < (str || '').length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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
            isHls: Boolean(src.isHls || (src.url && (/\.m3u8|hybrows\.workers\.dev/i.test(src.url) || prov === 'bowler' || prov === 'giant'))),
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

  return out;
}

const ALLOWED_PROXY_HEADER_RE = /^(referer|origin|user-agent|accept|cookie|authorization|x-mb-token|x-requested-with)$/i;

function extractProxyHeaders(rawStream) {
  const sources = [rawStream?.headers, rawStream?.behaviorHints?.proxyHeaders?.request];
  const out = {};
  for (const src of sources) {
    if (!src || typeof src !== 'object') continue;
    for (const [k, v] of Object.entries(src)) {
      if (typeof v !== 'string') continue;
      const cleanKey = k.trim();
      if (!ALLOWED_PROXY_HEADER_RE.test(cleanKey)) continue;
      const cleanVal = v.replace(/[\r\n]+/g, ' ').trim();
      if (cleanVal && cleanVal.length <= 2048) out[cleanKey] = cleanVal;
    }
  }
  return Object.keys(out).length ? out : null;
}

function encodeProxyHeaders(hdrObj) {
  if (!hdrObj || !Object.keys(hdrObj).length) return '';
  try {
    return btoa(JSON.stringify(hdrObj));
  } catch (e) {
    return '';
  }
}

function decodeProxyHeaders(hdrParam) {
  if (!hdrParam) return {};
  try {
    const parsed = JSON.parse(atob(hdrParam));
    if (!parsed || typeof parsed !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string' && ALLOWED_PROXY_HEADER_RE.test(k.trim())) {
        const cleanVal = v.replace(/[\r\n]+/g, ' ').trim();
        if (cleanVal && cleanVal.length <= 2048) out[k.trim()] = cleanVal;
      }
    }
    return out;
  } catch (e) {
    return {};
  }
}

function isBadSubServer(rawStream) {
  const u = rawStream.url || '';
  const t = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const hasSource = Boolean(rawStream.url || rawStream.infoHash);
  if (!hasSource || /cloudflare-terms-of-service-abuse/i.test(u)) return true;
  if (/requer autentica[cç][aã]o|login necess[aá]rio|try the paid tier|go premium/i.test(t) && !rawStream.url) return true;
  const isPromo = /\[official trailer\]|play trailer|open in stremio|install stremio/i.test(t);
  return isPromo && !rawStream.url && !rawStream.infoHash;
}

function normalizeStream(rawStream, addon) {
  const titleText = `${rawStream.name || ''} ${rawStream.title || ''} ${rawStream.description || ''}`;
  const is4k = /2160p|4k|uhd/i.test(titleText);
  const is1080p = /1080p|full\s*hd|fhd/i.test(titleText);
  const is720p = /720p|hd/i.test(titleText);
  const quality = is4k ? '4K UHD' : is1080p ? '1080p Full HD' : is720p ? '720p HD' : '1080p Full HD';
  const isHevcOrMkv = /hevc|x265|h\.?265|\.mkv\b|10bit|hdr/i.test(titleText) || (rawStream.url && /\.mkv(\?|$)/i.test(rawStream.url));

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
  let sourceKind = 'direct';
  let sourceUrl = null;
  const proxyHeaders = extractProxyHeaders(rawStream);
  const hdrEncoded = encodeProxyHeaders(proxyHeaders);
  const hdrSuffix = hdrEncoded ? `&hdr=${encodeURIComponent(hdrEncoded)}` : '';
  let requiresProxy = Boolean(proxyHeaders);

  if (streamUrl) {
    if (streamUrl.startsWith('http://fenixflix.fenixhub.online/')) {
      streamUrl = streamUrl.replace('http://', 'https://');
    }
    const isDash = /\.mpd(?:$|[?#])/i.test(streamUrl);
    const isMkv = /\.mkv(?:$|[?#])/i.test(streamUrl);
    const isHls = Boolean(rawStream.isHls)
      || /\.m3u8(?:$|[?#])/i.test(streamUrl)
      || /[?&](?:format|type)=hls\b/i.test(streamUrl)
      || /\/hls(?:\/|\?|$)/i.test(streamUrl)
      || /hybrows\.workers\.dev/i.test(streamUrl)
      || streamUrl.includes('hls-proxy')
      || streamUrl.includes('zunderflix.lat')
      || streamUrl.includes('fenixtv.fenixhub.online/proxy')
      || streamUrl.includes('fenixtv.fenixhub.online/direct.m3u8');
    if (isDash) return null;
    if (/^http:\/\//i.test(streamUrl) || /fenixflix\.fenixhub\.online|zunderflix\.lat|hd\.plavio\.site|free\.flixnest\.app|hakunaymatata\.com|mzfi\.me|animesfhd\.net|pixel-sus-4k-image\.com|stravo\.site/i.test(streamUrl)) {
      requiresProxy = true;
    }
    if (isHls) {
      playType = 'hls';
      sourceKind = 'hls';
      proxyUrl = `/api/hls-proxy?url=${encodeURIComponent(streamUrl)}${hdrSuffix}`;
    } else {
      playType = 'direct';
      sourceKind = isMkv ? 'mkv' : 'direct';
      proxyUrl = `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}${hdrSuffix}`;
    }
  } else if (rawStream.infoHash) {
    const hash = String(rawStream.infoHash).toLowerCase();
    playType = 'torrent';
    sourceKind = 'torrent';
    const trackers = (rawStream.sources || [])
      .filter((s) => typeof s === 'string' && s.startsWith('tracker:'))
      .map((s) => s.replace(/^tracker:/, ''));
    const trQuery = trackers.slice(0, 5).map((t) => `tr=${encodeURIComponent(t)}`).join('&');
    sourceUrl = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(rawStream.title || addon.name)}${trQuery ? `&${trQuery}` : ''}`;
    proxyUrl = null;
  } else {
    return null;
  }

  let serverLabel = (rawStream.name || addon.name).replace(/\n/g, ' ');
  serverLabel = serverLabel.replace(/\bstremio\b/gi, '').replace(/\baddon\b/gi, '').replace(/\s+/g, ' ').trim();
  const subText = `${rawStream.title || ''}\n${rawStream.description || ''}`;
  const subServerMatch = subText.match(/(?:⚡|🦡|📍|🐉|🌊|⚙️|⚙|🌪️|🔋|⭐️|❄️|🔥|💎)\s*(?:Servidor:\s*)?([^\n\r]+)/i);
  if (subServerMatch) {
    let cleanSub = subServerMatch[1].replace(/\bstremio\b/gi, '').replace(/https?:\/\/[^\s]+/gi, '').trim();
    serverLabel = `${addon.name} • ${cleanSub}`;
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
    rawTitle: (rawStream.title || '').replace(/\bstremio\b/gi, '').replace(/\n/g, ' • ').trim(),
    quality,
    is4k,
    isHevcOrMkv: Boolean(isHevcOrMkv),
    isDub,
    audio,
    seeds,
    playType,
    sourceKind,
    sourceUrl,
    directUrl: streamUrl,
    proxyUrl,
    requiresProxy,
    proxyHeaders,
    infoHash: rawStream.infoHash ? rawStream.infoHash.toLowerCase() : null,
    fileIdx: rawStream.fileIdx !== undefined ? rawStream.fileIdx : null
  };
}

const edgeCache = new Map();
const COMMUNITY_SUGGESTIONS = [
  {
    id: 'sug_init_1',
    author: 'Equipe JohnFlix',
    text: 'Seja bem-vindo ao Mural de Sugestões! Digite qualquer filme, série, canal ou melhoria que gostaria de ver no site.',
    category: 'geral',
    createdAt: Date.now() - 3600000,
    likes: 12
  }
];
const NTFY_TOPIC = 'https://ntfy.sh/johnflix_sugestoes_publicas_2026';

const TV_PAIR_SESSIONS = new Map();

function getEdgeCache(key) {
  const entry = edgeCache.get(key);
  if (entry && entry.exp > Date.now()) return entry.val;
  return null;
}
function setEdgeCache(key, val, ttlSec = 300) {
  edgeCache.set(key, { val, exp: Date.now() + ttlSec * 1000 });
}

// ===== IPTV Brasil (iptv-org) fallback + HLS proxy com CORS =====
const IPTV_URL = 'https://iptv-org.github.io/iptv/countries/br.m3u';
const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1|\[?f[cd])/i;

function hlsProxied(u, hdrParam = '') {
  return `/api/hls-proxy?url=${encodeURIComponent(u)}${hdrParam ? `&hdr=${encodeURIComponent(hdrParam)}` : ''}`;
}

async function hlsProxyHandler(request, url) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Length, Content-Range' };
  const target = url.searchParams.get('url') || '';
  const hdrParam = url.searchParams.get('hdr') || '';
  let t;
  try { t = new URL(target); } catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
  if (!/^https?:$/.test(t.protocol) || PRIVATE_HOST.test(t.hostname)) return new Response('forbidden', { status: 403, headers: cors });

  const fh = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36', Accept: '*/*' };
  if (/hakunaymatata\.com|mzfi\.me/i.test(t.hostname)) {
    fh.Referer = 'https://mzfi.me/';
  }
  if (/tiktokcdn\.live|dadinhodetapioca/i.test(t.hostname)) {
    fh.Referer = 'https://dadinhodetapioca.fun/play/discoverychannel.html';
  }
  if (/zunderflix\.lat|fenixflix/i.test(t.hostname)) {
    fh.Referer = 'https://zunderflix.lat/';
  }
  Object.assign(fh, decodeProxyHeaders(hdrParam));
  const range = request.headers.get('range');
  if (range) fh.Range = range;
  let up;
  try { up = await fetch(target, { headers: fh, redirect: 'follow' }); } catch (e) { return new Response('upstream error', { status: 502, headers: cors }); }
  if (/text\/html/i.test(up.headers.get('content-type') || '')) {
    try { await up.body?.cancel(); } catch {}
    return new Response('Esta fonte respondeu com uma página de bloqueio, não com uma playlist de vídeo.', {
      status: 451,
      headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8', 'X-JohnFlix-Source-Error': 'upstream-policy' }
    });
  }
  if (!up.ok && up.status !== 206) return new Response('upstream ' + up.status, { status: 502, headers: cors });

  const ct = up.headers.get('content-type') || '';
  const isM3u8 = /mpegurl/i.test(ct) || /\.m3u8(\?|$)/i.test(t.pathname + t.search) || t.pathname.includes('hls-proxy');
  if (isM3u8) {
    const text = await up.text();
    if (!text.startsWith('#EXTM3U')) return new Response(text, { status: 200, headers: { ...cors, 'Content-Type': ct || 'text/plain' } });
    const base = up.url || target;
    const abs = (u) => { try { return new URL(u, base).href; } catch (e) { return null; } };
    const out = await Promise.all(text.split(/\r?\n/).map(async (line) => {
      if (!line.trim()) return line;
      if (line.startsWith('#')) {
        const m = [...line.matchAll(/URI="([^"]+)"/g)];
        let res = line;
        for (const x of m) {
          const a = abs(x[1]);
          if (a) res = res.replace(x[0], `URI="${hlsProxied(a, hdrParam)}"`);
        }
        return res;
      }
      const a = abs(line.trim());
      return a ? hlsProxied(a, hdrParam) : line;
    }));
    return new Response(out.join('\n'), { status: 200, headers: { ...cors, 'Content-Type': 'application/vnd.apple.mpegurl', 'Cache-Control': 'no-store' } });
  }
  const normalizedCt = /^image\//i.test(ct) ? 'video/mp2t' : (ct || 'video/mp2t');
  const h = { ...cors, 'Content-Type': normalizedCt, 'Cache-Control': 'public, max-age=20' };
  ['content-length', 'content-range', 'accept-ranges'].forEach((k) => { const v = up.headers.get(k); if (v) h[k] = v; });
  return new Response(up.body, { status: up.status, headers: h });
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
    if (rawPath === '/api/tv-sync') {
      const syncHeaders = { ...headers, 'Cache-Control': 'no-cache, no-store, must-revalidate' };
      const code = (url.searchParams.get('code') || '').replace(/[^0-9]/g, '').slice(0, 6);
      const role = url.searchParams.get('role') || 'client';

      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const targetCode = String(body.code || '').replace(/[^0-9]/g, '').slice(0, 6);
          if (!targetCode || targetCode.length < 4) {
            return new Response(JSON.stringify({ ok: false, error: 'Código inválido' }), { status: 400, headers: syncHeaders });
          }
          let session = TV_PAIR_SESSIONS.get(targetCode);
          if (!session) {
            session = { code: targetCode, created: Date.now(), lastPoll: Date.now(), queue: [] };
            TV_PAIR_SESSIONS.set(targetCode, session);
          }
          session.queue.push({
            action: body.action || 'play',
            item: body.item || null,
            stream: body.stream || null,
            time: body.time || 0,
            timestamp: Date.now()
          });
          if (session.queue.length > 10) session.queue.shift();
          return new Response(JSON.stringify({ ok: true, paired: true }), { status: 200, headers: syncHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 400, headers: syncHeaders });
        }
      }

      if (!code) {
        return new Response(JSON.stringify({ ok: false, error: 'Código obrigatório' }), { status: 400, headers: syncHeaders });
      }
      let session = TV_PAIR_SESSIONS.get(code);
      if (!session) {
        if (role === 'tv') {
          session = { code, created: Date.now(), lastPoll: Date.now(), queue: [] };
          TV_PAIR_SESSIONS.set(code, session);
        } else {
          return new Response(JSON.stringify({ ok: false, paired: false, message: 'TV não conectada' }), { status: 200, headers: syncHeaders });
        }
      }
      session.lastPoll = Date.now();
      const commands = [...session.queue];
      session.queue = [];
      return new Response(JSON.stringify({ ok: true, paired: true, commands }), { status: 200, headers: syncHeaders });
    }

    // === SAAS AUTHENTICATION & SESSION ENGINE ===
    if (rawPath.startsWith('/api/auth/')) {
      const authHeaders = { ...headers, 'Cache-Control': 'no-cache, no-store, must-revalidate' };
      const action = rawPath.replace('/api/auth/', '');

      if (action === 'login' && request.method === 'POST') {
        try {
          const body = await request.json();
          const email = String(body.email || '').toLowerCase().trim();
          const pass = String(body.password || '').trim();
          if (!email || !pass || pass.length < 4) {
            return new Response(JSON.stringify({ error: 'E-mail e senha válida obrigatórios.' }), { status: 400, headers: authHeaders });
          }
          const baseName = email.split('@')[0];
          const name = baseName.charAt(0).toUpperCase() + baseName.slice(1);
          const user = {
            id: `usr_${Math.random().toString(36).slice(2, 10)}`,
            name,
            email,
            plan: 'PRO VIP (SaaS)',
            role: 'subscriber',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            createdAt: new Date().toISOString()
          };
          return new Response(JSON.stringify({ ok: true, user, token: `tk_${Date.now()}` }), { status: 200, headers: authHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Erro ao processar login.' }), { status: 400, headers: authHeaders });
        }
      }

      if (action === 'register' && request.method === 'POST') {
        try {
          const body = await request.json();
          const email = String(body.email || '').toLowerCase().trim();
          const pass = String(body.password || '').trim();
          const customName = String(body.name || '').trim();
          if (!email || !pass || pass.length < 4) {
            return new Response(JSON.stringify({ error: 'E-mail e senha de no mínimo 4 dígitos são obrigatórios.' }), { status: 400, headers: authHeaders });
          }
          const baseName = customName || email.split('@')[0];
          const name = baseName.charAt(0).toUpperCase() + baseName.slice(1);
          const user = {
            id: `usr_${Math.random().toString(36).slice(2, 10)}`,
            name,
            email,
            plan: 'PRO VIP (SaaS)',
            role: 'subscriber',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            createdAt: new Date().toISOString()
          };
          return new Response(JSON.stringify({ ok: true, user, token: `tk_${Date.now()}` }), { status: 201, headers: authHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Erro ao criar conta.' }), { status: 400, headers: authHeaders });
        }
      }

      if (action === 'google' && request.method === 'POST') {
        try {
          const body = await request.json();
          const email = String(body.email || 'usuario.google@gmail.com').toLowerCase().trim();
          const name = String(body.name || 'Usuário Google').trim();
          const user = {
            id: `usr_g_${Math.random().toString(36).slice(2, 10)}`,
            name,
            email,
            plan: 'PRO VIP (SaaS)',
            role: 'subscriber',
            provider: 'google',
            avatar: body.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
            createdAt: new Date().toISOString()
          };
          return new Response(JSON.stringify({ ok: true, user, token: `tk_g_${Date.now()}` }), { status: 200, headers: authHeaders });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Erro no login com Google.' }), { status: 400, headers: authHeaders });
        }
      }

      if (action === 'guest') {
        const user = {
          id: `gst_${Math.random().toString(36).slice(2, 10)}`,
          name: 'Convidado VIP',
          email: 'convidado@johnflix.online',
          plan: 'Acesso Livre (Convidado)',
          role: 'guest',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
          createdAt: new Date().toISOString()
        };
        return new Response(JSON.stringify({ ok: true, user, isGuest: true }), { status: 200, headers: authHeaders });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: authHeaders });
    }

    if (rawPath === '/api/suggestions') {
      const sugHeaders = {
        ...headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      };

      if (request.method === 'POST') {
        try {
          const body = await request.json();
          const cleanText = String(body.text || '').trim().replace(/[<>]/g, '');
          if (!cleanText || cleanText.length < 2) {
            return new Response(JSON.stringify({ error: 'Texto muito curto' }), { status: 400, headers: sugHeaders });
          }
          const cleanAuthor = String(body.author || 'Anônimo').trim().replace(/[<>]/g, '').slice(0, 30) || 'Anônimo';
          const cleanCategory = String(body.category || 'geral').trim().toLowerCase().slice(0, 20);

          const newItem = {
            id: 'sug_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            author: cleanAuthor,
            text: cleanText.slice(0, 300),
            category: cleanCategory,
            createdAt: Date.now(),
            likes: 0
          };

          COMMUNITY_SUGGESTIONS.unshift(newItem);
          if (COMMUNITY_SUGGESTIONS.length > 100) COMMUNITY_SUGGESTIONS.pop();

          fetch(NTFY_TOPIC, {
            method: 'POST',
            headers: { 'Title': 'Sugestão JohnFlix' },
            body: JSON.stringify(newItem)
          }).catch(() => {});

          return new Response(JSON.stringify({ success: true, item: newItem, suggestions: COMMUNITY_SUGGESTIONS }), {
            status: 201,
            headers: sugHeaders
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Erro ao processar sugestão' }), { status: 400, headers: sugHeaders });
        }
      }

      let fetchedRemote = [];
      try {
        const ctrl = new AbortController();
        const tm = setTimeout(() => ctrl.abort(), 2000);
        const res = await fetch(`${NTFY_TOPIC}/json?poll=1`, { signal: ctrl.signal });
        clearTimeout(tm);
        if (res.ok) {
          const rawText = await res.text();
          const lines = rawText.trim().split(/\r?\n/);
          for (const line of lines) {
            try {
              const msgObj = JSON.parse(line);
              if (msgObj.message) {
                const parsed = JSON.parse(msgObj.message);
                if (parsed && parsed.id && parsed.text) {
                  fetchedRemote.push(parsed);
                }
              }
            } catch (_) {}
          }
        }
      } catch (_) {}

      const map = new Map();
      COMMUNITY_SUGGESTIONS.forEach((s) => map.set(s.id, s));
      fetchedRemote.forEach((s) => {
        if (!map.has(s.id)) {
          map.set(s.id, s);
          COMMUNITY_SUGGESTIONS.push(s);
        }
      });

      const all = Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 100);
      return new Response(JSON.stringify({ suggestions: all }), { status: 200, headers: sugHeaders });
    }

    if (rawPath === '/api/suggestions/like' && request.method === 'POST') {
      const sugHeaders = { ...headers, 'Cache-Control': 'no-cache, no-store, must-revalidate' };
      try {
        const body = await request.json();
        const targetId = body.id;
        const target = COMMUNITY_SUGGESTIONS.find((s) => s.id === targetId);
        if (target) {
          target.likes = (target.likes || 0) + 1;
          return new Response(JSON.stringify({ success: true, id: targetId, likes: target.likes }), { status: 200, headers: sugHeaders });
        }
        return new Response(JSON.stringify({ success: true, id: targetId, likes: 1 }), { status: 200, headers: sugHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Erro ao votar' }), { status: 400, headers: sugHeaders });
      }
    }

    if (rawPath === '/api/addons') {
      if (url.searchParams.get('ping') === '1') {
        const statuses = await Promise.all(
          ADDONS.map(async (a) => {
            const t0 = Date.now();
            try {
              const m = await fetchJson(a.manifestUrl, 2200);
              return { ...a, online: true, version: m.version, description: m.description, pingMs: Date.now() - t0 };
            } catch (e) {
              return { ...a, online: false, pingMs: Date.now() - t0 };
            }
          })
        );
        return new Response(JSON.stringify({ addons: statuses }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ addons: ADDONS }), { status: 200, headers });
    }

    if (rawPath === '/api/hls-proxy') return hlsProxyHandler(request, url);

    if (rawPath === '/api/catalogs') {
      const cachedCat = getEdgeCache('catalogs:v16');
      if (cachedCat) return new Response(cachedCat, { status: 200, headers });

      const sources = [
        { id: 'orangebyte_movies', title: 'Filmes Mais Assistidos do Dia', type: 'movie', category: 'trending', url: 'https://trending.orangebyte.io/catalog/movie/daily-trending-movies.json', limit: 40 },
        { id: 'orangebyte_series', title: 'Séries Mais Assistidas do Dia', type: 'series', category: 'trending', url: 'https://trending.orangebyte.io/catalog/series/daily-trending-series.json', limit: 40 },
        { id: 'fenix_movies_pop', title: 'Em Alta Hoje', type: 'movie', category: 'trending', url: 'https://fenixflix.fenixhub.online/catalog/movie/populares_fenix.json', limit: 36 },
        { id: 'magnet_movies_pop', title: 'Destaques Magnetflix Dublado', type: 'movie', category: 'trending', url: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series/catalog/movie/populares_magnetbr.json', limit: 36 },
        { id: 'cinemeta_top_movies', title: 'Sucessos de Bilheteria', type: 'movie', category: 'trending', url: 'https://v3-cinemeta.strem.io/catalog/movie/top.json', limit: 36 },
        { id: 'fenix_series_pop', title: 'Séries Mais Assistidas', type: 'series', category: 'trending', url: 'https://fenixflix.fenixhub.online/catalog/series/populares_fenix.json', limit: 36 },
        { id: 'magnet_series_pop', title: 'Séries em Alta no Magnetflix', type: 'series', category: 'trending', url: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series/catalog/series/populares_magnetbr.json', limit: 36 },
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
        { id: 'tv_plavio_foot', title: 'PlavioHD • Futebol Ao Vivo', type: 'tv', tvCategory: 'Esportes', url: 'https://hd.plavio.site/catalog/tv/plaviohd-football.json', limit: 40 },
        { id: 'tv_plavio_sports', title: 'PlavioHD • Esportes Internacionais', type: 'tv', tvCategory: 'Esportes', url: 'https://hd.plavio.site/catalog/tv/plaviohd-live-sports.json', limit: 40 },
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
              const rawBg = String(m.background || '');
              const validWideBg = rawBg && (rawBg.includes('images.metahub.space') || rawBg.includes('image.tmdb.org')) && !rawBg.includes('poster');
              const cleanBg = validWideBg ? rawBg : (isImdb ? `https://images.metahub.space/background/large/${itemId}/img` : (rawBg || m.poster || m.logo || ''));
              const rawRel = String(m.releaseInfo || m.year || '');
              const looksLikeSeries = /\b(animated series|tv series|miniseries|temporada|season)\b/i.test(`${m.name || ''} ${m.description || ''}`) || /\d{4}\s*[–-]\s*(\d{4}|$)/.test(rawRel) || (Array.isArray(m.videos) && m.videos.length > 1);
              let resolvedType = src.type === 'tv' ? 'tv' : (m.type || src.type);
              if (resolvedType === 'movie' && looksLikeSeries) resolvedType = 'series';
              const isCinemetaRow = src.id.startsWith('cinemeta_');
              const item = {
                id: itemId,
                type: resolvedType,
                name: m.name,
                logo: m.logo || (isImdb ? `https://images.metahub.space/logo/medium/${itemId}/img` : ''),
                poster: m.poster || m.logo || (isImdb ? `https://images.metahub.space/poster/medium/${itemId}/img` : ''),
                background: cleanBg,
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
                  trueType: isCinemetaRow ? src.type : (prev.trueType || (looksLikeSeries ? 'series' : '')),
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
          if (cached && cached.ytId && cached.trueType) return;
          try {
            let d = await fetchJson(`https://v3-cinemeta.strem.io/meta/${item.type}/${item.id}.json`, 1800).catch(() => null);
            let m = d?.meta;
            let detectedType = (m && (m.name || (Array.isArray(m.videos) && m.videos.length > 0))) ? (Array.isArray(m.videos) && m.videos.length > 1 ? 'series' : item.type) : '';
            if (!m || !m.name) {
              const altType = item.type === 'series' ? 'movie' : 'series';
              const dAlt = await fetchJson(`https://v3-cinemeta.strem.io/meta/${altType}/${item.id}.json`, 1800).catch(() => null);
              if (dAlt?.meta?.name) {
                m = dAlt.meta;
                detectedType = altType;
              }
            }
            if (m) {
              const ytId = m.trailers?.[0]?.source || m.trailerStreams?.[0]?.ytId || '';
              const prev = richById.get(item.id) || {};
              richById.set(item.id, {
                ...prev,
                trueType: detectedType || prev.trueType || item.type,
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

      // Merge enriched data (trueType + localized PT title/desc + trailer ytId + rating + genres) across all rows
      const misplacedSeries = [];
      const misplacedMovies = [];
      rows.forEach((row) => {
        if (row.type === 'tv') return;
        row.items = row.items.filter((item) => {
          const rich = richById.get(item.id);
          if (rich) {
            if (rich.trueType) item.type = rich.trueType;
            if (rich.ptName) item.name = rich.ptName;
            if (rich.ptDesc) item.description = rich.ptDesc;
            if (!item.ytId && rich.ytId) item.ytId = rich.ytId;
            if (!item.imdbRating && rich.imdbRating) item.imdbRating = rich.imdbRating;
            if (!item.year && rich.year) item.year = rich.year;
            if (!item.runtime && rich.runtime) item.runtime = rich.runtime;
            if ((!item.genres || !item.genres.length) && rich.genres?.length) item.genres = rich.genres;
            if ((!item.cast || !item.cast.length) && rich.cast?.length) item.cast = rich.cast;
          }
          if (row.type === 'movie' && item.type === 'series') {
            misplacedSeries.push(item);
            return false;
          }
          if (row.type === 'series' && item.type === 'movie') {
            misplacedMovies.push(item);
            return false;
          }
          return true;
        });
      });
      if (misplacedSeries.length) {
        const sRow = rows.find((r) => r.id === 'fenix_series_pop' || r.type === 'series');
        if (sRow) sRow.items.unshift(...misplacedSeries);
      }
      if (misplacedMovies.length) {
        const mRow = rows.find((r) => r.id === 'fenix_movies_pop' || r.type === 'movie');
        if (mRow) mRow.items.unshift(...misplacedMovies);
      }

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
      const topFirst = rows.filter((r) => r.isTop10);
      const maxLen = Math.max(movieRows.length, seriesRows.length);
      for (let i = 0; i < maxLen; i++) {
        if (movieRows[i]) interleaved.push(movieRows[i]);
        if (seriesRows[i]) interleaved.push(seriesRows[i]);
      }
      rows.length = 0;
      rows.push(...topFirst, ...interleaved);
      const validRows = rows.filter((r) => r.items.length > 0);

      const bodyStr = JSON.stringify({ rows: validRows, catalogs: validRows, addons: ADDONS, movieAddons: MOVIE_ADDONS });
      if (validRows.length > 0) setEdgeCache('catalogs:v15', bodyStr, 300);
      const catHeaders = { ...headers, 'Cache-Control': 'public, max-age=180, s-maxage=600, stale-while-revalidate=1200' };
      return new Response(bodyStr, { status: 200, headers: catHeaders });
    }

    if (rawPath === '/api/catalog/more') {
      const rowId = (url.searchParams.get('id') || '').trim();
      const rowType = (url.searchParams.get('type') || 'movie').trim();
      let genre = (url.searchParams.get('genre') || '').trim();
      const category = (url.searchParams.get('category') || '').trim();
      const rowTitle = (url.searchParams.get('title') || '').trim();
      const rowUrl = (url.searchParams.get('url') || '').trim();

      const GENRE_MAP = {
        horror: 'Horror',
        terror: 'Horror',
        action: 'Action',
        acao: 'Action',
        scifi: 'Sci-Fi',
        ficcao: 'Sci-Fi',
        comedy: 'Comedy',
        comedia: 'Comedy',
        animation: 'Animation',
        animacao: 'Animation',
        drama: 'Drama',
        crime: 'Crime',
        thriller: 'Thriller',
        suspense: 'Thriller',
        romance: 'Romance',
        adventure: 'Adventure',
        aventura: 'Adventure',
        fantasy: 'Fantasy',
        fantasia: 'Fantasy',
        mystery: 'Mystery',
        misterio: 'Mystery',
        family: 'Family',
        familia: 'Family',
        history: 'History',
        guerra: 'History',
        documentary: 'Documentary',
        documentario: 'Documentary',
        docs: 'Documentary'
      };

      if (!genre) {
        const key = (category || rowId.replace(/^cinemeta_|^fenix_/, '')).toLowerCase();
        for (const [k, v] of Object.entries(GENRE_MAP)) {
          if (key.includes(k) || rowTitle.toLowerCase().includes(k)) {
            genre = v;
            break;
          }
        }
      }

      const moreCacheKey = `catalog_more_v2:${rowId}:${rowType}:${genre}:${category}`;
      const cached = getEdgeCache(moreCacheKey);
      if (cached) return new Response(cached, { status: 200, headers });

      const pages = [];
      if (genre) {
        pages.push(
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top/genre=${encodeURIComponent(genre)}.json`,
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top/genre=${encodeURIComponent(genre)}&skip=50.json`,
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top/genre=${encodeURIComponent(genre)}&skip=100.json`
        );
      } else if (rowUrl && rowUrl.includes('.json')) {
        const base = rowUrl.replace(/\.json$/, '');
        pages.push(
          rowUrl,
          rowUrl.includes('?') || rowUrl.includes('&') ? `${base}&skip=50.json` : `${base}/skip=50.json`,
          rowUrl.includes('?') || rowUrl.includes('&') ? `${base}&skip=100.json` : `${base}/skip=100.json`
        );
      } else if (rowId.includes('fenix')) {
        pages.push(
          `https://fenixflix.fenixhub.online/catalog/${rowType}/destaques_fenix.json`,
          `https://fenixflix.fenixhub.online/catalog/${rowType}/destaques_fenix/skip=50.json`
        );
      } else {
        pages.push(
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top.json`,
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top/skip=50.json`,
          `https://v3-cinemeta.strem.io/catalog/${rowType}/top/skip=100.json`
        );
      }

      const fetched = await Promise.all(pages.map((p) => fetchJson(p, 3000).catch(() => null)));
      const seen = new Set();
      const combined = [];
      for (const res of fetched) {
        if (!res?.metas) continue;
        for (const it of res.metas) {
          if (!it.id || !it.poster || seen.has(it.id)) continue;
          seen.add(it.id);
          combined.push(it);
        }
      }

      const resBody = JSON.stringify({ items: combined, genre: genre || '' });
      if (combined.length > 0) setEdgeCache(moreCacheKey, resBody, 600);
      return new Response(resBody, { status: 200, headers });
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

    // === SUBTITLES ENDPOINT (LegendasBR) ===
    if (rawPath.startsWith('/api/subtitles/')) {
      const parts = rawPath.replace('/api/subtitles/', '').split('/');
      const subType = parts[0] || 'movie';
      const subId = parts[1] || '';
      try {
        const legRes = await fetchJson(`https://legendas.legendasbr.site/subtitles/${encodeURIComponent(subType)}/${encodeURIComponent(subId)}.json`, 3000);
        const list = Array.isArray(legRes?.subtitles) ? legRes.subtitles : [];
        return new Response(JSON.stringify({ subtitles: list }), { status: 200, headers });
      } catch (e) {
        return new Response(JSON.stringify({ subtitles: [] }), { status: 200, headers });
      }
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
        let data = await fetchJson(`https://v3-cinemeta.strem.io/meta/${type}/${encodeURIComponent(decodedId)}.json`, 2800).catch(() => null);
        let meta = data?.meta || null;
        if (!meta || !meta.name) {
          const altType = type === 'series' ? 'movie' : 'series';
          const altData = await fetchJson(`https://v3-cinemeta.strem.io/meta/${altType}/${encodeURIComponent(decodedId)}.json`, 2800).catch(() => null);
          if (altData?.meta?.name) {
            meta = { ...altData.meta, type: altType };
          }
        } else if (Array.isArray(meta.videos) && meta.videos.length > 1) {
          meta.type = 'series';
        }
        const bodyStr = JSON.stringify({ meta });
        if (meta) setEdgeCache(cacheKey, bodyStr, 1800);
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

      const isFast = url.searchParams.get('fast') === '1';
      const streamCacheKey = `streams:v25:${type}:${decodedId}`;
      const streamHeaders = { ...headers, 'Cache-Control': 'no-store, no-cache, must-revalidate' };
      const cachedStreams = getEdgeCache(streamCacheKey);
      if (cachedStreams) return new Response(cachedStreams, { status: 200, headers: streamHeaders });

      // === MOVIE & SERIES STREAM AGGREGATION ===
      // Query configured addons directly, including addons that support live TV.

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

      const addonResultsState = MOVIE_ADDONS.map((addon) => ({
        addon,
        rawStreams: [],
        sourceStatus: 'loading',
        sourceError: null,
        latencyMs: null,
        done: false
      }));

      const addonTasks = addonResultsState.map(async (entry) => {
        const { addon } = entry;
        if (type === 'tv' && addon.id === 'framextv') {
          entry.sourceStatus = 'unsupported';
          entry.sourceError = 'Addon não oferece stream de canais ao vivo.';
          entry.done = true;
          return;
        }
        if (addon.id === 'framextv') {
          const startedAt = Date.now();
          const tmdbId = await tmdbPromise;
          const fxStreams = await fetchFrameXTVStreams(type, tmdbId, epSeason, epNumber);
          entry.rawStreams = fxStreams;
          entry.sourceStatus = fxStreams.length ? 'available' : 'empty';
          entry.latencyMs = Date.now() - startedAt;
          entry.done = true;
          return;
        }
        const startedAt = Date.now();
        try {
          const data = await fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 9500);
          entry.rawStreams = Array.isArray(data?.streams) ? data.streams : [];
          entry.sourceStatus = entry.rawStreams.length ? 'available' : 'empty';
        } catch (e) {
          entry.sourceStatus = 'offline';
          entry.sourceError = String(e?.message || 'upstream error').slice(0, 120);
        }
        entry.latencyMs = Date.now() - startedAt;
        entry.done = true;
      });

      if (isFast) {
        await Promise.race([
          Promise.all(addonTasks),
          new Promise((resolve) => setTimeout(resolve, 2200))
        ]);
      } else {
        await Promise.all(addonTasks);
      }

      const rawAddonResponses = addonResultsState.map((e) => ({ ...e }));
      const hasPending = isFast && rawAddonResponses.some((e) => !e.done);

      const sortStreamsUniversal = (a, b) => {
        const rank = (s) => {
          if (s.playType === 'direct' && !s.isHevcOrMkv && !/hd\.plavio\.site\/.*\/extract\//i.test(s.directUrl || '')) return 0;
          if (s.playType === 'hls') return 1;
          if (s.playType === 'direct') return 2;
          if (s.playType === 'torrent' && s.proxyUrl) return 3;
          return 4;
        };
        if (rank(a) !== rank(b)) return rank(a) - rank(b);
        const aDegraded = /free\.flixnest\.app\/api\/(?:4khdhub|hdhub4u)\//i.test(a.directUrl || '') ? 1 : 0;
        const bDegraded = /free\.flixnest\.app\/api\/(?:4khdhub|hdhub4u)\//i.test(b.directUrl || '') ? 1 : 0;
        if (aDegraded !== bDegraded) return aDegraded - bDegraded;
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? 1 : -1;
        return (b.seeds || 0) - (a.seeds || 0);
      };

      const addonResults = rawAddonResponses
        .map(({ addon, rawStreams, sourceStatus, sourceError, latencyMs }) => {
          const filteredRaw = (rawStreams || []).filter((s) => !isBadSubServer(s));
          let streams = filteredRaw
            .map((s) => normalizeStream(s, addon))
            .filter((s) => s && (s.proxyUrl || s.directUrl || s.infoHash || s.sourceUrl));

          streams.sort(sortStreamsUniversal);

          return {
            addonId: addon.id,
            addonName: addon.name,
            badge: addon.badge,
            color: addon.color,
            isEnglishOnly: Boolean(addon.isEnglishOnly),
            status: streams.length ? 'available' : rawStreams?.length ? 'filtered' : sourceStatus || 'empty',
            sourceError,
            latencyMs,
            count: streams.length,
            streams
          };
        });

      let allStreams = addonResults.flatMap((r) => r.streams);
      allStreams.sort(sortStreamsUniversal);

      // Fallbacks cleanly disabled

      const bodyStr = JSON.stringify({
        id: decodedId,
        type,
        hasPending,
        totalStreams: allStreams.length,
        servers: addonResults,
        streams: allStreams
      });
      if (!isFast && allStreams.length > 0) {
        const hasFailedAddon = addonResults.some((server) => server.status === 'offline');
        setEdgeCache(streamCacheKey, bodyStr, hasFailedAddon ? 15 : 300);
      }

      return new Response(bodyStr, { status: 200, headers: streamHeaders });
    }

    // === SECRET VAULT ENDPOINTS (ONLY ACCESSIBLE WHEN TRIGGERED BY 'johntri2') ===
    const SECRET_VAULT_ADDONS = [
      { id: 'midnight', name: 'Midnight VIP', baseUrl: 'https://midnight.stravo.site/local', badge: 'VIP 1080p', color: '#e11d48' },
      { id: 'hgate', name: 'H-Gate Adult HD', baseUrl: 'https://h-gate.site/AdultVideo', badge: 'FULL HD', color: '#be123c' },
      { id: 'dirtypink', name: 'DirtyPink Tube', baseUrl: 'https://dirty-pink.ers.pw', badge: '4K / HD', color: '#f43f5e' },
      { id: 'tpbadult', name: 'TPB Adult 4K', baseUrl: 'https://tpb-adult-addon.click', badge: '4K ULTRA', color: '#9f1239' },
      { id: 'jaxxx', name: 'JAXXX Adult V2', baseUrl: 'https://07b88951aaab-jaxxx-v2.baby-beamup.club', badge: 'JAXXX VIP', color: '#dc2626' }
    ];

    async function getVaultPlayablePool() {
      const cached = getEdgeCache('vault:playable_pool:v2');
      if (cached) return cached;

      const seedCatUrls = [
        'https://midnight.stravo.site/local/catalog/movie/trending.json',
        'https://midnight.stravo.site/local/catalog/movie/homepage_1033693527613627536.json',
        'https://midnight.stravo.site/local/catalog/movie/homepage_7364316894532720656.json'
      ];
      const catResults = await Promise.all(seedCatUrls.map((u) => fetchJson(u, 4500).catch(() => null)));
      const candidateIds = [];
      for (const c of catResults) {
        for (const m of (c?.metas || []).slice(0, 6)) {
          if (m?.id && !candidateIds.includes(m.id)) candidateIds.push(m.id);
        }
      }

      const pool = [];
      await Promise.all(
        candidateIds.slice(0, 12).map(async (cid) => {
          const sData = await fetchJson(`https://midnight.stravo.site/local/stream/movie/${encodeURIComponent(cid)}.json`, 4500).catch(() => null);
          for (const st of (sData?.streams || [])) {
            if (st?.url && /^https?:\/\//i.test(st.url) && !/payments\.stravo|t\.me\//i.test(st.url)) {
              pool.push({
                url: st.url,
                title: st.title || 'HD • Original Audio [MP4]',
                quality: /1080p/i.test(st.title || '') ? '1080p Full HD' : (/720p/i.test(st.title || '') ? '720p HD' : (/480p/i.test(st.title || '') ? '480p HD' : 'HD Direto'))
              });
            }
          }
        })
      );

      if (pool.length > 0) setEdgeCache('vault:playable_pool:v2', pool, 240);
      return pool;
    }

    if (rawPath === '/api/vault/catalogs') {
      const cachedVault = getEdgeCache('vault:catalogs:v3');
      if (cachedVault) return new Response(cachedVault, { status: 200, headers });

      const vaultSources = [
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Mais Populares', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/trending.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Top Videos', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_1033693527613627536.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Vivamax & Destaques', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_8170622407217234072.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Japanese 18+', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_7364316894532720656.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Korea 18+', rawType: 'movie', url: 'https://midnight.stravo.site/local/catalog/movie/homepage_4105487575106966448.json' },
        { addon: SECRET_VAULT_ADDONS[0], title: 'Midnight • Coleções & Séries', rawType: 'series', url: 'https://midnight.stravo.site/local/catalog/series/homepage_4543422163096946912.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Em Alta (Hot)', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69459:hot.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Lançamentos Recentes', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69459:recent.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Amateur', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69458:amateur.json' },
        { addon: SECRET_VAULT_ADDONS[1], title: 'H-Gate HD • Asia AV', rawType: 'AdultVideo', url: 'https://h-gate.site/AdultVideo/catalog/AdultVideo/69458:asia.json' },
        { addon: SECRET_VAULT_ADDONS[2], title: 'DirtyPink • Novos Lançamentos', rawType: 'movie', url: 'https://dirty-pink.ers.pw/catalog/movie/tpdb_catalog.json' },
        { addon: SECRET_VAULT_ADDONS[3], title: 'TPB Adult • 4K Ultra Top', rawType: 'Porn', url: 'https://tpb-adult-addon.click/catalog/Porn/xxx_top.json' },
        { addon: SECRET_VAULT_ADDONS[3], title: 'TPB Adult • 4K Recentes', rawType: 'Porn', url: 'https://tpb-adult-addon.click/catalog/Porn/xxx_recent.json' },
        { addon: SECRET_VAULT_ADDONS[3], title: 'TPB Adult • Curated 4K', rawType: 'Porn', url: 'https://tpb-adult-addon.click/catalog/Porn/curated_top.json' },
        { addon: SECRET_VAULT_ADDONS[4], title: 'JAXXX • Eporner Top', rawType: 'movie', url: 'https://07b88951aaab-jaxxx-v2.baby-beamup.club/catalog/movie/eporner.json' },
        { addon: SECRET_VAULT_ADDONS[4], title: 'JAXXX • SpankBang HD', rawType: 'movie', url: 'https://07b88951aaab-jaxxx-v2.baby-beamup.club/catalog/movie/spankbang.json' },
        { addon: SECRET_VAULT_ADDONS[4], title: 'JAXXX • Xhamster 4K', rawType: 'movie', url: 'https://07b88951aaab-jaxxx-v2.baby-beamup.club/catalog/movie/xhamster.4k.json' }
      ];

      const fetched = await Promise.all(
        vaultSources.map(async (src) => {
          const data = await fetchJson(src.url, 5500).catch(() => null);
          const metas = Array.isArray(data?.metas) ? data.metas : [];
          const items = metas
            .filter((m) => m && m.id && m.name)
            .slice(0, 32)
            .map((m) => ({
              id: `vault:${src.addon.id}:${src.rawType}:${m.id}`,
              rawId: m.id,
              rawType: m.type || src.rawType,
              vaultAddonId: src.addon.id,
              type: src.rawType === 'series' ? 'series' : 'movie',
              name: m.name,
              poster: m.poster || m.background || `https://placehold.co/340x510/1f0812/f43f5e?text=${encodeURIComponent(m.name.slice(0, 18))}`,
              background: m.background || m.poster || '',
              year: m.releaseInfo || m.year || '18+',
              imdbRating: m.imdbRating || '18+',
              description: m.description || `${src.addon.name} • Conteúdo Exclusivo Área Restrita`,
              isVaultItem: true
            }));
          return {
            title: src.title,
            type: src.rawType === 'series' ? 'series' : 'movie',
            category: src.addon.id,
            items
          };
        })
      );

      const validRows = fetched.filter((r) => r.items.length > 0);
      const out = JSON.stringify({ rows: validRows, addons: SECRET_VAULT_ADDONS });
      if (validRows.length > 0) setEdgeCache('vault:catalogs:v3', out, 300);
      return new Response(out, { status: 200, headers });
    }

    if (rawPath === '/api/vault/meta') {
      const rawVaultId = url.searchParams.get('id') || '';
      const parts = rawVaultId.split(':');
      if (parts[0] === 'vault' && parts.length >= 4) {
        const addonId = parts[1];
        const rawType = parts[2];
        const itemId = parts.slice(3).join(':');
        const addon = SECRET_VAULT_ADDONS.find((a) => a.id === addonId);
        if (addon) {
          const metaUrl = `${addon.baseUrl}/meta/${encodeURIComponent(rawType)}/${encodeURIComponent(itemId)}.json`;
          const data = await fetchJson(metaUrl, 4500).catch(() => null);
          if (data?.meta) {
            return new Response(JSON.stringify({ meta: data.meta }), { status: 200, headers });
          }
        }
      }
      return new Response(JSON.stringify({ meta: null }), { status: 200, headers });
    }

    if (rawPath === '/api/vault/streams') {
      const rawVaultId = url.searchParams.get('id') || '';
      const parts = rawVaultId.split(':');
      let targetAddon = null;
      let rawType = 'movie';
      let itemId = rawVaultId;

      if (parts[0] === 'vault' && parts.length >= 4) {
        targetAddon = SECRET_VAULT_ADDONS.find((a) => a.id === parts[1]) || null;
        rawType = parts[2];
        itemId = parts.slice(3).join(':');
      }

      // Deterministic hash seed from itemId so every item gets consistent streams across all 4 servers
      let itemHash = 0;
      for (let i = 0; i < itemId.length; i++) {
        itemHash = ((itemHash << 5) - itemHash + itemId.charCodeAt(i)) | 0;
      }
      itemHash = Math.abs(itemHash);

      const [targetData, fallbackPool] = await Promise.all([
        (async () => {
          if (!targetAddon) return null;
          const sUrl = `${targetAddon.baseUrl}/stream/${encodeURIComponent(rawType)}/${encodeURIComponent(itemId)}.json`;
          return fetchJson(sUrl, 5000).catch(() => null);
        })(),
        getVaultPlayablePool()
      ]);

      const directTargetStreams = [];
      for (const st of (targetData?.streams || [])) {
        if (st?.url && /^https?:\/\//i.test(st.url) && !/payments\.stravo|t\.me\/|h-gate\.site\/(AdultVideo\/configure|pricing)/i.test(st.url)) {
          directTargetStreams.push({
            url: st.url,
            title: st.title || st.name || 'HD • Original Audio [MP4]',
            quality: /2160p|4k/i.test(st.title || '') ? '4K Ultra HD' : (/1080p/i.test(st.title || '') ? '1080p Full HD' : (/720p/i.test(st.title || '') ? '720p HD' : (/480p/i.test(st.title || '') ? '480p HD' : '360p Fast')))
          });
        }
      }

      const activePool = directTargetStreams.length > 0
        ? [...directTargetStreams, ...fallbackPool]
        : fallbackPool;

      const orderedAddons = targetAddon
        ? [targetAddon, ...SECRET_VAULT_ADDONS.filter((a) => a.id !== targetAddon.id)]
        : SECRET_VAULT_ADDONS;

      const servers = [];
      const allStreams = [];

      for (let aIdx = 0; aIdx < orderedAddons.length; aIdx++) {
        const addon = orderedAddons[aIdx];
        const mapped = [];

        // If this is the exact Midnight item with direct streams, expose all its native streams first
        const addonSourceStreams = (aIdx === 0 && directTargetStreams.length > 0)
          ? directTargetStreams
          : (activePool.length > 0
              ? [
                  activePool[(itemHash + aIdx * 3) % activePool.length],
                  activePool[(itemHash + aIdx * 3 + 1) % activePool.length]
                ].filter(Boolean)
              : []);

        for (let idx = 0; idx < addonSourceStreams.length; idx++) {
          const picked = addonSourceStreams[idx];
          if (!picked || !picked.url) continue;

          const rawUrl = picked.url;
          const isHls = /\.m3u8(\?|$)/i.test(rawUrl) || /\/hls\b|\/hlsm\//i.test(rawUrl);
          const playType = isHls ? 'hls' : 'direct';
          const proxiedUrl = isHls
            ? hlsProxied(rawUrl)
            : `/api/proxy-stream?url=${encodeURIComponent(rawUrl)}`;

          const cleanTitle = String(picked.title || addon.name).replace(/\r?\n/g, ' • ').trim();
          const qualityLabel = picked.quality || (/2160p|4k/i.test(cleanTitle) ? '4K Ultra HD' : (/1080p/i.test(cleanTitle) ? '1080p Full HD' : 'HD Direto'));

          const streamObj = {
            addonId: addon.id,
            addonName: addon.name,
            addonBadge: addon.badge,
            addonColor: addon.color,
            serverLabel: `${addon.name} • Servidor #${idx + 1}`,
            rawName: addon.name,
            rawTitle: cleanTitle,
            quality: qualityLabel,
            is4k: /4k|2160p/i.test(qualityLabel),
            isDub: false,
            audio: 'Áudio Original • Cloud Direto',
            playType,
            directUrl: proxiedUrl,
            proxyUrl: proxiedUrl
          };
          mapped.push(streamObj);
          allStreams.push(streamObj);
        }

        if (mapped.length > 0) {
          servers.push({
            addonId: addon.id,
            addonName: addon.name,
            badge: addon.badge,
            color: addon.color,
            count: mapped.length,
            streams: mapped
          });
        }
      }

      return new Response(
        JSON.stringify({
          id: rawVaultId,
          type: rawType === 'series' ? 'series' : 'movie',
          totalStreams: allStreams.length,
          servers,
          streams: allStreams
        }),
        { status: 200, headers }
      );
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};
