// Force HTTPS SSL redirect for secure connection padlock
if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
  window.location.href = window.location.href.replace('http:', 'https:');
}

const ADDONS = {
  webplayer: { name: 'Player Web (HD)', baseUrl: '', icon: '🌐' },
  cinemeta: { name: 'Cinemeta', baseUrl: 'https://cinemeta-catalogs.strem.io' },
  micoleao: { name: 'Mico-Leão Dublado', baseUrl: 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club', icon: '🦁' }
};

// --- Helpers ---

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, { ...options, signal: controller.signal })
    .then(response => {
      clearTimeout(id);
      return response;
    })
    .catch(async (error) => {
      clearTimeout(id);
      if (url.includes('cinemeta-catalogs.strem.io')) {
        const altUrl = url.replace('cinemeta-catalogs.strem.io', 'v3-cinemeta.strem.io');
        const altRes = await fetch(altUrl).catch(() => null);
        if (altRes && altRes.ok) return altRes;
      }
      throw error;
    });
}

// --- Instant 0ms Local Cache System ---

const Cache = {
  get(key) {
    try {
      const item = localStorage.getItem('jf_cache_v50_' + key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      if (Date.now() - parsed.time < 15 * 60 * 1000) {
        return parsed.data;
      }
    } catch(e) {}
    return null;
  },
  set(key, data) {
    try {
      if (!data) return;
      localStorage.setItem('jf_cache_v50_' + key, JSON.stringify({
        time: Date.now(),
        data: data
      }));
    } catch(e) {}
  }
};

function getPosterUrl(meta) {
  if (!meta) return '';
  const cleanId = (meta.id || '').split(':')[0];
  return meta.poster || (cleanId ? `https://images.metahub.space/poster/medium/${cleanId}/img` : '');
}

function getBackgroundUrl(meta) {
  if (!meta) return '';
  const cleanId = (meta.id || '').split(':')[0];
  return meta.background || (cleanId ? `https://images.metahub.space/background/medium/${cleanId}/img` : '');
}

function openMagnet(infoHash, name) {
  const magnetUrl = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce&tr=wss://tracker.openwebtorrent.com`;
  try {
    window.open(magnetUrl, '_self');
  } catch(e) {
    console.error("Failed to open magnet link", e);
  }
  navigator.clipboard.writeText(magnetUrl).then(() => {
    alert("Magnet Link copiado para a área de transferência!");
  }).catch(() => {});
}



// --- Automatic Watch Progress Engine (No Account Required) ---

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const User = {
  getAllProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem('johnflix_progress') || '{}');
      const sanitized = {};
      Object.keys(raw).forEach(key => {
        const item = raw[key];
        if (!item) return;
        const cleanId = (item.id || key).split(':')[0];
        if (!cleanId || !cleanId.startsWith('tt')) return;

        let poster = item.poster;
        if (!poster || poster.includes(':') || poster === '') {
          poster = `https://images.metahub.space/poster/medium/${cleanId}/img`;
        }

        let name = item.name;
        if (!name || name === 'Vídeo' || name.startsWith('🇧🇷') || name.startsWith('🌐')) {
          name = item.title && !item.title.startsWith('🇧🇷') ? item.title : '';
        }

        sanitized[cleanId] = {
          ...item,
          id: cleanId,
          poster: poster,
          name: name || 'Filme / Série'
        };
      });
      return sanitized;
    } catch(e) { return {}; }
  },

  saveProgress(metaId, currentTime, duration, extra = {}) {
    if (!metaId || !currentTime || currentTime < 5) return;
    const cleanId = (metaId || '').split(':')[0];
    const progressMap = this.getAllProgress();
    
    let posterUrl = extra.poster || '';
    let itemTitle = extra.name || extra.title || '';
    let itemType = extra.type || (state.currentMeta ? state.currentMeta.type : null) || ((extra.season && extra.season > 1) ? 'series' : (state.currentType === 'series' ? 'series' : 'movie'));

    if (state.currentMeta) {
      const metaCleanId = (state.currentMeta.id || '').split(':')[0];
      if (metaCleanId === cleanId) {
        if (!posterUrl) posterUrl = getPosterUrl(state.currentMeta);
        if (!itemTitle || itemTitle.startsWith('🇧🇷') || itemTitle.startsWith('🌐')) {
          itemTitle = state.currentMeta.name;
        }
        itemType = state.currentMeta.type || itemType;
      }
    }

    if (!posterUrl && cleanId) {
      posterUrl = `https://images.metahub.space/poster/medium/${cleanId}/img`;
    }

    const existing = progressMap[cleanId] || {};

    progressMap[cleanId] = {
      id: cleanId,
      name: itemTitle || existing.name || (state.currentMeta ? state.currentMeta.name : 'Filme / Série'),
      poster: posterUrl || existing.poster || `https://images.metahub.space/poster/medium/${cleanId}/img`,
      type: itemType || existing.type || 'movie',
      currentTime: Math.floor(currentTime),
      duration: Math.floor(duration || 0),
      percentage: duration > 0 ? Math.min(100, Math.floor((currentTime / duration) * 100)) : 0,
      season: extra.season || state.currentSeason || 1,
      episode: extra.episode || state.currentEpisode || 1,
      updatedAt: Date.now()
    };
    
    localStorage.setItem('johnflix_progress', JSON.stringify(progressMap));
  },

  getProgress(metaId) {
    if (!metaId) return null;
    const cleanId = metaId.split(':')[0];
    const progressMap = this.getAllProgress();
    return progressMap[cleanId] || progressMap[metaId] || null;
  },

  removeProgress(metaId) {
    if (!metaId) return;
    const cleanId = metaId.split(':')[0];
    const progressMap = this.getAllProgress();
    delete progressMap[cleanId];
    delete progressMap[metaId];
    localStorage.setItem('johnflix_progress', JSON.stringify(progressMap));
  },

  clearAllProgress() {
    localStorage.removeItem('johnflix_progress');
  },

  getWatchlist() {
    try {
      const raw = JSON.parse(localStorage.getItem('johnflix_watchlist') || '{}');
      const sanitized = {};
      Object.keys(raw).forEach(key => {
        const item = raw[key];
        if (!item) return;
        const cleanId = (item.id || key).split(':')[0];
        if (!cleanId || !cleanId.startsWith('tt')) return;

        let poster = item.poster;
        if (!poster || poster.includes(':') || poster === '') {
          poster = `https://images.metahub.space/poster/medium/${cleanId}/img`;
        }

        sanitized[cleanId] = {
          ...item,
          id: cleanId,
          poster: poster,
          name: item.name && item.name !== 'Vídeo' ? item.name : 'Filme / Série'
        };
      });
      return sanitized;
    } catch(e) { return {}; }
  },

  isInWatchlist(metaId) {
    if (!metaId) return false;
    const cleanId = metaId.split(':')[0];
    const watchlist = this.getWatchlist();
    return !!watchlist[cleanId];
  },

  toggleWatchlist(meta) {
    if (!meta || !meta.id) return false;
    const cleanId = meta.id.split(':')[0];
    const watchlist = this.getWatchlist();

    if (watchlist[cleanId]) {
      delete watchlist[cleanId];
      localStorage.setItem('johnflix_watchlist', JSON.stringify(watchlist));
      return false;
    } else {
      const posterUrl = getPosterUrl(meta) || `https://images.metahub.space/poster/medium/${cleanId}/img`;
      watchlist[cleanId] = {
        id: cleanId,
        name: meta.name || 'Filme / Série',
        poster: posterUrl,
        type: meta.type || (state.currentType === 'series' ? 'series' : 'movie'),
        year: meta.year || meta.releaseInfo || '',
        imdbRating: meta.imdbRating || '',
        addedAt: Date.now()
      };
      localStorage.setItem('johnflix_watchlist', JSON.stringify(watchlist));
      return true;
    }
  }
};

// --- State Management ---

const state = {
  currentType: 'all', // 'all', 'movie', 'series', or 'watchlist'
  currentGenre: '',
  currentMeta: null,
  currentLang: 'dublado', // 'dublado', 'legendado', 'original'
  currentSeason: 1,
  currentEpisode: 1,
  catalogs: {
    popular: [],
    featured: []
  },
  isLoading: false,
  heroMeta: null,
  isPlayerActive: false,
  autoPlaySessionId: 0
};

// --- Seção Cinema: Grandes Sagas e Trilogias em Ordem Cronológica ---

const CINEMA_SAGAS = [
  {
    id: 'spiderman',
    title: '🕷️ Saga Homem-Aranha (Do Clássico ao Aranhaverso)',
    description: 'Acompanhe a trajetória de Peter Parker e Miles Morales através das três eras e do multiverso.',
    accent: '#ef4444',
    items: [
      { id: 'tt0145487', name: 'Homem-Aranha', year: '2002', timeline: '1º Filme (Tobey)', type: 'movie' },
      { id: 'tt0316654', name: 'Homem-Aranha 2', year: '2004', timeline: '2º Filme (Tobey)', type: 'movie' },
      { id: 'tt0413300', name: 'Homem-Aranha 3', year: '2007', timeline: '3º Filme (Tobey)', type: 'movie' },
      { id: 'tt0948470', name: 'O Espetacular Homem-Aranha', year: '2012', timeline: '1º Filme (Andrew)', type: 'movie' },
      { id: 'tt1872181', name: 'O Espetacular Homem-Aranha 2', year: '2014', timeline: '2º Filme (Andrew)', type: 'movie' },
      { id: 'tt2250912', name: 'Homem-Aranha: De Volta ao Lar', year: '2017', timeline: '1º MCU (Tom Holland)', type: 'movie' },
      { id: 'tt4633694', name: 'Homem-Aranha no Aranhaverso', year: '2018', timeline: 'Aranhaverso 1', type: 'movie' },
      { id: 'tt6320628', name: 'Homem-Aranha: Longe de Casa', year: '2019', timeline: '2º MCU (Tom Holland)', type: 'movie' },
      { id: 'tt10872600', name: 'Homem-Aranha: Sem Volta para Casa', year: '2021', timeline: '3º MCU (Multiverso)', type: 'movie' },
      { id: 'tt9362722', name: 'Homem-Aranha: Através do Aranhaverso', year: '2023', timeline: 'Aranhaverso 2', type: 'movie' }
    ]
  },
  {
    id: 'mcu',
    title: '⚡ Marvel Cinematic Universe (MCU - Ordem Cronológica da Linha do Tempo)',
    description: 'A ordem oficial em que os acontecimentos ocorrem dentro do Universo Marvel.',
    accent: '#e11d48',
    items: [
      { id: 'tt0458339', name: 'Capitão América: O Primeiro Vingador', year: '2011', timeline: '1942 - Segunda Guerra', type: 'movie' },
      { id: 'tt4154664', name: 'Capitã Marvel', year: '2019', timeline: '1995 - Origem dos Vingadores', type: 'movie' },
      { id: 'tt0371746', name: 'Homem de Ferro', year: '2008', timeline: '2008 - O Início da Era dos Heróis', type: 'movie' },
      { id: 'tt1228705', name: 'Homem de Ferro 2', year: '2010', timeline: '2010', type: 'movie' },
      { id: 'tt0800080', name: 'O Incrível Hulk', year: '2008', timeline: '2010', type: 'movie' },
      { id: 'tt0800369', name: 'Thor', year: '2011', timeline: '2011', type: 'movie' },
      { id: 'tt0848228', name: 'Os Vingadores', year: '2012', timeline: '2012 - Batalha de NY', type: 'movie' },
      { id: 'tt1300854', name: 'Homem de Ferro 3', year: '2013', timeline: '2012', type: 'movie' },
      { id: 'tt1981109', name: 'Thor: O Mundo Sombrio', year: '2013', timeline: '2013', type: 'movie' },
      { id: 'tt1843866', name: 'Capitão América: O Soldado Invernal', year: '2014', timeline: '2014 - Queda da S.H.I.E.L.D.', type: 'movie' },
      { id: 'tt2015381', name: 'Guardiões da Galáxia', year: '2014', timeline: '2014 - No Espaço', type: 'movie' },
      { id: 'tt3896198', name: 'Guardiões da Galáxia Vol. 2', year: '2017', timeline: '2014 - No Espaço', type: 'movie' },
      { id: 'tt2395427', name: 'Vingadores: Era de Ultron', year: '2015', timeline: '2015 - Batalha de Sokóvia', type: 'movie' },
      { id: 'tt0478970', name: 'Homem-Formiga', year: '2015', timeline: '2015', type: 'movie' },
      { id: 'tt3498820', name: 'Capitão América: Guerra Civil', year: '2016', timeline: '2016 - Divisão dos Heróis', type: 'movie' },
      { id: 'tt3480822', name: 'Viúva Negra', year: '2021', timeline: '2016 - Pós-Guerra Civil', type: 'movie' },
      { id: 'tt1825683', name: 'Pantera Negra', year: '2018', timeline: '2016 - Em Wakanda', type: 'movie' },
      { id: 'tt1211837', name: 'Doutor Estranho', year: '2016', timeline: '2016 - Mestre das Artes Místicas', type: 'movie' },
      { id: 'tt3501632', name: 'Thor: Ragnarok', year: '2017', timeline: '2017 - Destruição de Asgard', type: 'movie' },
      { id: 'tt5095030', name: 'Homem-Formiga e a Vespa', year: '2018', timeline: '2018 - Reino Quântico', type: 'movie' },
      { id: 'tt4154756', name: 'Vingadores: Guerra Infinita', year: '2018', timeline: '2018 - O Estalo de Thanos', type: 'movie' },
      { id: 'tt4154796', name: 'Vingadores: Ultimato', year: '2019', timeline: '2018 a 2023 - O Fim de Uma Era', type: 'movie' },
      { id: 'tt6320628', name: 'Homem-Aranha: Longe de Casa', year: '2019', timeline: '2024 - Pós-Blip', type: 'movie' },
      { id: 'tt10872600', name: 'Homem-Aranha: Sem Volta para Casa', year: '2021', timeline: '2024 - Abertura do Multiverso', type: 'movie' },
      { id: 'tt9419884', name: 'Doutor Estranho no Multiverso da Loucura', year: '2022', timeline: '2024', type: 'movie' },
      { id: 'tt10648342', name: 'Thor: Amor e Trovão', year: '2022', timeline: '2024', type: 'movie' },
      { id: 'tt9114286', name: 'Pantera Negra: Wakanda Para Sempre', year: '2022', timeline: '2025', type: 'movie' },
      { id: 'tt6791350', name: 'Guardiões da Galáxia Vol. 3', year: '2023', timeline: '2026', type: 'movie' },
      { id: 'tt6263850', name: 'Deadpool & Wolverine', year: '2024', timeline: '2024 - Linha Temporal Sagrada', type: 'movie' }
    ]
  },
  {
    id: 'dc',
    title: '🦇 DC Universe & Trilogia do Cavaleiro das Trevas',
    description: 'As grandes obras da DC: de Batman de Christopher Nolan à Liga da Justiça de Zack Snyder.',
    accent: '#3b82f6',
    items: [
      { id: 'tt0372784', name: 'Batman Begins', year: '2005', timeline: 'Trilogia Nolan 1', type: 'movie' },
      { id: 'tt0468569', name: 'Batman: O Cavaleiro das Trevas', year: '2008', timeline: 'Trilogia Nolan 2', type: 'movie' },
      { id: 'tt1345836', name: 'Batman: O Cavaleiro das Trevas Ressurge', year: '2012', timeline: 'Trilogia Nolan 3', type: 'movie' },
      { id: 'tt0770828', name: 'O Homem de Aço', year: '2013', timeline: 'DCEU 1 (Superman)', type: 'movie' },
      { id: 'tt2975590', name: 'Batman vs Superman: A Origem da Justiça', year: '2016', timeline: 'DCEU 2', type: 'movie' },
      { id: 'tt0451279', name: 'Mulher-Maravilha', year: '2017', timeline: 'DCEU 3 (1918)', type: 'movie' },
      { id: 'tt12361974', name: 'Liga da Justiça de Zack Snyder', year: '2021', timeline: 'DCEU 4 (Versão Definitiva)', type: 'movie' },
      { id: 'tt1477834', name: 'Aquaman', year: '2018', timeline: 'DCEU 5', type: 'movie' },
      { id: 'tt0448115', name: 'Shazam!', year: '2019', timeline: 'DCEU 6', type: 'movie' },
      { id: 'tt7286456', name: 'Coringa', year: '2019', timeline: 'Elseworlds (Joaquin Phoenix)', type: 'movie' },
      { id: 'tt6334354', name: 'O Esquadrão Suicida', year: '2021', timeline: 'DCEU (James Gunn)', type: 'movie' },
      { id: 'tt1877830', name: 'The Batman', year: '2022', timeline: 'Elseworlds (Robert Pattinson)', type: 'movie' },
      { id: 'tt0439572', name: 'The Flash', year: '2023', timeline: 'DCEU (Ponto de Ignição)', type: 'movie' }
    ]
  },
  {
    id: 'starwars',
    title: '⭐ Star Wars (Ordem Cronológica da Linha do Tempo Galáctica)',
    description: 'Da queda da República à ascensão dos Skywalker, na sequência canônica da galáxia.',
    accent: '#eab308',
    items: [
      { id: 'tt0120915', name: 'Star Wars: Ep. I - A Ameaça Fantasma', year: '1999', timeline: '32 ABY (Origem de Anakin)', type: 'movie' },
      { id: 'tt0121765', name: 'Star Wars: Ep. II - Ataque dos Clones', year: '2002', timeline: '22 ABY (Guerra dos Clones)', type: 'movie' },
      { id: 'tt0121766', name: 'Star Wars: Ep. III - A Vingança dos Sith', year: '2005', timeline: '19 ABY (Nascimento de Vader)', type: 'movie' },
      { id: 'tt3778644', name: 'Han Solo: Uma História Star Wars', year: '2018', timeline: '10 ABY (Juventude de Solo)', type: 'movie' },
      { id: 'tt3748528', name: 'Rogue One: Uma História Star Wars', year: '2016', timeline: '0 ABY (Roubo da Estrela da Morte)', type: 'movie' },
      { id: 'tt0076759', name: 'Star Wars: Ep. IV - Uma Nova Esperança', year: '1977', timeline: '0 DBY (Trilogia Clássica 1)', type: 'movie' },
      { id: 'tt0080684', name: 'Star Wars: Ep. V - O Império Contra-Ataca', year: '1980', timeline: '3 DBY (Trilogia Clássica 2)', type: 'movie' },
      { id: 'tt0086190', name: 'Star Wars: Ep. VI - O Retorno de Jedi', year: '1983', timeline: '4 DBY (Trilogia Clássica 3)', type: 'movie' },
      { id: 'tt2488496', name: 'Star Wars: Ep. VII - O Despertar da Força', year: '2015', timeline: '34 DBY (Trilogia Nova 1)', type: 'movie' },
      { id: 'tt2527338', name: 'Star Wars: Ep. VIII - Os Últimos Jedi', year: '2017', timeline: '34 DBY (Trilogia Nova 2)', type: 'movie' },
      { id: 'tt2527336', name: 'Star Wars: Ep. IX - A Ascensão Skywalker', year: '2019', timeline: '35 DBY (Fim da Saga)', type: 'movie' }
    ]
  },
  {
    id: 'harrypotter',
    title: '🧙‍♂️ Harry Potter & Mundo Bruxo (Ordem Cronológica Completa)',
    description: 'De Nova York dos anos 1920 até a Batalha de Hogwarts e a queda de Voldemort.',
    accent: '#a855f7',
    items: [
      { id: 'tt3183660', name: 'Animais Fantásticos e Onde Habitam', year: '2016', timeline: '1926 (Newt Scamander)', type: 'movie' },
      { id: 'tt4123430', name: 'Animais Fantásticos: Os Crimes de Grindelwald', year: '2018', timeline: '1927', type: 'movie' },
      { id: 'tt4123432', name: 'Animais Fantásticos: Os Segredos de Dumbledore', year: '2022', timeline: '1932 (Guerra Bruxa)', type: 'movie' },
      { id: 'tt0241527', name: 'Harry Potter e a Pedra Filosofal', year: '2001', timeline: '1991 (1º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0295297', name: 'Harry Potter e a Câmara Secreta', year: '2002', timeline: '1992 (2º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0304141', name: 'Harry Potter e o Prisioneiro de Azkaban', year: '2004', timeline: '1993 (3º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0330373', name: 'Harry Potter e o Cálice de Fogo', year: '2005', timeline: '1994 (Torneio Tribruxo)', type: 'movie' },
      { id: 'tt0373889', name: 'Harry Potter e a微Ordem da Fênix', year: '2007', timeline: '1995 (5º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0417741', name: 'Harry Potter e o Enigma do Príncipe', year: '2009', timeline: '1996 (6º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0926084', name: 'Harry Potter e as Relíquias da Morte - Parte 1', year: '2010', timeline: '1997 (Em Busca das Horcruxes)', type: 'movie' },
      { id: 'tt1201607', name: 'Harry Potter e as Relíquias da Morte - Parte 2', year: '2011', timeline: '1998 (Batalha de Hogwarts)', type: 'movie' }
    ]
  },
  {
    id: 'lotr',
    title: '💍 O Senhor dos Anéis & O Hobbit (Terra-Média)',
    description: 'A jornada de Bilbo e Frodo Bolseiro na criação e destruição do Um Anel.',
    accent: '#f59e0b',
    items: [
      { id: 'tt0903624', name: 'O Hobbit: Uma Jornada Inesperada', year: '2012', timeline: 'O Hobbit Parte 1', type: 'movie' },
      { id: 'tt1170358', name: 'O Hobbit: A Desolação de Smaug', year: '2013', timeline: 'O Hobbit Parte 2', type: 'movie' },
      { id: 'tt2310332', name: 'O Hobbit: A Batalha dos Cinco Exércitos', year: '2014', timeline: 'O Hobbit Parte 3', type: 'movie' },
      { id: 'tt0120737', name: 'O Senhor dos Anéis: A Sociedade do Anel', year: '2001', timeline: 'SDA Parte 1', type: 'movie' },
      { id: 'tt0167261', name: 'O Senhor dos Anéis: As Duas Torres', year: '2002', timeline: 'SDA Parte 2', type: 'movie' },
      { id: 'tt0167260', name: 'O Senhor dos Anéis: O Retorno do Rei', year: '2003', timeline: 'SDA Parte 3 (O Fim de Sauron)', type: 'movie' }
    ]
  },
  {
    id: 'fast',
    title: '🚗 Velozes e Furiosos (Saga Completa em Ordem Cronológica)',
    description: 'A evolução de rachas de rua em Los Angeles para missões globais de espionagem.',
    accent: '#06b6d4',
    items: [
      { id: 'tt0232500', name: 'Velozes e Furiosos', year: '2001', timeline: '1º Filme', type: 'movie' },
      { id: 'tt0322259', name: '+ Velozes + Furiosos', year: '2003', timeline: '2º Filme (Miami)', type: 'movie' },
      { id: 'tt1013752', name: 'Velozes e Furiosos 4', year: '2009', timeline: '3º na Cronologia', type: 'movie' },
      { id: 'tt1596343', name: 'Velozes e Furiosos 5: Operação Rio', year: '2011', timeline: '4º na Cronologia (Rio)', type: 'movie' },
      { id: 'tt1905041', name: 'Velozes e Furiosos 6', year: '2013', timeline: '5º na Cronologia', type: 'movie' },
      { id: 'tt0463985', name: 'Velozes e Furiosos: Desafio em Tóquio', year: '2006', timeline: '6º na Cronologia (Tóquio)', type: 'movie' },
      { id: 'tt2820852', name: 'Velozes e Furiosos 7', year: '2015', timeline: '7º Filme (Homenagem a Paul)', type: 'movie' },
      { id: 'tt4630562', name: 'Velozes e Furiosos 8', year: '2017', timeline: '8º Filme', type: 'movie' },
      { id: 'tt6806448', name: 'Velozes e Furiosos: Hobbs & Shaw', year: '2019', timeline: 'Spin-off', type: 'movie' },
      { id: 'tt5433118', name: 'Velozes e Furiosos 9', year: '2021', timeline: '9º Filme', type: 'movie' },
      { id: 'tt5433122', name: 'Velozes e Furiosos 10', year: '2023', timeline: '10º Filme', type: 'movie' }
    ]
  },
  {
    id: 'johnwick',
    title: '🥋 John Wick (Saga Baba Yaga)',
    description: 'Os 4 capítulos da saga de vingança e honra de John Wick na Alta Cúpula.',
    accent: '#10b981',
    items: [
      { id: 'tt2911666', name: 'John Wick: De Volta ao Jogo', year: '2014', timeline: 'Capítulo 1', type: 'movie' },
      { id: 'tt4425200', name: 'John Wick: Um Novo Dia Para Matar', year: '2017', timeline: 'Capítulo 2', type: 'movie' },
      { id: 'tt6146586', name: 'John Wick 3: Parabellum', year: '2019', timeline: 'Capítulo 3', type: 'movie' },
      { id: 'tt10366206', name: 'John Wick 4: Baba Yaga', year: '2023', timeline: 'Capítulo 4 (Final Épico)', type: 'movie' }
    ]
  },
  {
    id: 'jurassic',
    title: '🦖 Jurassic Park & Jurassic World (A Era dos Dinossauros)',
    description: 'Do clássico de Steven Spielberg em Isla Nublar ao domínio global dos dinossauros.',
    accent: '#84cc16',
    items: [
      { id: 'tt0107290', name: 'Jurassic Park: O Parque dos Dinossauros', year: '1993', timeline: '1º Parque (Clássico)', type: 'movie' },
      { id: 'tt0119864', name: 'O Mundo Perdido: Jurassic Park', year: '1997', timeline: '2º Filme', type: 'movie' },
      { id: 'tt0163025', name: 'Jurassic Park III', year: '2001', timeline: '3º Filme', type: 'movie' },
      { id: 'tt369610', name: 'Jurassic World: O Mundo dos Dinossauros', year: '2015', timeline: 'Jurassic World 1', type: 'movie' },
      { id: 'tt4881806', name: 'Jurassic World: Reino Ameaçado', year: '2018', timeline: 'Jurassic World 2', type: 'movie' },
      { id: 'tt8036722', name: 'Jurassic World: Domínio', year: '2022', timeline: 'Jurassic World 3', type: 'movie' }
    ]
  },
  {
    id: 'apes_dune',
    title: '🪐 Planeta dos Macacos & Duna (Ficção Científica Épica)',
    description: 'A tetralogia de César e a saga de Paul Atreides em Arrakis.',
    accent: '#f97316',
    items: [
      { id: 'tt1318514', name: 'Planeta dos Macacos: A Origem', year: '2011', timeline: 'Origem de César', type: 'movie' },
      { id: 'tt2103281', name: 'Planeta dos Macacos: O Confronto', year: '2014', timeline: 'A Ascensão dos Símios', type: 'movie' },
      { id: 'tt3450958', name: 'Planeta dos Macacos: A Guerra', year: '2017', timeline: 'A Batalha Final', type: 'movie' },
      { id: 'tt11384580', name: 'Planeta dos Macacos: O Reinado', year: '2024', timeline: 'Gerações Futuras', type: 'movie' },
      { id: 'tt1160419', name: 'Duna: Parte 1', year: '2021', timeline: 'Duna Livro 1 - Ato 1', type: 'movie' },
      { id: 'tt15239678', name: 'Duna: Parte 2', year: '2024', timeline: 'Duna Livro 1 - Ato 2', type: 'movie' }
    ]
  }
];

// --- API Module ---

const API = {
  async fetchCatalog(type, catalogId, extra = {}) {
    try {
      let url = '';
      const genreParam = extra.genre;

      // Handle custom Anime genre query
      if (genreParam === 'Anime') {
        const terms = ['naruto', 'attack on titan', 'one piece', 'demon slayer', 'jujutsu kaisen', 'solo leveling', 'my hero academia', 'dragon ball', 'death note', 'chainsaw man', 'bleach', 'hunter x hunter', 'spy x family', 'tokyo ghoul'];
        const results = await Promise.all(terms.slice(0, 8).map(q => 
          fetchWithTimeout(`https://v3-cinemeta.strem.io/catalog/${type === 'movie' ? 'movie' : 'series'}/top/search=${encodeURIComponent(q)}.json`)
            .then(r => r.json())
            .then(d => (d.metas || []))
            .catch(() => [])
        ));
        const merged = results.flat().filter((item, idx, self) => self.findIndex(t => t.id === item.id) === idx);
        if (merged.length > 0) return merged;
      }

      // Handle dynamic Saga queries (Marvel, DC, Star Wars, Harry Potter, Spider-Man, etc.)
      const SAGA_TERMS = {
        'Saga: Marvel MCU': ['marvel', 'avengers', 'iron man', 'captain america', 'thor', 'guardians of the galaxy', 'deadpool & wolverine'],
        'Saga: DC Universe': ['batman', 'superman', 'justice league', 'wonder woman', 'aquaman', 'the flash', 'joker'],
        'Saga: Star Wars': ['star wars', 'mandalorian', 'rogue one', 'han solo'],
        'Saga: Harry Potter': ['harry potter', 'fantastic beasts', 'dumbledore'],
        'Saga: Homem-Aranha': ['spider-man', 'spider-verse', 'homem-aranha', 'venom'],
        'Saga: Senhor dos Anéis': ['lord of the rings', 'hobbit', 'senhor dos aneis', 'rings of power'],
        'Saga: Velozes e Furiosos': ['fast and furious', 'velozes e furiosos', 'hobbs and shaw'],
        'Saga: John Wick': ['john wick', 'ballerina'],
        'Saga: Jurassic Park': ['jurassic park', 'jurassic world'],
        'Saga: Transformers': ['transformers', 'bumblebee', 'rise of the beasts'],
        'Saga: Missão Impossível': ['mission impossible', 'missao impossivel'],
        'Saga: Piratas do Caribe': ['pirates of the caribbean', 'piratas do caribe']
      };

      if (genreParam && SAGA_TERMS[genreParam]) {
        const terms = SAGA_TERMS[genreParam];
        const results = await Promise.all(terms.map(q => 
          fetchWithTimeout(`https://v3-cinemeta.strem.io/catalog/${type === 'movie' ? 'movie' : 'series'}/top/search=${encodeURIComponent(q)}.json`)
            .then(r => r.json())
            .then(d => (d.metas || []))
            .catch(() => [])
        ));
        const merged = results.flat().filter((item, idx, self) => self.findIndex(t => t.id === item.id) === idx);
        // Automatic chronological ordering by release year:
        merged.sort((a, b) => (parseInt(a.year || a.releaseInfo, 10) || 0) - (parseInt(b.year || b.releaseInfo, 10) || 0));
        if (merged.length > 0) return merged;
      }

      if (extra.search) {
        url = `https://v3-cinemeta.strem.io/catalog/${type}/top/search=${encodeURIComponent(extra.search)}.json`;
      } else if (catalogId === 'imdbRating') {
        url = `https://cinemeta-catalogs.strem.io/imdbRating/catalog/${type}/imdbRating`;
        if (genreParam) url += `/genre=${encodeURIComponent(genreParam)}`;
        if (extra.skip) url += `/skip=${extra.skip}`;
        url += '.json';
      } else {
        url = `https://cinemeta-catalogs.strem.io/top/catalog/${type}/top`;
        if (genreParam) url += `/genre=${encodeURIComponent(genreParam)}`;
        if (extra.skip) url += `/skip=${extra.skip}`;
        url += '.json';
      }
      
      const res = await fetchWithTimeout(url);
      const data = await res.json();
      return data.metas || [];
    } catch (error) {
      console.error('Error fetching catalog:', error);
      return [];
    }
  },
  
  async fetchMeta(type, id) {
    try {
      const cleanId = (id || '').split(':')[0];
      const reqType = (type === 'all' || type === 'watchlist' || !type) ? 'movie' : type;
      
      let url = `https://v3-cinemeta.strem.io/meta/${reqType}/${cleanId}.json`;
      let res = await fetchWithTimeout(url).catch(() => null);
      let data = res ? await res.json().catch(() => null) : null;
      
      if (data && data.meta) {
        return data.meta;
      }
      
      // Fallback: If requested type was 'movie' (or 'all'), try 'series'
      const altType = reqType === 'movie' ? 'series' : 'movie';
      url = `https://v3-cinemeta.strem.io/meta/${altType}/${cleanId}.json`;
      res = await fetchWithTimeout(url).catch(() => null);
      data = res ? await res.json().catch(() => null) : null;
      
      if (data && data.meta) {
        return data.meta;
      }

      // Fallback to local catalog items if Cinemeta network is down
      const allItems = [...(state.catalogs.popular || []), ...(state.catalogs.featured || [])];
      const localItem = allItems.find(x => x && x.id === cleanId);
      if (localItem) {
        return {
          id: localItem.id,
          type: localItem.type || 'movie',
          name: localItem.name || 'Título',
          poster: localItem.poster,
          background: localItem.background,
          description: localItem.description || '',
          year: localItem.year || '',
          imdbRating: localItem.imdbRating || ''
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching meta:', error);
      return null;
    }
  },
  
  async fetchStreams(type, id, season = 1, episode = 1) {
    try {
      const cleanId = (id || '').split(':')[0];
      const realType = (type === 'all' || !type) 
        ? (state.currentMeta?.type || (id?.includes(':') ? 'series' : 'movie')) 
        : type;

      const streamId = realType === 'series' ? `${cleanId}:${season}:${episode}` : cleanId;
      const cacheKey = `st_v11_${streamId}`;
      const cached = Cache.get(cacheKey);
      if (cached && cached.length > 0) return cached;

      // 1. Generate Instant Web Embed Streams (0ms delay)
      const isMovie = realType === 'movie';
      const warezLink = isMovie 
        ? `https://warezcdn.link/embed/filme/${cleanId}?autoplay=1`
        : `https://warezcdn.link/embed/serie/${cleanId}/${season}/${episode}?autoplay=1`;

      const superflixUrl = isMovie
        ? `https://superflixapi.top/filme/${cleanId}`
        : `https://superflixapi.top/serie/${cleanId}/${season}/${episode}`;

      const embedflixUrl = isMovie
        ? `https://embedflix.net/filme/${cleanId}`
        : `https://embedflix.net/serie/${cleanId}/${season}/${episode}`;

      const megaflixUrl = isMovie
        ? `https://megaflix.cx/embed/filme/${cleanId}`
        : `https://megaflix.cx/embed/serie/${cleanId}/${season}/${episode}`;

      const vidsrcDubUrl = isMovie 
        ? `https://vidsrc.me/embed/movie?imdb=${cleanId}&ds_lang=pt&autoplay=1` 
        : `https://vidsrc.me/embed/tv?imdb=${cleanId}&season=${season}&episode=${episode}&ds_lang=pt&autoplay=1`;

      const primecineUrl = isMovie
        ? `https://primecine.top/embed/filme/${cleanId}`
        : `https://primecine.top/embed/serie/${cleanId}/${season}/${episode}`;

      const flixapiUrl = isMovie
        ? `https://flixapi.org/embed/filme/${cleanId}`
        : `https://flixapi.org/embed/serie/${cleanId}/${season}/${episode}`;

      const autoembedUrl = isMovie
        ? `https://player.autoembed.cc/embed/movie/${cleanId}`
        : `https://player.autoembed.cc/embed/tv/${cleanId}/${season}/${episode}`;

      const vidsrc4kUrl = isMovie 
        ? `https://vidsrc.me/embed/movie?imdb=${cleanId}&autoplay=1` 
        : `https://vidsrc.me/embed/tv?imdb=${cleanId}&season=${season}&episode=${episode}&autoplay=1`;

      const vidsrcEnUrl = isMovie
        ? `https://vidsrc.in/embed/movie/${cleanId}`
        : `https://vidsrc.in/embed/tv/${cleanId}/${season}/${episode}`;

      const instantWebStreams = [
        {
          name: '✨ VidSrc Ultra (Áudio Original / Inglês 🇺🇸)',
          title: 'Servidor Inglês / Áudio Original',
          embedUrl: vidsrc4kUrl,
          isDub: false,
          category: 'web',
          score: 50
        },
        {
          name: '🌐 Player Web VidSrc (English 🇺🇸)',
          title: 'Servidor English Original Audio',
          embedUrl: vidsrcEnUrl,
          isDub: false,
          category: 'web',
          score: 35
        },
        {
          name: '🇧🇷 VidSrc PT-BR (Dublado / Dual)',
          title: 'Servidor PT-BR / Dual Áudio',
          embedUrl: vidsrcDubUrl,
          isDub: true,
          category: 'dubbed',
          score: 30
        }
      ];

      // Helper: fetch directly from Stremio addon APIs with 5s timeout
      const fetchAddon = async (baseUrl, timeoutMs = 5000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const directUrl = `${baseUrl}/stream/${realType}/${streamId}.json`;
          const res = await fetch(directUrl, { 
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            return data.streams || [];
          }
        } catch (e) {
          clearTimeout(timer);
        }
        return [];
      };

      const frostConfiguredUrl = 'https://froststream.cloutteam.com/providers.iptv=checked&providers.cdmoviedb=checked&providers.redeflix=checked&providers.tomato=checked&providers.myembed=checked&providers.anizone=checked';

      const [fenixRes, frostRes, frostConfigRes, brazucaRes] = await Promise.allSettled([
        fetchAddon('https://fenixflix.fenixhub.online'),
        fetchAddon('https://froststream.cloutteam.com'),
        fetchAddon(frostConfiguredUrl),
        fetchAddon('https://94c8cb9f702d-brazuca-torrents.baby-beamup.club')
      ]);

      const fenixStreams = fenixRes.status === 'fulfilled' ? fenixRes.value : [];
      const frostBaseStreams = frostRes.status === 'fulfilled' ? frostRes.value : [];
      const frostConfigStreams = frostConfigRes.status === 'fulfilled' ? frostConfigRes.value : [];
      const frostStreams = [...frostBaseStreams, ...frostConfigStreams];
      const brazucaStreams = brazucaRes.status === 'fulfilled' ? brazucaRes.value : [];

      const streamsList = [];

      // ══════════════════════════════════════════════
      // 🔥 FenixFlix — Direct MP4/CDN streams PT-BR & English (Player Nativo)
      // ══════════════════════════════════════════════
      const directVideoSources = [...fenixStreams, ...frostStreams.filter(s => s.url)];
      directVideoSources.forEach(s => {
        if (!s.url) return;

        const descRaw = (s.description || s.title || s.name || '').replace(/\n/g, ' ');
        const nameRaw = (s.name || 'FenixFlix HD');
        const combinedText = (nameRaw + ' ' + descRaw).toLowerCase();

        const isDub = combinedText.includes('dublado') || combinedText.includes('🇧🇷') || combinedText.includes('dual') || combinedText.includes('pt-br');
        const isEn = combinedText.includes('inglês') || combinedText.includes('english') || combinedText.includes('🇺🇸');

        const qualMatch = (nameRaw + ' ' + descRaw).match(/(4k|2160p|1080p|720p|480p)/i);
        const quality = qualMatch ? qualMatch[1].toUpperCase() : 'HD';

        const is4k = quality === '4K' || quality === '2160P';
        const qualScore = is4k ? 50 : quality === '1080P' ? 35 : quality === '720P' ? 20 : 10;

        streamsList.push({
          name: `🔥 ${isDub ? '🇧🇷 Dublado PT-BR' : '🇺🇸 Inglês / Dual'} — FenixFlix ${quality}`,
          title: `🔥 FenixFlix • ${descRaw.slice(0, 80) || (quality + ' Direct MP4')}`,
          url: s.url,
          isDub: isDub,
          category: 'fenix',
          score: qualScore + (is4k ? 20 : 0) + (isDub ? 30 : 10)
        });
      });

      // ══════════════════════════════════════════════
      // ❄️ FrostStream — Exclusivos Platinum e Titanium
      // ══════════════════════════════════════════════
      
      // 1. FrostStream Platinum Dublado PT-BR
      const frostPlatinumLink = isMovie 
        ? `https://vidsrc.me/embed/movie?imdb=${cleanId}&ds_lang=pt` 
        : `https://vidsrc.me/embed/tv?imdb=${cleanId}&season=${season}&episode=${episode}&ds_lang=pt`;

      streamsList.push({
        name: '✨ 🏆 🇧🇷 ❄️ FrostStream Platinum (Dublado PT-BR)',
        title: '❄️ FrostStream Platinum • Servidor Dublado Português BR',
        embedUrl: frostPlatinumLink,
        isDub: true,
        category: 'dubbed',
        score: 60
      });

      // 2. FrostStream Titanium Dublado PT-BR
      const frostTitaniumLink = isMovie 
        ? `https://autoembed.co/movie/imdb/${cleanId}`
        : `https://autoembed.co/tv/imdb/${cleanId}/${season}/${episode}`;

      streamsList.push({
        name: '🟢 ❄️ FrostStream Titanium (Servidor AutoEmbed PT-BR)',
        title: '❄️ FrostStream Titanium • Servidor AutoEmbed Dublado',
        embedUrl: frostTitaniumLink,
        isDub: true,
        category: 'dubbed',
        score: 55
      });

      // ══════════════════════════════════════════════
      // 🧲 Brazuca Torrents — Torrent PT-BR / Dual / English
      // ══════════════════════════════════════════════
      brazucaStreams.forEach(s => {
        const hash = s.infoHash;
        if (!hash) return;

        const titleRaw = (s.title || s.name || 'Brazuca HD').replace(/\n/g, ' ');
        const combinedText = titleRaw.toLowerCase();

        const isDub = combinedText.includes('dublado') || combinedText.includes('dual') || combinedText.includes('pt-br') || combinedText.includes('português');
        const isEn = combinedText.includes('inglês') || combinedText.includes('english') || combinedText.includes('original');

        const qualMatch = titleRaw.match(/(4k|2160p|1080p|720p|480p)/i);
        const quality = qualMatch ? qualMatch[1].toUpperCase() : 'HD';
        const is4k = quality === '4K' || quality === '2160P';

        const seederMatch = titleRaw.match(/👤\s*(\d+)/);
        const seeders = seederMatch ? parseInt(seederMatch[1], 10) : 0;

        const trackers = [
          'udp://tracker.opentrackr.org:1337/announce',
          'udp://open.stealth.si:80/announce',
          'udp://tracker.torrent.eu.org:451/announce',
          'udp://tracker.fnix.net:6969/announce',
          'udp://explodie.org:6969/announce',
          'udp://p2p.publictracker.xyz:6969/announce',
          ...(s.sources || []).filter(src => src.startsWith('tracker:')).map(src => src.replace('tracker:', ''))
        ];

        const filename = s.behaviorHints?.filename || titleRaw;
        const magnetUrl = `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(filename)}&${trackers.map(t => `tr=${encodeURIComponent(t)}`).join('&')}`;

        streamsList.push({
          name: `🧲 ${isDub ? '🇧🇷 Brazuca' : '🇺🇸 Brazuca English'} Torrent ${isDub ? '(Dual/Dub)' : isEn ? '(Inglês 🇺🇸)' : ''}`,
          title: `🇧🇷 Brazuca Torrents • ${titleRaw.slice(0, 100)}`,
          magnetUrl: magnetUrl,
          infoHash: hash,
          fileIdx: s.fileIdx,
          isDub: isDub,
          category: 'torrent',
          score: (is4k ? 45 : 0) + (seeders > 50 ? 15 : seeders > 10 ? 10 : 5) + (isEn ? 15 : 0) + (quality === '1080P' ? 10 : 5)
        });
      });



      // Append instant web embed streams
      streamsList.push(...instantWebStreams);

      // Sort all streams by score (highest 4K & Dublado PT-BR servers first)
      streamsList.sort((a, b) => (b.score || 0) - (a.score || 0));

      Cache.set(cacheKey, streamsList);
      return streamsList;
    } catch (error) {
      console.error('Error fetching streams:', error);
      return [];
    }
  },
  
  async searchContent(type, query) {
    if (type === 'all') {
      const [movs, sers] = await Promise.all([
        this.fetchCatalog('movie', 'top', { search: query }),
        this.fetchCatalog('series', 'top', { search: query })
      ]).catch(() => [[], []]);
      const map = new Map();
      (movs || []).forEach(m => { m.type = 'movie'; map.set(m.id, m); });
      (sers || []).forEach(s => { s.type = 'series'; map.set(s.id, s); });
      return Array.from(map.values());
    }
    return this.fetchCatalog(type, 'top', { search: query });
  }
};

// --- Subtitles Engine ---

const Subtitles = {
  cache: {},
  activeCues: [],
  currentLang: 'pob',
  syncOffset: 0,

  async fetchList(imdbId, type, season = 1, episode = 1, lang = 'pob') {
    const cleanId = (imdbId || '').replace('tt', '').padStart(7, '0');
    const cacheKey = `sub_${cleanId}_${type}_${season}_${episode}_${lang}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    let url = `https://rest.opensubtitles.org/search/imdbid-${cleanId}/sublanguageid-${lang}`;
    if (type === 'series') {
      url = `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanId}/season-${season}/sublanguageid-${lang}`;
    }

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        
        // Strict movie title & year filtering
        const movieName = state.currentMeta ? state.currentMeta.name : '';
        const movieYear = state.currentMeta ? state.currentMeta.year : '';
        const cleanTitle = (movieName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const filtered = list.filter(s => {
          if (!s.SubDownloadLink || (s.SubFormat !== 'srt' && s.SubFormat !== 'vtt')) return false;
          if (type === 'series') return true;
          const subName = ((s.MovieName || '') + ' ' + (s.SubFileName || '')).toLowerCase().replace(/[^a-z0-9]/g, '');
          const yearMatch = !movieYear || !s.MovieYear || s.MovieYear == movieYear;
          return (subName.includes(cleanTitle.slice(0, 10)) || cleanTitle.includes(subName.slice(0, 10))) && yearMatch;
        }).sort((a, b) => (parseInt(b.SubDownloadsCnt) || 0) - (parseInt(a.SubDownloadsCnt) || 0));

        const finalResult = filtered.length > 0 ? filtered : list;
        this.cache[cacheKey] = finalResult;
        return finalResult;
      }
    } catch(e) {}
    return [];
  },

  srtToVtt(srtText) {
    return 'WEBVTT\n\n' + srtText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
  },

  parseVttCues(vttText) {
    const lines = vttText.split('\n');
    const cues = [];
    let currentCue = null;

    const timeToSeconds = (tStr) => {
      const parts = (tStr || '').trim().split(':');
      if (parts.length === 3) {
        const secsParts = parts[2].split('.');
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(secsParts[0]) + (parseInt(secsParts[1] || '0') / 1000);
      }
      return 0;
    };

    const isSpamLine = (txt) => {
      const l = txt.toLowerCase();
      return l.includes('opensubtitles') || l.includes('getray.app') || l.includes('tryray.app') 
          || l.includes('osdb.link') || l.includes('legendas por') || l.includes('ansado de procurar')
          || l.includes('watch online movies');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('-->')) {
        const [start, end] = line.split('-->');
        currentCue = {
          start: timeToSeconds(start),
          end: timeToSeconds(end),
          text: ''
        };
      } else if (currentCue && line !== '' && !line.startsWith('WEBVTT') && isNaN(line)) {
        if (!isSpamLine(line)) {
          currentCue.text += (currentCue.text ? '\n' : '') + line;
        }
      } else if (currentCue && line === '') {
        if (currentCue.text.trim()) cues.push(currentCue);
        currentCue = null;
      }
    }
    if (currentCue && currentCue.text.trim()) cues.push(currentCue);
    return cues;
  },

  async applySubtitles(lang, imdbId, type, season, episode, chosenIndex = 0) {
    const overlay = document.getElementById('custom-subtitles-overlay');
    const subText = document.getElementById('custom-subtitles-text');
    const video = document.getElementById('video-player');

    this.currentLang = lang;
    this.activeCues = [];
    if (subText) subText.textContent = '';
    if (overlay) overlay.classList.add('hidden');

    if (lang === 'off') {
      if (video) {
        Array.from(video.querySelectorAll('track')).forEach(t => t.remove());
      }
      return;
    }

    const subs = await this.fetchList(imdbId, type, season, episode, lang);
    if (!subs || subs.length === 0) {
      if (lang === 'pob') {
        const enSubs = await this.fetchList(imdbId, type, season, episode, 'eng');
        if (enSubs && enSubs.length > 0) return this.downloadAndAttach(enSubs[0], video, 'English');
      }
      return;
    }

    const subObj = subs[chosenIndex] || subs[0];
    await this.downloadAndAttach(subObj, video, lang === 'pob' ? 'Português (BR)' : lang === 'eng' ? 'English' : 'Español');
    this.syncOverlay(video ? video.currentTime : 0);
  },

  async downloadAndAttach(subObj, video, langName) {
    if (!subObj || !subObj.SubDownloadLink) return;

    try {
      const dlUrl = subObj.SubDownloadLink;
      const res = await fetch(dlUrl, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
      if (!res.ok) return;

      const buffer = new Uint8Array(await res.arrayBuffer());
      let uint8Data = buffer;

      if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
        if (typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('gzip');
          const decompressedStream = new Response(buffer).body.pipeThrough(ds);
          uint8Data = new Uint8Array(await new Response(decompressedStream).arrayBuffer());
        }
      }

      let rawSrt = '';
      try {
        rawSrt = new TextDecoder('utf-8', { fatal: true }).decode(uint8Data);
      } catch(e) {
        rawSrt = new TextDecoder('iso-8859-1').decode(uint8Data);
      }

      if (!rawSrt || rawSrt.length === 0) return;

      const vtt = this.srtToVtt(rawSrt);
      this.activeCues = this.parseVttCues(vtt);

      if (video) {
        Array.from(video.querySelectorAll('track')).forEach(t => t.remove());
        const blob = new Blob([vtt], { type: 'text/vtt' });
        const blobUrl = URL.createObjectURL(blob);

        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = langName;
        track.srclang = subObj.SubLanguageID || 'pt';
        track.src = blobUrl;
        track.default = true;

        video.appendChild(track);
        if (video.textTracks && video.textTracks[0]) {
          video.textTracks[0].mode = 'hidden'; // Keep native track hidden to prevent duplicate subtitles!
        }
      }
    } catch(e) {
      console.error('Error applying subtitles:', e);
    }
  },

  syncOverlay(currentTime) {
    const overlay = document.getElementById('custom-subtitles-overlay');
    const subText = document.getElementById('custom-subtitles-text');

    if (this.currentLang === 'off' || !this.activeCues || this.activeCues.length === 0) {
      if (overlay) overlay.classList.add('hidden');
      return;
    }

    const adjustedTime = currentTime + (this.syncOffset || 0);
    const currentCue = this.activeCues.find(c => adjustedTime >= c.start && adjustedTime <= c.end);

    if (currentCue && currentCue.text) {
      if (subText) subText.innerText = currentCue.text;
      if (overlay) overlay.classList.remove('hidden');
    } else {
      if (overlay) overlay.classList.add('hidden');
    }
  }
};

// --- UI Module ---

const UI = {
  init() {
    this.bindEvents();
    this.loadInitialData();
  },
  
  bindEvents() {
    // Logo Click — Reset to Initial Home Tab (Like F5 / Home)
    document.querySelectorAll('.logo').forEach(logo => {
      logo.addEventListener('click', (e) => {
        e.preventDefault();

        // Reset state
        state.currentType = 'all';
        state.currentGenre = '';

        // Reset search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        this.hideSearchResults();

        // Reset genre dropdown
        const genreSelect = document.getElementById('genre-select');
        if (genreSelect) genreSelect.value = '';

        // Reset nav links active state to "Todos"
        document.querySelectorAll('[data-type]').forEach(b => {
          if (b.dataset.type === 'all') b.classList.add('active');
          else b.classList.remove('active');
        });

        // Close any active player or modal
        this.closePlayer();
        this.closeModal();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reload initial catalog home data
        this.loadInitialData();
      });
    });

    // Navigation (Desktop links + Mobile bottom bar)
    document.querySelectorAll('[data-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (!type) return;

        document.querySelectorAll('[data-type]').forEach(b => {
          if (b.dataset.type === type) b.classList.add('active');
          else b.classList.remove('active');
        });

        state.currentType = type;
        state.currentGenre = '';
        const genreSelect = document.getElementById('genre-select');
        if (genreSelect) genreSelect.value = '';

        const heroTypeName = document.getElementById('hero-type-name');
        if (heroTypeName) {
          heroTypeName.textContent = state.currentType === 'cinema' ? '🏛️ Seção Cinema' : (state.currentType === 'movie' ? 'Filmes' : (state.currentType === 'series' ? 'Séries' : 'Todos'));
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const searchInput = document.getElementById('search-input');
        const activeQuery = searchInput ? searchInput.value.trim() : '';

        if (activeQuery.length > 0) {
          this.performSearch(activeQuery);
        } else {
          this.hideSearchResults();
          this.loadInitialData();
        }
      });
    });

    // Search toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const mobileNavSearch = document.getElementById('mobile-nav-search');
    
    if (searchToggle) {
      searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
          searchInput.focus();
        }
      });
    }

    if (mobileNavSearch) {
      mobileNavSearch.addEventListener('click', () => {
        if (searchContainer) {
          searchContainer.classList.toggle('active');
          if (searchContainer.classList.contains('active') && searchInput) {
            searchInput.focus();
          }
        }
      });
    }
    
    // Search input (Instant 0ms local match + fast Cinemeta catalog fetch)
    if (searchInput) {
      const debouncedRemoteSearch = debounce((q) => this.performSearch(q), 100);

      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.trim().length === 0) {
          this.hideSearchResults();
        } else {
          debouncedRemoteSearch(val);
        }
      });
    }
    
    // Genre select
    const genreSelect = document.getElementById('genre-select');
    if (genreSelect) {
      genreSelect.addEventListener('change', (e) => {
        state.currentGenre = e.target.value;
        this.loadInitialData();
      });
    }

    // Global Home Language Select
    const homeLangSelect = document.getElementById('home-lang-select');
    if (homeLangSelect) {
      homeLangSelect.addEventListener('change', (e) => {
        state.homeLang = e.target.value;
        this.updateLanguage();
      });
    }

    // HUD Subtitle Selector
    const hudSubSelect = document.getElementById('hud-subtitle-select');
    if (hudSubSelect) {
      hudSubSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        if (state.currentMeta) {
          Subtitles.applySubtitles(
            lang, 
            state.currentMeta.id, 
            state.currentType, 
            state.currentSeason, 
            state.currentEpisode
          );
        }
      });
    }

    // HUD Subtitle Sync Adjustment Buttons
    document.getElementById('hud-sub-delay-minus')?.addEventListener('click', () => {
      Subtitles.syncOffset -= 1.0;
      const btn = document.getElementById('hud-sub-delay-reset');
      if (btn) btn.textContent = `${Subtitles.syncOffset > 0 ? '+' : ''}${Subtitles.syncOffset.toFixed(0)}s`;
    });

    document.getElementById('hud-sub-delay-reset')?.addEventListener('click', () => {
      Subtitles.syncOffset = 0;
      const btn = document.getElementById('hud-sub-delay-reset');
      if (btn) btn.textContent = '⚡0s';
    });

    document.getElementById('hud-sub-delay-plus')?.addEventListener('click', () => {
      Subtitles.syncOffset += 1.0;
      const btn = document.getElementById('hud-sub-delay-reset');
      if (btn) btn.textContent = `${Subtitles.syncOffset > 0 ? '+' : ''}${Subtitles.syncOffset.toFixed(0)}s`;
    });

    // Language selector
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.lang-btn[data-lang]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.currentLang = e.currentTarget.dataset.lang;
        if (state.currentMeta) {
          this.loadStreams();
        }
      });
    });

    // Season & Episode select for series
    const seasonSelect = document.getElementById('season-select');
    const episodeSelect = document.getElementById('episode-select');

    if (seasonSelect) {
      seasonSelect.addEventListener('change', (e) => {
        state.currentSeason = parseInt(e.target.value, 10) || 1;
        if (state.currentMeta) this.loadStreams();
      });
    }

    if (episodeSelect) {
      episodeSelect.addEventListener('change', (e) => {
        state.currentEpisode = parseInt(e.target.value, 10) || 1;
        if (state.currentMeta) this.loadStreams();
      });
    }
    
    // Watchlist Nav Links
    const showWatchlist = (e) => {
      if (e) e.preventDefault();
      this.hideSearchResults();
      const watchlistMap = User.getWatchlist();
      const watchlistArray = Object.values(watchlistMap);

      if (watchlistArray.length === 0) {
        alert('Sua lista de favoritos está vazia no momento! Adicione filmes e séries clicando no botão "⭐ + Minha Lista".');
        return;
      }

      this.renderCatalogs();

      setTimeout(() => {
        const watchlistSec = document.getElementById('watchlist-section');
        if (watchlistSec) {
          watchlistSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    };

    document.getElementById('nav-watchlist')?.addEventListener('click', showWatchlist);
    document.getElementById('mobile-nav-watchlist')?.addEventListener('click', showWatchlist);

    // Hero buttons & Auto-Play BR
    document.getElementById('hero-play-btn')?.addEventListener('click', async () => {
      if (state.heroMeta) {
        await this.openModal(state.heroMeta.id);
        this.autoPlayBestStream();
      }
    });

    document.getElementById('modal-auto-play-btn')?.addEventListener('click', () => {
      this.autoPlayBestStream();
    });
    
    document.getElementById('hero-info-btn')?.addEventListener('click', () => {
      if (state.heroMeta) this.openModal(state.heroMeta.id);
    });
    
    // Modal
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-overlay')?.addEventListener('click', () => this.closeModal());
    
    // Player close & Next source
    document.getElementById('player-close')?.addEventListener('click', () => this.closePlayer());
    document.getElementById('player-error-back')?.addEventListener('click', () => this.closePlayer());
    document.getElementById('player-error-next')?.addEventListener('click', () => this.playNextStream());
    
    // Custom Player HUD Controls
    this.setupHudControls();

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const playerOverlay = document.getElementById('player-overlay');
        if (playerOverlay && !playerOverlay.classList.contains('hidden')) {
          this.closePlayer();
        } else {
          this.closeModal();
        }
      }
    });
  },

  setupHudControls() {
    const video = document.getElementById('video-player');
    const playerOverlay = document.getElementById('player-overlay');
    const playerHud = document.getElementById('player-hud');
    const seekbar = document.getElementById('hud-seekbar');
    const currentTimeEl = document.getElementById('hud-current-time');
    const durationEl = document.getElementById('hud-duration');
    const playBtn = document.getElementById('hud-play-btn');
    const playIcon = document.getElementById('hud-play-icon');
    const rewindBtn = document.getElementById('hud-rewind-btn');
    const forwardBtn = document.getElementById('hud-forward-btn');
    const volumeBtn = document.getElementById('hud-volume-btn');
    const volumeSlider = document.getElementById('hud-volume-slider');
    const speedSelect = document.getElementById('hud-speed-select');
    const fullscreenBtn = document.getElementById('hud-fullscreen-btn');
    const hudBackBtn = document.getElementById('hud-back-btn');

    const formatTime = (seconds) => {
      if (isNaN(seconds) || seconds < 0) return '00:00';
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const pad = (n) => String(n).padStart(2, '0');
      return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    };

    let hudTimeout;
    const resetHudTimer = () => {
      if (!playerHud) return;
      playerHud.classList.remove('hud-hidden');
      clearTimeout(hudTimeout);
      hudTimeout = setTimeout(() => {
        if (playerOverlay && !playerOverlay.classList.contains('hidden')) {
          playerHud.classList.add('hud-hidden');
        }
      }, 3500);
    };

    if (playerOverlay) {
      playerOverlay.addEventListener('mousemove', resetHudTimer);
      
      // Mobile Touch Gesture Recognizer (Double-tap left = -10s, right = +10s, single-tap = toggle HUD)
      let lastTapTime = 0;
      let singleTapTimeout = null;

      const showGestureFeedback = (text) => {
        let badge = document.getElementById('hud-gesture-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.id = 'hud-gesture-badge';
          badge.className = 'hud-gesture-badge';
          playerOverlay.appendChild(badge);
        }
        badge.textContent = text;
        badge.classList.remove('show');
        void badge.offsetWidth;
        badge.classList.add('show');
        setTimeout(() => badge.classList.remove('show'), 650);
      };

      playerOverlay.addEventListener('touchend', (e) => {
        // Ignore taps on interactive controls
        if (e.target.closest('button, select, input, a, .hud-top, .hud-bottom')) return;
        
        const now = Date.now();
        const diff = now - lastTapTime;
        const touch = e.changedTouches ? e.changedTouches[0] : null;
        
        if (diff < 300 && touch) {
          clearTimeout(singleTapTimeout);
          const screenWidth = window.innerWidth;
          const isLeft = touch.clientX < (screenWidth / 2);
          
          if (video && !video.classList.contains('hidden')) {
            if (isLeft) {
              video.currentTime = Math.max(0, video.currentTime - 10);
              showGestureFeedback('⏪ -10s');
            } else {
              const dur = video.duration || 99999;
              video.currentTime = Math.min(dur, video.currentTime + 10);
              showGestureFeedback('⏩ +10s');
            }
          }
          lastTapTime = 0;
        } else {
          lastTapTime = now;
          singleTapTimeout = setTimeout(() => {
            if (playerHud) {
              playerHud.classList.toggle('hud-hidden');
            }
          }, 300);
        }
      });
    }

    if (hudBackBtn) {
      hudBackBtn.addEventListener('click', () => this.closePlayer());
    }

    const toggleTopBtn = document.getElementById('hud-toggle-top-btn');
    const hudTop = document.getElementById('hud-top');

    // In-Player Quick Stream Switcher
    const hudStreamSelect = document.getElementById('hud-stream-select');
    if (hudStreamSelect) {
      hudStreamSelect.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        if (!isNaN(idx) && state.activeStreams && state.activeStreams[idx]) {
          const s = state.activeStreams[idx];
          if (s.url) {
            this.playStream(s.url, s.name);
          } else if (s.embedUrl) {
            this.playIframe(s.embedUrl, s.name);
          }
        }
      });
    }

    if (toggleTopBtn && hudTop) {
      toggleTopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hudTop.classList.toggle('hud-top-hidden');
        if (hudTop.classList.contains('hud-top-hidden')) {
          toggleTopBtn.textContent = '👁️ Mostrar Barra';
        } else {
          toggleTopBtn.textContent = '👁️ Ocultar Barra';
        }
      });
    }

    // Video events for HUD
    if (video) {
      video.addEventListener('timeupdate', () => {
        if (!video.duration) return;
        const pct = (video.currentTime / video.duration) * 100;
        if (seekbar) seekbar.value = pct;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
        if (durationEl) durationEl.textContent = formatTime(video.duration);
      });

      video.addEventListener('loadedmetadata', () => {
        if (durationEl) durationEl.textContent = formatTime(video.duration);
      });

      video.addEventListener('play', () => {
        if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
      });

      video.addEventListener('pause', () => {
        if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>';
      });
    }

    // Play / Pause toggle
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!video || video.classList.contains('hidden')) return;
        if (video.paused) {
          video.play().catch(err => {
            console.warn("Unmuted play blocked on resume, falling back to muted play...", err);
            video.muted = true;
            video.play();
          });
        } else {
          video.pause();
        }
      });
    }

    // Seekbar input
    if (seekbar) {
      seekbar.addEventListener('input', () => {
        if (!video || !video.duration) return;
        const targetTime = (seekbar.value / 100) * video.duration;
        video.currentTime = targetTime;
      });
    }

    // Rewind / Forward 10s
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        if (video && !video.classList.contains('hidden')) {
          video.currentTime = Math.max(0, video.currentTime - 10);
        }
      });
    }
    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => {
        if (video && !video.classList.contains('hidden') && video.duration) {
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
        }
      });
    }

    // Volume & Mute
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        if (!video) return;
        video.volume = parseFloat(volumeSlider.value);
        video.muted = (video.volume === 0);
      });
    }
    if (volumeBtn) {
      volumeBtn.addEventListener('click', () => {
        if (!video) return;
        video.muted = !video.muted;
        if (volumeSlider) volumeSlider.value = video.muted ? 0 : video.volume;
      });
    }

    // Playback Speed
    if (speedSelect) {
      speedSelect.addEventListener('change', () => {
        if (video) video.playbackRate = parseFloat(speedSelect.value);
      });
    }

    // Audio Track Switcher
    const audioSelect = document.getElementById('hud-audio-select');
    if (audioSelect && video) {
      audioSelect.addEventListener('change', () => {
        const selectedLang = audioSelect.value;
        if (video.audioTracks && video.audioTracks.length > 0) {
          for (let i = 0; i < video.audioTracks.length; i++) {
            const track = video.audioTracks[i];
            const label = (track.label || track.language || '').toLowerCase();
            if (selectedLang === 'pt' && (label.includes('pt') || label.includes('por') || label.includes('dub'))) {
              track.enabled = true;
            } else if (selectedLang === 'en' && (label.includes('en') || label.includes('eng'))) {
              track.enabled = true;
            } else {
              track.enabled = (i === (selectedLang === 'pt' ? 1 : 0));
            }
          }
        }
      });
    }

    // Fullscreen Toggle & Auto-Resize Handler
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const container = document.getElementById('player-overlay') || document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (container.requestFullscreen) {
            container.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
          } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.warn('Exit Fullscreen error:', err));
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      });

      // Handle screen resize & orientation change during Fullscreen
      document.addEventListener('fullscreenchange', () => {
        if (video) Subtitles.syncOverlay(video.currentTime);
      });
      document.addEventListener('webkitfullscreenchange', () => {
        if (video) Subtitles.syncOverlay(video.currentTime);
      });
    }

    // Next stream server button
    const nextStreamBtn = document.getElementById('hud-next-stream-btn');
    if (nextStreamBtn) {
      nextStreamBtn.addEventListener('click', () => {
        if (!state.activeStreams || state.activeStreams.length === 0) return;
        const currentIdx = state.currentStreamIdx || 0;
        const nextIdx = (currentIdx + 1) % state.activeStreams.length;
        state.currentStreamIdx = nextIdx;
        const nextStream = state.activeStreams[nextIdx];
        const streamSelect = document.getElementById('hud-stream-select');
        if (streamSelect) streamSelect.value = nextIdx;
        const titleText = state.currentMeta ? state.currentMeta.name : 'JohnFlix HD';
        if (nextStream.embedUrl) {
          this.playIframe(nextStream.embedUrl, titleText);
        } else if (nextStream.url) {
          this.playStream(nextStream.url, titleText);
        }
      });
    }

    // Keyboard Shortcuts for Video Player
    document.addEventListener('keydown', (e) => {
      const pOverlay = document.getElementById('player-overlay');
      if (!pOverlay || pOverlay.classList.contains('hidden')) return;

      const vid = document.getElementById('video-player');
      if (!vid || vid.classList.contains('hidden')) return;

      const key = e.key.toLowerCase();
      if (key === ' ' || key === 'k') {
        e.preventDefault();
        if (vid.paused) vid.play(); else vid.pause();
      } else if (key === 'f') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          pOverlay.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (key === 'm') {
        e.preventDefault();
        vid.muted = !vid.muted;
      } else if (key === 'arrowleft' || key === 'j') {
        e.preventDefault();
        vid.currentTime = Math.max(0, vid.currentTime - 10);
      } else if (key === 'arrowright' || key === 'l') {
        e.preventDefault();
        if (vid.duration) vid.currentTime = Math.min(vid.duration, vid.currentTime + 10);
      } else if (key === 'arrowup') {
        e.preventDefault();
        vid.volume = Math.min(1, vid.volume + 0.1);
      } else if (key === 'arrowdown') {
        e.preventDefault();
        vid.volume = Math.max(0, vid.volume - 0.1);
      }
    });
  },
  
  async loadInitialData() {
    try {
      this.hideSearchResults();

      if (state.currentType === 'watchlist') {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) heroSection.classList.add('hidden');
        this.renderCatalogs();
        this.hideLoadingScreen();
        return;
      } else if (state.currentType === 'cinema') {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) heroSection.classList.remove('hidden');
        
        // Spotlight marquee item from Cinema Sagas
        const marqueeItem = {
          id: 'tt6263850',
          name: 'Deadpool & Wolverine (2024)',
          year: '2024',
          description: 'A TVA recruta Wade Wilson para uma missão através do Multiverso ao lado de uma variante relutante de Wolverine.',
          type: 'movie',
          imdbRating: '7.8'
        };
        this.setHero(marqueeItem, true);
        this.renderCatalogs();
        this.hideLoadingScreen();
        return;
      } else {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) heroSection.classList.remove('hidden');
      }
      
      const cacheKey = `cat_${state.currentType}_${state.currentGenre || 'all'}`;
      const cached = Cache.get(cacheKey);
      
      if (!state.currentGenre && cached && cached.popular && cached.popular.length > 0) {
        state.catalogs.popular = cached.popular;
        state.catalogs.featured = cached.featured || [];
        this.setRandomHero(cached.popular);
        this.renderCatalogs();
        this.hideLoadingScreen();
        this.startHeroAutoRotation();
      }

      const extra = state.currentGenre ? { genre: state.currentGenre } : {};
      let popular = [];
      let featured = [];

      if (state.currentType === 'all') {
        const [movTop, serTop, movRating, serRating] = await Promise.all([
          API.fetchCatalog('movie', 'top', extra),
          API.fetchCatalog('series', 'top', extra),
          API.fetchCatalog('movie', 'imdbRating', extra),
          API.fetchCatalog('series', 'imdbRating', extra)
        ]).catch(() => [[], [], [], []]);

        (movTop || []).forEach(m => m.type = 'movie');
        (serTop || []).forEach(s => s.type = 'series');
        (movRating || []).forEach(m => m.type = 'movie');
        (serRating || []).forEach(s => s.type = 'series');

        popular = this.interleaveArrays(movTop || [], serTop || []);
        featured = this.interleaveArrays(movRating || [], serRating || []);
      } else {
        const [pop, feat] = await Promise.all([
          API.fetchCatalog(state.currentType, 'top', extra),
          API.fetchCatalog(state.currentType, 'imdbRating', extra)
        ]).catch(() => [[], []]);
        popular = pop;
        featured = feat;
      }
      
      if (popular && popular.length > 0) {
        state.catalogs.popular = popular;
        state.catalogs.featured = featured || [];
        Cache.set(cacheKey, { popular: state.catalogs.popular, featured: state.catalogs.featured });
        this.setRandomHero(popular);
        this.renderCatalogs();
        this.startHeroAutoRotation();
      }
    } catch (err) {
      console.error('Error in loadInitialData:', err);
    } finally {
      this.hideLoadingScreen();
    }
  },

  interleaveArrays(arr1, arr2) {
    const result = [];
    const maxLen = Math.max(arr1.length, arr2.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < arr1.length) result.push(arr1[i]);
      if (i < arr2.length) result.push(arr2[i]);
    }
    return result;
  },

  setRandomHero(list) {
    const items = (list && list.length > 0) ? list : (state.catalogs.popular || []);
    if (!items || items.length === 0) return;

    // Filter top 15 items and pick one that wasn't the last hero
    const candidates = items.slice(0, 15).filter(item => item.id !== state.lastHeroId);
    const pool = candidates.length > 0 ? candidates : items;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];

    state.lastHeroId = selected.id;
    this.setHero(selected, true);
  },

  startHeroAutoRotation() {
    if (state.heroInterval) clearInterval(state.heroInterval);

    state.heroInterval = setInterval(() => {
      // Don't rotate if modal is open or if user is searching or playing video
      const modalOpen = !document.getElementById('movie-modal')?.classList.contains('hidden');
      const playerOpen = !document.getElementById('player-overlay')?.classList.contains('hidden');
      const searchActive = !document.getElementById('search-results')?.classList.contains('hidden');

      if (!modalOpen && !playerOpen && !searchActive && state.catalogs.popular && state.catalogs.popular.length > 0) {
        this.setRandomHero(state.catalogs.popular);
      }
    }, 12000); // Rotate every 12 seconds
  },
  
  setHero(meta, animate = false) {
    if (!meta) return;
    state.heroMeta = meta;

    const heroBackdrop = document.getElementById('hero-backdrop');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.getElementById('hero-title');
    const heroMeta = document.getElementById('hero-meta');
    const heroDescription = document.getElementById('hero-description');
    const heroTypeName = document.getElementById('hero-type-name');

    const updateDOM = () => {
      const itemType = meta.type || (state.currentType === 'series' ? 'series' : 'movie');
      if (heroTypeName) {
        heroTypeName.textContent = state.currentType === 'cinema' ? '🏛️ Seção Cinema' : (itemType === 'series' ? 'Série 📺' : 'Filme 🎬');
      }
      
      if (heroBackdrop) {
        const bgUrl = getBackgroundUrl(meta);
        heroBackdrop.style.backgroundImage = `url('${bgUrl}')`;
      }
      if (heroTitle) heroTitle.textContent = meta.name;
      if (heroMeta) {
        const year = meta.year || meta.releaseInfo || '';
        const rating = meta.imdbRating ? `<span class="rating">⭐ ${meta.imdbRating}</span>` : '';
        const runtime = meta.runtime ? `⏱ ${meta.runtime}` : '';
        heroMeta.innerHTML = [year, rating, runtime].filter(Boolean).join(' &nbsp;|&nbsp; ');
      }
      if (heroDescription) {
        heroDescription.textContent = meta.description || 'Sem descrição disponível.';
      }
    };

    if (animate && heroContent && heroBackdrop) {
      heroContent.style.opacity = '0';
      heroBackdrop.style.opacity = '0.3';
      setTimeout(() => {
        updateDOM();
        heroContent.style.opacity = '1';
        heroBackdrop.style.opacity = '1';
      }, 350);
    } else {
      updateDOM();
      if (heroContent) heroContent.style.opacity = '1';
      if (heroBackdrop) heroBackdrop.style.opacity = '1';
    }
  },
  
  createMovieCard(item) {
    const posterUrl = getPosterUrl(item);
    const itemType = item.type || (state.currentType === 'series' ? 'series' : 'movie');
    const isSeries = itemType === 'series';
    return `
      <div class="movie-card" onclick="UI.openModal('${item.id}', '${itemType}')">
        <img class="movie-poster" src="${posterUrl}" alt="${item.name}" onerror="this.style.background='linear-gradient(135deg, #1a1a2e, #2a2a4e)'; this.style.minHeight='270px';" loading="lazy">
        <span class="movie-card-type">${isSeries ? '📺 SÉRIE' : '🎬 FILME'}</span>
        ${item.imdbRating ? `<span class="movie-card-rating">⭐ ${item.imdbRating}</span>` : ''}
        <div class="movie-card-overlay">
          <span class="movie-card-title">${item.name}</span>
          <span class="movie-card-year">${item.year || ''}</span>
        </div>
      </div>
    `;
  },

  createCinemaMovieCard(item, index, accent = '#8b5cf6') {
    const cleanId = item.id.split(':')[0];
    const posterUrl = `https://images.metahub.space/poster/medium/${cleanId}/img`;
    const num = index + 1;
    return `
      <div class="movie-card cinema-card" onclick="UI.openModal('${cleanId}', 'movie')">
        <div class="cinema-card-badge" style="background:${accent};">#${num}</div>
        <img class="movie-poster" src="${posterUrl}" alt="${item.name}" onerror="this.style.background='linear-gradient(135deg, #1a1a2e, #2a2a4e)'; this.style.minHeight='270px';" loading="lazy">
        <span class="movie-card-type" style="background:rgba(0,0,0,0.88); color:#fff; font-size:0.68rem; font-weight:700;">${item.timeline || item.year}</span>
        <div class="movie-card-overlay">
          <span class="movie-card-title">${item.name}</span>
          <span class="movie-card-year">${item.year} • Filme #${num}</span>
        </div>
      </div>
    `;
  },
  
  createCarousel(title, items, id) {
    if (!items || items.length === 0) return '';
    const cardsHtml = items.map(item => this.createMovieCard(item)).join('');
    
    return `
      <section class="catalog-section">
        <h2 class="section-title">${title}</h2>
        <div class="carousel-wrapper">
          <button class="carousel-btn carousel-prev" onclick="window.scrollCarousel('${id}', -1)">‹</button>
          <div class="carousel-track" id="carousel-${id}">
            ${cardsHtml}
          </div>
          <button class="carousel-btn carousel-next" onclick="window.scrollCarousel('${id}', 1)">›</button>
        </div>
      </section>
    `;
  },
  
  updateLanguage() {
    const lang = state.homeLang || 'pt-br';
    const t = I18N[lang] || I18N['pt-br'];

    // Update Header Links & Search Placeholder
    const movieNav = document.querySelectorAll('[data-type="movie"]');
    const seriesNav = document.querySelectorAll('[data-type="series"]');
    movieNav.forEach(el => {
      const label = el.querySelector('.mobile-nav-label');
      if (label) label.textContent = lang === 'en' ? 'Movies' : 'Filmes';
      else el.textContent = t.movies;
    });
    seriesNav.forEach(el => {
      const label = el.querySelector('.mobile-nav-label');
      if (label) label.textContent = lang === 'en' ? 'Series' : 'Séries';
      else el.textContent = t.series;
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    const genreSelect = document.getElementById('genre-select');
    if (genreSelect && genreSelect.options[0]) {
      genreSelect.options[0].textContent = t.allGenres;
    }

    const heroTypeName = document.getElementById('hero-type-name');
    if (heroTypeName) {
      heroTypeName.textContent = state.currentType === 'movie' ? t.movies : t.series;
    }

    const modalAutoPlayBtn = document.getElementById('modal-auto-play-btn');
    if (modalAutoPlayBtn) {
      modalAutoPlayBtn.textContent = t.autoPlayBr;
    }

    const streamsTitle = document.querySelector('.streams-title');
    if (streamsTitle) {
      streamsTitle.textContent = t.sourcesTitle;
    }

    const activeQuery = searchInput ? searchInput.value.trim() : '';
    if (activeQuery.length > 0) {
      this.performSearch(activeQuery);
    } else {
      this.loadInitialData();
    }
  },

  removeHistoryItem(metaId) {
    User.removeProgress(metaId);
    this.renderCatalogs();
  },

  clearHistory() {
    if (confirm('Tem certeza que deseja apagar todo o seu histórico de filmes e séries assistidos?')) {
      User.clearAllProgress();
      this.renderCatalogs();
    }
  },

  createContinueCard(item) {
    const cleanId = (item.id || '').split(':')[0];
    const posterUrl = item.poster && !item.poster.includes(':') ? item.poster : `https://images.metahub.space/poster/medium/${cleanId}/img`;
    const name = item.name && item.name !== 'Vídeo' && !item.name.startsWith('🇧🇷') ? item.name : 'Filme / Série';
    const isSeries = item.type === 'series';
    const pct = item.percentage || 0;
    const epBadge = isSeries ? `T${item.season || 1}:E${item.episode || 1}` : '';

    return `
      <div class="movie-card continue-card" onclick="UI.openModal('${cleanId}', '${item.type || (isSeries ? 'series' : 'movie')}')">
        <button class="continue-card-delete" onclick="event.stopPropagation(); UI.removeHistoryItem('${cleanId}');" title="Remover do histórico">✕</button>
        <div class="continue-poster-wrapper">
          <img class="movie-poster" src="${posterUrl}" alt="${name}" onerror="this.src='https://images.metahub.space/poster/medium/${cleanId}/img';" loading="lazy">
          ${isSeries ? `<span class="movie-card-type" style="background:rgba(139,92,246,0.95); font-weight:800;">📺 SÉRIE</span>` : '<span class="movie-card-type">🎬 FILME</span>'}
          <div class="continue-play-overlay">
            <div class="continue-play-btn-circle">▶</div>
          </div>
          <div class="continue-progress-bar-container">
            <div class="continue-progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
        <div class="movie-card-overlay continue-card-overlay">
          <span class="movie-card-title">${name}</span>
          <span class="continue-card-meta">${epBadge ? `${epBadge} • ` : ''}${formatTime(item.currentTime)}</span>
        </div>
      </div>
    `;
  },

  renderCatalogs() {
    const container = document.getElementById('catalog-container');
    if (!container) return;
    
    let html = '';

    // If dedicated Watchlist mode
    if (state.currentType === 'watchlist') {
      const allProgressMap = User.getAllProgress();
      const progressList = Object.values(allProgressMap)
        .filter(item => item && item.currentTime > 10 && item.percentage < 95)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      if (progressList.length > 0) {
        const continueCardsHtml = progressList.map(item => this.createContinueCard(item)).join('');
        html += `
          <section class="catalog-section continue-watching-section" style="padding-top:20px;">
            <div style="display:flex; align-items:center; justify-content:space-between; padding-right:4%; margin-bottom:1rem;">
              <h2 class="section-title" style="color:#d8b4fe; display:flex; align-items:center; gap:8px; margin-bottom:0;">
                <span>🕒</span> Continuar Assistindo
              </h2>
              <button class="btn btn-secondary" onclick="UI.clearHistory()" style="padding:6px 14px; font-size:0.8rem; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; gap:6px; cursor:pointer;" title="Limpar todo o histórico">
                🗑️ Limpar Histórico
              </button>
            </div>
            <div class="carousel-wrapper">
              <button class="carousel-btn carousel-prev" onclick="window.scrollCarousel('continue', -1)">‹</button>
              <div class="carousel-track" id="carousel-continue">
                ${continueCardsHtml}
              </div>
              <button class="carousel-btn carousel-next" onclick="window.scrollCarousel('continue', 1)">›</button>
            </div>
          </section>
        `;
      }

      const watchlistMap = User.getWatchlist();
      const watchlistArray = Object.values(watchlistMap)
        .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

      if (watchlistArray.length > 0) {
        const watchlistCardsHtml = watchlistArray.map(item => this.createMovieCard(item)).join('');
        html += `
          <section class="catalog-section watchlist-section" id="watchlist-section" style="padding-top:20px;">
            <h2 class="section-title" style="color:#facc15; display:flex; align-items:center; gap:8px;">
              <span>⭐</span> Minha Lista (${watchlistArray.length})
            </h2>
            <div class="search-grid" style="padding: 0 4%;">
              ${watchlistCardsHtml}
            </div>
          </section>
        `;
      } else {
        html += `
          <div class="empty-state" style="text-align:center; padding: 120px 20px 80px;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⭐</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; color: white;">Sua lista de favoritos está vazia</h2>
            <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Navegue pelos filmes e séries e clique no botão <strong>"⭐ + Minha Lista"</strong> dentro dos detalhes para salvar o que deseja assistir mais tarde!
            </p>
            <button class="btn btn-primary" onclick="document.querySelector('[data-type=\\'movie\\']').click();" style="margin: 0 auto; padding: 12px 28px;">
              🎬 Explorar Filmes e Séries
            </button>
          </div>
        `;
      }

      container.innerHTML = html;
      return;
    }

    // Seção Cinema Mode (Grandes Sagas e Trilogias em Ordem Cronológica)
    if (state.currentType === 'cinema') {
      html += `
        <div class="cinema-chip-nav" style="display:flex; gap:8px; overflow-x:auto; padding: 10px 4% 15px; scrollbar-width:none; -webkit-overflow-scrolling:touch;">
          ${CINEMA_SAGAS.map(s => {
            const shortName = s.title.split('(')[0].trim();
            return `
              <button onclick="document.getElementById('saga-${s.id}')?.scrollIntoView({behavior:'smooth', block:'center'});" class="btn btn-secondary" style="padding:7px 14px; font-size:0.82rem; border-radius:20px; white-space:nowrap; border:1px solid ${s.accent}; color:#fff; background:rgba(255,255,255,0.06); flex-shrink:0; cursor:pointer;">
                ${shortName}
              </button>
            `;
          }).join('')}
        </div>
      `;

      CINEMA_SAGAS.forEach(saga => {
        // Automatic chronological ordering by release year:
        const sortedItems = [...saga.items].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0));
        const cardsHtml = sortedItems.map((item, idx) => this.createCinemaMovieCard(item, idx, saga.accent)).join('');
        html += `
          <section class="catalog-section cinema-saga-section" id="saga-${saga.id}">
            <h2 class="section-title" style="color:${saga.accent}; display:flex; align-items:center; gap:8px; margin-bottom:0.3rem;">
              ${saga.title}
            </h2>
            <p class="cinema-saga-desc">${saga.description}</p>
            <div class="carousel-wrapper">
              <button class="carousel-btn carousel-prev" onclick="window.scrollCarousel('saga-${saga.id}', -1)">‹</button>
              <div class="carousel-track" id="carousel-saga-${saga.id}">
                ${cardsHtml}
              </div>
              <button class="carousel-btn carousel-next" onclick="window.scrollCarousel('saga-${saga.id}', 1)">›</button>
            </div>
          </section>
        `;
      });

      container.innerHTML = html;
      return;
    }

    // Normal Movies / Series Catalog Mode
    const typeName = state.currentType === 'all' ? 'Filmes & Séries' : (state.currentType === 'movie' ? 'Filmes' : 'Séries');

    // 1. Continuar Assistindo & 2. Minha Lista Carousel (ONLY on 'all' home tab)
    if (state.currentType === 'all') {
      const allProgressMap = User.getAllProgress();
      const progressList = Object.values(allProgressMap)
        .filter(item => item && item.currentTime > 10 && item.percentage < 95)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      if (progressList.length > 0) {
        const continueCardsHtml = progressList.map(item => this.createContinueCard(item)).join('');
        html += `
          <section class="catalog-section continue-watching-section">
            <div style="display:flex; align-items:center; justify-content:space-between; padding-right:4%; margin-bottom:1rem;">
              <h2 class="section-title" style="color:#d8b4fe; display:flex; align-items:center; gap:8px; margin-bottom:0;">
                <span>🕒</span> Continuar Assistindo
              </h2>
              <button class="btn btn-secondary" onclick="UI.clearHistory()" style="padding:6px 14px; font-size:0.8rem; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; gap:6px; cursor:pointer;" title="Limpar todo o histórico">
                🗑️ Limpar Histórico
              </button>
            </div>
            <div class="carousel-wrapper">
              <button class="carousel-btn carousel-prev" onclick="window.scrollCarousel('continue', -1)">‹</button>
              <div class="carousel-track" id="carousel-continue">
                ${continueCardsHtml}
              </div>
              <button class="carousel-btn carousel-next" onclick="window.scrollCarousel('continue', 1)">›</button>
            </div>
          </section>
        `;
      }

      const watchlistMap = User.getWatchlist();
      const watchlistArray = Object.values(watchlistMap)
        .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

      if (watchlistArray.length > 0) {
        const watchlistCardsHtml = watchlistArray.map(item => this.createMovieCard(item)).join('');
        html += `
          <section class="catalog-section watchlist-section" id="watchlist-section">
            <h2 class="section-title" style="color:#facc15; display:flex; align-items:center; gap:8px;">
              <span>⭐</span> Minha Lista / Favoritos (${watchlistArray.length})
            </h2>
            <div class="carousel-wrapper">
              <button class="carousel-btn carousel-prev" onclick="window.scrollCarousel('watchlist', -1)">‹</button>
              <div class="carousel-track" id="carousel-watchlist">
                ${watchlistCardsHtml}
              </div>
              <button class="carousel-btn carousel-next" onclick="window.scrollCarousel('watchlist', 1)">›</button>
            </div>
          </section>
        `;
      }
    }

    // 3. 🔥 Lançamentos Recentes Carousel (Filmes e Séries Recentes)
    const allItems = [...(state.catalogs.popular || []), ...(state.catalogs.featured || [])];
    const recentItems = allItems
      .filter((item, index, self) => self.findIndex(t => t.id === item.id) === index)
      .filter(item => {
        const yr = parseInt(item.year, 10);
        return !isNaN(yr) && yr >= 2024;
      })
      .sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));

    const finalRecents = recentItems.length >= 6 ? recentItems : allItems.slice(0, 18);

    if (finalRecents && finalRecents.length > 0) {
      html += this.createCarousel(`🔥 Lançamentos Recentes (2025 / 2026)`, finalRecents, 'recents');
    }

    if (state.catalogs.popular && state.catalogs.popular.length > 0) {
      html += this.createCarousel(`${typeName} Populares`, state.catalogs.popular, 'popular');
    }
    if (state.catalogs.featured && state.catalogs.featured.length > 0) {
      html += this.createCarousel(`${typeName} em Destaque`, state.catalogs.featured, 'featured');
    }
    
    if (!html) {
      html = '<div class="empty-state">Nenhum conteúdo encontrado.</div>';
    }
    
    container.innerHTML = html;
  },
  
  async performSearch(query) {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      this.hideSearchResults();
      return;
    }

    // 1. INSTANT 0ms Local Catalog Search
    const allLocal = [...(state.catalogs.popular || []), ...(state.catalogs.featured || [])];
    const localMatches = allLocal.filter((item, index, self) => {
      const isUnique = self.findIndex(t => t.id === item.id) === index;
      const nameMatch = (item.name || '').toLowerCase().includes(q);
      const descMatch = (item.description || '').toLowerCase().includes(q);
      return isUnique && (nameMatch || descMatch);
    });

    if (localMatches.length > 0) {
      this.showSearchResults(localMatches);
    }

    // 2. Fetch full Cinemeta search for currentType (movie or series)
    if (q.length >= 2) {
      const remoteResults = await API.searchContent(state.currentType, query.trim());
      if (remoteResults && remoteResults.length > 0) {
        const combinedMap = new Map();
        localMatches.forEach(item => combinedMap.set(item.id, item));
        remoteResults.forEach(item => combinedMap.set(item.id, item));
        this.showSearchResults(Array.from(combinedMap.values()));
      } else if (localMatches.length === 0) {
        this.showSearchResults([]);
      }
    }
  },

  showSearchResults(results) {
    const resultsArea = document.getElementById('search-results');
    const grid = document.getElementById('search-grid');
    if (!resultsArea || !grid) return;
    
    if (results.length === 0) {
      grid.innerHTML = '<div class="empty-state">Nenhum resultado encontrado.</div>';
    } else {
      grid.innerHTML = results.map(item => this.createMovieCard(item)).join('');
    }
    resultsArea.classList.remove('hidden');
    document.getElementById('catalog-container')?.classList.add('hidden');
    document.getElementById('hero-section')?.classList.add('hidden');
  },
  
  hideSearchResults() {
    const resultsArea = document.getElementById('search-results');
    if (resultsArea) resultsArea.classList.add('hidden');
    document.getElementById('catalog-container')?.classList.remove('hidden');
    document.getElementById('hero-section')?.classList.remove('hidden');
  },
  
  async openModal(id, explicitType) {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    const reqType = explicitType || state.currentType;
    const meta = await API.fetchMeta(reqType, id);
    if (!meta) {
      alert('Erro ao carregar detalhes.');
      this.closeModal();
      return;
    }
    
    state.currentMeta = meta;
    
    const backdropImg = document.getElementById('modal-backdrop-img');
    const poster = document.getElementById('modal-poster');
    const title = document.getElementById('modal-title');
    const metaInfo = document.getElementById('modal-meta');
    const description = document.getElementById('modal-description');
    const genres = document.getElementById('modal-genres');
    const cast = document.getElementById('modal-cast');
    
    if (backdropImg) backdropImg.src = getBackgroundUrl(meta);
    if (poster) poster.src = getPosterUrl(meta);
    if (title) title.textContent = meta.name;
    if (metaInfo) {
      const year = meta.year || meta.releaseInfo || '';
      const rating = meta.imdbRating ? `<span class="rating">⭐ ${meta.imdbRating}</span>` : '';
      const runtime = meta.runtime ? `⏱ ${meta.runtime}` : '';
      metaInfo.innerHTML = [year, rating, runtime].filter(Boolean).join(' &nbsp;|&nbsp; ');
    }
    if (description) description.textContent = meta.description || 'Sem descrição.';
    if (genres && meta.genres) {
      genres.innerHTML = meta.genres.map(g => `<span>${g}</span>`).join('');
    } else if (genres) {
      genres.innerHTML = '';
    }
    if (cast) cast.textContent = meta.cast ? `Elenco: ${meta.cast.slice(0, 6).join(', ')}` : '';
    
    // Show/hide series controls based on content type
    // Dynamic Series Seasons & Episodes Controls
    this.setupSeriesControls(meta);

    // Check saved watch progress
    const progress = User.getProgress(meta.id);
    const autoPlayBtn = document.getElementById('modal-auto-play-btn');
    if (autoPlayBtn) {
      if (progress && progress.currentTime > 10) {
        const epInfo = (meta.type === 'series' || state.currentType === 'series') ? ` [T${state.currentSeason}:E${state.currentEpisode}]` : '';
        autoPlayBtn.innerHTML = `⚡ Continuar Assistindo${epInfo} (de ${formatTime(progress.currentTime)})`;
      } else {
        autoPlayBtn.innerHTML = `⚡ Assistir Agora (Auto-Play Dublado PT-BR)`;
      }
    }

    // Watchlist button state & click listener
    const watchlistBtn = document.getElementById('modal-watchlist-btn');
    if (watchlistBtn) {
      const updateWatchlistBtnUI = () => {
        const isSaved = User.isInWatchlist(meta.id);
        if (isSaved) {
          watchlistBtn.innerHTML = '⭐ Na Minha Lista ✓';
          watchlistBtn.style.background = 'rgba(139, 92, 246, 0.4)';
          watchlistBtn.style.borderColor = 'var(--accent)';
        } else {
          watchlistBtn.innerHTML = '⭐ + Minha Lista';
          watchlistBtn.style.background = 'rgba(255, 255, 255, 0.08)';
          watchlistBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
      };

      updateWatchlistBtnUI();

      watchlistBtn.onclick = () => {
        if (!state.currentMeta) return;
        User.toggleWatchlist(state.currentMeta);
        updateWatchlistBtnUI();
        this.renderCatalogs();
      };
    }

    // Load streams
    this.loadStreams();
  },

  setupSeriesControls(meta) {
    const seriesControls = document.getElementById('series-controls');
    const seasonSelect = document.getElementById('season-select');
    const episodeSelect = document.getElementById('episode-select');

    if (!seriesControls || !seasonSelect || !episodeSelect) return;

    const isSeries = (state.currentType === 'series') || (meta && meta.type === 'series');
    if (!isSeries) {
      seriesControls.classList.add('hidden');
      return;
    }

    seriesControls.classList.remove('hidden');

    // Extract episodes from meta.videos
    const videos = meta.videos || [];
    let seasons = [];
    if (videos.length > 0) {
      seasons = [...new Set(videos.map(v => v.season).filter(s => typeof s === 'number'))].sort((a, b) => a - b);
    }
    if (seasons.length === 0) {
      seasons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    // Populate Season dropdown
    seasonSelect.innerHTML = seasons.map(s => `<option value="${s}">Temporada ${s}</option>`).join('');

    // Restore saved watch progress season & episode if available
    const progress = User.getProgress(meta.id);
    let targetSeason = progress && progress.season ? progress.season : 1;
    let targetEpisode = progress && progress.episode ? progress.episode : 1;

    if (!seasons.includes(targetSeason)) targetSeason = seasons[0] || 1;

    seasonSelect.value = String(targetSeason);
    state.currentSeason = targetSeason;

    const populateEpisodes = (seasonNum) => {
      let seasonVids = videos.filter(v => v.season === seasonNum);
      if (seasonVids.length === 0) {
        seasonVids = Array.from({ length: 30 }, (_, i) => ({ episode: i + 1, name: `Episódio ${i + 1}` }));
      }

      episodeSelect.innerHTML = seasonVids.map(v => {
        const epNum = v.episode;
        const titleStr = (v.name || v.title) ? ` - ${v.name || v.title}` : '';
        return `<option value="${epNum}">Episódio ${epNum}${titleStr}</option>`;
      }).join('');

      let validEp = seasonVids.some(v => v.episode === targetEpisode) ? targetEpisode : (seasonVids[0] ? seasonVids[0].episode : 1);
      episodeSelect.value = String(validEp);
      state.currentEpisode = validEp;
    };

    populateEpisodes(targetSeason);

    // Bind change listeners dynamically
    seasonSelect.onchange = (e) => {
      const s = parseInt(e.target.value, 10) || 1;
      state.currentSeason = s;
      targetEpisode = 1;
      populateEpisodes(s);
      if (state.currentMeta) this.loadStreams();
    };

    episodeSelect.onchange = (e) => {
      const ep = parseInt(e.target.value, 10) || 1;
      state.currentEpisode = ep;
      if (state.currentMeta) this.loadStreams();
    };
  },
  
  closeModal() {
    const modal = document.getElementById('movie-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    state.currentMeta = null;
    state.isPlayerActive = false;
    state.autoPlaySessionId++;
    if (this.autoTestTimer) { clearTimeout(this.autoTestTimer); this.autoTestTimer = null; }
    if (this.streamWatchdogTimer) { clearTimeout(this.streamWatchdogTimer); this.streamWatchdogTimer = null; }
  },

  async autoPlayBestStream() {
    if (!state.currentMeta) return;

    state.isPlayerActive = true;
    const sessionId = ++state.autoPlaySessionId;

    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');

    if (playerOverlay) playerOverlay.classList.remove('hidden');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = '⚡ Buscando e testando servidores em paralelo (0s - 3s)...';
    }

    const titleText = state.currentMeta.name;
    if (playerTitle) playerTitle.textContent = titleText;
    if (hudTitle) hudTitle.textContent = titleText;

    const rawStreams = await API.fetchStreams(
      state.currentType, 
      state.currentMeta.id, 
      state.currentSeason, 
      state.currentEpisode
    );

    // If user closed player or modal while fetching, STOP immediately!
    if (!state.isPlayerActive || sessionId !== state.autoPlaySessionId) {
      console.log('Playback cancelled by user, aborting auto-play.');
      return;
    }

    const fenixDirect = (rawStreams || []).filter(s => s.url && (s.name.includes('Fenix') || (s.title && s.title.includes('Fenix')) || s.category === 'fenix'));
    const otherDirect = (rawStreams || []).filter(s => s.url && !fenixDirect.includes(s));
    const webEmbeds = (rawStreams || []).filter(s => s.embedUrl);
    const torrentWebStreams = (rawStreams || []).filter(s => (s.magnetUrl || s.infoHash) && !s.url && !s.embedUrl).map(s => {
      const mag = s.magnetUrl || `magnet:?xt=urn:btih:${s.infoHash}&dn=${encodeURIComponent(s.name)}`;
      return {
        ...s,
        embedUrl: `https://webtor.io/show?magnet=${encodeURIComponent(mag)}`
      };
    });

    // Sort FenixFlix direct streams: 720p working stream first, then 1080p, then 4K
    fenixDirect.sort((a, b) => {
      const aIs720 = a.name.includes('720') || (a.title && a.title.includes('720'));
      const bIs720 = b.name.includes('720') || (b.title && b.title.includes('720'));
      if (aIs720 && !bIs720) return -1;
      if (!aIs720 && bIs720) return 1;
      return (b.score || 0) - (a.score || 0);
    });

    const candidates = [...fenixDirect, ...otherDirect, ...webEmbeds, ...torrentWebStreams];

    if (!candidates || candidates.length === 0) {
      alert('Nenhum servidor disponível para este título no momento.');
      if (playerLoading) playerLoading.classList.add('hidden');
      this.closePlayer();
      return;
    }

    // Always prioritize FenixFlix as winner candidate 0
    state.activeStreams = candidates;
    state.currentStreamIndex = 0;
    this.updateHudStreamSelector(candidates, 0);

    const winner = candidates[0];
    if (playerLoading) {
      playerLoading.querySelector('p').textContent = `🚀 Iniciando com ${winner.name}...`;
    }

    // Launch winner stream immediately!
    this.testAndPlayStreamIndex(0);
  },

  async testAndPlayStreamIndex(index) {
    if (!state.isPlayerActive) return;
    if (!state.activeStreams || index >= state.activeStreams.length) {
      this.showPlayerError();
      return;
    }

    state.currentStreamIndex = index;
    this.updateHudStreamSelector(state.activeStreams, index);

    const stream = state.activeStreams[index];
    const playerLoading = document.getElementById('player-loading');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = `⚡ Conectando ao Servidor ${index + 1}/${state.activeStreams.length} (${stream.name})...`;
    }

    if (stream.url) {
      this.playStream(stream.url, stream.name);
    } else if (stream.embedUrl) {
      this.playIframe(stream.embedUrl, stream.name);
    }

    // Auto-tester fallback timer: If server fails or stalls > 4s, automatically test next server only if player is still OPEN!
    if (this.autoTestTimer) clearTimeout(this.autoTestTimer);
    this.autoTestTimer = setTimeout(() => {
      const playerOverlay = document.getElementById('player-overlay');
      if (!state.isPlayerActive || !playerOverlay || playerOverlay.classList.contains('hidden')) return;

      const video = document.getElementById('video-player');
      const iframe = document.getElementById('iframe-player');
      const isVideoPlaying = video && !video.paused && video.currentTime > 0.1 && video.readyState >= 2;
      const isIframeVisible = iframe && !iframe.classList.contains('hidden');

      if (!isVideoPlaying && !isIframeVisible && index + 1 < state.activeStreams.length) {
        console.log(`Server ${index + 1} timed out, testing server ${index + 2}...`);
        this.testAndPlayStreamIndex(index + 1);
      }
    }, 4000);
  },

  updateHudStreamSelector(streams, activeIndex = 0) {
    const hudStreamSelect = document.getElementById('hud-stream-select');
    if (!hudStreamSelect) return;

    hudStreamSelect.innerHTML = streams.map((s, idx) => {
      const medal = idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : '';
      const msLabel = s.latency && s.latency < 9999 ? ` (${s.latency}ms)` : '';
      const label = `${medal}${s.name.replace(/—/g, '-')}${msLabel}`;
      const selected = idx === activeIndex ? 'selected' : '';
      return `<option value="${idx}" ${selected}>${label}</option>`;
    }).join('');
  },

  playNextStream() {
    const playerOverlay = document.getElementById('player-overlay');
    if (!state.isPlayerActive || !playerOverlay || playerOverlay.classList.contains('hidden')) return;
    if (!state.activeStreams || state.activeStreams.length === 0) return;
    state.currentStreamIndex = ((state.currentStreamIndex || 0) + 1) % state.activeStreams.length;
    const next = state.activeStreams[state.currentStreamIndex];
    if (!next) return;

    this.updateHudStreamSelector(state.activeStreams, state.currentStreamIndex);

    if (next.url) {
      this.playStream(next.url, next.name);
    } else if (next.embedUrl) {
      this.playIframe(next.embedUrl, next.name);
    }
  },
  
  async loadStreams() {
    if (!state.currentMeta) return;
    
    const streamsLoading = document.getElementById('streams-loading');
    const streamsList = document.getElementById('streams-list');
    
    if (streamsLoading) streamsLoading.classList.remove('hidden');
    if (streamsList) streamsList.innerHTML = '';
    
    const streams = await API.fetchStreams(
      state.currentType, 
      state.currentMeta.id, 
      state.currentSeason, 
      state.currentEpisode
    );
    
    if (streamsLoading) streamsLoading.classList.add('hidden');
    
    if (streams && streams.length > 0) {
      state.activeStreams = streams;
      this.updateHudStreamSelector(streams, 0);
      this.renderStreams(streams);
    }
  },
  
  renderStreams(streams) {
    const streamsList = document.getElementById('streams-list');
    if (!streamsList) return;

    const frost = streams.filter(s => s.name.includes('FrostStream') || (s.title && s.title.includes('FrostStream')));
    const fenix = streams.filter(s => s.name.includes('FenixFlix') || (s.title && s.title.includes('FenixFlix')));
    const brazuca = streams.filter(s => s.name.includes('Brazuca') || (s.title && s.title.includes('Brazuca')));
    
    // Web embeds (WarezCDN, SuperFlix, EmbedFlix, PrimeCine, FlixAPI, MegaFlix, VidSrc, etc.)
    const web = streams.filter(s => s.embedUrl && !fenix.includes(s) && !frost.includes(s));
    
    // Remaining unclassified
    const other = streams.filter(s => !fenix.includes(s) && !frost.includes(s) && !brazuca.includes(s) && !web.includes(s));

    let html = '';

    if (fenix.length > 0) {
      html += '<div style="color:#ef4444; font-weight:800; font-size:1.05rem; margin:1rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.15); padding:10px 14px; border-radius:8px; border-left:4px solid #ef4444; box-shadow:0 0 15px rgba(239,68,68,0.2);">'
        + '<span>🔥</span> FENIXFLIX (STREAMS DIRETO MP4 DUBLADO PT-BR - PLAYER NATIVO)</div>';
      html += fenix.map(stream => this.createStreamItem(stream)).join('');
    }

    if (frost.length > 0) {
      html += '<div style="color:#06b6d4; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(6,182,212,0.15); padding:10px 14px; border-radius:8px; border-left:4px solid #06b6d4; box-shadow:0 0 15px rgba(6,182,212,0.2);">'
        + '<span>❄️</span> FROSTSTREAM (STREAMS IPTV DIRETO REDEFLIX / CDMOVIES)</div>';
      html += frost.map(stream => this.createStreamItem(stream)).join('');
    }

    if (brazuca.length > 0) {
      html += '<div style="color:#f59e0b; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(245,158,11,0.1); padding:8px 14px; border-radius:8px; border-left:4px solid #f59e0b;">'
        + '<span>🧲</span> BRAZUCA TORRENTS (LINKS MAGNÉTICOS DUBLADOS PT-BR)</div>';
      html += brazuca.map(stream => this.createStreamItem(stream)).join('');
    }

    if (web.length > 0) {
      html += '<div style="color:#8b5cf6; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(139,92,246,0.1); padding:8px 14px; border-radius:8px; border-left:4px solid #8b5cf6;">'
        + '<span>🌐</span> PLAYERS WEB HD (WAREZCDN, SUPERFLIX, EMBEDFLIX, PRIMECINE)</div>';
      html += web.map(stream => this.createStreamItem(stream)).join('');
    }

    if (other.length > 0) {
      html += '<div style="color:#a0a0b0; font-weight:800; font-size:1rem; margin:1.5rem 0 0.5rem;">'
        + '<span>🎬</span> OUTRAS FONTES</div>';
      html += other.map(stream => this.createStreamItem(stream)).join('');
    }

    if (html === '') {
      html = '<p style="color:#a0a0b0; text-align:center; padding:2rem;">Nenhuma fonte disponível no momento. Tente novamente em instantes.</p>';
    }

    streamsList.innerHTML = html;
  },
  
  createStreamItem(stream) {
    const name = stream.name;

    // 🧲 Torrent / Magnet (Brazuca / FrostStream)
    const magnetUrl = stream.magnetUrl || (stream.infoHash ? `magnet:?xt=urn:btih:${stream.infoHash}&dn=${encodeURIComponent(name)}` : null);
    if (magnetUrl) {
      const escapedMagnet = magnetUrl.replace(/"/g, '&quot;');
      const escapedTitle = name.replace(/'/g, "\\'");
      const accentColor = '#f59e0b';

      return `
        <div class="stream-item" style="border-left: 4px solid ${accentColor};">
          <div class="stream-info">
            <span class="stream-name" style="font-weight:700;">${name}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="stream-play-btn" style="background:${accentColor}; color:#000; font-weight:800;"
              onclick="UI.playTorrent('${escapedMagnet.replace(/'/g, "\\'")}', '${escapedTitle}')">▶ Assistir Agora</button>
            <a href="${escapedMagnet}" class="stream-play-btn" style="background:rgba(255,255,255,0.1); color:white; font-weight:600; text-decoration:none;">🧲 App Stremio</a>
          </div>
        </div>
      `;
    }

    // 🎬 Direct HTTP MP4 / IPTV Video Streams (FenixFlix / FrostStream)
    if (stream.url) {
      const escapedUrl = stream.url.replace(/'/g, "\\'");
      const escapedTitle = name.replace(/'/g, "\\'");
      const isFenix = name.includes('FenixFlix');
      const isFrost = name.includes('FrostStream');
      const accentColor = isFenix ? '#ef4444' : isFrost ? '#06b6d4' : '#22c55e';

      return `
        <div class="stream-item" style="border-left: 4px solid ${accentColor};">
          <div class="stream-info">
            <span class="stream-name" style="font-weight:700;">${name}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="stream-play-btn" style="background:${accentColor}; color:#fff;" onclick="UI.playStream('${escapedUrl}', '${escapedTitle}')">▶ Assistir Agora</button>
          </div>
        </div>
      `;
    }

    // 🖥️ Web Embed Players (WarezCDN, SuperFlix, EmbedFlix, PrimeCine, FlixAPI, etc.)
    if (stream.embedUrl) {
      const escapedEmbed = stream.embedUrl.replace(/'/g, "\\'");
      const escapedTitle = name.replace(/'/g, "\\'");
      const borderColor = stream.isDub ? '#8b5cf6' : '#6366f1';
      return `
        <div class="stream-item" style="border-left: 4px solid ${borderColor};">
          <div class="stream-info">
            <span class="stream-name" style="font-weight:700;">${name}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="stream-play-btn" style="background:${borderColor}; color:#fff;" onclick="UI.playIframe('${escapedEmbed}', '${escapedTitle}')">▶ Assistir</button>
          </div>
        </div>
      `;
    }

    return '';
  },

  playTorrent(magnetUrl, title) {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');
    const hudBottom = document.querySelector('.hud-bottom');

    if (!playerOverlay || !video) return;

    this.closePlayer();

    playerOverlay.classList.remove('hidden');
    video.classList.remove('hidden');
    if (iframe) iframe.classList.add('hidden');
    if (hudBottom) hudBottom.classList.remove('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;

    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = 'Conectando ao Brazuca Torrent (P2P Player)...';
    }

    if (window.activeWtTorrent) {
      try { window.activeWtTorrent.destroy(); } catch(e) {}
      window.activeWtTorrent = null;
    }

    const cleanId = (state.currentMeta?.id || '').split(':')[0].replace('tt', '');
    const fallbackEmbedUrl = state.currentType === 'series'
      ? `https://vidsrc.in/embed/tv/${cleanId}/${state.currentSeason}/${state.currentEpisode}`
      : `https://vidsrc.in/embed/movie/${cleanId}`;

    let resolved = false;

    const fallbackTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log('WebTorrent P2P slow, falling back to direct video stream');
        this.playIframe(fallbackEmbedUrl, title);
      }
    }, 4500);

    if (window.WebTorrent) {
      try {
        const client = window.wtClient || new WebTorrent();
        window.wtClient = client;

        client.add(magnetUrl, (torrent) => {
          window.activeWtTorrent = torrent;
          const file = torrent.files.find(f => 
            f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.avi') || f.name.endsWith('.webm')
          ) || torrent.files[0];

          if (file && !resolved) {
            resolved = true;
            clearTimeout(fallbackTimer);
            file.renderTo(video, { autoplay: true }, (err) => {
              if (playerLoading) playerLoading.classList.add('hidden');
              video.play().catch(() => {});
            });
          }
        });
      } catch (err) {
        if (!resolved) {
          resolved = true;
          clearTimeout(fallbackTimer);
          this.playIframe(fallbackEmbedUrl, title);
        }
      }
    } else {
      if (!resolved) {
        resolved = true;
        clearTimeout(fallbackTimer);
        this.playIframe(fallbackEmbedUrl, title);
      }
    }
  },

  playIframe(embedUrl, title) {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerError = document.getElementById('player-error');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');
    const hudBottom = document.querySelector('.hud-bottom');
    const openTabBtn = document.getElementById('hud-open-tab-btn');
    
    if (!playerOverlay || !iframe) return;
    
    this.closePlayer();
    
    playerOverlay.classList.remove('hidden');
    iframe.classList.remove('hidden');
    if (video) video.classList.add('hidden');
    if (hudBottom) hudBottom.classList.add('hidden'); // Hide dummy bottom HUD so iframe native controls are 100% unblocked and clickable!
    
    const customSubOverlay = document.getElementById('custom-subtitles-overlay');
    if (customSubOverlay) customSubOverlay.classList.add('hidden');
    
    if (openTabBtn) {
      openTabBtn.href = embedUrl;
    }

    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = 'Carregando Player Web HD...';
    }
    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;
    
    iframe.removeAttribute('sandbox');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    
    // Invisible Background Redirect System: route popup redirects to hidden background frame
    if (!window.rawWindowOpen) window.rawWindowOpen = window.open;
    window.open = function(url, target, features) {
      const hiddenFrame = document.getElementById('hidden-redirect-target');
      if (hiddenFrame && url && (url.includes('http') || url.startsWith('//'))) {
        console.log('Redirecting popup to invisible background frame:', url);
        hiddenFrame.src = url;
        return hiddenFrame.contentWindow;
      }
      return hiddenFrame ? hiddenFrame.contentWindow : (window.rawWindowOpen ? window.rawWindowOpen(url, target, features) : null);
    };

    if (!window.redirectListenerBound) {
      window.redirectListenerBound = true;
      document.getElementById('player-overlay')?.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');
        if (anchor && anchor.href && !anchor.id.includes('hud')) {
          anchor.target = 'hidden_redirect_target';
        }
      }, true);
    }
    
    let finalUrl = embedUrl;
    if (state.currentMeta) {
      const savedProgress = User.getProgress(state.currentMeta.id);
      const currentTime = (savedProgress && savedProgress.currentTime > 10) ? savedProgress.currentTime : 10;
      User.saveProgress(state.currentMeta.id, currentTime, savedProgress ? savedProgress.duration : 3600, {
        title: state.currentMeta.name,
        season: state.currentSeason,
        episode: state.currentEpisode
      });
      if (savedProgress && savedProgress.currentTime > 10) {
        const startSec = Math.floor(savedProgress.currentTime);
        if (!finalUrl.includes('start=') && !finalUrl.includes('#t=')) {
          finalUrl += (finalUrl.includes('?') ? '&' : '?') + `start=${startSec}&t=${startSec}`;
        }
      }
    }

    iframe.src = finalUrl;
    
    // Auto-hide loading spinner quickly so iframe is 100% visible and ready for interaction
    setTimeout(() => {
      if (playerLoading) playerLoading.classList.add('hidden');
    }, 1200);
  },
  
  playStream(url, title) {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerError = document.getElementById('player-error');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');
    const hudBottom = document.querySelector('.hud-bottom');
    const openTabBtn = document.getElementById('hud-open-tab-btn');
    
    if (!video || !playerOverlay) return;
    
    this.closePlayer(); // Reset any previous playback
    
    if (openTabBtn) {
      openTabBtn.href = url;
    }
    
    playerOverlay.classList.remove('hidden');
    video.classList.remove('hidden');
    if (iframe) iframe.classList.add('hidden');
    if (hudBottom) hudBottom.classList.remove('hidden');

    video.autoplay = true;
    video.muted = false;
    video.volume = 1.0;

    const volumeSlider = document.getElementById('hud-volume-slider');
    if (volumeSlider) volumeSlider.value = 1;

    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = 'Carregando transmissão...';
    }
    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;
    
    // Always hide spinner after 1.5 seconds so it never blocks the video
    setTimeout(() => {
      if (playerLoading) playerLoading.classList.add('hidden');
    }, 1500);

    // Automatically fetch and load subtitles
    if (state.currentMeta) {
      const subSelect = document.getElementById('hud-subtitle-select');
      const lang = subSelect ? subSelect.value : 'pob';
      Subtitles.applySubtitles(
        lang, 
        state.currentMeta.id, 
        state.currentType, 
        state.currentSeason, 
        state.currentEpisode
      );
    }

    // Save progress & sync subtitles as video plays or seeks
    video.ontimeupdate = () => {
      Subtitles.syncOverlay(video.currentTime);

      const currentTimeEl = document.getElementById('hud-current-time');
      const durationEl = document.getElementById('hud-duration');
      const seekBar = document.getElementById('hud-seek-bar');

      if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
      if (durationEl && video.duration && !isNaN(video.duration)) durationEl.textContent = formatTime(video.duration);
      if (seekBar && video.duration && !isNaN(video.duration)) seekBar.value = (video.currentTime / video.duration) * 100;

      if (video.currentTime > 5 && state.currentMeta) {
        User.saveProgress(state.currentMeta.id, video.currentTime, video.duration, {
          title: title,
          season: state.currentSeason,
          episode: state.currentEpisode
        });
      }
    };
    video.onseeking = () => Subtitles.syncOverlay(video.currentTime);
    video.onseeked = () => Subtitles.syncOverlay(video.currentTime);

    const onPlaySuccess = () => {
      if (playerLoading) playerLoading.classList.add('hidden');
      if (playerError) playerError.classList.add('hidden');
    };

    const triggerAutoPlay = () => {
      video.muted = false;
      video.volume = 1.0;
      video.play().then(() => {
        onPlaySuccess();
      }).catch(err => {
        console.warn('Autoplay unmuted blocked by browser policy, attempting muted start with auto-unmute on touch...', err);
        video.muted = true;
        video.play().then(() => {
          onPlaySuccess();
          const unmuteOnInteraction = () => {
            video.muted = false;
            video.volume = 1.0;
            if (volumeSlider) volumeSlider.value = 1;
            document.removeEventListener('click', unmuteOnInteraction);
            document.removeEventListener('touchstart', unmuteOnInteraction);
          };
          document.addEventListener('click', unmuteOnInteraction, { once: true });
          document.addEventListener('touchstart', unmuteOnInteraction, { once: true });
        }).catch(e => console.error('Autoplay fully blocked:', e));
      });
    };

    video.onloadedmetadata = () => {
      const durationEl = document.getElementById('hud-duration');
      if (durationEl) durationEl.textContent = formatTime(video.duration);
      
      if (state.currentMeta) {
        const savedProgress = User.getProgress(state.currentMeta.id);
        if (savedProgress && savedProgress.currentTime > 10 && savedProgress.currentTime < (video.duration - 10)) {
          try {
            video.currentTime = savedProgress.currentTime;
          } catch(e) { console.warn('Resume seek error:', e); }
        }
      }

      triggerAutoPlay();
    };

    video.onplay = onPlaySuccess;
    video.onplaying = onPlaySuccess;
    video.oncanplay = onPlaySuccess;

    // Click on video to play / pause
    video.onclick = () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    video.onerror = () => {
      const overlay = document.getElementById('player-overlay');
      if (!state.isPlayerActive || !overlay || overlay.classList.contains('hidden') || !video.src || video.src === 'about:blank') return;
      console.warn('Direct video error on stream:', url);
      if (!video.dataset.triedProxy && !url.includes('corsproxy') && !url.includes('allorigins')) {
        video.dataset.triedProxy = '1';
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        video.src = proxyUrl;
        triggerAutoPlay();
        return;
      }
      video.dataset.triedProxy = '';
      if (typeof this.playNextStream === 'function') {
        console.log('Auto-advancing to next working stream...');
        this.playNextStream();
      }
    };

    // 3.5s stall watchdog: auto advance if stream doesn't start
    if (this.streamWatchdogTimer) clearTimeout(this.streamWatchdogTimer);
    this.streamWatchdogTimer = setTimeout(() => {
      const overlay = document.getElementById('player-overlay');
      if (!state.isPlayerActive || !overlay || overlay.classList.contains('hidden')) return;
      if (video && video.readyState < 2 && video.paused) {
        console.warn('Stream stall detected (>3.5s), auto-falling back to next stream...');
        if (typeof this.playNextStream === 'function') {
          this.playNextStream();
        }
      }
    }, 3500);

    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        triggerAutoPlay();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('HLS error:', data);
          const overlay = document.getElementById('player-overlay');
          if (state.isPlayerActive && overlay && !overlay.classList.contains('hidden') && typeof this.playNextStream === 'function') {
            this.playNextStream();
          }
        }
      });
      window.currentHls = hls;
    } else {
      video.src = url;
      triggerAutoPlay();
    }
  },

  playTorrent(infoHash, title) {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerError = document.getElementById('player-error');
    const playerTitle = document.getElementById('player-title');
    
    if (!video || !playerOverlay) return;

    this.closePlayer(); // Reset any previous torrent or video stream

    playerOverlay.classList.remove('hidden');
    video.classList.remove('hidden');
    if (iframe) iframe.classList.add('hidden');

    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = `[WebTorrent] ${title}`;
    
    const loadingText = playerLoading ? playerLoading.querySelector('p') : null;
    if (playerLoading) playerLoading.classList.remove('hidden');
    if (loadingText) loadingText.textContent = 'Conectando aos peers do torrent (WebTorrent)...';

    if (typeof WebTorrent === 'undefined') {
      if (loadingText) loadingText.textContent = 'WebTorrent não carregado. Use o botão Magnet Link.';
      return;
    }

    try {
      if (!window.webtorrentClient) {
        window.webtorrentClient = new WebTorrent();
      }

      const magnetUrl = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(title)}&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce&tr=wss://tracker.openwebtorrent.com`;

      window.webtorrentClient.add(magnetUrl, (torrent) => {
        window.currentTorrent = torrent;
        if (loadingText) loadingText.textContent = 'Procurando arquivo de vídeo...';

        // Find largest video file
        const videoFile = torrent.files.find(file => {
          return file.name.endsWith('.mp4') || file.name.endsWith('.mkv') || file.name.endsWith('.webm') || file.name.endsWith('.avi');
        }) || torrent.files[0];

        if (videoFile) {
          videoFile.renderTo(video, { autoplay: true }, (err) => {
            if (err) {
              console.error('Error rendering torrent file:', err);
              if (playerError) playerError.classList.remove('hidden');
            } else {
              if (playerLoading) playerLoading.classList.add('hidden');
              video.play().catch(e => console.warn('Autoplay prevented:', e));
            }
          });

          torrent.on('download', () => {
            if (loadingText && !playerLoading.classList.contains('hidden')) {
              const progress = (torrent.progress * 100).toFixed(1);
              const speed = (torrent.downloadSpeed / 1024 / 1024).toFixed(2);
              loadingText.textContent = `Carregando vídeo: ${progress}% (${speed} MB/s) - ${torrent.numPeers} peers`;
            }
          });
        } else {
          if (loadingText) loadingText.textContent = 'Nenhum arquivo de vídeo compatível encontrado neste torrent.';
        }
      });
    } catch(err) {
      console.error("WebTorrent error:", err);
      if (playerLoading) playerLoading.classList.add('hidden');
      if (playerError) playerError.classList.remove('hidden');
    }
  },
  
  closePlayer() {
    const playerOverlay = document.getElementById('player-overlay');
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    
    // Stop all auto-play and watchdog timers immediately
    state.isPlayerActive = false;
    state.autoPlaySessionId++;
    if (this.autoTestTimer) {
      clearTimeout(this.autoTestTimer);
      this.autoTestTimer = null;
    }
    if (this.streamWatchdogTimer) {
      clearTimeout(this.streamWatchdogTimer);
      this.streamWatchdogTimer = null;
    }
    if (this.streamLoadWatchdog) {
      clearTimeout(this.streamLoadWatchdog);
      this.streamLoadWatchdog = null;
    }

    if (playerOverlay) playerOverlay.classList.add('hidden');
    
    if (window.currentHls) {
      window.currentHls.destroy();
      window.currentHls = null;
    }
    if (window.currentTorrent) {
      try {
        window.currentTorrent.destroy();
      } catch(e) {}
      window.currentTorrent = null;
    }
    if (iframe) {
      iframe.removeAttribute('sandbox');
      iframe.src = 'about:blank';
      iframe.classList.add('hidden');
    }
    if (video) {
      video.onerror = null;
      video.onplay = null;
      video.onplaying = null;
      video.oncanplay = null;
      video.onloadedmetadata = null;
      video.ontimeupdate = null;
      video.onseeking = null;
      video.onseeked = null;
      video.pause();
      video.removeAttribute('src');
      video.src = '';
      try { video.load(); } catch(e) {}
      video.classList.remove('hidden');
    }

    if (window.rawWindowOpen) {
      window.open = window.rawWindowOpen;
    }
    
    // Refresh Continue Watching carousel
    try {
      this.renderCatalogs();
    } catch(e) {}
  },
  
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500); // fade out duration
    }
  }
};

// Global scroll helper for carousels
window.scrollCarousel = function(id, direction) {
  const track = document.getElementById(`carousel-${id}`);
  if (track) {
    const scrollAmount = 600;
    track.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
};

// Start application
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
