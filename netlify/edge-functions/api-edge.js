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
    name: 'SuperFlix Oficial',
    badge: 'DUBLADO BR',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://superflixapi.fun/',
    baseUrl: 'https://superflixapi.fun',
    logo: 'https://superflixapi.fun/favicon.ico',
    color: '#e11d48'
  },
  {
    id: 'vidsrc',
    name: 'VidSrc BR',
    badge: 'MULTISERVER',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://vidsrc.sh/',
    baseUrl: 'https://vidsrc.sh',
    logo: 'https://vidsrc.sh/favicon.ico',
    color: '#3b82f6'
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed Cloud',
    badge: 'FAST CLOUD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://player.autoembed.cc/',
    baseUrl: 'https://player.autoembed.cc',
    logo: 'https://player.autoembed.cc/favicon.ico',
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
    baseUrl: 'https://flixnest.app/flix-streams',
    logo: 'https://flixnest.app/flix-streams/static/icon.png',
    color: '#06b6d4'
  },
  {
    id: 'magnetflix',
    name: 'Magnetflix BR',
    badge: 'DUBLADO 4K/HD',
    type: 'direct',
    category: 'movie_series',
    manifestUrl: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series/manifest.json',
    baseUrl: 'https://magnetflix.flixbr.online/qualities%3D4k%2C1080p%2C720p%2Csd%7Caudio%3Ddublado%2Clegendado%7Ccatalogs%3Dpopulares_movie%2Cpopulares_series%2Crecentes_servidor_movie%2Crecentes_servidor_series%2Cemalta_movie%2Cemalta_series',
    logo: 'https://magnetflix.flixbr.online/static/logo.jpg',
    color: '#e11d48'
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
  },
  {
    id: 'plaviotv',
    name: 'PlavioHD Live TV',
    badge: 'ESPORTES HD',
    type: 'tv',
    category: 'tv',
    manifestUrl: 'https://hd.plavio.site/manifest.json',
    baseUrl: 'https://hd.plavio.site',
    logo: 'https://hd.plavio.site/logo.png',
    color: '#3b82f6'
  },
  {
    id: 'iptvorg',
    name: 'TV Brasil Ao Vivo',
    badge: 'TV AO VIVO',
    type: 'tv',
    category: 'tv',
    manifestUrl: 'https://iptv-org.github.io/iptv/countries/br.m3u',
    baseUrl: 'https://iptv-org.github.io/iptv/countries/br.m3u',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg/512px-Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg.png',
    color: '#a855f7'
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
  out.push(
    {
      name: 'FrameXTV • Multi-Server 4K',
      title: '🇺🇸 Miner XIX / Valkyrie VI (FrameXTV)\n🇺🇸 Inglês (Original)',
      embedUrl: fxEmbed
    }
  );

  return out;
}

function isBadSubServer(rawStream) {
  const u = rawStream.url || '';
  const t = `${rawStream.name || ''} ${rawStream.title || ''}`;
  if (rawStream.ytId && !u && !rawStream.embedUrl && !rawStream.infoHash) return true;
  if (/\[official trailer\]|play trailer in stremio/i.test(t)) return true;
  if (/moviebox/i.test(t) || /moviebox/i.test(u)) return true;
  if ((u.includes('koyeb.app') && !u.includes('fenixflix')) || u.includes('squareweb.app')) return true;
  if (/hypex|atlas|\bastra\b|\bneon\b/i.test(t)) return true;
  return false;
}

function normalizeStream(rawStream, addon, fallbackDirectUrls = [], idx = 0, englishPool = [], universalEmbedUrl = '') {
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
    const pool = (forceEn && englishPool.length > 0) ? englishPool : fallbackDirectUrls;
    if (pool.length > 0) {
      const picked = pool[idx % pool.length];
      playType = 'direct';
      streamUrl = picked.directUrl;
      proxyUrl = streamUrl.includes('workers.dev')
        ? streamUrl
        : `/api/proxy-stream?url=${encodeURIComponent(streamUrl)}`;
    } else if (universalEmbedUrl) {
      playType = 'embed';
      proxyUrl = universalEmbedUrl;
    }
  }

  let serverLabel = (rawStream.name || addon.name).replace(/\n/g, ' ');
  const subText = `${rawStream.title || ''}\n${rawStream.description || ''}`;
  const subServerMatch = subText.match(/(?:⚡|🦡|📍|🐉|🌊|⚙️|⚙|🌪️|🔋|⭐️|❄️|🔥|💎)\s*(?:Servidor:\s*)?([^\n\r]+)/i);
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
    isHevcOrMkv: Boolean(isHevcOrMkv),
    isDub,
    audio,
    seeds,
    playType,
    directUrl: streamUrl,
    proxyUrl,
    embedUrl: embedUrl || universalEmbedUrl || null,
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
const iptvCache = { exp: 0, list: [] };
const b64uEnc = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uDec = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));

async function proxySign(value) {
  const secret = (typeof Deno !== 'undefined' && Deno.env.get('PROXY_SECRET')) || 'jf-hls-proxy-v1';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hlsProxied(u) {
  return `/api/hls-proxy?url=${encodeURIComponent(u)}&s=${await proxySign(u)}&x=index.m3u8`;
}

async function getIptvBr() {
  if (iptvCache.exp > Date.now() && iptvCache.list.length) return iptvCache.list;
  try {
    const res = await fetch(IPTV_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error('iptv');
    const lines = (await res.text()).split(/\r?\n/);
    const out = [];
    const seen = new Set();
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith('#EXTINF')) continue;
      const info = lines[i];
      let j = i + 1;
      while (j < lines.length && (!lines[j].trim() || lines[j].startsWith('#'))) j++;
      const url = (lines[j] || '').trim();
      if (!/^https?:\/\//i.test(url)) continue;
      const name = (info.split(',').slice(1).join(',') || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s*\(\d+p\)/gi, '').trim();
      if (!name || /geo-?blocked/i.test(info) || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      const logo = (info.match(/tvg-logo="([^"]*)"/) || [])[1] || '';
      const group = (info.match(/group-title="([^"]*)"/) || [])[1] || 'Canais';
      out.push({ url, name, logo, group: group.split(';')[0] });
    }
    if (out.length) { iptvCache.list = out; iptvCache.exp = Date.now() + 30 * 60 * 1000; }
  } catch (e) {}
  return iptvCache.list;
}

const GROUP_PT = { News: 'Notícias', Sports: 'Esportes', Movies: 'Filmes', Kids: 'Infantil', Music: 'Música', Entertainment: 'Entretenimento', General: 'Geral', Culture: 'Cultura', Documentary: 'Documentários', Religious: 'Religiosos', Series: 'Séries', Animation: 'Animação', Education: 'Educação', Lifestyle: 'Estilo de Vida', Comedy: 'Comédia', Undefined: 'Variedades', Public: 'TV Pública', Legislative: 'Legislativo', Weather: 'Clima', Business: 'Negócios' };

const STATIC_NATIONAL_CHANNELS = [
  {
    name: 'SBT Nacional (Ao Vivo)',
    url: 'https://d1jvs4svzaqp8n.cloudfront.net/indexMobile.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg/512px-Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg.png',
    group: 'General'
  },
  {
    name: 'TV Globo (Ao Vivo)',
    url: 'http://hls1.sua.tv/live/globotvbahiafhdbr2/s.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/TV_Globo_2021.svg/512px-TV_Globo_2021.svg.png',
    group: 'General'
  },
  {
    name: 'SBT (Ao Vivo)',
    url: 'https://video09.logicahost.com.br/sbtcuiaba/sbtcuiaba/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg/512px-Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg.png',
    group: 'General'
  },
  {
    name: 'SBT Interior (HD)',
    url: 'https://video09.logicahost.com.br/sbtmutum/sbtmutum/playlist.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg/512px-Sistema_Brasileiro_de_Televis%C3%A3o_logo.svg.png',
    group: 'General'
  },
  {
    name: 'Record News (Ao Vivo)',
    url: 'https://jmp2.uk/plu-6102e04e9ab1db0007a980a1.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Record_News_2023.svg/512px-Record_News_2023.svg.png',
    group: 'News'
  },
  {
    name: 'TV Cultura (Ao Vivo)',
    url: 'https://fpa-gateway.tvcultura.com.br:8181/memfs/606caef0-a290-413d-9f1f-8fcdb3a73831.m3u8',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/TV_Cultura_logo.svg/512px-TV_Cultura_logo.svg.png',
    group: 'General'
  }
];

async function iptvRows() {
  const dynamicList = await getIptvBr();
  const staticUrls = new Set(STATIC_NATIONAL_CHANNELS.map((c) => c.url));
  const list = [
    ...STATIC_NATIONAL_CHANNELS,
    ...dynamicList.filter((c) => !staticUrls.has(c.url))
  ];
  if (!list.length) return [];
  const toItem = (ch) => ({
    id: `tv:iptvorg:${b64uEnc(ch.url)}`,
    type: 'tv',
    name: ch.name,
    logo: ch.logo,
    poster: ch.logo,
    background: ch.logo,
    year: 'AO VIVO',
    runtime: '',
    imdbRating: '',
    description: '',
    genres: [GROUP_PT[ch.group] || ch.group],
    cast: [],
    ytId: ''
  });
  const groups = new Map();
  list.forEach((ch) => {
    const g = GROUP_PT[ch.group] || ch.group;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(ch);
  });
  const rows = [
    {
      id: 'tv_nacionais',
      title: 'Canais Abertos Nacionais (Globo, SBT, Record, Cultura)',
      type: 'tv',
      category: 'tv',
      tvCategory: 'Abertos',
      items: STATIC_NATIONAL_CHANNELS.map(toItem)
    },
    {
      id: 'tv_iptv_all',
      title: 'Todos os Canais de TV do Brasil',
      type: 'tv',
      category: 'tv',
      tvCategory: 'Brasil',
      items: list.slice(0, 80).map(toItem)
    }
  ];
  [...groups.entries()].filter(([, v]) => v.length >= 3).sort((a, b) => b[1].length - a[1].length).slice(0, 6).forEach(([g, v]) => {
    rows.push({ id: `tv_iptv_${b64uEnc(g).slice(0, 10)}`, title: `TV • ${g}`, type: 'tv', category: 'tv', tvCategory: g, items: v.slice(0, 60).map(toItem) });
  });
  return rows;
}

const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[?::1|\[?f[cd])/i;

async function hlsProxyHandler(request, url) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Length, Content-Range' };
  const target = url.searchParams.get('url') || '';
  const sig = url.searchParams.get('s') || '';
  let t;
  try { t = new URL(target); } catch (e) { return new Response('bad url', { status: 400, headers: cors }); }
  if (!/^https?:$/.test(t.protocol) || PRIVATE_HOST.test(t.hostname)) return new Response('forbidden', { status: 403, headers: cors });
  if (sig !== (await proxySign(target))) return new Response('forbidden', { status: 403, headers: cors });

  const fh = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36', Accept: '*/*' };
  if (/hakunaymatata\.com|mzfi\.me/i.test(t.hostname)) {
    fh.Referer = 'https://mzfi.me/';
  }
  if (/tiktokcdn\.live|dadinhodetapioca/i.test(t.hostname)) {
    fh.Referer = 'https://dadinhodetapioca.fun/play/discoverychannel.html';
  }
  const range = request.headers.get('range');
  if (range) fh.Range = range;
  let up;
  try { up = await fetch(target, { headers: fh, redirect: 'follow' }); } catch (e) { return new Response('upstream error', { status: 502, headers: cors }); }
  if (!up.ok && up.status !== 206) return new Response('upstream ' + up.status, { status: 502, headers: cors });

  const ct = up.headers.get('content-type') || '';
  const isM3u8 = /mpegurl/i.test(ct) || /\.m3u8(\?|$)/i.test(t.pathname + t.search);
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
          if (a) res = res.replace(x[0], `URI="${await hlsProxied(a)}"`);
        }
        return res;
      }
      const a = abs(line.trim());
      return a ? await hlsProxied(a) : line;
    }));
    return new Response(out.join('\n'), { status: 200, headers: { ...cors, 'Content-Type': 'application/vnd.apple.mpegurl', 'Cache-Control': 'no-store' } });
  }
  const h = { ...cors, 'Content-Type': ct || 'video/mp2t', 'Cache-Control': 'public, max-age=20' };
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
              return { ...a, online: true, pingMs: Math.min(Date.now() - t0, 280) };
            }
          })
        );
        return new Response(JSON.stringify({ addons: statuses }), { status: 200, headers });
      }
      return new Response(JSON.stringify({ addons: ADDONS }), { status: 200, headers });
    }

    if (rawPath === '/api/hls-proxy') return hlsProxyHandler(request, url);

    if (rawPath === '/api/catalogs') {
      const cachedCat = getEdgeCache('catalogs:v12');
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

      // Fallback de TV: se o FenixTV estiver fora do ar, usa canais abertos do Brasil (iptv-org)
      if (!rows.some((r) => r.type === 'tv' && r.items.length > 0)) {
        try { rows.push(...(await iptvRows())); } catch (e) {}
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

      // YouTube Row for Home View
      const ytItems = [
        { id: 'yt:mrbeast', name: 'MrBeast', type: 'channel', ytId: 'UCX6OQ3DkcsbYNE6H8uQQuVA', poster: 'https://yt3.googleusercontent.com/fxGKYucJAVme-YzgnKiYGasPuvYXcmqOIXriGdgHPku0o_pnW0JaW ведущий?f=1', year: 'YouTube', imdbRating: '300M+', description: 'Desafios épicos e vídeos virais milionários.', category: 'youtube' },
        { id: 'yt:nostalgia', name: 'Canal Nostalgia', type: 'channel', ytId: 'UCbba9T4Dcxk_8Zl7aQxM3iA', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_k6_U2VqF7w0B7B9k9m0', year: 'YouTube', imdbRating: '13M+', description: 'História, cinema, ciência e documentários por Felipe Castanhari.', category: 'youtube' },
        { id: 'yt:alanzoka', name: 'Alanzoka', type: 'channel', ytId: 'UCg4Hq42-QY32w92a7oT_07w', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_k_alanzoka', year: 'YouTube', imdbRating: 'Gaming', description: 'Gameplays, sustos e melhores momentos de jogos.', category: 'youtube' },
        { id: 'yt:casimito', name: 'Cortes do Casimito', type: 'channel', ytId: 'UCpjyfPq0xPzK2_G80M', year: 'YouTube', imdbRating: 'React', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_casimito', description: 'Reacts, futebol e muito entretenimento.', category: 'youtube' },
        { id: 'yt:flow', name: 'Flow Podcast', type: 'channel', ytId: 'UC4ncvgh5hFr5O83MH7-jRJg', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_flow', year: 'YouTube', imdbRating: 'Podcast', description: 'Entrevistas e conversas sem filtro.', category: 'youtube' },
        { id: 'yt:pewdiepie', name: 'PewDiePie', type: 'channel', ytId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_pewdiepie', year: 'YouTube', imdbRating: '111M+', description: 'O criador mais emblemático do YouTube global.', category: 'youtube' },
        { id: 'yt:markiplier', name: 'Markiplier', type: 'channel', ytId: 'UC7_YxT-hzdPBtcWhtG5CE-Q', poster: 'https://yt3.googleusercontent.com/ytc/AIdro_markiplier', year: 'YouTube', imdbRating: 'Gaming', description: 'Jogos de terror e produções cinematográficas.', category: 'youtube' }
      ];
      validRows.push({
        id: 'youtube_featured',
        title: 'Canais em Destaque do YouTube',
        type: 'channel',
        category: 'youtube',
        items: ytItems
      });

      const bodyStr = JSON.stringify({ rows: validRows, catalogs: validRows, addons: ADDONS, tvAddons: TV_ADDONS, movieAddons: MOVIE_ADDONS });
      if (validRows.length > 0) setEdgeCache('catalogs:v13', bodyStr, 300);
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

      const streamCacheKey = `streams:v20:${type}:${decodedId}`;
      const cachedStreams = getEdgeCache(streamCacheKey);
      if (cachedStreams) return new Response(cachedStreams, { status: 200, headers });

      // === LIVE TV CHANNELS STREAM AGGREGATION (ONLY TV ADDONS) ===
      if (type === 'tv' && decodedId.startsWith('tv:iptvorg:')) {
        let src = '';
        try { src = b64uDec(decodedId.slice('tv:iptvorg:'.length)); } catch (e) {}
        const dynamicList = await getIptvBr();
        const fullList = [...STATIC_NATIONAL_CHANNELS, ...dynamicList];
        const ch = fullList.find((x) => x.url === src) || { name: 'Canal de TV', url: src };
        const streams = src ? [{
          addonId: 'iptvorg', addonName: 'TV Brasil Ao Vivo', addonLogo: '', addonBadge: 'TV AO VIVO', addonColor: '#a855f7',
          serverLabel: `${ch.name} • Transmissão Direta`, rawName: 'TV Brasil', rawTitle: ch.name, quality: '1080p HD Ao Vivo', is4k: false, isDub: true,
          audio: 'Ao Vivo PT-BR', seeds: null, playType: 'hls', directUrl: await hlsProxied(src), proxyUrl: await hlsProxied(src)
        }] : [];
        const body = JSON.stringify({ id: decodedId, type: 'tv', totalStreams: streams.length, servers: [{ addonId: 'iptvorg', addonName: 'TV Brasil Ao Vivo', badge: 'TV AO VIVO', color: '#a855f7', count: streams.length, streams }], streams });
        return new Response(body, { status: 200, headers });
      }
      if (type === 'tv') {
        let rawTvStreams = [];
        try {
          const fenixTvData = await fetchJson(`https://fenixtv.fenixhub.online/stream/tv/${encodedId}.json`, 2500);
          if (Array.isArray(fenixTvData?.streams)) rawTvStreams.push(...fenixTvData.streams);
        } catch (e) {}

        // Check for direct high-availability feeds for major channels (SBT, Globo, Discovery)
        if (/sbt/i.test(decodedId)) {
          rawTvStreams.unshift(
            { name: 'SBT Ao Vivo', title: '📺 SBT Cuiabá HD (Ao Vivo)', url: 'https://video09.logicahost.com.br/sbtcuiaba/sbtcuiaba/playlist.m3u8' },
            { name: 'SBT Nacional', title: '📺 SBT Nacional (Full HD)', url: 'https://d1jvs4svzaqp8n.cloudfront.net/indexMobile.m3u8' },
            { name: 'SBT Mutum', title: '📺 SBT Mutum HD (Ao Vivo)', url: 'https://video09.logicahost.com.br/sbtmutum/sbtmutum/playlist.m3u8' }
          );
        }
        if (/discovery/i.test(decodedId)) {
          rawTvStreams.unshift({
            name: 'Discovery Channel',
            title: '📺 Discovery Channel [FULL HD]',
            url: await hlsProxied('https://tiktokcdn.live/live/secure/C3uEBwDRmCBd2odYLQkmWSnQlvJDTkWmhKYMtAtAsBQ/1793050614/e0d384e8639071c3/discoverychannel/index.m3u8')
          });
        }

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

        // Filter out [OFFLINE] streams so users are never sent dead channels
        const activeTvRaw = rawTvStreams.filter((s) => !/\[OFFLINE\]/i.test(`${s.name || ''} ${s.title || ''}`));

        // Upgrade and sanitize live streams:
        // Exclude broken direct.m3u8 and unwrap broken Square Cloud proxy wrappers
        const cleanTvRaw = activeTvRaw
          .filter((s) => s.url && !s.url.includes('fenixtv.fenixhub.online/direct.m3u8'))
          .map((s) => {
            let u = s.url || '';
            if (u.includes('fenixtv.fenixhub.online/proxy?url=')) {
              try {
                const m = u.match(/proxy\?url=([^&]+)/);
                if (m) u = decodeURIComponent(m[1]);
              } catch (e) {}
            }
            return {
              ...s,
              url: u
            };
          });

        cleanTvRaw.sort((a, b) => (a.isProxyPreferred === b.isProxyPreferred ? 0 : a.isProxyPreferred ? -1 : 1));

        const tvAddonResults = [];
        if (cleanTvRaw.length > 0) {
          const fenixStreams = (await Promise.all(cleanTvRaw.map(async (s, idx) => {
            const cleanTitle = (s.title || 'Fenix TV').replace(/🔴\s*\[OFFLINE\]\s*/gi, '').replace(/\?\?\s*\[OFFLINE\]\s*/gi, '');
            const isFhd = /1080p|fhd|full\s*hd|4k/i.test(cleanTitle);
            const quality = isFhd ? '1080p Full HD' : 'HD Ao Vivo';
            const finalUrl = (s.url && s.url.startsWith('http://')) ? await hlsProxied(s.url) : s.url;
            return {
              addonId: 'fenixtv',
              addonName: 'Fenix TV',
              addonLogo: 'https://fenixtv.fenixhub.online/logo.png',
              addonBadge: 'CANAIS HD',
              addonColor: '#38bdf8',
              serverLabel: `Fenix TV • Ao Vivo #${idx + 1}`,
              rawName: 'Fenix TV',
              rawTitle: cleanTitle.replace(/\n/g, ' • '),
              quality,
              is4k: false,
              isDub: true,
              audio: 'Ao Vivo PT-BR',
              seeds: null,
              playType: 'hls',
              directUrl: finalUrl,
              proxyUrl: finalUrl
            };
          }))).filter((s) => s.proxyUrl);

          if (fenixStreams.length > 0) {
            tvAddonResults.push({
              addonId: 'fenixtv',
              addonName: 'Fenix TV',
              badge: 'CANAIS HD',
              color: '#38bdf8',
              count: fenixStreams.length,
              streams: fenixStreams
            });
          }
        }

        const lowerId = decodedId.toLowerCase();
        const rawSlug = decodedId.split(':').pop().replace(/[^a-z0-9]/gi, '').toLowerCase();
        const dynamicList = await getIptvBr().catch(() => []);
        const fullList = [...STATIC_NATIONAL_CHANNELS, ...dynamicList];
        const matchStatic = fullList.find((c) => {
          const n = c.name.toLowerCase().replace(/[^a-z0-9]/gi, '');
          return (rawSlug && (n === rawSlug || n.includes(rawSlug) || rawSlug.includes(n))) ||
                 (lowerId.includes('sbt') && n.includes('sbt')) ||
                 (lowerId.includes('globo') && n.includes('globo')) ||
                 (lowerId.includes('cultura') && n.includes('cultura')) ||
                 (lowerId.includes('record') && n.includes('record')) ||
                 (lowerId.includes('band') && n.includes('band'));
        }) || (tvAddonResults.length === 0 ? STATIC_NATIONAL_CHANNELS[0] : null);

        if (matchStatic) {
          const direct = await hlsProxied(matchStatic.url);
          const brStream = {
            addonId: 'iptvorg',
            addonName: 'TV Brasil Ao Vivo',
            addonLogo: matchStatic.logo,
            addonBadge: 'TV AO VIVO',
            addonColor: '#a855f7',
            serverLabel: `${matchStatic.name} • Transmissão Direta`,
            rawName: 'TV Brasil',
            rawTitle: matchStatic.name,
            quality: '1080p HD Ao Vivo',
            is4k: false,
            isDub: true,
            audio: 'Ao Vivo PT-BR',
            seeds: null,
            playType: 'hls',
            directUrl: direct,
            proxyUrl: direct
          };
          tvAddonResults.unshift({
            addonId: 'iptvorg',
            addonName: 'TV Brasil Ao Vivo',
            badge: 'TV AO VIVO',
            color: '#a855f7',
            count: 1,
            streams: [brStream]
          });
        }

        let allTvStreams = tvAddonResults.flatMap((r) => r.streams);

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
            return {
              addon,
              rawStreams: [{
                name: 'SuperFlix Oficial',
                title: '🇧🇷 Servidor Dublado Oficial (SuperFlix)',
                embedUrl: sEmbed
              }]
            };
          }
          if (addon.id === 'vidsrc') {
            const tmdbId = await tmdbPromise;
            const isSeries = type === 'series';
            const vidsrcPt = isSeries
              ? (tmdbId
                  ? 'https://vidsrc.sh/embed/tv?tmdb=' + tmdbId + '&season=' + epSeason + '&episode=' + epNumber + '&ds_lang=pt'
                  : 'https://vidsrc.sh/embed/tv?imdb=' + baseImdb + '&season=' + epSeason + '&episode=' + epNumber + '&ds_lang=pt')
              : (tmdbId
                  ? 'https://vidsrc.sh/embed/movie?tmdb=' + tmdbId + '&ds_lang=pt'
                  : 'https://vidsrc.sh/embed/movie?imdb=' + baseImdb + '&ds_lang=pt');
            return {
              addon,
              rawStreams: [{
                name: 'VidSrc BR',
                title: '🇧🇷 Servidor Multiserver (VidSrc)',
                embedUrl: vidsrcPt
              }]
            };
          }
          if (addon.id === 'autoembed') {
            const tmdbId = await tmdbPromise;
            const isSeries = type === 'series';
            const autoEmbed = isSeries
              ? (tmdbId ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${epSeason}&e=${epNumber}` : `https://player.videasy.to/tv/${baseImdb}/${epSeason}/${epNumber}`)
              : (tmdbId ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1` : `https://player.videasy.to/movie/${baseImdb}`);
            return {
              addon,
              rawStreams: [{
                name: 'AutoEmbed Cloud',
                title: '⚡ Servidor Rápido MultiEmbed (AutoEmbed)',
                embedUrl: autoEmbed
              }]
            };
          }
          if (addon.id === 'videasy') {
            const isSeries = type === 'series';
            const videasyEmbed = isSeries
              ? 'https://player.videasy.to/tv/' + baseImdb + '/' + epSeason + '/' + epNumber
              : 'https://player.videasy.to/movie/' + baseImdb;
            return {
              addon,
              rawStreams: [{
                name: 'Videasy 4K',
                title: '🎬 Player Universal Multilingue (Videasy)',
                embedUrl: videasyEmbed
              }]
            };
          }
          if (addon.id === 'framextv') {
            const tmdbId = await tmdbPromise;
            const fxStreams = await fetchFrameXTVStreams(type, tmdbId, epSeason, epNumber);
            return { addon, rawStreams: fxStreams };
          }

          const primaryPromise = fetchJson(`${addon.baseUrl}/stream/${type}/${encodedId}.json`, 3200)
            .then((d) => (Array.isArray(d?.streams) && d.streams.length > 0 ? d.streams : Promise.reject(new Error('empty'))));

          const tasks = [primaryPromise];
          if (addon.fallbackUrl) {
            tasks.push(
              fetchJson(`${addon.fallbackUrl}/stream/${type}/${encodedId}.json`, 3200)
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
            const t = `${s.name || ''} ${s.title || ''} ${s.description || ''}`;
            const isZeusOrCarbon = /zeus|carbon|azure|titan|magnetflix|corruptx/i.test(t) || cleanUrl.includes('corruptx.org');
            const isHevcOrMkv = /hevc|x265|h\.?265|\.mkv\b|10bit|hdr/i.test(t) || /\.mkv(\?|$)/i.test(cleanUrl);
            const isDub = addon.isEnglishOnly ? false : /dublado|🇧🇷|portugu[eê]s|dual/i.test(t);
            const entry = {
              directUrl: cleanUrl,
              is4k: /2160p|4k|uhd/i.test(t),
              isDub,
              isPreferredH264: isZeusOrCarbon && !isHevcOrMkv && !/2160p|4k|uhd/i.test(t),
              title: s.title || s.description || addon.name,
              name: s.name || addon.name
            };
            if (!isHevcOrMkv) {
              directPool.push(entry);
              if (addon.isEnglishOnly || !isDub) {
                englishPool.push(entry);
              }
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
        ? `https://player.videasy.to/tv/${baseImdb}/${epSeason}/${epNumber}`
        : `https://player.videasy.to/movie/${baseImdb}`;

      const sortStreamsUniversal = (a, b) => {
        const rank = (p) => (p === 'direct' ? 0 : p === 'hls' ? 1 : p === 'embed' ? 2 : 3);
        if (rank(a.playType) !== rank(b.playType)) return rank(a.playType) - rank(b.playType);
        if (Boolean(a.isHevcOrMkv) !== Boolean(b.isHevcOrMkv)) return a.isHevcOrMkv ? 1 : -1;
        if (a.isDub !== b.isDub) return a.isDub ? -1 : 1;
        if (a.is4k !== b.is4k) return a.is4k ? 1 : -1;
        return (b.seeds || 0) - (a.seeds || 0);
      };

      const addonResults = rawAddonResponses
        .map(({ addon, rawStreams }) => {
          const filteredRaw = rawStreams.filter((s) => !isBadSubServer(s));
          if (filteredRaw.length === 0) return null;

          const streams = filteredRaw
            .map((s, idx) => normalizeStream(s, addon, directPool, idx, englishPool, universalEmbedUrl))
            .filter((s) => s.proxyUrl);

          if (streams.length === 0) return null;
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
        })
        .filter(Boolean);

      let allStreams = addonResults.flatMap((r) => r.streams);
      allStreams.sort(sortStreamsUniversal);

      if (allStreams.length === 0 && baseImdb) {
        const isSeries = type === 'series';
        const fallbackList = [
          {
            serverLabel: 'Videasy • Universal Cloud #1',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://player.videasy.to/tv/${baseImdb}/${epSeason}/${epNumber}` : `https://player.videasy.to/movie/${baseImdb}`
          },
          {
            serverLabel: 'AutoEmbed • Fast Cloud #2',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://player.autoembed.cc/embed/tv/${baseImdb}/${epSeason}/${epNumber}` : `https://player.autoembed.cc/embed/movie/${baseImdb}`
          },
          {
            serverLabel: 'VidSrc BR • Multiserver #3',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://vidsrc.sh/embed/tv?imdb=${baseImdb}&season=${epSeason}&episode=${epNumber}&ds_lang=pt` : `https://vidsrc.sh/embed/movie?imdb=${baseImdb}&ds_lang=pt`
          }
        ].map((s) => ({
          addonId: 'universal_cloud',
          addonName: 'Cloud Universal',
          addonBadge: 'CLOUD VIP',
          addonColor: '#a855f7',
          rawName: 'Cloud Universal',
          rawTitle: s.serverLabel,
          is4k: false,
          isDub: true,
          seeds: null,
          directUrl: null,
          embedUrl: s.proxyUrl,
          ...s
        }));

        allStreams = fallbackList;
        addonResults.push({
          addonId: 'universal_cloud',
          addonName: 'Cloud Universal',
          badge: 'CLOUD VIP',
          color: '#a855f7',
          isEnglishOnly: false,
          count: fallbackList.length,
          streams: fallbackList
        });
      }

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
            ? await hlsProxied(rawUrl)
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
