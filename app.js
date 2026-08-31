// Force HTTPS SSL redirect for secure connection padlock
if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
  window.location.href = window.location.href.replace('http:', 'https:');
}

const ADDONS = {
  bestcine: { name: 'BestCine', baseUrl: 'https://bestcine.dpdns.org', icon: '🎬' },
  froststream: { name: 'FrostStream', baseUrl: 'https://froststream.cloutteam.com', icon: '❄️' },
  kingvod: { name: 'King VOD', baseUrl: 'https://kingvod.wasmer.app/index.php', icon: '👑' },
  webplayer: { name: 'Player Web (HD)', baseUrl: '', icon: '🌐' },
  cinemeta: { name: 'Cinemeta', baseUrl: 'https://cinemeta-catalogs.strem.io' }
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

// --- Motor de Tradução e Localização Oficial PT-BR ---

const PTBR_Engine = {
  genresMap: {
    'Action': 'Ação',
    'Adventure': 'Aventura',
    'Animation': 'Animação',
    'Anime': 'Anime',
    'Biography': 'Biografia',
    'Comedy': 'Comédia',
    'Crime': 'Crime',
    'Documentary': 'Documentário',
    'Drama': 'Drama',
    'Family': 'Família',
    'Fantasy': 'Fantasia',
    'Film-Noir': 'Cinema Noir',
    'Game-Show': 'Game Show',
    'History': 'História',
    'Horror': 'Terror',
    'Music': 'Música',
    'Musical': 'Musical',
    'Mystery': 'Mistério',
    'News': 'Notícias',
    'Reality-TV': 'Reality Show',
    'Romance': 'Romance',
    'Sci-Fi': 'Ficção Científica',
    'Science Fiction': 'Ficção Científica',
    'Short': 'Curta-metragem',
    'Sport': 'Esporte',
    'Talk-Show': 'Talk Show',
    'Thriller': 'Suspense',
    'War': 'Guerra',
    'Western': 'Faroeste'
  },

  titlesMap: {
    'Spider-Man: No Way Home': 'Homem-Aranha: Sem Volta Para Casa',
    'Spider-Man: Far From Home': 'Homem-Aranha: Longe de Casa',
    'Spider-Man: Homecoming': 'Homem-Aranha: De Volta ao Lar',
    'Spider-Man: Into the Spider-Verse': 'Homem-Aranha: No Aranhaverso',
    'Spider-Man: Across the Spider-Verse': 'Homem-Aranha: Através do Aranhaverso',
    'Spider-Man': 'Homem-Aranha',
    'Spider-Man 2': 'Homem-Aranha 2',
    'Spider-Man 3': 'Homem-Aranha 3',
    'The Amazing Spider-Man': 'O Espetacular Homem-Aranha',
    'The Amazing Spider-Man 2': 'O Espetacular Homem-Aranha 2: A Ameaça de Electro',
    'Avengers: Endgame': 'Vingadores: Ultimato',
    'Avengers: Infinity War': 'Vingadores: Guerra Infinita',
    'The Avengers': 'Os Vingadores',
    'Avengers: Age of Ultron': 'Vingadores: Era de Ultron',
    'House of the Dragon': 'A Casa do Dragão',
    'Game of Thrones': 'A Guerra dos Tronos',
    'Breaking Bad': 'Breaking Bad: A Química do Mal',
    'The Godfather': 'O Poderoso Chefão',
    'The Godfather Part II': 'O Poderoso Chefão: Parte II',
    'The Godfather Part III': 'O Poderoso Chefão: Parte III',
    'The Lord of the Rings: The Fellowship of the Ring': 'O Senhor dos Anéis: A Sociedade do Anel',
    'The Lord of the Rings: The Two Towers': 'O Senhor dos Anéis: As Duas Torres',
    'The Lord of the Rings: The Return of the King': 'O Senhor dos Anéis: O Retorno do Rei',
    'Inside Out': 'Divertida Mente',
    'Inside Out 2': 'Divertida Mente 2',
    'Avatar: The Way of Water': 'Avatar: O Caminho da Água',
    'Avatar': 'Avatar',
    'Fast X': 'Velozes e Furiosos 10',
    'F9: The Fast Saga': 'Velozes e Furiosos 9',
    'The Fate of the Furious': 'Velozes e Furiosos 8',
    'Furious 7': 'Velozes e Furiosos 7',
    'Fast Five': 'Velozes e Furiosos 5: Operação Rio',
    'How to Train Your Dragon': 'Como Treinar o Seu Dragão',
    'How to Train Your Dragon 2': 'Como Treinar o Seu Dragão 2',
    'How to Train Your Dragon: The Hidden World': 'Como Treinar o Seu Dragão 3: O Mundo Escondido',
    'Puss in Boots: The Last Wish': 'Gato de Botas 2: O Último Pedido',
    'Finding Nemo': 'Procurando Nemo',
    'Finding Dory': 'Procurando Dory',
    'Monsters, Inc.': 'Monstros S.A.',
    'Monsters University': 'Universidade Monstros',
    'Spirited Away': 'A Viagem de Chihiro',
    'Attack on Titan': 'Ataque dos Titãs (Shingeki no Kyojin)',
    'Demon Slayer: Kimetsu no Yaiba': 'Demon Slayer: Kimetsu no Yaiba',
    'Saving Private Ryan': 'O Resgate do Soldado Ryan',
    'The Silence of the Lambs': 'O Silêncio dos Inocentes',
    'Fight Club': 'Clube da Luta',
    'The Dark Knight': 'Batman: O Cavaleiro das Trevas',
    'The Dark Knight Rises': 'Batman: O Cavaleiro das Trevas Ressurge',
    'Batman Begins': 'Batman Begins',
    'Inception': 'A Origem',
    'Interstellar': 'Interestelar',
    'The Hunger Games': 'Jogos Vorazes',
    'The Hunger Games: Catching Fire': 'Jogos Vorazes: Em Chamas',
    'The Hunger Games: Mockingjay - Part 1': 'Jogos Vorazes: A Esperança - Parte 1',
    'The Hunger Games: Mockingjay - Part 2': 'Jogos Vorazes: A Esperança - O Final',
    'Pirates of the Caribbean: The Curse of the Black Pearl': 'Piratas do Caribe: A Maldição do Pérola Negra',
    'Pirates of the Caribbean: Dead Man\'s Chest': 'Piratas do Caribe: O Baú da Morte',
    'Pirates of the Caribbean: At World\'s End': 'Piratas do Caribe: No Fim do Mundo',
    'Guardians of the Galaxy': 'Guardiões da Galáxia',
    'Guardians of the Galaxy Vol. 2': 'Guardiões da Galáxia Vol. 2',
    'Guardians of the Galaxy Vol. 3': 'Guardiões da Galáxia Vol. 3',
    'Doctor Strange': 'Doutor Estranho',
    'Doctor Strange in the Multiverse of Madness': 'Doutor Estranho no Multiverso da Loucura',
    'Black Panther': 'Pantera Negra',
    'Black Panther: Wakanda Forever': 'Pantera Negra: Wakanda Para Sempre',
    'Money Heist': 'La Casa de Papel',
    'Supernatural': 'Sobrenatural',
    'Stranger Things': 'Stranger Things',
    'The Boys': 'The Boys',
    'Invincible': 'Invencível',
    'Shrek': 'Shrek',
    'Shrek 2': 'Shrek 2',
    'Shrek the Third': 'Shrek Terceiro',
    'Shrek Forever After': 'Shrek Para Sempre',
    'Oppenheimer': 'Oppenheimer',
    'Barbie': 'Barbie',
    'The Matrix': 'Matrix',
    'The Matrix Reloaded': 'Matrix Reloaded',
    'The Matrix Revolutions': 'Matrix Revolutions',
    'The Matrix Resurrections': 'Matrix Resurrections',
    'Dune: Part Two': 'Duna: Parte 2',
    'Dune': 'Duna',
    'Gladiator': 'Gladiador',
    'Gladiator II': 'Gladiador II',
    'Moana': 'Moana: Um Mar de Aventuras',
    'Moana 2': 'Moana 2',
    'Wicked': 'Wicked',
    'Joker': 'Coringa',
    'Joker: Folie à Deux': 'Coringa: Delírio a Dois',
    'Venom: The Last Dance': 'Venom: A Última Rodada',
    'The Batman': 'Batman (2022)',
    'Aquaman and the Lost Kingdom': 'Aquaman e o Reino Perdido',
    'The Lion King': 'O Rei Leão',
    'Toy Story': 'Toy Story: Um Mundo de Aventuras',
    'Toy Story 2': 'Toy Story 2',
    'Toy Story 3': 'Toy Story 3',
    'Toy Story 4': 'Toy Story 4',
    'Coco': 'Viva: A Vida é uma Festa',
    'Frozen': 'Frozen: Uma Aventura Congelante',
    'Frozen II': 'Frozen 2',
    'Zootopia': 'Zootopia: Essa Cidade é o Bicho',
    'Big Hero 6': 'Operação Big Hero',
    'Tangled': 'Enrolados',
    'The Incredibles': 'Os Incríveis',
    'Incredibles 2': 'Os Incríveis 2',
    'Cars': 'Carros',
    'Cars 2': 'Carros 2',
    'Cars 3': 'Carros 3',
    'Ratatouille': 'Ratatouille',
    'WALL·E': 'WALL-E',
    'Up': 'Up: Altas Aventuras',
    'Brave': 'Valente',
    'Soul': 'Soul: Uma Vida com Propósito',
    'Luca': 'Luca',
    'Turning Red': 'Red: Crescer é uma Fera',
    'Elemental': 'Elementos',
    'The Shawshank Redemption': 'Um Sonho de Liberdade',
    'Pulp Fiction': 'Pulp Fiction: Tempo de Violência',
    'Forrest Gump': 'Forrest Gump: O Contador de Histórias',
    'GoodFellas': 'Os Bons Companheiros',
    'Se7en': 'Seven: Os Sete Crimes Capitais',
    'The Usual Suspects': 'Os Suspeitos',
    'Léon: The Professional': 'O Profissional',
    'American History X': 'A Outra Face da Violência',
    'The Pianist': 'O Pianista',
    'The Departed': 'Os Infiltrados',
    'The Prestige': 'O Grande Truque',
    'Whiplash': 'Whiplash: Em Busca da Perfeição',
    'Parasite': 'Parasita',
    'Django Unchained': 'Django Livre',
    'Inglourious Basterds': 'Bastardos Inglórios',
    'The Wolf of Wall Street': 'O Lobo de Wall Street',
    'Shutter Island': 'Ilha do Medo',
    'Titanic': 'Titanic',
    'Jurassic Park': 'Parque dos Dinossauros',
    'Jurassic World': 'Jurassic World: O Mundo dos Dinossauros',
    'Alien': 'Alien: O 8º Passageiro',
    'Aliens': 'Aliens: O Resgate',
    'The Terminator': 'O Exterminador do Futuro',
    'Terminator 2: Judgment Day': 'O Exterminador do Futuro 2: O Julgamento Final',
    'Back to the Future': 'De Volta Para o Futuro',
    'Deadpool': 'Deadpool',
    'Deadpool 2': 'Deadpool 2',
    'Deadpool & Wolverine': 'Deadpool & Wolverine',
    'Logan': 'Logan',
    'The Wolf of Wall Street': 'O Lobo de Wall Street'
  },

  translateTitle(title) {
    if (!title) return '';
    const clean = title.trim();
    if (this.titlesMap[clean]) return this.titlesMap[clean];
    
    // Strip trailing year like "Title (2024)"
    const match = clean.match(/^(.+?)\s*\(\d{4}\)$/);
    if (match && this.titlesMap[match[1].trim()]) {
      return this.titlesMap[match[1].trim()];
    }
    return clean;
  },

  translateGenre(genre) {
    if (!genre) return '';
    return this.genresMap[genre.trim()] || genre.trim();
  },

  translateGenres(genres) {
    if (!genres || !Array.isArray(genres)) return [];
    return genres.map(g => this.translateGenre(g));
  },

  async translateText(text) {
    if (!text || typeof text !== 'string' || text.length < 3) return text;
    const cleanText = text.trim();
    
    // Check local storage cache
    const cacheKey = 'jf_tr_' + cleanText.slice(0, 40).replace(/\W/g, '_');
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    // If already in Portuguese, skip network call
    if (/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(cleanText) && /\b(que|para|com|uma|um|ele|ela|onde|quando|sua|seu|filme|série|história|após|sobre)\b/i.test(cleanText)) {
      return cleanText;
    }

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText.slice(0, 450))}&langpair=en|pt-BR`;
      const res = await fetch(url).catch(() => null);
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        const translated = data?.responseData?.translatedText;
        if (translated && translated.length > 5 && !translated.includes('MYMEMORY WARNING')) {
          localStorage.setItem(cacheKey, translated);
          return translated;
        }
      }
    } catch(e) {}
    return cleanText;
  },

  localizeMeta(meta) {
    if (!meta) return meta;
    const localized = { ...meta };
    localized.name = this.translateTitle(meta.name);
    if (meta.genres) {
      localized.genres = this.translateGenres(meta.genres);
    }
    return localized;
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



// --- Toast Notifications Module ---
const Toast = {
  show(message, type = 'info', duration = 2400) {
    try {
      let container = document.getElementById('johnflix-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'johnflix-toast-container';
        container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `johnflix-toast toast-${type}`;
      const bg = type === 'success' 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))' 
        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(109, 40, 217, 0.95))';
      toast.style.cssText = `background:${bg}; color:#ffffff; padding:12px 20px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(139,92,246,0.3); font-weight:600; font-size:0.92rem; display:flex; align-items:center; gap:10px; backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.2); transform:translateY(20px); opacity:0; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1);`;
      toast.innerHTML = `<span>${message}</span>`;

      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });

      setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 350);
      }, duration);
    } catch(e) {
      console.log('Toast:', message);
    }
  }
};

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

        let name = item.name || item.title || '';
        const isServerName = !name || /^(FrostStream|Brazuca|Torrentio|FenixFlix|Servidor|Stream|Embed|Player Web|Vídeo)/i.test(name) || name.includes('Stream ') || name.startsWith('🇧🇷') || name.startsWith('🌐') || name.startsWith('❄️') || name.startsWith('🧲') || name.startsWith('🔥');

        if (isServerName) {
          let foundName = '';
          if (typeof CINEMA_SAGAS !== 'undefined') {
            for (const saga of CINEMA_SAGAS) {
              const match = (saga.items || []).find(i => i.id.startsWith(cleanId));
              if (match) { foundName = match.name; break; }
            }
          }
          if (!foundName && state.currentMeta && state.currentMeta.id.startsWith(cleanId)) {
            foundName = state.currentMeta.name;
          }
          name = foundName || '';
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
    let itemTitle = (state.currentMeta && state.currentMeta.id.startsWith(cleanId)) ? state.currentMeta.name : (extra.name || extra.title || '');

    // Never save server names (e.g. FrostStream, Brazuca, etc.) as the item title
    const isServerTitle = !itemTitle || /^(FrostStream|Brazuca|Torrentio|FenixFlix|Servidor|Stream|Embed|Player Web|Vídeo)/i.test(itemTitle) || itemTitle.includes('Stream ') || itemTitle.startsWith('🇧🇷') || itemTitle.startsWith('🌐');
    if (isServerTitle) {
      itemTitle = (state.currentMeta && state.currentMeta.id.startsWith(cleanId)) ? state.currentMeta.name : '';
    }

    if (!itemTitle && typeof CINEMA_SAGAS !== 'undefined') {
      for (const saga of CINEMA_SAGAS) {
        const match = (saga.items || []).find(i => i.id.startsWith(cleanId));
        if (match) { itemTitle = match.name; break; }
      }
    }

    let itemType = extra.type || (state.currentMeta ? state.currentMeta.type : null) || ((extra.season && extra.season > 1) ? 'series' : (state.currentType === 'series' ? 'series' : 'movie'));

    if (state.currentMeta) {
      const metaCleanId = (state.currentMeta.id || '').split(':')[0];
      if (metaCleanId === cleanId) {
        if (!posterUrl) posterUrl = getPosterUrl(state.currentMeta);
        itemTitle = state.currentMeta.name;
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
    try { localStorage.removeItem('johnflix_progress'); } catch(e) {}
  },

  getWatchlist() {
    try {
      const raw = JSON.parse(localStorage.getItem('johnflix_watchlist') || '{}');
      const sanitized = {};
      Object.keys(raw).forEach(key => {
        const item = raw[key];
        if (!item) return;
        const cleanId = (item.id || key).split(':')[0];
        if (!cleanId) return;

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
    } catch(e) { 
      return window._johnflix_memory_watchlist || {}; 
    }
  },

  isInWatchlist(metaId) {
    if (!metaId) return false;
    const cleanId = (typeof metaId === 'string' ? metaId : (metaId.id || '')).split(':')[0];
    if (!cleanId) return false;
    const watchlist = this.getWatchlist();
    return !!watchlist[cleanId];
  },

  toggleWatchlist(input) {
    try {
      if (!input) return false;
      let cleanId = '';
      let itemMeta = null;

      if (typeof input === 'string') {
        cleanId = input.split(':')[0];
      } else if (typeof input === 'object') {
        cleanId = (input.id || '').split(':')[0];
        itemMeta = input;
      }

      if (!cleanId) return false;

      // Check UI cache if metadata object is missing
      if (!itemMeta && typeof UI !== 'undefined' && UI.metaCache && UI.metaCache[cleanId]) {
        itemMeta = UI.metaCache[cleanId];
      }
      if (!itemMeta && state.heroMeta && state.heroMeta.id.startsWith(cleanId)) {
        itemMeta = state.heroMeta;
      }
      if (!itemMeta && state.currentMeta && state.currentMeta.id.startsWith(cleanId)) {
        itemMeta = state.currentMeta;
      }

      const watchlist = this.getWatchlist();

      if (watchlist[cleanId]) {
        delete watchlist[cleanId];
        try {
          localStorage.setItem('johnflix_watchlist', JSON.stringify(watchlist));
        } catch(e) {
          window._johnflix_memory_watchlist = watchlist;
        }
        return false;
      } else {
        const title = (itemMeta && (itemMeta.name || itemMeta.title)) ? (itemMeta.name || itemMeta.title) : 'Filme / Série';
        const posterUrl = itemMeta ? getPosterUrl(itemMeta) : `https://images.metahub.space/poster/medium/${cleanId}/img`;
        const itemType = (itemMeta && itemMeta.type) ? itemMeta.type : (state.currentType === 'series' ? 'series' : 'movie');
        const year = (itemMeta && (itemMeta.year || itemMeta.releaseInfo)) ? (itemMeta.year || itemMeta.releaseInfo) : '';

        watchlist[cleanId] = {
          id: cleanId,
          name: title,
          poster: posterUrl || `https://images.metahub.space/poster/medium/${cleanId}/img`,
          type: itemType,
          year: year,
          addedAt: Date.now()
        };
        try {
          localStorage.setItem('johnflix_watchlist', JSON.stringify(watchlist));
        } catch(e) {
          window._johnflix_memory_watchlist = watchlist;
        }
        return true;
      }
    } catch(e) {
      console.error('Error toggling watchlist:', e);
      return false;
    }
  }
};

// --- State Management ---

const state = {
  currentType: 'all', // 'all', 'cinema', 'movie', 'series', 'explore', or 'watchlist'
  currentGenre: '',
  exploreGenre: 'Action',
  exploreSaga: null,
  exploreType: 'all',
  exploreQuery: '',
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
  autoPlaySessionId: 0,
  tabEnterPending: false,
  _didInitialType: false
};

const GENRES_LIST = [
  { id: 'Action', label: '💥 Ação' },
  { id: 'Adventure', label: '🗺️ Aventura' },
  { id: 'Animation', label: '🎨 Animação' },
  { id: 'Anime', label: '⛩️ Anime' },
  { id: 'Comedy', label: '😂 Comédia' },
  { id: 'Crime', label: '🕵️ Crime' },
  { id: 'Documentary', label: '📽️ Documentário' },
  { id: 'Drama', label: '🎭 Drama' },
  { id: 'Dorama', label: '🌸 Dorama / K-Drama' },
  { id: 'Family', label: '👨‍👩‍👧 Família' },
  { id: 'Fantasy', label: '🧙 Fantasia' },
  { id: 'History', label: '📜 História' },
  { id: 'Horror', label: '👻 Terror' },
  { id: 'Mystery', label: '🔍 Mistério' },
  { id: 'Romance', label: '❤️ Romance' },
  { id: 'Sci-Fi', label: '🚀 Ficção Científica' },
  { id: 'Sport', label: '⚽ Esporte' },
  { id: 'Thriller', label: '⚡ Suspense' },
  { id: 'War', label: '⚔️ Guerra' },
  { id: 'Western', label: '🤠 Faroeste' }
];

// --- Seção Cinema: Grandes Sagas e Trilogias em Ordem Cronológica ---

// --- Seção Cinema: Grandes Sagas e Trilogias em Ordem Cronológica ---

const CINEMA_SAGAS = [
  {
    id: 'spiderman',
    title: '🕷️ Saga Homem-Aranha (Do Clássico ao Aranhaverso)',
    accent: '#ef4444',
    items: [
      { id: 'tt0145487', name: 'Homem-Aranha', year: '2002', timeline: '1º Filme (Tobey)', type: 'movie' },
      { id: 'tt0316654', name: 'Homem-Aranha 2', year: '2004', timeline: '2º Filme (Tobey)', type: 'movie' },
      { id: 'tt0413300', name: 'Homem-Aranha 3', year: '2007', timeline: '3º Filme (Tobey)', type: 'movie' },
      { id: 'tt0948470', name: 'O Espetacular Homem-Aranha', year: '2012', timeline: '1º Filme (Andrew)', type: 'movie' },
      { id: 'tt1872181', name: 'O Espetacular Homem-Aranha 2: A Ameaça de Electro', year: '2014', timeline: '2º Filme (Andrew)', type: 'movie' },
      { id: 'tt2250912', name: 'Homem-Aranha: De Volta ao Lar', year: '2017', timeline: '1º MCU (Tom Holland)', type: 'movie' },
      { id: 'tt1270797', name: 'Venom', year: '2018', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt4633694', name: 'Homem-Aranha no Aranhaverso', year: '2018', timeline: 'Aranhaverso 1', type: 'movie' },
      { id: 'tt6320628', name: 'Homem-Aranha: Longe de Casa', year: '2019', timeline: '2º MCU (Tom Holland)', type: 'movie' },
      { id: 'tt7097896', name: 'Venom: Tempo de Carnificina', year: '2021', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt10872600', name: 'Homem-Aranha: Sem Volta para Casa', year: '2021', timeline: '3º MCU (Multiverso)', type: 'movie' },
      { id: 'tt5108870', name: 'Morbius', year: '2022', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt9362722', name: 'Homem-Aranha: Através do Aranhaverso', year: '2023', timeline: 'Aranhaverso 2', type: 'movie' },
      { id: 'tt11057302', name: 'Madame Teia', year: '2024', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt16366836', name: 'Venom: A Última Rodada', year: '2024', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt8790086', name: 'Kraven, o Caçador', year: '2024', timeline: 'Universo Aranha (Sony)', type: 'movie' },
      { id: 'tt16360004', name: 'Homem-Aranha: Além do Aranhaverso', year: '2025', timeline: 'Aranhaverso 3', type: 'movie' },
      { id: 'tt22084616', name: 'Homem-Aranha: Brand New Day (Spider-Man 4)', year: '2026', timeline: '4º MCU (Novo Capítulo)', type: 'movie' }
    ]
  },
  {
    id: 'mcu',
    title: '⚡ Marvel Cinematic Universe (MCU - Todos os Filmes em Ordem Cronológica)',
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
      { id: 'tt1981115', name: 'Thor: O Mundo Sombrio', year: '2013', timeline: '2013', type: 'movie' },
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
      { id: 'tt9376612', name: 'Shang-Chi e a Lenda dos Dez Anéis', year: '2021', timeline: '2024', type: 'movie' },
      { id: 'tt9032400', name: 'Eternos', year: '2021', timeline: '2024', type: 'movie' },
      { id: 'tt6320628', name: 'Homem-Aranha: Longe de Casa', year: '2019', timeline: '2024 - Pós-Blip', type: 'movie' },
      { id: 'tt10872600', name: 'Homem-Aranha: Sem Volta para Casa', year: '2021', timeline: '2024 - Multiverso', type: 'movie' },
      { id: 'tt9419884', name: 'Doutor Estranho no Multiverso da Loucura', year: '2022', timeline: '2024', type: 'movie' },
      { id: 'tt10648342', name: 'Thor: Amor e Trovão', year: '2022', timeline: '2024', type: 'movie' },
      { id: 'tt9114286', name: 'Pantera Negra: Wakanda Para Sempre', year: '2022', timeline: '2025', type: 'movie' },
      { id: 'tt10954600', name: 'Homem-Formiga e a Vespa: Quantumania', year: '2023', timeline: '2025 - Kang', type: 'movie' },
      { id: 'tt6791350', name: 'Guardiões da Galáxia Vol. 3', year: '2023', timeline: '2026', type: 'movie' },
      { id: 'tt10676048', name: 'As Marvels', year: '2023', timeline: '2026', type: 'movie' },
      { id: 'tt6263850', name: 'Deadpool & Wolverine', year: '2024', timeline: '2024 - Multiverso TVA', type: 'movie' },
      { id: 'tt14513804', name: 'Capitão América: Admirável Mundo Novo', year: '2025', timeline: '2026 - Sam Wilson', type: 'movie' },
      { id: 'tt20969586', name: 'Thunderbolts*', year: '2025', timeline: '2026 - Nova Equipe', type: 'movie' },
      { id: 'tt10676052', name: 'Quarteto Fantástico: Primeiros Passos', year: '2025', timeline: 'Multiverso Anos 60', type: 'movie' }
    ]
  },
  {
    id: 'dc',
    title: '🦇 DC Universe & Trilogia do Cavaleiro das Trevas',
    accent: '#3b82f6',
    items: [
      { id: 'tt0096895', name: 'Batman', year: '1989', timeline: 'Batman Clássico 1 (Tim Burton)', type: 'movie' },
      { id: 'tt0103776', name: 'Batman: O Retorno', year: '1992', timeline: 'Batman Clássico 2 (Tim Burton)', type: 'movie' },
      { id: 'tt0372784', name: 'Batman Begins', year: '2005', timeline: 'Trilogia Nolan 1', type: 'movie' },
      { id: 'tt0468569', name: 'Batman: O Cavaleiro das Trevas', year: '2008', timeline: 'Trilogia Nolan 2', type: 'movie' },
      { id: 'tt1345836', name: 'Batman: O Cavaleiro das Trevas Ressurge', year: '2012', timeline: 'Trilogia Nolan 3', type: 'movie' },
      { id: 'tt0770828', name: 'O Homem de Aço', year: '2013', timeline: 'DCEU 1 (Superman)', type: 'movie' },
      { id: 'tt2975590', name: 'Batman vs Superman: A Origem da Justiça', year: '2016', timeline: 'DCEU 2', type: 'movie' },
      { id: 'tt1386697', name: 'Esquadrão Suicida', year: '2016', timeline: 'DCEU', type: 'movie' },
      { id: 'tt0451279', name: 'Mulher-Maravilha', year: '2017', timeline: 'DCEU 3 (1918)', type: 'movie' },
      { id: 'tt12361974', name: 'Liga da Justiça de Zack Snyder', year: '2021', timeline: 'DCEU (Snyder Cut)', type: 'movie' },
      { id: 'tt1477834', name: 'Aquaman', year: '2018', timeline: 'DCEU', type: 'movie' },
      { id: 'tt0448115', name: 'Shazam!', year: '2019', timeline: 'DCEU', type: 'movie' },
      { id: 'tt7286456', name: 'Coringa', year: '2019', timeline: 'Elseworlds (Joaquin Phoenix)', type: 'movie' },
      { id: 'tt8574252', name: 'Aves de Rapina', year: '2020', timeline: 'DCEU (Arlequina)', type: 'movie' },
      { id: 'tt3659388', name: 'Mulher-Maravilha 1984', year: '2020', timeline: 'DCEU (1984)', type: 'movie' },
      { id: 'tt6334354', name: 'O Esquadrão Suicida', year: '2021', timeline: 'DCEU (James Gunn)', type: 'movie' },
      { id: 'tt1877830', name: 'The Batman', year: '2022', timeline: 'Elseworlds (Robert Pattinson)', type: 'movie' },
      { id: 'tt6443346', name: 'Adão Negro', year: '2022', timeline: 'DCEU', type: 'movie' },
      { id: 'tt10151854', name: 'Shazam! Fúria dos Deuses', year: '2023', timeline: 'DCEU', type: 'movie' },
      { id: 'tt0439572', name: 'The Flash', year: '2023', timeline: 'DCEU (Ponto de Ignição)', type: 'movie' },
      { id: 'tt9362930', name: 'Besouro Azul', year: '2023', timeline: 'DCEU', type: 'movie' },
      { id: 'tt9663764', name: 'Aquaman 2: O Reino Perdido', year: '2023', timeline: 'DCEU Final', type: 'movie' },
      { id: 'tt11315808', name: 'Coringa: Delírio a Dois', year: '2024', timeline: 'Elseworlds', type: 'movie' },
      { id: 'tt5950044', name: 'Superman', year: '2025', timeline: 'Novo DCU (James Gunn)', type: 'movie' }
    ]
  },
  {
    id: 'starwars',
    title: '⭐ Star Wars (A Linha do Tempo Galáctica Canônica)',
    accent: '#eab308',
    items: [
      { id: 'tt0120915', name: 'Star Wars: Ep. I - A Ameaça Fantasma', year: '1999', timeline: '32 ABY (Origem de Anakin)', type: 'movie' },
      { id: 'tt0121765', name: 'Star Wars: Ep. II - Ataque dos Clones', year: '2002', timeline: '22 ABY (Guerra dos Clones)', type: 'movie' },
      { id: 'tt1185834', name: 'Star Wars: The Clone Wars', year: '2008', timeline: '22 ABY', type: 'movie' },
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
    title: '🧙‍♂️ Harry Potter & Mundo Bruxo (Wizarding World)',
    accent: '#a855f7',
    items: [
      { id: 'tt3183660', name: 'Animais Fantásticos e Onde Habitam', year: '2016', timeline: '1926 (Newt Scamander)', type: 'movie' },
      { id: 'tt4123430', name: 'Animais Fantásticos: Os Crimes de Grindelwald', year: '2018', timeline: '1927', type: 'movie' },
      { id: 'tt4123432', name: 'Animais Fantásticos: Os Segredos de Dumbledore', year: '2022', timeline: '1932 (Guerra Bruxa)', type: 'movie' },
      { id: 'tt0241527', name: 'Harry Potter e a Pedra Filosofal', year: '2001', timeline: '1991 (1º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0295297', name: 'Harry Potter e a Câmara Secreta', year: '2002', timeline: '1992 (2º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0304141', name: 'Harry Potter e o Prisioneiro de Azkaban', year: '2004', timeline: '1993 (3º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0330373', name: 'Harry Potter e o Cálice de Fogo', year: '2005', timeline: '1994 (Torneio Tribruxo)', type: 'movie' },
      { id: 'tt0373889', name: 'Harry Potter e a Ordem da Fênix', year: '2007', timeline: '1995 (5º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0417741', name: 'Harry Potter e o Enigma do Príncipe', year: '2009', timeline: '1996 (6º Ano em Hogwarts)', type: 'movie' },
      { id: 'tt0926084', name: 'Harry Potter e as Relíquias da Morte - Parte 1', year: '2010', timeline: '1997 (Horcruxes)', type: 'movie' },
      { id: 'tt1201607', name: 'Harry Potter e as Relíquias da Morte - Parte 2', year: '2011', timeline: '1998 (Batalha de Hogwarts)', type: 'movie' }
    ]
  },
  {
    id: 'lotr',
    title: '💍 O Senhor dos Anéis & O Hobbit (Terra-Média de Tolkien)',
    accent: '#f59e0b',
    items: [
      { id: 'tt0903624', name: 'O Hobbit: Uma Jornada Inesperada', year: '2012', timeline: 'O Hobbit Parte 1', type: 'movie' },
      { id: 'tt1170358', name: 'O Hobbit: A Desolação de Smaug', year: '2013', timeline: 'O Hobbit Parte 2', type: 'movie' },
      { id: 'tt2310332', name: 'O Hobbit: A Batalha dos Cinco Exércitos', year: '2014', timeline: 'O Hobbit Parte 3', type: 'movie' },
      { id: 'tt0120737', name: 'O Senhor dos Anéis: A Sociedade do Anel', year: '2001', timeline: 'SDA Parte 1', type: 'movie' },
      { id: 'tt0167261', name: 'O Senhor dos Anéis: As Duas Torres', year: '2002', timeline: 'SDA Parte 2', type: 'movie' },
      { id: 'tt0167260', name: 'O Senhor dos Anéis: O Retorno do Rei', year: '2003', timeline: 'SDA Parte 3 (O Fim de Sauron)', type: 'movie' },
      { id: 'tt14824600', name: 'O Senhor dos Anéis: A Guerra dos Rohirrim', year: '2024', timeline: '261 Anos Antes de Frodo', type: 'movie' }
    ]
  },
  {
    id: 'fast',
    title: '🚗 Velozes e Furiosos (Saga Completa)',
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
      { id: 'tt5433138', name: 'Velozes e Furiosos 9', year: '2021', timeline: '9º Filme', type: 'movie' },
      { id: 'tt5433140', name: 'Velozes e Furiosos 10', year: '2023', timeline: '10º Filme', type: 'movie' }
    ]
  },
  {
    id: 'johnwick',
    title: '🥋 John Wick (Saga Baba Yaga)',
    accent: '#10b981',
    items: [
      { id: 'tt2911666', name: 'John Wick: De Volta ao Jogo', year: '2014', timeline: 'Capítulo 1', type: 'movie' },
      { id: 'tt4425200', name: 'John Wick: Um Novo Dia Para Matar', year: '2017', timeline: 'Capítulo 2', type: 'movie' },
      { id: 'tt6146586', name: 'John Wick 3: Parabellum', year: '2019', timeline: 'Capítulo 3', type: 'movie' },
      { id: 'tt10366206', name: 'John Wick 4: Baba Yaga', year: '2023', timeline: 'Capítulo 4 (Final Épico)', type: 'movie' },
      { id: 'tt7181546', name: 'Bailarina (Do Universo de John Wick)', year: '2025', timeline: 'Entre John Wick 3 e 4', type: 'movie' }
    ]
  },
  {
    id: 'transformers',
    title: '🤖 Transformers (Saga Completa de Autobots & Decepticons)',
    accent: '#38bdf8',
    items: [
      { id: 'tt0418279', name: 'Transformers', year: '2007', timeline: '1º Filme', type: 'movie' },
      { id: 'tt1055369', name: 'Transformers: A Vingança dos Derrotados', year: '2009', timeline: '2º Filme', type: 'movie' },
      { id: 'tt1399103', name: 'Transformers: O Lado Oculto da Lua', year: '2011', timeline: '3º Filme', type: 'movie' },
      { id: 'tt2109248', name: 'Transformers: A Era da Extinção', year: '2014', timeline: '4º Filme', type: 'movie' },
      { id: 'tt3371366', name: 'Transformers: O Último Cavaleiro', year: '2017', timeline: '5º Filme', type: 'movie' },
      { id: 'tt4701182', name: 'Bumblebee', year: '2018', timeline: '1987 (Origem)', type: 'movie' },
      { id: 'tt5090568', name: 'Transformers: O Despertar das Feras', year: '2023', timeline: '1994 (Maximals)', type: 'movie' },
      { id: 'tt8864596', name: 'Transformers: O Início', year: '2024', timeline: 'Cybertron (Origem)', type: 'movie' }
    ]
  },
  {
    id: 'missionimpossible',
    title: '🎯 Missão: Impossível (Saga Ethan Hunt)',
    accent: '#ef4444',
    items: [
      { id: 'tt0117060', name: 'Missão: Impossível', year: '1996', timeline: '1º Filme', type: 'movie' },
      { id: 'tt0120755', name: 'Missão: Impossível 2', year: '2000', timeline: '2º Filme', type: 'movie' },
      { id: 'tt0317919', name: 'Missão: Impossível 3', year: '2006', timeline: '3º Filme', type: 'movie' },
      { id: 'tt1229238', name: 'Missão: Impossível - Protocolo Fantasma', year: '2011', timeline: '4º Filme', type: 'movie' },
      { id: 'tt2381249', name: 'Missão: Impossível - Nação Secreta', year: '2015', timeline: '5º Filme', type: 'movie' },
      { id: 'tt4912910', name: 'Missão: Impossível - Efeito Fallout', year: '2018', timeline: '6º Filme', type: 'movie' },
      { id: 'tt9603212', name: 'Missão: Impossível - Acerto de Contas Parte 1', year: '2023', timeline: '7º Filme', type: 'movie' },
      { id: 'tt9603208', name: 'Missão: Impossível - O Acerto Final', year: '2025', timeline: '8º Filme (Acerto de Contas 2)', type: 'movie' }
    ]
  },
  {
    id: 'pirates',
    title: '🏴‍☠️ Piratas do Caribe (Saga Jack Sparrow)',
    accent: '#14b8a6',
    items: [
      { id: 'tt0325980', name: 'Piratas do Caribe: A Maldição do Pérola Negra', year: '2003', timeline: '1º Filme', type: 'movie' },
      { id: 'tt0383574', name: 'Piratas do Caribe: O Baú da Morte', year: '2006', timeline: '2º Filme', type: 'movie' },
      { id: 'tt0449088', name: 'Piratas do Caribe: No Fim do Mundo', year: '2007', timeline: '3º Filme', type: 'movie' },
      { id: 'tt1298650', name: 'Piratas do Caribe: Navegando em Águas Misteriosas', year: '2011', timeline: '4º Filme', type: 'movie' },
      { id: 'tt1790809', name: 'Piratas do Caribe: A Vingança de Salazar', year: '2017', timeline: '5º Filme', type: 'movie' }
    ]
  },
  {
    id: 'matrix',
    title: '🕶️ Saga Matrix',
    accent: '#22c55e',
    items: [
      { id: 'tt0133093', name: 'Matrix', year: '1999', timeline: '1º Filme (Clássico)', type: 'movie' },
      { id: 'tt0234215', name: 'Matrix Reloaded', year: '2003', timeline: '2º Filme', type: 'movie' },
      { id: 'tt0242653', name: 'Matrix Revolutions', year: '2003', timeline: '3º Filme', type: 'movie' },
      { id: 'tt10838180', name: 'Matrix Resurrections', year: '2021', timeline: '4º Filme (Retorno)', type: 'movie' }
    ]
  },
  {
    id: 'hungergames',
    title: '🏹 Jogos Vorazes (The Hunger Games)',
    accent: '#f97316',
    items: [
      { id: 'tt10545296', name: 'Jogos Vorazes: A Cantiga dos Pássaros e das Serpentes', year: '2023', timeline: '64 Anos Antes (Prequel)', type: 'movie' },
      { id: 'tt1392170', name: 'Jogos Vorazes', year: '2012', timeline: '1º Filme (Katniss)', type: 'movie' },
      { id: 'tt1951264', name: 'Jogos Vorazes: Em Chamas', year: '2013', timeline: '2º Filme', type: 'movie' },
      { id: 'tt1951265', name: 'Jogos Vorazes: A Esperança - Parte 1', year: '2014', timeline: '3º Filme', type: 'movie' },
      { id: 'tt1951266', name: 'Jogos Vorazes: A Esperança - O Final', year: '2015', timeline: '4º Filme (Revolução)', type: 'movie' }
    ]
  },
  {
    id: 'jurassic',
    title: '🦖 Jurassic Park & Jurassic World (A Era dos Dinossauros)',
    accent: '#84cc16',
    items: [
      { id: 'tt0107290', name: 'Jurassic Park: O Parque dos Dinossauros', year: '1993', timeline: '1º Parque (Clássico)', type: 'movie' },
      { id: 'tt0119567', name: 'O Mundo Perdido: Jurassic Park', year: '1997', timeline: '2º Filme', type: 'movie' },
      { id: 'tt0163025', name: 'Jurassic Park III', year: '2001', timeline: '3º Filme', type: 'movie' },
      { id: 'tt0369610', name: 'Jurassic World: O Mundo dos Dinossauros', year: '2015', timeline: 'Jurassic World 1', type: 'movie' },
      { id: 'tt4881806', name: 'Jurassic World: Reino Ameaçado', year: '2018', timeline: 'Jurassic World 2', type: 'movie' },
      { id: 'tt8041270', name: 'Jurassic World: Domínio', year: '2022', timeline: 'Jurassic World 3', type: 'movie' },
      { id: 'tt31036941', name: 'Jurassic World: Rebirth', year: '2025', timeline: 'Nova Era dos Dinossauros', type: 'movie' }
    ]
  },
  {
    id: 'apes',
    title: '🦧 Planeta dos Macacos (Saga de César ao Reinado)',
    accent: '#f59e0b',
    items: [
      { id: 'tt1318514', name: 'Planeta dos Macacos: A Origem', year: '2011', timeline: 'Origem de César', type: 'movie' },
      { id: 'tt2103281', name: 'Planeta dos Macacos: O Confronto', year: '2014', timeline: 'A Ascensão dos Símios', type: 'movie' },
      { id: 'tt3450958', name: 'Planeta dos Macacos: A Guerra', year: '2017', timeline: 'A Batalha Final', type: 'movie' },
      { id: 'tt11389872', name: 'Planeta dos Macacos: O Reinado', year: '2024', timeline: 'Gerações Futuras', type: 'movie' }
    ]
  },
  {
    id: 'dune',
    title: '🪐 Saga Duna (O Universo de Arrakis & Paul Atreides)',
    accent: '#f97316',
    items: [
      { id: 'tt0087182', name: 'Duna', year: '1984', timeline: 'Duna Clássico (David Lynch)', type: 'movie' },
      { id: 'tt1160419', name: 'Duna: Parte 1', year: '2021', timeline: 'Duna Livro 1 - Ato 1', type: 'movie' },
      { id: 'tt15239678', name: 'Duna: Parte 2', year: '2024', timeline: 'Duna Livro 1 - Ato 2', type: 'movie' }
    ]
  },
  {
    id: 'shrek',
    title: '🟢 Saga Shrek & Gato de Botas (O Reino de Tão Tão Distante)',
    accent: '#84cc16',
    items: [
      { id: 'tt0126029', name: 'Shrek', year: '2001', timeline: 'Shrek 1 (Oscar)', type: 'movie' },
      { id: 'tt0298148', name: 'Shrek 2', year: '2004', timeline: 'Shrek 2 (Tão Tão Distante)', type: 'movie' },
      { id: 'tt0413267', name: 'Shrek Terceiro', year: '2007', timeline: 'Shrek 3', type: 'movie' },
      { id: 'tt0892791', name: 'Shrek Para Sempre: O Capítulo Final', year: '2010', timeline: 'Shrek 4', type: 'movie' },
      { id: 'tt0448694', name: 'Gato de Botas', year: '2011', timeline: 'Origem do Gato', type: 'movie' },
      { id: 'tt3915174', name: 'Gato de Botas 2: O Último Pedido', year: '2022', timeline: 'A Última Vida', type: 'movie' },
      { id: 'tt6113186', name: 'Shrek 5', year: '2026', timeline: 'O Retorno a Tão Tão Distante', type: 'movie' }
    ]
  },
  {
    id: 'toystory',
    title: '🚀 Saga Toy Story (Ao Infinito e Além)',
    accent: '#ec4899',
    items: [
      { id: 'tt0114709', name: 'Toy Story: Um Mundo de Aventuras', year: '1995', timeline: 'Toy Story 1', type: 'movie' },
      { id: 'tt0120363', name: 'Toy Story 2', year: '1999', timeline: 'Toy Story 2', type: 'movie' },
      { id: 'tt0435761', name: 'Toy Story 3', year: '2010', timeline: 'Toy Story 3 (Sunnyside)', type: 'movie' },
      { id: 'tt1979376', name: 'Toy Story 4', year: '2019', timeline: 'Toy Story 4 (Garfinho)', type: 'movie' },
      { id: 'tt10298810', name: 'Lightyear', year: '2022', timeline: 'Origem do Buzz', type: 'movie' },
      { id: 'tt29355505', name: 'Toy Story 5', year: '2026', timeline: 'Nova Aventura dos Brinquedos', type: 'movie' }
    ]
  },
  {
    id: 'adultanimation',
    title: '🔞 Séries & Desenhos Adultos (Rick and Morty, BoJack, Invencível e mais)',
    accent: '#ef4444',
    items: [
      { id: 'tt0096697', name: 'Os Simpsons', year: '1989', timeline: 'Clássico da Animação', type: 'series' },
      { id: 'tt0121955', name: 'South Park', year: '1997', timeline: 'Sátira & Humor Ácido', type: 'series' },
      { id: 'tt0182576', name: 'Uma Família da Pesada (Family Guy)', year: '1999', timeline: 'Peter Griffin & Família', type: 'series' },
      { id: 'tt0149460', name: 'Futurama', year: '1999', timeline: 'Ficção & Comédia Espacial', type: 'series' },
      { id: 'tt0397306', name: 'American Dad!', year: '2005', timeline: 'Stan Smith & Roger', type: 'series' },
      { id: 'tt0437745', name: 'Frango Robô (Robot Chicken)', year: '2005', timeline: 'Stop-Motion Sátira', type: 'series' },
      { id: 'tt1486217', name: 'Archer', year: '2009', timeline: 'Espionagem & Comédia', type: 'series' },
      { id: 'tt2861424', name: 'Rick and Morty', year: '2013', timeline: 'Multiverso & Ficção Científica', type: 'series' },
      { id: 'tt2950342', name: 'Mr. Pickles', year: '2013', timeline: 'Terror & Humor Extremo', type: 'series' },
      { id: 'tt3398228', name: 'BoJack Horseman', year: '2014', timeline: 'Drama Psicológico & Comédia', type: 'series' },
      { id: 'tt4326894', name: 'F is for Family', year: '2015', timeline: 'Família Anos 70 (Bill Burr)', type: 'series' },
      { id: 'tt6517102', name: 'Castlevania', year: '2017', timeline: 'Fantasia Sombria & Ação', type: 'series' },
      { id: 'tt6524350', name: 'Big Mouth', year: '2017', timeline: 'Puberdade & Monstros', type: 'series' },
      { id: 'tt5363918', name: 'Desencanto (Disenchantment)', year: '2018', timeline: 'Fantasia Medieval (Matt Groening)', type: 'series' },
      { id: 'tt8235236', name: 'Paradise PD', year: '2018', timeline: 'Comédia Policial Ácida', type: 'series' },
      { id: 'tt9561862', name: 'Love, Death & Robots', year: '2019', timeline: 'Antologia Sci-Fi Adulta', type: 'series' },
      { id: 'tt10332508', name: 'Primal (Genndy Tartakovsky)', year: '2019', timeline: 'Ação Brutal Pré-Histórica', type: 'series' },
      { id: 'tt7658402', name: 'Harley Quinn', year: '2019', timeline: 'Vilões DC & Violência', type: 'series' },
      { id: 'tt8910922', name: 'Solar Opposites', year: '2020', timeline: 'Alienígenas na Terra', type: 'series' },
      { id: 'tt10009170', name: 'O Sangue de Zeus (Blood of Zeus)', year: '2020', timeline: 'Mitologia Grega & Ação', type: 'series' },
      { id: 'tt12074628', name: 'Smiling Friends', year: '2020', timeline: 'Comédia Surreal Adult Swim', type: 'series' },
      { id: 'tt6741278', name: 'Invencível (Invincible)', year: '2021', timeline: 'Super-Heróis & Sangue', type: 'series' },
      { id: 'tt11126994', name: 'Arcane', year: '2021', timeline: 'League of Legends (Obra-Prima)', type: 'series' },
      { id: 'tt10231312', name: 'Departamento de Conspirações (Inside Job)', year: '2021', timeline: 'Teorias da Conspiração', type: 'series' },
      { id: 'tt12590266', name: 'Cyberpunk: Edgerunners', year: '2022', timeline: 'Distopia & Ação Frenética', type: 'series' },
      { id: 'tt13309742', name: 'Samurai de Olhos Azuis (Blue Eye Samurai)', year: '2023', timeline: 'Vingança no Japão Feudal', type: 'series' },
      { id: 'tt7216636', name: 'Hazbin Hotel', year: '2024', timeline: 'Inferno & Musicais Adultos', type: 'series' }
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

      // Handle dynamic Saga queries (Marvel, DC, Star Wars, Harry Potter, Spider-Man, Adult Animation, etc.)
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
        'Saga: Piratas do Caribe': ['pirates of the caribbean', 'piratas do caribe'],
        'Saga: Planeta dos Macacos': ['planet of the apes', 'planeta dos macacos'],
        'Saga: Duna': ['dune', 'duna'],
        'Saga: Shrek': ['shrek', 'puss in boots', 'gato de botas'],
        'Saga: Toy Story': ['toy story', 'lightyear'],
        'Saga: Matrix': ['matrix'],
        'Saga: Jogos Vorazes': ['hunger games', 'jogos vorazes'],
        'Saga: Animações Adultas': ['rick and morty', 'bojack horseman', 'south park', 'invincible', 'arcane', 'family guy', 'futurama', 'love death robots', 'cyberpunk edgerunners', 'castlevania', 'archer', 'solar opposites', 'harley quinn', 'primal', 'blue eye samurai']
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
        const res = await fetchWithTimeout(url);
        const data = await res.json();
        return data.metas || [];
      }

      // Fetch multi-page catalog to ensure deep, authentic results
      let urls = [];
      if (catalogId === 'imdbRating') {
        urls.push(`https://cinemeta-catalogs.strem.io/imdbRating/catalog/${type}/imdbRating${genreParam ? `/genre=${encodeURIComponent(genreParam)}` : ''}.json`);
        if (genreParam) {
          urls.push(`https://cinemeta-catalogs.strem.io/imdbRating/catalog/${type}/imdbRating/genre=${encodeURIComponent(genreParam)}/skip=20.json`);
        }
      } else {
        urls.push(`https://cinemeta-catalogs.strem.io/top/catalog/${type}/top${genreParam ? `/genre=${encodeURIComponent(genreParam)}` : ''}.json`);
        if (genreParam) {
          urls.push(`https://cinemeta-catalogs.strem.io/top/catalog/${type}/top/genre=${encodeURIComponent(genreParam)}/skip=20.json`);
        }
      }
      
      const results = await Promise.all(urls.map(u => fetchWithTimeout(u).then(r => r.json()).then(d => d.metas || []).catch(() => [])));
      let combined = results.flat().filter((item, idx, self) => self.findIndex(t => t.id === item.id) === idx);

      // Strict Genre Verification: Only keep titles that authentically belong to the selected genre!
      if (genreParam && !genreParam.startsWith('Saga:')) {
        const targetGenre = genreParam.toLowerCase().trim();
        const filtered = combined.filter(item => {
          if (!item.genres || !Array.isArray(item.genres) || item.genres.length === 0) return true;
          return item.genres.some(g => {
            const gLower = g.toLowerCase();
            return gLower === targetGenre || gLower.includes(targetGenre);
          });
        });
        if (filtered.length > 0) return filtered.map(item => PTBR_Engine.localizeMeta(item));
      }

      return combined.map(item => PTBR_Engine.localizeMeta(item));
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
        const localized = PTBR_Engine.localizeMeta(data.meta);
        if (localized.description) {
          localized.description = await PTBR_Engine.translateText(localized.description);
        }
        return localized;
      }
      
      // Fallback: If requested type was 'movie' (or 'all'), try 'series'
      const altType = reqType === 'movie' ? 'series' : 'movie';
      url = `https://v3-cinemeta.strem.io/meta/${altType}/${cleanId}.json`;
      res = await fetchWithTimeout(url).catch(() => null);
      data = res ? await res.json().catch(() => null) : null;
      
      if (data && data.meta) {
        const localized = PTBR_Engine.localizeMeta(data.meta);
        if (localized.description) {
          localized.description = await PTBR_Engine.translateText(localized.description);
        }
        return localized;
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
      const cleanId = (id || '').split(':')[0].trim();
      let realType = 'movie';
      if (type === 'series' || type === 'tv') {
        realType = 'series';
      } else if (state.currentMeta && (state.currentMeta.type === 'series' || state.currentMeta.type === 'tv')) {
        realType = 'series';
      } else if (id && typeof id === 'string' && (id.includes(':1') || (id.split(':').length > 1))) {
        realType = 'series';
      }

      const streamId = realType === 'series' ? `${cleanId}:${season}:${episode}` : cleanId;
      // Bump cache key to force-refresh stream lists with active BestCine 4K/1080p and FrostStream
      const cacheKey = `st_v150_${streamId}`;
      const cached = Cache.get(cacheKey);
      if (cached && cached.length > 0) return cached;

      // 1. Generate Clean, Fast & Reliable Web Embed Sources
      const isMovie = realType === 'movie';

      const warezCdnUrl = isMovie
        ? `https://embed.warezcdn.net/filme/${cleanId}`
        : `https://embed.warezcdn.net/serie/${cleanId}/${season}/${episode}`;

      const embedderNetUrl = isMovie
        ? `https://embedder.net/e/movie?imdb=${cleanId}`
        : `https://embedder.net/e/tv?imdb=${cleanId}&season=${season}&episode=${episode}`;

      const multiembedUrl = isMovie
        ? `https://multiembed.mov/?video_id=${cleanId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${cleanId}&s=${season}&e=${episode}`;

      const autoEmbedUrl = isMovie
        ? `https://autoembed.co/movie/imdb/${cleanId}`
        : `https://autoembed.co/tv/imdb/${cleanId}/${season}/${episode}`;

      const vidlinkUrl = isMovie
        ? `https://vidlink.pro/movie/${cleanId}`
        : `https://vidlink.pro/tv/${cleanId}/${season}/${episode}`;

      const smashyUrl = isMovie
        ? `https://embed.smashystream.com/playere.php?imdb=${cleanId}`
        : `https://embed.smashystream.com/playere.php?imdb=${cleanId}&season=${season}&episode=${episode}`;

      const cinestreamUrl = isMovie
        ? `https://moviesapi.club/movie/${cleanId}`
        : `https://moviesapi.club/tv/${cleanId}-${season}-${episode}`;

      const twoembedUrl = isMovie
        ? `https://www.2embed.cc/embed/${cleanId}`
        : `https://www.2embed.cc/embedtv/${cleanId}&s=${season}&e=${episode}`;

      const vidsrcDubUrl = isMovie 
        ? `https://vidsrc.me/embed/movie?imdb=${cleanId}&ds_lang=pt&autoplay=1` 
        : `https://vidsrc.me/embed/tv?imdb=${cleanId}&season=${season}&episode=${episode}&ds_lang=pt&autoplay=1`;

      const vidsrcEnUrl = isMovie
        ? `https://vidsrc.in/embed/movie/${cleanId}`
        : `https://vidsrc.in/embed/tv/${cleanId}/${season}/${episode}`;


      const fetchAddon = async (baseUrl, timeoutMs = 4000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const directUrl = `${baseUrl}/stream/${realType}/${streamId}.json`;
          const res = await fetch(directUrl, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
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

      const frostConfiguredUrl = 'https://froststream.cloutteam.com/providers.iptv=checked&providers.cdmoviedb=checked&providers.redeflix=checked&providers.tomato=checked&providers.myembed=checked&providers.anizone=checked&providers.superflix=checked&providers.overflix=checked';
      const frostRailwayUrl = 'https://froststream.up.railway.app';
      const torrentioPtBrUrl = 'https://torrentio.strem.fun/sort=qualitysize|providers=comando,bludv,micoleaodublado,brazuca,yts,torrentgalaxy,eztv,rarbg,1337x,thepiratebay';

      const [bestCineDpdnsRes, bestCineBeamRes, bestCineAltRes, frostRes, frostConfigRes, frostRailRes, kingRes, fenixRes, brazucaRes, micoLeaoRes, torrentioRes, torrentioPtBrRes, tpbPlusRes] = await Promise.allSettled([
        fetchAddon('https://bestcine.dpdns.org', 4000),
        fetchAddon('https://c2bba09da496-bestcine-app.baby-beamup.club', 2500),
        fetchAddon('https://bestcine.alwaysdata.net', 2500),
        fetchAddon('https://froststream.cloutteam.com', 3000),
        fetchAddon(frostConfiguredUrl, 3000),
        fetchAddon(frostRailwayUrl, 3000),
        fetchAddon('https://kingvod.wasmer.app/index.php', 3000),
        fetchAddon('https://fenixflix.fenixhub.online', 2500),
        fetchAddon('https://94c8cb9f702d-brazuca-torrents.baby-beamup.club', 2500),
        fetchAddon('https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club', 2500),
        fetchAddon('https://torrentio.strem.fun', 2500),
        fetchAddon(torrentioPtBrUrl, 2500),
        fetchAddon('https://thepiratebay-plus.strem.fun', 2500)
      ]);

      const bestCineStreams = (bestCineDpdnsRes.status === 'fulfilled' && bestCineDpdnsRes.value.length > 0)
        ? bestCineDpdnsRes.value
        : ((bestCineBeamRes.status === 'fulfilled' && bestCineBeamRes.value.length > 0)
          ? bestCineBeamRes.value
          : (bestCineAltRes.status === 'fulfilled' ? bestCineAltRes.value : []));
      const frostBaseStreams = frostRes.status === 'fulfilled' ? frostRes.value : [];
      const frostConfigStreams = frostConfigRes.status === 'fulfilled' ? frostConfigRes.value : [];
      const frostRailStreams = frostRailRes.status === 'fulfilled' ? frostRailRes.value : [];
      const frostStreams = [...frostBaseStreams, ...frostConfigStreams, ...frostRailStreams];
      const kingStreams = kingRes.status === 'fulfilled' ? kingRes.value : [];
      const fenixStreams = fenixRes.status === 'fulfilled' ? fenixRes.value : [];
      const brazucaStreams = brazucaRes.status === 'fulfilled' ? brazucaRes.value : [];
      const micoLeaoStreams = micoLeaoRes.status === 'fulfilled' ? micoLeaoRes.value : [];
      const torrentioStreams = torrentioRes.status === 'fulfilled' ? torrentioRes.value : [];
      const torrentioPtBrStreams = torrentioPtBrRes.status === 'fulfilled' ? torrentioPtBrRes.value : [];
      const tpbPlusStreams = tpbPlusRes.status === 'fulfilled' ? tpbPlusRes.value : [];

      const streamsList = [];

      // 1. TOP 1 & TOP 2 Direct Stremio Streams: FrostStream (Top 1) & BestCine (Top 2)
      const directVideoSources = [];

      // TOP 1: FrostStream
      frostStreams.forEach(s => {
        if (!s.url) return;
        const rawInfo = `${s.name || ''} ${s.title || ''}`.toLowerCase();
        const isDub = rawInfo.includes('dublado') || rawInfo.includes('português') || rawInfo.includes('portugues') || rawInfo.includes('pt-br') || rawInfo.includes('dual');
        let quality = '1080p Full HD';
        let qScore = 200;
        if (rawInfo.includes('4k') || rawInfo.includes('2160') || rawInfo.includes('uhd')) {
          quality = '4K Ultra HD';
          qScore = 350;
        } else if (rawInfo.includes('1080') || rawInfo.includes('fhd') || rawInfo.includes('bluray') || rawInfo.includes('remux')) {
          quality = '1080p Full HD';
          qScore = 250;
        } else if (rawInfo.includes('720')) {
          quality = '720p HD';
          qScore = 80;
        } else if (rawInfo.includes('480') || rawInfo.includes('360') || rawInfo.includes('cam') || rawInfo.includes('ts')) {
          quality = 'SD';
          qScore = -400;
        }

        directVideoSources.push({
          provider: 'FrostStream',
          name: `❄️ FrostStream ${quality}${isDub ? ' (Dublado PT-BR)' : ''}`,
          title: s.title || `FrostStream ${quality}`,
          url: s.url,
          isDub: isDub,
          quality: quality,
          category: 'frost',
          score: 2000 + qScore + (isDub ? 120 : 0)
        });
      });

      // TOP 2: BestCine
      bestCineStreams.forEach(s => {
        if (!s.url) return;
        const rawInfo = `${s.name || ''} ${s.title || ''}`.toLowerCase();
        const isDub = rawInfo.includes('dublado') || rawInfo.includes('🇧🇷') || rawInfo.includes('português') || rawInfo.includes('portugues');
        let quality = '1080p Full HD';
        let qScore = 200;
        if (rawInfo.includes('4k') || rawInfo.includes('2160') || rawInfo.includes('uhd')) {
          quality = '4K Ultra HD';
          qScore = 350;
        } else if (rawInfo.includes('1080') || rawInfo.includes('fhd') || rawInfo.includes('bluray') || rawInfo.includes('remux')) {
          quality = '1080p Full HD';
          qScore = 250;
        } else if (rawInfo.includes('720')) {
          quality = '720p HD';
          qScore = 80;
        }
        
        let serverName = '';
        const serverMatch = (s.title || '').match(/⚡\s*Servidor\s*([^\n]+)/i) || (s.name || '').match(/\[(.*?)\]/);
        if (serverMatch) serverName = ` [${serverMatch[1].trim()}]`;

        const cleanTitle = s.title ? s.title.replace(/\n/g, ' • ') : `BestCine ${quality}`;
        directVideoSources.push({
          provider: 'BestCine',
          name: `🎬 BestCine${serverName} ${quality} (${isDub ? 'Dublado PT-BR' : 'Legendado'})`,
          title: cleanTitle,
          url: s.url,
          isDub: isDub,
          quality: quality,
          category: 'bestcine',
          score: 1800 + qScore + (isDub ? 120 : 0)
        });
      });

      kingStreams.forEach(s => {
        if (!s.url) return;
        const rawInfo = `${s.name || ''} ${s.title || ''}`.toLowerCase();
        const isDub = rawInfo.includes('dublado') || rawInfo.includes('🇧🇷') || rawInfo.includes('português') || rawInfo.includes('portugues') || !rawInfo.includes('legendado');
        directVideoSources.push({
          provider: 'KingVOD',
          name: `👑 King VOD HD (${isDub ? 'Dublado PT-BR' : 'Legendado'})`,
          title: s.title ? s.title.replace(/\n/g, ' • ') : 'King VOD Stream',
          url: s.url,
          isDub: isDub,
          quality: '1080p',
          category: 'kingvod',
          score: 1200 + (isDub ? 80 : 0)
        });
      });

      fenixStreams.forEach(s => {
        if (!s.url) return;
        const rawInfo = `${s.name || ''} ${s.title || ''}`.toLowerCase();
        const isDub = rawInfo.includes('dublado') || rawInfo.includes('português') || rawInfo.includes('portugues') || rawInfo.includes('pt-br') || rawInfo.includes('dual');
        let quality = 'HD';
        if (rawInfo.includes('4k') || rawInfo.includes('2160')) quality = '4K';
        else if (rawInfo.includes('1080')) quality = '1080p';
        else if (rawInfo.includes('720')) quality = '720p';
        directVideoSources.push({
          provider: 'FenixFlix',
          name: `🔥 FenixFlix ${quality}${isDub ? ' (Dublado PT-BR)' : ''}`,
          title: s.title || `FenixFlix ${quality}`,
          url: s.url,
          isDub: isDub,
          category: 'fenix',
          score: 900 + (quality === '4K' ? 30 : quality === '1080p' ? 20 : 10) + (isDub ? 40 : 0)
        });
      });

      streamsList.push(...directVideoSources);

      const nontonGoUrl = isMovie
        ? `https://www.nontongo.win/embed/movie/${cleanId}`
        : `https://www.nontongo.win/embed/tv/${cleanId}/${season}/${episode}`;

      const myEmbedUrl = isMovie
        ? `https://embed.myembed.top/filme/${cleanId}`
        : `https://embed.myembed.top/serie/${cleanId}/${season}/${episode}`;

      // 2. High-Performance Web Embed Players (Dublado PT-BR & Multi)
      const webEmbedItems = [
        { provider: 'WarezCDN', name: '⚡ WarezCDN HD (Dublado PT-BR)', title: 'Player Principal WarezCDN (Dublado/Nacional)', embedUrl: warezCdnUrl, category: 'web', isDub: true, score: 1500 },
        { provider: 'VidSrc', name: '⚡ VidSrc HD (Dublado PT-BR)', title: 'Player VidSrc HD (Dublado PT-BR)', embedUrl: vidsrcDubUrl, category: 'web', isDub: true, score: 1400 },
        { provider: 'AutoEmbed', name: '⚡ AutoEmbed HD (Dublado / Multi)', title: 'Player AutoEmbed HD Multi-Servidores', embedUrl: autoEmbedUrl, category: 'web', isDub: true, score: 1300 },
        { provider: 'EmbedderNet', name: 'EmbedderNet HD (Dublado PT-BR)', title: 'Player EmbedderNet (Dublado PT-BR)', embedUrl: embedderNetUrl, category: 'web', isDub: true, score: 1100 },
        { provider: 'MultiEmbed', name: '⚡ MultiEmbed Fast HD', title: 'Player MultiEmbed Multi-Servidores', embedUrl: multiembedUrl, category: 'web', isDub: true, score: 1000 },
        { provider: 'VidLink', name: '⚡ VidLink Pro HD (Rápido)', title: 'Player VidLink Pro HD', embedUrl: vidlinkUrl, category: 'web', isDub: true, score: 950 },
        { provider: 'NontonGo', name: 'NontonGo Ultra HD (Multi-Áudio)', title: 'Player NontonGo Ultra HD', embedUrl: nontonGoUrl, category: 'web', isDub: true, score: 850 },
        { provider: 'SmashyStream', name: 'SmashyStream Multi-Server HD', title: 'Player SmashyStream', embedUrl: smashyUrl, category: 'web', isDub: false, score: 750 },
        { provider: '2Embed', name: '2Embed Premium HD', title: 'Player 2Embed HD', embedUrl: twoembedUrl, category: 'web', isDub: false, score: 650 },
        { provider: 'CineStream', name: 'CineStream Club HD', title: 'Player CineStream', embedUrl: cinestreamUrl, category: 'web', isDub: false, score: 550 },
        { provider: 'VidSrc IN', name: 'VidSrc Original (Legendado)', title: 'Player VidSrc Original HD', embedUrl: vidsrcEnUrl, category: 'web', isDub: false, score: 450 }
      ];
      streamsList.push(...webEmbedItems);

      // 3. Native torrents (Brazuca, Mico Leão & Torrentio)
      const torrentSources = [
        ...brazucaStreams.map(s => ({ ...s, customProvider: 'Brazuca Torrents' })),
        ...micoLeaoStreams.map(s => ({ ...s, customProvider: 'Mico Leão' })),
        ...torrentioPtBrStreams.map(s => ({ ...s, customProvider: 'Torrentio PT-BR' })),
        ...torrentioStreams.slice(0, 15).map(s => ({ ...s, customProvider: 'Torrentio' })),
        ...tpbPlusStreams.slice(0, 10).map(s => ({ ...s, customProvider: 'ThePirateBay' }))
      ];

      torrentSources.forEach((s) => {
        const hash = s.infoHash;
        if (!hash) return;

        const titleRaw = (s.name + ' ' + (s.title || '')).toLowerCase();
        const isDub = titleRaw.includes('dublado') || titleRaw.includes('dual') || titleRaw.includes('pt-br') || titleRaw.includes('português') || titleRaw.includes('portugues') || titleRaw.includes('brazuca') || titleRaw.includes('mico') || titleRaw.includes('bludv') || titleRaw.includes('comando') || titleRaw.includes('nacional');
        let quality = '1080p';
        if (titleRaw.includes('4k') || titleRaw.includes('2160')) quality = '4K';
        else if (titleRaw.includes('720')) quality = '720p';

        const trackers = [
          'udp://tracker.opentrackr.org:1337/announce',
          'udp://open.stealth.si:80/announce',
          'udp://tracker.torrent.eu.org:451/announce',
          'udp://tracker.fnix.net:6969/announce'
        ];
        const trackerParams = trackers.map(t => 'tr=' + encodeURIComponent(t)).join('&');
        const magnetUrl = 'magnet:?xt=urn:btih:' + hash + '&dn=' + encodeURIComponent(s.name || 'Stream') + '&' + trackerParams;

        streamsList.push({
          provider: s.customProvider,
          name: s.customProvider + ' ' + quality + (isDub ? ' (Dublado)' : ''),
          title: s.title || s.name || (s.customProvider + ' ' + quality),
          magnetUrl: magnetUrl,
          infoHash: hash,
          isDub: isDub,
          category: 'torrent',
          score: (s.customProvider === 'Brazuca Torrents' || s.customProvider === 'Mico Leão' ? 75 : s.customProvider === 'Torrentio PT-BR' ? 65 : 45) + (isDub ? 30 : 0)
        });
      });

      // Sort streams strictly by highest quality resolution, provider reliability & audio
      streamsList.sort((a, b) => {
        const getQualityWeight = (s) => {
          const n = `${s.name || ''} ${s.title || ''} ${s.quality || ''}`.toLowerCase();
          if (n.includes('4k') || n.includes('2160') || n.includes('uhd')) return 400;
          if (n.includes('1080') || n.includes('fhd') || n.includes('bluray') || n.includes('remux')) return 280;
          if (n.includes('720') || n.includes('hd')) return 120;
          if (n.includes('480') || n.includes('sd') || n.includes('cam')) return -300;
          return 80;
        };

        const scoreA = (a.score || 0) + getQualityWeight(a) + (a.isDub ? 80 : 0);
        const scoreB = (b.score || 0) + getQualityWeight(b) + (b.isDub ? 80 : 0);
        return scoreB - scoreA;
      });

      Cache.set(cacheKey, streamsList);
      return streamsList;
    } catch (error) {
      console.error('Error fetching streams:', error);
      return [];
    }
  },

  async searchContent(type, query) {
    const rawQuery = (query || '').trim();
    if (!rawQuery) return [];

    const norm = rawQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    // Comprehensive Multilingual Portuguese-to-English Search Dictionary
    const ALIAS_MAP = {
      'homem aranha sem volta para casa': 'spider-man no way home',
      'homem aranha': 'spider-man',
      'homem de ferro': 'iron man',
      'capitao america': 'captain america',
      'vingadores ultimato': 'avengers endgame',
      'vingadores guerra infinita': 'avengers infinity war',
      'vingadores': 'the avengers',
      'os vingadores': 'the avengers',
      'senhor dos aneis': 'the lord of the rings',
      'o senhor dos aneis': 'the lord of the rings',
      'guerra nas estrelas': 'star wars',
      'velozes e furiosos 10': 'fast x',
      'velozes e furiosos 9': 'f9',
      'velozes e furiosos': 'fast and furious',
      'planeta dos macacos': 'planet of the apes',
      'jogos vorazes': 'the hunger games',
      'piratas do caribe': 'pirates of the caribbean',
      'uma familia da pesada': 'family guy',
      'o poderoso chefao': 'the godfather',
      'poderoso chefao': 'the godfather',
      'clube da luta': 'fight club',
      'interestelar': 'interstellar',
      'a viagem de chihiro': 'spirited away',
      'ataque dos titas': 'attack on titan',
      'cavaleiro das trevas': 'the dark knight',
      'o cavaleiro das trevas': 'the dark knight',
      'coringa': 'joker',
      'bastardos inglorios': 'inglourious basterds',
      'matrix': 'the matrix',
      'a matrix': 'the matrix',
      'origem': 'inception',
      'a origem': 'inception',
      'resgate do soldado ryan': 'saving private ryan',
      'o resgate do soldado ryan': 'saving private ryan',
      'silencio dos inocentes': 'the silence of the lambs',
      'o silencio dos inocentes': 'the silence of the lambs',
      'gato de botas': 'puss in boots',
      'o gato de botas': 'puss in boots',
      'monstros sa': 'monsters inc',
      'monstros s.a.': 'monsters inc',
      'procurando nemo': 'finding nemo',
      'divertida mente 2': 'inside out 2',
      'divertida mente': 'inside out',
      'divertidamente 2': 'inside out 2',
      'divertidamente': 'inside out',
      'como treinar o seu dragao': 'how to train your dragon',
      'como treinar seu dragao': 'how to train your dragon',
      'samurai de olhos azuis': 'blue eye samurai',
      'invencivel': 'invincible',
      'desencanto': 'disenchantment',
      'sangue de zeus': 'blood of zeus',
      'sobrenatural': 'supernatural',
      'la casa de papel': 'money heist',
      'a casa do dragao': 'house of the dragon',
      'casa do dragao': 'house of the dragon',
      'doutor estranho': 'doctor strange',
      'pantera negra': 'black panther',
      'guardioes da galaxia': 'guardians of the galaxy',
      'guardioes': 'guardians of the galaxy',
      'avatar o caminho da agua': 'avatar the way of water',
      'avatar 2': 'avatar the way of water',
      'creed 3': 'creed iii',
      'creed iii': 'creed 3',
      'deadpool': 'deadpool',
      'wolverine': 'wolverine',
      'batman': 'batman',
      'superman': 'superman',
      'liga da justica': 'justice league'
    };

    const searchQueries = [rawQuery];
    for (const [pt, en] of Object.entries(ALIAS_MAP)) {
      if (norm.includes(pt) || pt.includes(norm)) {
        searchQueries.push(en);
      }
    }

    const uniqueQueries = [...new Set(searchQueries)];
    const targetTypes = (type === 'all' || !type || type === 'cinema' || type === 'watchlist' || type === 'favorites') 
      ? ['movie', 'series'] 
      : [type];

    const fetchPromises = [];
    uniqueQueries.forEach(q => {
      targetTypes.forEach(t => {
        // Query both top catalog AND imdbRating catalog for 100% comprehensive coverage!
        const urlTop = `https://v3-cinemeta.strem.io/catalog/${t}/top/search=${encodeURIComponent(q)}.json`;
        const urlImdb = `https://v3-cinemeta.strem.io/catalog/${t}/imdbRating/search=${encodeURIComponent(q)}.json`;

        fetchPromises.push(
          fetchWithTimeout(urlTop, 4000)
            .then(res => res.json())
            .then(d => (d.metas || []).map(m => ({ ...m, type: m.type || t })))
            .catch(() => [])
        );

        fetchPromises.push(
          fetchWithTimeout(urlImdb, 4000)
            .then(res => res.json())
            .then(d => (d.metas || []).map(m => ({ ...m, type: m.type || t })))
            .catch(() => [])
        );
      });
    });

    // Also include instant local catalog items match
    const localDatabase = [
      ...(state.catalogs.popular || []),
      ...(state.catalogs.featured || []),
      ...(state.catalogs.series || []),
      ...(state.catalogs.anime || []),
      ...(state.watchlist || [])
    ];
    if (typeof CINEMA_SAGAS !== 'undefined') {
      CINEMA_SAGAS.forEach(saga => {
        if (saga.items) localDatabase.push(...saga.items);
      });
    }

    const combinedMap = new Map();

    // Check local database
    localDatabase.forEach(item => {
      if (!item || !item.id) return;
      const n = (item.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      for (const q of uniqueQueries) {
        const nq = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
        if (n.includes(nq) || nq.includes(n)) {
          combinedMap.set(item.id, { ...item, type: item.type || 'movie' });
          break;
        }
      }
    });

    const resultsArray = await Promise.all(fetchPromises);
    resultsArray.flat().forEach(item => {
      if (item && item.id && !combinedMap.has(item.id)) {
        combinedMap.set(item.id, item);
      }
    });

    // Score against all query variants
    const normVariants = uniqueQueries.map(q => q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim());

    const scoreTitle = (name) => {
      if (!name) return 0;
      const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const nClean = n.replace(/^(the|a|an|o|os|as|um|uma)\s+/i, '');

      let bestScore = 0;
      for (const v of normVariants) {
        const vClean = v.replace(/^(the|a|an|o|os|as|um|uma)\s+/i, '');
        if (n === v || nClean === vClean) {
          bestScore = Math.max(bestScore, 1000);
          continue;
        }
        if (n.startsWith(v) || nClean.startsWith(vClean)) {
          bestScore = Math.max(bestScore, 600);
          continue;
        }
        if (n.includes(v) || nClean.includes(vClean)) {
          bestScore = Math.max(bestScore, 400);
          continue;
        }

        const vWords = vClean.split(/\s+/).filter(w => w.length >= 3);
        if (vWords.length > 0) {
          let matchCount = 0;
          vWords.forEach(w => {
            if (nClean.includes(w)) matchCount += 100;
          });
          bestScore = Math.max(bestScore, matchCount);
        }
      }
      return bestScore;
    };

    const finalResults = Array.from(combinedMap.values());
    finalResults.sort((a, b) => {
      const sA = scoreTitle(a.name);
      const sB = scoreTitle(b.name);
      if (sB !== sA) return sB - sA;
      const rA = parseFloat(a.imdbRating) || 0;
      const rB = parseFloat(b.imdbRating) || 0;
      if (rB !== rA) return rB - rA;
      const yA = parseInt(a.year || a.releaseInfo, 10) || 0;
      const yB = parseInt(b.year || b.releaseInfo, 10) || 0;
      return yB - yA;
    });

    return finalResults;
  }
};

// --- 4K Video Visual Enhancement Filter & Post-Processing Engine ---

const VideoEnhancer = {
  currentPreset: 'custom',
  settings: {
    sharpness: 85,
    shadow: 15,
    saturation: 136,
    contrast: 120,
    brightness: 103
  },
  presets: {
    custom: { name: 'Personalizada', sharpness: 85, shadow: 15, saturation: 136, contrast: 120, brightness: 103, filterId: 'johnflix-hdr-ultra' },
    hdr_ultra: { name: 'HDR Ultra Pro', sharpness: 85, shadow: 15, saturation: 136, contrast: 120, brightness: 103, filterId: 'johnflix-hdr-ultra' },
    shadow_boost: { name: 'Clarear Sombras / Menos Preto', sharpness: 70, shadow: 35, saturation: 125, contrast: 110, brightness: 106, filterId: 'johnflix-shadow-boost' },
    super_sharp: { name: 'Super Nitidez 4K', sharpness: 100, shadow: 10, saturation: 122, contrast: 115, brightness: 102, filterId: 'johnflix-sharpen-4k' },
    vivid_colors: { name: 'Cores Vívidas', sharpness: 70, shadow: 15, saturation: 152, contrast: 122, brightness: 104, filterId: null },
    cinema: { name: 'Cinema 4K', sharpness: 75, shadow: 10, saturation: 120, contrast: 116, brightness: 100, filterId: 'johnflix-cinema-4k' },
    extreme: { name: 'Nitidez Extrema', sharpness: 120, shadow: 15, saturation: 128, contrast: 122, brightness: 102, filterId: 'johnflix-extreme-sharp' },
    oled: { name: 'Preto OLED', sharpness: 75, shadow: -15, saturation: 125, contrast: 128, brightness: 97, filterId: null },
    night: { name: 'Modo Noturno', sharpness: 30, shadow: 25, saturation: 105, contrast: 105, brightness: 92, filterId: null, sepia: 8 },
    off: { name: 'Imagem Original', sharpness: 0, shadow: 0, saturation: 100, contrast: 100, brightness: 100, filterId: null }
  },

  init() {
    try {
      const saved = localStorage.getItem('johnflix_video_enhancer');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preset && this.presets[parsed.preset]) {
          this.currentPreset = parsed.preset;
        } else {
          this.currentPreset = 'custom';
        }
        if (parsed.settings) {
          this.settings = { ...this.settings, ...parsed.settings };
          this.presets.custom = { ...this.presets.custom, ...parsed.settings };
        }
      } else {
        this.currentPreset = 'custom';
      }
    } catch(e) {
      this.currentPreset = 'custom';
    }
    this.apply();
  },

  apply() {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    const container = document.getElementById('player-container');
    const overlay = document.getElementById('player-enhancement-overlay');
    const toggleText = document.getElementById('hud-enhancer-text');
    const quickPillName = document.getElementById('hud-quick-enhancer-name');
    const toggleBtn = document.getElementById('hud-enhancer-toggle-btn');
    const quickPill = document.getElementById('hud-quick-enhancer-pill');

    if (!container) return;

    // Remove existing mode classes
    container.className = container.className.replace(/\benhancement-[\w-]+\b/g, '').trim();

    if (this.currentPreset === 'off') {
      container.classList.add('enhancement-off');
      if (video) video.style.filter = '';
      if (iframe) iframe.style.filter = '';
      if (overlay) overlay.style.display = 'none';
      if (toggleBtn) toggleBtn.classList.remove('active');
      if (quickPill) quickPill.classList.remove('active');
      if (toggleText) toggleText.textContent = 'Filtro: Off';
      if (quickPillName) quickPillName.textContent = 'Filtro: Off';
      this.updateUI();
      return;
    }

    container.classList.add(`enhancement-${this.currentPreset.replace(/_/g, '-')}`);
    if (toggleBtn) toggleBtn.classList.add('active');
    if (quickPill) quickPill.classList.add('active');

    const p = this.presets[this.currentPreset] || this.presets.hdr_ultra;
    if (toggleText) toggleText.textContent = p.name;
    if (quickPillName) quickPillName.textContent = p.name;

    // Calculate dynamic filter parameters
    const sat = (this.settings.saturation || p.saturation || 100) / 100;
    const con = (this.settings.contrast || p.contrast || 100) / 100;
    const bri = (this.settings.brightness || p.brightness || 100) / 100;
    const shadowVal = (this.settings.shadow !== undefined) ? this.settings.shadow : (p.shadow || 0);
    const svgFilter = p.filterId ? ` url(#${p.filterId})` : '';
    const sepiaStr = p.sepia ? ` sepia(${p.sepia}%)` : '';

    const filterString = `contrast(${con}) saturate(${sat}) brightness(${bri})${sepiaStr}${svgFilter}`;

    if (video) video.style.filter = filterString;
    if (iframe) iframe.style.filter = filterString;
    if (overlay) {
      overlay.style.display = 'block';
      // Dynamically lift shadows / decrease black crush or deepen blacks
      if (shadowVal > 0) {
        const opacity = Math.min(0.12, shadowVal * 0.0022);
        overlay.style.background = `rgba(255, 255, 255, ${opacity})`;
        overlay.style.mixBlendMode = 'screen';
      } else if (shadowVal < 0) {
        const opacity = Math.min(0.25, Math.abs(shadowVal) * 0.004);
        overlay.style.background = `rgba(0, 0, 0, ${opacity})`;
        overlay.style.mixBlendMode = 'multiply';
      } else {
        overlay.style.background = '';
        overlay.style.mixBlendMode = 'soft-light';
      }
    }

    this.updateUI();

    try {
      localStorage.setItem('johnflix_video_enhancer', JSON.stringify({
        preset: this.currentPreset,
        settings: this.settings
      }));
    } catch(e) {}
  },

  setPreset(presetKey, showToast = true) {
    if (!this.presets[presetKey]) return;
    this.currentPreset = presetKey;
    const p = this.presets[presetKey];
    this.settings.sharpness = p.sharpness;
    this.settings.shadow = p.shadow || 0;
    this.settings.saturation = p.saturation;
    this.settings.contrast = p.contrast;
    this.settings.brightness = p.brightness;
    this.apply();

    if (showToast && typeof UI.showPlayerToast === 'function') {
      const icon = presetKey === 'off' ? '🚫' : '✨';
      UI.showPlayerToast(`${icon} Filtro: ${p.name}`, 1800);
    }
  },

  toggleNext() {
    const keys = Object.keys(this.presets);
    const currIdx = keys.indexOf(this.currentPreset);
    const nextKey = keys[(currIdx + 1) % keys.length];
    this.setPreset(nextKey, true);
  },

  updateUI() {
    // Update active preset button in panel
    document.querySelectorAll('.hud-preset-btn').forEach(btn => {
      if (btn.dataset.preset === this.currentPreset) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update sliders
    const sharpnessSlider = document.getElementById('filter-sharpness-slider');
    const shadowSlider = document.getElementById('filter-shadow-slider');
    const saturationSlider = document.getElementById('filter-saturation-slider');
    const contrastSlider = document.getElementById('filter-contrast-slider');
    const brightnessSlider = document.getElementById('filter-brightness-slider');

    const sharpnessVal = document.getElementById('filter-sharpness-val');
    const shadowVal = document.getElementById('filter-shadow-val');
    const saturationVal = document.getElementById('filter-saturation-val');
    const contrastVal = document.getElementById('filter-contrast-val');
    const brightnessVal = document.getElementById('filter-brightness-val');

    if (sharpnessSlider && sharpnessVal) {
      sharpnessSlider.value = this.settings.sharpness;
      sharpnessVal.textContent = `${this.settings.sharpness}%`;
    }
    if (shadowSlider && shadowVal) {
      const s = (this.settings.shadow !== undefined) ? this.settings.shadow : 15;
      shadowSlider.value = s;
      const sign = s > 0 ? '+' : '';
      shadowVal.textContent = `${sign}${s}%`;
    }
    if (saturationSlider && saturationVal) {
      saturationSlider.value = this.settings.saturation;
      saturationVal.textContent = `${this.settings.saturation}%`;
    }
    if (contrastSlider && contrastVal) {
      contrastSlider.value = this.settings.contrast;
      contrastVal.textContent = `${this.settings.contrast}%`;
    }
    if (brightnessSlider && brightnessVal) {
      brightnessSlider.value = this.settings.brightness;
      brightnessVal.textContent = `${this.settings.brightness}%`;
    }
  }
};

// --- Real-Time Hardware-Accelerated WebGL Super-Resolution / CAS Upscaler ---

const WebGLUpscaler = {
  gl: null,
  canvas: null,
  video: null,
  program: null,
  texture: null,
  positionBuffer: null,
  isRunning: false,
  _rafId: null,

  init() {
    this.canvas = document.getElementById('upscale-canvas');
    this.video = document.getElementById('video-player');
    if (!this.canvas || !this.video) return;

    try {
      this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: false, powerPreference: 'high-performance' })
        || this.canvas.getContext('experimental-webgl');
      if (!this.gl) return;

      const vs = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_pos + 1.0) * 0.5;
          v_uv.y = 1.0 - v_uv.y;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `;

      const fs = `
        precision mediump float;
        varying vec2 v_uv;
        uniform sampler2D u_tex;
        uniform vec2 u_resolution;
        uniform float u_sharpness;
        uniform float u_saturation;
        uniform float u_contrast;
        uniform float u_brightness;
        uniform float u_shadow;

        void main() {
          vec2 texel = 1.0 / u_resolution;
          vec3 c = texture2D(u_tex, v_uv).rgb;
          
          if (u_sharpness > 0.0) {
            vec3 a = texture2D(u_tex, v_uv + vec2(0.0, -texel.y)).rgb;
            vec3 b = texture2D(u_tex, v_uv + vec2(-texel.x, 0.0)).rgb;
            vec3 d = texture2D(u_tex, v_uv + vec2(texel.x, 0.0)).rgb;
            vec3 e = texture2D(u_tex, v_uv + vec2(0.0, texel.y)).rgb;

            vec3 min_rgb = min(min(min(a, b), min(d, e)), c);
            vec3 max_rgb = max(max(max(a, b), max(d, e)), c);
            vec3 amp = clamp(min(min_rgb, 2.0 - max_rgb) / (max_rgb + 0.0001), 0.0, 1.0);
            vec3 w = -sqrt(amp) * (u_sharpness * 0.28);
            c = (a * w.r + b * w.g + c + d * w.b + e * w.r) / (1.0 + 4.0 * w.r);
          }

          c = clamp(c * u_brightness, 0.0, 1.0);
          c = clamp((c - 0.5) * u_contrast + 0.5, 0.0, 1.0);

          if (u_shadow != 0.0) {
            float lum = dot(c, vec3(0.299, 0.587, 0.114));
            float shadowMask = clamp(1.0 - lum * 1.8, 0.0, 1.0);
            c = clamp(c + u_shadow * shadowMask * 0.25, 0.0, 1.0);
          }

          float gray = dot(c, vec3(0.299, 0.587, 0.114));
          c = clamp(mix(vec3(gray), c, u_saturation), 0.0, 1.0);

          gl_FragColor = vec4(c, 1.0);
        }
      `;

      const createShader = (gl, type, source) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      };

      const program = this.gl.createProgram();
      this.gl.attachShader(program, createShader(this.gl, this.gl.VERTEX_SHADER, vs));
      this.gl.attachShader(program, createShader(this.gl, this.gl.FRAGMENT_SHADER, fs));
      this.gl.linkProgram(program);
      this.program = program;

      this.positionBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]), this.gl.STATIC_DRAW);

      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    } catch(e) {
      console.warn('WebGL Upscaler not available:', e);
    }
  },

  start() {
    if (!this.gl || !this.program || !this.video) return;
    if (this.isRunning) return;
    this.isRunning = true;
    if (this.canvas) this.canvas.classList.remove('hidden');

    const render = () => {
      if (!this.isRunning) return;
      if (this.video.readyState >= 2 && !this.video.paused && !this.video.ended) {
        this.drawFrame();
      }
      this._rafId = requestAnimationFrame(render);
    };
    render();
  },

  stop() {
    this.isRunning = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this.canvas) this.canvas.classList.add('hidden');
  },

  drawFrame() {
    if (!this.gl || !this.program || !this.video) return;
    const gl = this.gl;
    const vW = this.video.videoWidth || 1920;
    const vH = this.video.videoHeight || 1080;

    if (this.canvas.width !== vW || this.canvas.height !== vH) {
      this.canvas.width = vW;
      this.canvas.height = vH;
      gl.viewport(0, 0, vW, vH);
    }

    gl.useProgram(this.program);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
    } catch(e) { return; }

    const posLoc = gl.getAttribLocation(this.program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const p = VideoEnhancer.presets[VideoEnhancer.currentPreset] || VideoEnhancer.presets.hdr_ultra;
    const sharp = (VideoEnhancer.settings.sharpness || p.sharpness || 0) / 100.0;
    const sat = (VideoEnhancer.settings.saturation || p.saturation || 100) / 100.0;
    const con = (VideoEnhancer.settings.contrast || p.contrast || 100) / 100.0;
    const bri = (VideoEnhancer.settings.brightness || p.brightness || 100) / 100.0;
    const shd = ((VideoEnhancer.settings.shadow !== undefined) ? VideoEnhancer.settings.shadow : (p.shadow || 0)) / 100.0;

    gl.uniform2f(gl.getUniformLocation(this.program, 'u_resolution'), vW, vH);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_sharpness'), sharp);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_saturation'), sat);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_contrast'), con);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_brightness'), bri);
    gl.uniform1f(gl.getUniformLocation(this.program, 'u_shadow'), shd);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
};

// --- Real-Time Web Audio Equalizer & Sound Enhancement Engine ---

const AudioEngine = {
  ctx: null,
  sourceNode: null,
  gainNode: null,
  bassFilter: null,
  voiceFilter: null,
  trebleFilter: null,
  compressorNode: null,
  isInitialized: false,
  settings: {
    volumeBoost: 100, // 100% to 250%
    voice: 0,
    bass: 0,
    treble: 0,
    compressor: 0
  },
  presets: {
    surround: { name: 'Cinema Surround Pro', voice: 4, bass: 6, treble: 3, volumeBoost: 110, compressor: 20 },
    voice_boost: { name: 'Realce de Voz / Diálogos', voice: 10, bass: -2, treble: 5, volumeBoost: 115, compressor: 35 },
    bass_boost: { name: 'Super Bass Impact', voice: 1, bass: 12, treble: 2, volumeBoost: 110, compressor: 10 },
    night_mode: { name: 'Modo Noturno (Anti-Susto)', voice: 6, bass: -4, treble: 0, volumeBoost: 100, compressor: 80 },
    music: { name: 'Música & Trilha Sonora', voice: 2, bass: 5, treble: 6, volumeBoost: 105, compressor: 10 },
    flat: { name: 'Áudio Original (Flat)', voice: 0, bass: 0, treble: 0, volumeBoost: 100, compressor: 0 }
  },
  currentPreset: 'flat',

  init() {
    const video = document.getElementById('video-player');
    if (this.isInitialized || !video) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Only attach if user explicitly requests custom EQ
      this.sourceNode = this.ctx.createMediaElementSource(video);

      this.bassFilter = this.ctx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 120;
      this.bassFilter.gain.value = this.settings.bass;

      this.voiceFilter = this.ctx.createBiquadFilter();
      this.voiceFilter.type = 'peaking';
      this.voiceFilter.frequency.value = 2500;
      this.voiceFilter.Q.value = 1.2;
      this.voiceFilter.gain.value = this.settings.voice;

      this.trebleFilter = this.ctx.createBiquadFilter();
      this.trebleFilter.type = 'highshelf';
      this.trebleFilter.frequency.value = 8000;
      this.trebleFilter.gain.value = this.settings.treble;

      this.compressorNode = this.ctx.createDynamicsCompressor();
      this.compressorNode.threshold.value = -35;
      this.compressorNode.knee.value = 25;
      this.compressorNode.ratio.value = 8;
      this.compressorNode.attack.value = 0.003;
      this.compressorNode.release.value = 0.25;

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = (this.settings.volumeBoost || 100) / 100;

      this.sourceNode.connect(this.bassFilter);
      this.bassFilter.connect(this.voiceFilter);
      this.voiceFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.compressorNode);
      this.compressorNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.isInitialized = true;
      this.apply();
    } catch(e) {
      console.warn('Web Audio direct connection info:', e);
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },

  apply() {
    const video = document.getElementById('video-player');
    if (video) {
      video.muted = false;
    }
    if (!this.isInitialized) return;
    this.resume();

    if (this.bassFilter) this.bassFilter.gain.value = this.settings.bass;
    if (this.voiceFilter) this.voiceFilter.gain.value = this.settings.voice;
    if (this.trebleFilter) this.trebleFilter.gain.value = this.settings.treble;
    if (this.gainNode) this.gainNode.gain.value = (this.settings.volumeBoost || 100) / 100;
    if (this.compressorNode) {
      const compVal = this.settings.compressor || 0;
      this.compressorNode.threshold.value = -60 + (compVal * 0.45);
    }
    this.updateUI();
  },

  setPreset(key, showToast = true) {
    if (!this.presets[key]) return;
    this.currentPreset = key;
    const p = this.presets[key];
    this.settings.voice = p.voice;
    this.settings.bass = p.bass;
    this.settings.treble = p.treble;
    this.settings.volumeBoost = p.volumeBoost;
    this.settings.compressor = p.compressor;
    this.apply();

    if (showToast && typeof UI.showPlayerToast === 'function') {
      UI.showPlayerToast(`🔊 Equalizador: ${p.name}`, 1800);
    }
  },

  updateUI() {
    document.querySelectorAll('.audio-preset-btn').forEach(b => {
      if (b.dataset.preset === this.currentPreset) b.classList.add('active');
      else b.classList.remove('active');
    });

    const setSlider = (id, val, suffix = ' dB', isPlus = true) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(id + '-val');
      if (el && valEl) {
        el.value = val;
        const sign = (isPlus && val > 0) ? '+' : '';
        valEl.textContent = `${sign}${val}${suffix}`;
      }
    };

    setSlider('audio-volume-boost', this.settings.volumeBoost, '%', false);
    setSlider('audio-voice-boost', this.settings.voice, ' dB', true);
    setSlider('audio-bass-boost', this.settings.bass, ' dB', true);
    setSlider('audio-treble-boost', this.settings.treble, ' dB', true);
    setSlider('audio-night-compressor', this.settings.compressor, '%', false);
  }
};

// --- Subtitles Engine ---

const Subtitles = {
  cache: {},
  activeCues: [],
  currentLang: 'pob',
  syncOffset: 0,
  _rafId: null,
  _lastRenderedText: '',

  async fetchList(imdbId, type, season = 1, episode = 1, lang = 'pob') {
    const cleanId = (imdbId || '').split(':')[0];
    const realType = (type === 'series' || cleanId.includes(':') || (season && episode && type !== 'movie')) ? 'series' : 'movie';
    const subKey = realType === 'series' ? `${cleanId}:${season}:${episode}` : cleanId;
    const cacheKey = `sub_v4_${subKey}_${lang}`;
    if (this.cache[cacheKey]) return this.cache[cacheKey];

    const results = [];

    // 1. Fetch from high-speed Stremio OpenSubtitles v3 Addon (CORS-free, direct UTF-8)
    try {
      const stremioUrl = `https://opensubtitles-v3.strem.io/subtitles/${realType}/${subKey}.json`;
      const res = await fetch(stremioUrl, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        const allSubs = data.subtitles || [];
        const langMatches = allSubs.filter(s => {
          const l = (s.lang || '').toLowerCase();
          if (lang === 'pob') return l === 'pob' || l === 'por' || l === 'pt' || l === 'pt-br' || l === 'brazilian';
          if (lang === 'eng') return l === 'eng' || l === 'en' || l === 'english';
          if (lang === 'spa') return l === 'spa' || l === 'es' || l === 'spanish';
          return l === lang;
        });

        langMatches.forEach(s => {
          results.push({
            url: s.url,
            lang: s.lang,
            SubFileName: s.id || 'OpenSubtitles HD',
            source: 'stremio'
          });
        });
      }
    } catch(e) {}

    // 2. Fetch from OpenSubtitles REST fallback
    try {
      const padId = cleanId.replace('tt', '').padStart(7, '0');
      let restUrl = `https://rest.opensubtitles.org/search/imdbid-${padId}/sublanguageid-${lang}`;
      if (realType === 'series') {
        restUrl = `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${padId}/season-${season}/sublanguageid-${lang}`;
      }

      const res = await fetch(restUrl, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        list.forEach(s => {
          if (s.SubDownloadLink) {
            results.push({
              SubDownloadLink: s.SubDownloadLink,
              SubFormat: s.SubFormat,
              SubFileName: s.SubFileName || s.MovieName,
              SubLanguageID: s.SubLanguageID,
              source: 'rest'
            });
          }
        });
      }
    } catch(e) {}

    this.cache[cacheKey] = results;
    return results;
  },

  cleanSubtitleText(raw) {
    if (!raw) return '';
    return raw
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<[^>]+>/g, '') // remove HTML formatting tags
      .replace(/\{[^\}]+\}/g, '') // remove ASS/SSA positioning tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  },

  timeToSeconds(tStr) {
    if (!tStr) return 0;
    const clean = tStr.trim().replace(',', '.');
    const parts = clean.split(':');
    if (parts.length === 3) {
      return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
    } else if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return parseFloat(clean) || 0;
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

    const isSpamLine = (txt) => {
      const l = txt.toLowerCase();
      return l.includes('opensubtitles') || l.includes('getray.app') || l.includes('tryray.app') 
          || l.includes('osdb.link') || l.includes('legendas por') || l.includes('ansado de procurar')
          || l.includes('watch online movies') || l.includes('subtitles by') || l.includes('sincronizado por');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('-->')) {
        const [startStr, endStr] = line.split('-->');
        currentCue = {
          start: this.timeToSeconds(startStr),
          end: this.timeToSeconds(endStr),
          text: ''
        };
      } else if (currentCue && line !== '' && !line.startsWith('WEBVTT') && isNaN(line)) {
        if (!isSpamLine(line)) {
          const cleanText = this.cleanSubtitleText(line);
          if (cleanText) {
            currentCue.text += (currentCue.text ? '\n' : '') + cleanText;
          }
        }
      } else if (currentCue && line === '') {
        if (currentCue.text.trim() && currentCue.end > currentCue.start) {
          cues.push(currentCue);
        }
        currentCue = null;
      }
    }
    if (currentCue && currentCue.text.trim() && currentCue.end > currentCue.start) {
      cues.push(currentCue);
    }

    // Sort ascending by start time for instant binary search
    cues.sort((a, b) => a.start - b.start);
    return cues;
  },

  findCue(time) {
    if (!this.activeCues || this.activeCues.length === 0) return null;
    let low = 0;
    let high = this.activeCues.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const cue = this.activeCues[mid];
      if (time < cue.start) {
        high = mid - 1;
      } else if (time > cue.end) {
        low = mid + 1;
      } else {
        return cue;
      }
    }
    return null;
  },

  startClockSync(video) {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (!video) return;

    const renderFrame = () => {
      if (!video.paused && !video.ended && this.currentLang !== 'off') {
        this.syncOverlay(video.currentTime);
        this._rafId = requestAnimationFrame(renderFrame);
      }
    };
    this._rafId = requestAnimationFrame(renderFrame);
  },

  stopClockSync() {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  },

  async applySubtitles(lang, imdbId, type, season = 1, episode = 1, chosenIndex = 0) {
    const overlay = document.getElementById('custom-subtitles-overlay');
    const subText = document.getElementById('custom-subtitles-text');
    const video = document.getElementById('video-player');

    this.currentLang = lang;
    this.activeCues = [];
    this._lastRenderedText = '';
    if (subText) subText.textContent = '';
    if (overlay) overlay.classList.add('hidden');

    if (lang === 'off') {
      this.stopClockSync();
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
    
    if (video && !video.paused) {
      this.startClockSync(video);
    } else {
      this.syncOverlay(video ? video.currentTime : 0);
    }
  },

  async downloadAndAttach(subObj, video, langName) {
    if (!subObj) return;

    try {
      let rawSrt = '';

      if (subObj.url) {
        // Direct Stremio subtitle URL
        const res = await fetch(subObj.url);
        if (res.ok) {
          rawSrt = await res.text();
        }
      } else if (subObj.SubDownloadLink) {
        // OpenSubtitles REST link (may be gzip compressed)
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

        try {
          rawSrt = new TextDecoder('utf-8', { fatal: true }).decode(uint8Data);
        } catch(e) {
          rawSrt = new TextDecoder('iso-8859-1').decode(uint8Data);
        }
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
        track.srclang = (subObj.lang || subObj.SubLanguageID || 'pt').slice(0, 2);
        track.src = blobUrl;
        track.default = true;

        video.appendChild(track);
        if (video.textTracks && video.textTracks[0]) {
          video.textTracks[0].mode = 'hidden'; // Custom high-contrast overlay renders text
        }
      }
    } catch(e) {
      console.error('Error applying subtitles:', e);
    }
  },

  clear() {
    this.stopClockSync();
    this.activeCues = [];
    this.syncOffset = 0;
    this._lastRenderedText = '';
    const overlay = document.getElementById('custom-subtitles-overlay');
    const subText = document.getElementById('custom-subtitles-text');
    if (subText) subText.textContent = '';
    if (overlay) overlay.classList.add('hidden');
  },

  autoSync() {
    const video = document.getElementById('video-player');
    if (!video || !this.activeCues || this.activeCues.length === 0) {
      return { success: false, msg: '💬 Ative uma legenda para auto-sincronizar.' };
    }

    const currTime = video.currentTime;
    let closestCue = null;
    let minDiff = Infinity;

    for (const cue of this.activeCues) {
      const diffStart = Math.abs(cue.start - currTime);
      const diffEnd = Math.abs(cue.end - currTime);
      const diffCenter = Math.abs(((cue.start + cue.end) / 2) - currTime);
      const m = Math.min(diffStart, diffEnd, diffCenter);
      if (m < minDiff) {
        minDiff = m;
        closestCue = cue;
      }
    }

    if (closestCue) {
      let calculatedOffset = 0;
      if (currTime >= closestCue.start && currTime <= closestCue.end) {
        calculatedOffset = 0;
      } else if (minDiff < 30) {
        calculatedOffset = (currTime - closestCue.start);
        calculatedOffset = Math.max(-12, Math.min(12, calculatedOffset));
      } else {
        calculatedOffset = 0;
      }

      this.syncOffset = calculatedOffset;
      this.syncOverlay(currTime);
      
      const offsetMs = Math.round(this.syncOffset * 1000);
      return {
        success: true,
        offset: this.syncOffset,
        msg: offsetMs === 0 ? '✨ Legenda 100% sincronizada com a fala!' : `✨ Sincronizado automaticamente (${offsetMs > 0 ? '+' : ''}${offsetMs}ms)`
      };
    }

    this.syncOffset = 0;
    this.syncOverlay(currTime);
    return { success: true, offset: 0, msg: '✨ Legenda sincronizada!' };
  },

  syncOverlay(currentTime) {
    const overlay = document.getElementById('custom-subtitles-overlay');
    const subText = document.getElementById('custom-subtitles-text');

    if (this.currentLang === 'off' || !this.activeCues || this.activeCues.length === 0) {
      if (overlay) overlay.classList.add('hidden');
      return;
    }

    const adjustedTime = currentTime + (this.syncOffset || 0);
    const currentCue = this.findCue(adjustedTime);

    if (currentCue && currentCue.text) {
      if (this._lastRenderedText !== currentCue.text) {
        this._lastRenderedText = currentCue.text;
        if (subText) subText.innerText = currentCue.text;
      }
      if (overlay && overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
      }
    } else {
      this._lastRenderedText = '';
      if (overlay && !overlay.classList.contains('hidden')) {
        overlay.classList.add('hidden');
      }
    }
  }
};

// --- UI Module ---


const Motion = {
  beginTabChange(next) {
    const main = document.getElementById('main-content');
    if (!main) {
      if (typeof next === 'function') next();
      return;
    }
    main.classList.remove('page-enter');
    main.classList.add('tab-fade-out');
    setTimeout(() => {
      if (typeof next === 'function') next();
      main.classList.remove('tab-fade-out');
      void main.offsetWidth;
      main.classList.add('page-enter');
    }, 150);
  },
  pageEnter() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.classList.remove('tab-fade-out');
    main.classList.remove('page-enter');
    void main.offsetWidth;
    main.classList.add('page-enter');
  },
  fadeBlock(el) {
    if (!el) return;
    el.classList.remove('hero-in');
    void el.offsetWidth;
    el.classList.add('hero-in');
  },
  reveal(root) {
    if (!root) return;
    root.querySelectorAll('.section-title, .explore-title, .cinema-saga-title').forEach((el, i) => {
      el.style.setProperty('--in-delay', `${i * 55}ms`);
    });
  }
};

const UI = {
  metaCache: {},
  init() {
    VideoEnhancer.init();
    WebGLUpscaler.init();
    this.bindEvents();
    this.loadInitialData();
  },

  showPlayerToast(message, duration = 2200) {
    const playerOverlay = document.getElementById('player-overlay');
    if (!playerOverlay) return;

    const oldToast = document.getElementById('player-toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.id = 'player-toast-notification';
    toast.className = 'player-toast-notification';
    toast.innerHTML = `<span>${message}</span>`;
    playerOverlay.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 350);
    }, duration);
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
        Motion.beginTabChange(() => this.loadInitialData());
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
          heroTypeName.textContent = state.currentType === 'movie' ? 'Filmes' : (state.currentType === 'series' ? 'Séries' : 'Todos');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        const searchInput = document.getElementById('search-input');
        const activeQuery = searchInput ? searchInput.value.trim() : '';

        if (activeQuery.length > 0) {
          this.performSearch(activeQuery);
        } else {
          this.hideSearchResults();
          Motion.beginTabChange(() => this.loadInitialData());
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
      const debouncedRemoteSearch = debounce((q) => this.performSearch(q), 80);

      searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.trim().length === 0) {
          state.searchSeq = (state.searchSeq || 0) + 1;
          this.hideSearchResults();
        } else {
          debouncedRemoteSearch(val);
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = searchInput.value.trim();
          if (val.length > 0) this.performSearch(val);
        } else if (e.key === 'Escape') {
          searchInput.value = '';
          state.searchSeq = (state.searchSeq || 0) + 1;
          if (searchContainer) searchContainer.classList.remove('active');
          this.hideSearchResults();
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

    // HUD Subtitle Auto-Sync Button (Instant speech-to-subtitle time alignment)
    document.getElementById('hud-sub-auto-sync')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const res = Subtitles.autoSync();
      this.showPlayerToast(res.msg, 2400);
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

    document.getElementById('modal-watchlist-btn')?.addEventListener('click', (e) => {
      this.toggleModalWatchlist(e);
    });
    
    document.getElementById('hero-info-btn')?.addEventListener('click', () => {
      if (state.heroMeta) this.openModal(state.heroMeta.id);
    });

    document.getElementById('hero-watchlist-btn')?.addEventListener('click', () => {
      if (state.heroMeta) {
        const added = User.toggleWatchlist(state.heroMeta);
        this.updateHeroWatchlistBtn();
        Toast.show(added ? '⭐ Adicionado à Minha Lista!' : 'Removido da Minha Lista', added ? 'success' : 'info');
      }
    });

    document.getElementById('hero-prev-btn')?.addEventListener('click', () => {
      this.cycleHero(-1);
    });

    document.getElementById('hero-next-btn')?.addEventListener('click', () => {
      this.cycleHero(1);
    });

    document.querySelectorAll('.hero-prog-dot').forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10) || 0;
        this.setHeroByIndex(idx);
      });
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

    const togglePlayPause = () => {
      if (!video || video.classList.contains('hidden')) return;
      const playBtn = document.getElementById('hud-play-btn');
      const playIcon = document.getElementById('hud-play-icon');
      if (video.paused) {
        video.muted = false;
        video.play().catch(err => {
          console.warn("Play request notice:", err);
        });
        if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        this.showPlayerToast('▶ Reproduzindo', 900);
      } else {
        video.pause();
        if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        this.showPlayerToast('⏸️ Pausado', 900);
      }
    };

    if (playerOverlay) {
      playerOverlay.addEventListener('mousemove', () => {
        resetHudTimer();
        this.onUserPlayerInteraction();
      });
      playerOverlay.addEventListener('touchstart', () => {
        resetHudTimer();
        this.onUserPlayerInteraction();
      }, { passive: true });

      // Desktop Click on Screen -> Seamless Play / Pause (No intrusive on-screen badges or blocking overlays)
      playerOverlay.addEventListener('click', (e) => {
        // Strict guard: Do not toggle pause when clicking controls, buttons, selects, links, or HUD bars
        if (e.target.closest('#player-hud, .hud-source-feedback, .hud-top, .hud-bottom, button, select, a, input, label, option, .modal')) return;
        togglePlayPause();
        resetHudTimer();
        this.onUserPlayerInteraction();
      });

      // Desktop Double-Click on Screen -> Toggle Fullscreen / Skip 10s
      playerOverlay.addEventListener('dblclick', (e) => {
        if (e.target.closest('#player-hud, .hud-source-feedback, button, select, input, a, .hud-top, .hud-bottom')) return;
        const rect = playerOverlay.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (clickX < width * 0.35) {
          if (video && !video.classList.contains('hidden')) {
            video.currentTime = Math.max(0, video.currentTime - 10);
          }
        } else if (clickX > width * 0.65) {
          if (video && !video.classList.contains('hidden') && video.duration) {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
          }
        } else {
          if (!document.fullscreenElement) {
            playerOverlay.requestFullscreen?.().catch(() => {});
          } else {
            document.exitFullscreen?.().catch(() => {});
          }
        }
      });
      
      // Mobile Touch Gesture Recognizer
      let lastTapTime = 0;
      let singleTapTimeout = null;

      playerOverlay.addEventListener('touchend', (e) => {
        // Ignore taps on interactive controls
        if (e.target.closest('#player-hud, .hud-source-feedback, button, select, input, a, .hud-top, .hud-bottom')) return;
        
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
            } else {
              const dur = video.duration || 99999;
              video.currentTime = Math.min(dur, video.currentTime + 10);
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

    // Keyboard Shortcuts (Space/K = Play/Pause, ArrowLeft = -10s, ArrowRight = +10s, F = Fullscreen, M = Mute)
    document.addEventListener('keydown', (e) => {
      if (!state.isPlayerActive || !playerOverlay || playerOverlay.classList.contains('hidden')) return;
      if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) return;

      if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        if (video && !video.classList.contains('hidden')) {
          video.currentTime = Math.max(0, video.currentTime - 10);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (video && !video.classList.contains('hidden') && video.duration) {
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          playerOverlay.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (video) {
          video.muted = !video.muted;
          this.showPlayerToast(video.muted ? '🔇 Mudo' : '🔊 Áudio Ativado', 1500);
        }
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        VideoEnhancer.toggleNext();
      } else if (e.key === 's' || e.key === 'S' || e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        const masterModal = document.getElementById('hud-settings-modal');
        if (masterModal) {
          if (masterModal.classList.contains('hidden')) {
            AudioEngine.init();
            masterModal.classList.remove('hidden');
          } else {
            masterModal.classList.add('hidden');
          }
        }
      } else if (e.key === 'Escape') {
        const masterModal = document.getElementById('hud-settings-modal');
        if (masterModal && !masterModal.classList.contains('hidden')) {
          e.preventDefault();
          e.stopPropagation();
          masterModal.classList.add('hidden');
          return;
        }
      }
    });

    if (hudBackBtn) {
      hudBackBtn.addEventListener('click', () => this.closePlayer());
    }

    // Video Visual Enhancement Filter HUD Controls
    const quickEnhancerPill = document.getElementById('hud-quick-enhancer-pill');
    if (quickEnhancerPill) {
      quickEnhancerPill.addEventListener('click', (e) => {
        e.stopPropagation();
        VideoEnhancer.toggleNext();
      });
    }

    const enhancerToggleBtn = document.getElementById('hud-enhancer-toggle-btn');
    const enhancerPanel = document.getElementById('hud-enhancer-panel');
    const enhancerCloseBtn = document.getElementById('hud-enhancer-close');
    const enhancerResetBtn = document.getElementById('hud-enhancer-reset-btn');

    if (enhancerToggleBtn && enhancerPanel) {
      enhancerToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enhancerPanel.classList.toggle('hidden');
        if (!enhancerPanel.classList.contains('hidden')) {
          VideoEnhancer.updateUI();
        }
      });
    }

    if (enhancerCloseBtn && enhancerPanel) {
      enhancerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        enhancerPanel.classList.add('hidden');
      });
    }

    if (enhancerResetBtn) {
      enhancerResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        VideoEnhancer.settings = { sharpness: 85, shadow: 15, saturation: 136, contrast: 120, brightness: 103 };
        if (VideoEnhancer.presets.custom) {
          VideoEnhancer.presets.custom = { ...VideoEnhancer.presets.custom, ...VideoEnhancer.settings };
        }
        VideoEnhancer.currentPreset = 'custom';
        VideoEnhancer.apply();
        this.showPlayerToast('🛠️ Configuração personalizada restaurada', 1500);
      });
    }

    document.querySelectorAll('.hud-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const preset = btn.dataset.preset;
        if (preset) {
          VideoEnhancer.setPreset(preset);
        }
      });
    });

    const bindEnhancerSlider = (id, prop, valId, suffix = '%') => {
      const slider = document.getElementById(id);
      const valEl = document.getElementById(valId);
      if (slider && valEl) {
        slider.addEventListener('input', (e) => {
          e.stopPropagation();
          const num = parseInt(e.target.value, 10);
          VideoEnhancer.currentPreset = 'custom';
          VideoEnhancer.settings[prop] = num;
          if (VideoEnhancer.presets.custom) {
            VideoEnhancer.presets.custom[prop] = num;
          }
          const sign = (prop === 'shadow' && num > 0) ? '+' : '';
          valEl.textContent = `${sign}${num}${suffix}`;
          VideoEnhancer.apply();
        });
      }
    };

    bindEnhancerSlider('filter-sharpness-slider', 'sharpness', 'filter-sharpness-val');
    bindEnhancerSlider('filter-shadow-slider', 'shadow', 'filter-shadow-val');
    bindEnhancerSlider('filter-saturation-slider', 'saturation', 'filter-saturation-val');
    bindEnhancerSlider('filter-contrast-slider', 'contrast', 'filter-contrast-val');
    bindEnhancerSlider('filter-brightness-slider', 'brightness', 'filter-brightness-val');

    // --- Master Settings Modal Hub (⚙️ Áudio, Vídeo, Qualidade, Legendas) ---
    const masterSettingsModal = document.getElementById('hud-settings-modal');
    const masterSettingsBtn = document.getElementById('hud-master-settings-btn');
    const masterSettingsClose = document.getElementById('hud-settings-close');
    const masterSettingsBackdrop = document.getElementById('hud-settings-backdrop');

    const openMasterSettings = (targetTab = null) => {
      if (!masterSettingsModal) return;
      AudioEngine.init();
      masterSettingsModal.classList.remove('hidden');
      if (targetTab) {
        document.querySelectorAll('.settings-tab-btn').forEach(btn => {
          if (btn.dataset.tab === targetTab) btn.classList.add('active');
          else btn.classList.remove('active');
        });
        document.querySelectorAll('.settings-tab-panel').forEach(panel => {
          if (panel.id === targetTab) panel.classList.add('active');
          else panel.classList.remove('active');
        });
      }
    };

    const closeMasterSettings = () => {
      if (masterSettingsModal) masterSettingsModal.classList.add('hidden');
    };

    if (masterSettingsBtn) {
      masterSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openMasterSettings();
      });
    }

    if (masterSettingsClose) {
      masterSettingsClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMasterSettings();
      });
    }

    if (masterSettingsBackdrop) {
      masterSettingsBackdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMasterSettings();
      });
    }

    // Tabs switching
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.settings-tab-panel').forEach(p => {
          if (p.id === tabId) p.classList.add('active');
          else p.classList.remove('active');
        });
      });
    });

    // Audio Presets
    document.querySelectorAll('.audio-preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.init();
        const preset = btn.dataset.preset;
        if (preset) AudioEngine.setPreset(preset);
      });
    });

    // Audio Equalizer Sliders
    const bindAudioSlider = (id, prop, valId, suffix = ' dB', isPlus = true) => {
      const slider = document.getElementById(id);
      const valEl = document.getElementById(valId);
      if (slider && valEl) {
        slider.addEventListener('input', (e) => {
          e.stopPropagation();
          AudioEngine.init();
          const num = parseInt(e.target.value, 10);
          AudioEngine.settings[prop] = num;
          const sign = (isPlus && num > 0) ? '+' : '';
          valEl.textContent = `${sign}${num}${suffix}`;
          AudioEngine.apply();
        });
      }
    };

    bindAudioSlider('audio-volume-boost', 'volumeBoost', 'audio-volume-boost-val', '%', false);
    bindAudioSlider('audio-voice-boost', 'voice', 'audio-voice-boost-val', ' dB', true);
    bindAudioSlider('audio-bass-boost', 'bass', 'audio-bass-boost-val', ' dB', true);
    bindAudioSlider('audio-treble-boost', 'treble', 'audio-treble-boost-val', ' dB', true);
    bindAudioSlider('audio-night-compressor', 'compressor', 'audio-night-compressor-val', '%', false);

    const audioResetBtn = document.getElementById('audio-reset-btn');
    if (audioResetBtn) {
      audioResetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AudioEngine.setPreset('surround');
      });
    }

    const settingsNextServerBtn = document.getElementById('settings-next-server-btn');
    if (settingsNextServerBtn) {
      settingsNextServerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMasterSettings();
        this.playNextStream();
      });
    }

    // Native Stream Quality Selector
    const qualitySelect = document.getElementById('hud-quality-select');
    if (qualitySelect) {
      qualitySelect.addEventListener('change', (e) => {
        e.stopPropagation();
        this.switchQuality(e.target.value);
      });
    }

    // Source Health & Fast Feedback buttons (ONLY closes on 'Sim'!)
    const feedbackPrompt = document.getElementById('hud-source-feedback');
    const feedbackYesBtn = document.getElementById('hud-feedback-yes-btn');
    const feedbackNoBtn = document.getElementById('hud-feedback-no-btn');
    const nextStreamBtn = document.getElementById('hud-next-stream-btn');

    if (feedbackYesBtn) {
      feedbackYesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.feedbackConfirmed = true;
        state.isAutoCycling = false;
        if (this.autoCycleInterval) {
          clearInterval(this.autoCycleInterval);
          this.autoCycleInterval = null;
        }
        this.dismissFeedbackPrompt();
        this.showPlayerToast('Fonte confirmada!', 1400);
      });
    }

    if (feedbackNoBtn) {
      feedbackNoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.autoCycleInterval) {
          clearInterval(this.autoCycleInterval);
          this.autoCycleInterval = null;
        }
        this.showPlayerToast('Trocando servidor...', 1000);
        this.playNextStream();
      });
    }

    if (nextStreamBtn) {
      nextStreamBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.autoCycleInterval) {
          clearInterval(this.autoCycleInterval);
          this.autoCycleInterval = null;
        }
        this.playNextStream();
      });
    }

    const toggleTopBtn = document.getElementById('hud-toggle-top-btn');
    const hudTop = document.getElementById('hud-top');

    // In-Player Quick Stream Switcher
    const hudStreamSelect = document.getElementById('hud-stream-select');
    if (hudStreamSelect) {
      hudStreamSelect.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        if (!isNaN(idx) && state.activeStreams && state.activeStreams[idx]) {
          this.selectAndPlayStream(idx);
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

    // Next stream server button (bound earlier with feedback buttons)

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

      if (state.currentType === 'watchlist' || state.currentType === 'explore') {
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

    // Filter top 5 spotlight items
    const pool = items.slice(0, 5);
    state.heroSpotlightItems = pool;

    const randomIndex = Math.floor(Math.random() * pool.length);
    state.heroSpotlightIndex = randomIndex;
    const selected = pool[randomIndex];

    state.lastHeroId = selected.id;
    this.setHero(selected, true);
  },

  cycleHero(direction) {
    const pool = state.heroSpotlightItems && state.heroSpotlightItems.length > 0 
      ? state.heroSpotlightItems 
      : (state.catalogs.popular ? state.catalogs.popular.slice(0, 5) : []);
    if (!pool || pool.length === 0) return;

    state.heroSpotlightItems = pool;
    let newIndex = (state.heroSpotlightIndex || 0) + direction;
    if (newIndex < 0) newIndex = pool.length - 1;
    if (newIndex >= pool.length) newIndex = 0;

    state.heroSpotlightIndex = newIndex;
    const selected = pool[newIndex];
    state.lastHeroId = selected.id;
    this.setHero(selected, true);
  },

  setHeroByIndex(index) {
    const pool = state.heroSpotlightItems && state.heroSpotlightItems.length > 0 
      ? state.heroSpotlightItems 
      : (state.catalogs.popular ? state.catalogs.popular.slice(0, 5) : []);
    if (!pool || !pool[index]) return;

    state.heroSpotlightIndex = index;
    const selected = pool[index];
    state.lastHeroId = selected.id;
    this.setHero(selected, true);
  },

  updateHeroWatchlistBtn() {
    const btn = document.getElementById('hero-watchlist-btn');
    const icon = document.getElementById('hero-wl-icon');
    const text = document.getElementById('hero-wl-text');
    if (!btn || !state.heroMeta) return;

    const inList = User.isInWatchlist(state.heroMeta.id);
    if (icon) {
      icon.innerHTML = inList 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
    }
    if (text) text.textContent = inList ? 'Salvo na Lista' : 'Salvar na Lista';
    if (inList) {
      btn.style.background = 'rgba(139, 92, 246, 0.35)';
      btn.style.borderColor = 'var(--accent)';
    } else {
      btn.style.background = '';
      btn.style.borderColor = '';
    }
  },

  updateHeroDots() {
    const activeIdx = state.heroSpotlightIndex || 0;
    document.querySelectorAll('.hero-prog-dot').forEach((dot, idx) => {
      if (idx === activeIdx) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  },

  startHeroAutoRotation() {
    if (state.heroInterval) clearInterval(state.heroInterval);

    state.heroInterval = setInterval(() => {
      // Don't rotate if modal is open or if user is searching or playing video
      const modalOpen = !document.getElementById('movie-modal')?.classList.contains('hidden');
      const playerOpen = !document.getElementById('player-overlay')?.classList.contains('hidden');
      const searchActive = !document.getElementById('search-results')?.classList.contains('hidden');

      if (!modalOpen && !playerOpen && !searchActive && state.catalogs.popular && state.catalogs.popular.length > 0) {
        this.cycleHero(1);
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
    const heroPillLabel = document.getElementById('hero-pill-label');

    const updateDOM = () => {
      const itemType = meta.type || (state.currentType === 'series' ? 'series' : 'movie');
      if (heroTypeName) {
        heroTypeName.textContent = state.currentType === 'cinema' ? 'Seção Cinema' : (itemType === 'series' ? 'Séries' : 'Filmes');
      }
      if (heroPillLabel) {
        const isHighRated = meta.imdbRating && parseFloat(meta.imdbRating) >= 8.0;
        heroPillLabel.textContent = isHighRated ? 'EM ALTA HOJE' : 'RECOMENDADO';
      }
      
      if (heroBackdrop) {
        const bgUrl = getBackgroundUrl(meta);
        heroBackdrop.style.backgroundImage = `url('${bgUrl}')`;
      }
      if (heroTitle) {
        const translatedName = PTBR_Engine.translateTitle(meta.name || '');
        const words = translatedName.split(' ');
        heroTitle.innerHTML = words.map((w, idx) => `<span class="kinetic-word" style="--i:${idx}">${w}</span>`).join(' ');
      }
      if (heroMeta) {
        const year = meta.year || meta.releaseInfo || '';
        const formatBadge = `<span class="hero-meta-badge quality kinetic-badge" style="--i:0">${itemType === 'series' ? 'Série' : 'Filme'}</span>`;
        const quality = `<span class="hero-meta-badge quality kinetic-badge" style="--i:1">4K Ultra HD</span>`;
        const audio = `<span class="hero-meta-badge audio kinetic-badge" style="--i:2">Dublado PT-BR</span>`;
        const runtime = meta.runtime ? `<span class="kinetic-badge" style="--i:3; color:#cbd5e1; font-weight:600;">${meta.runtime}</span>` : '';
        const yearBadge = year ? `<span class="kinetic-badge" style="--i:4; color:#cbd5e1; font-weight:600;">${year}</span>` : '';
        heroMeta.innerHTML = [formatBadge, quality, audio, yearBadge, runtime].filter(Boolean).join(' &nbsp; ');
      }
      if (heroDescription) {
        heroDescription.innerHTML = `<span class="kinetic-desc">${meta.description || 'Sem descrição disponível.'}</span>`;
        if (meta.description && !/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(meta.description)) {
          PTBR_Engine.translateText(meta.description).then(ptDesc => {
            if (ptDesc && state.heroMeta && state.heroMeta.id === meta.id) {
              state.heroMeta.description = ptDesc;
              heroDescription.innerHTML = `<span class="kinetic-desc">${ptDesc}</span>`;
            }
          });
        }
      }

      this.updateHeroWatchlistBtn();
      this.updateHeroDots();
    };

    const playHeroIn = () => {
      updateDOM();
      if (heroContent) {
        heroContent.classList.remove('hero-in');
        void heroContent.offsetWidth;
        heroContent.classList.add('hero-in');
      }
      if (heroBackdrop) {
        heroBackdrop.classList.remove('hero-bg-in');
        void heroBackdrop.offsetWidth;
        heroBackdrop.classList.add('hero-bg-in');
      }
    };
    playHeroIn();
  },
  

  afterCatalogPaint(container) {
    const root = container || document.getElementById('catalog-container');
    if (state.tabEnterPending) {
      state.tabEnterPending = false;
      Motion.pageEnter();
      Motion.reveal(root);
    } else if (!state._didInitialType) {
      state._didInitialType = true;
      Motion.reveal(root);
    }
  },

  createMovieCard(item) {
    if (!item) return '';
    const cleanId = (item.id || '').split(':')[0];
    if (cleanId) this.metaCache[cleanId] = item;

    const posterUrl = getPosterUrl(item);
    const itemType = item.type || (state.currentType === 'series' ? 'series' : 'movie');
    const isSeries = itemType === 'series';
    const displayName = PTBR_Engine.translateTitle(item.name || '');
    const isSaved = User.isInWatchlist(cleanId);

    const bookmarkIcon = isSaved
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="#facc15" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

    return `
      <div class="movie-card" onclick="UI.openModal('${cleanId}', '${itemType}')">
        <div class="movie-poster-wrap">
          <img class="movie-poster" src="${posterUrl}" alt="${displayName}" onerror="this.style.background='linear-gradient(135deg, #141520, #1f2032)'; this.style.minHeight='270px';" loading="lazy">
          <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" data-id="${cleanId}" title="${isSaved ? 'Remover da Minha Lista' : 'Salvar na Minha Lista'}" onclick="event.stopPropagation(); UI.quickToggleWatchlist(event, '${cleanId}')">
            ${bookmarkIcon}
          </button>
          <span class="movie-card-audio-tag">${isSeries ? 'Série' : '4K HDR'}</span>
        </div>
        <div class="movie-card-overlay">
          <div class="movie-card-details">
            <span class="movie-card-title">${displayName}</span>
            <div class="movie-card-meta-row">
              <span class="movie-card-year">${item.year || (isSeries ? 'Série' : 'Filme')}</span>
              <span>•</span>
              <span class="movie-card-audio-label">Dublado PT-BR</span>
            </div>
            <div class="movie-card-actions">
              <button class="card-action-btn play" title="Assistir Agora" onclick="event.stopPropagation(); UI.quickPlayMovie('${cleanId}', '${itemType}')">▶</button>
              <button class="card-action-btn watchlist ${isSaved ? 'active' : ''}" data-id="${cleanId}" title="${isSaved ? 'Remover da Minha Lista' : 'Salvar na Minha Lista'}" onclick="event.stopPropagation(); UI.quickToggleWatchlist(event, '${cleanId}')">
                ${isSaved ? '★' : '☆'}
              </button>
              <button class="card-action-btn" title="Mais Informações" onclick="event.stopPropagation(); UI.openModal('${cleanId}', '${itemType}')">ℹ</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async quickPlayMovie(id, type) {
    const meta = await API.fetchMeta(type || 'movie', id);
    if (meta) {
      state.currentMeta = meta;
      this.autoPlayBestStream();
    } else {
      this.openModal(id, type);
    }
  },

  quickToggleWatchlist(e, cleanId) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!cleanId) return;
    if (this._togglingWatchlist) return;
    this._togglingWatchlist = true;
    setTimeout(() => { this._togglingWatchlist = false; }, 280);

    let meta = null;
    if (state.currentMeta && state.currentMeta.id.startsWith(cleanId)) {
      meta = state.currentMeta;
    }
    if (!meta && state.heroMeta && state.heroMeta.id.startsWith(cleanId)) {
      meta = state.heroMeta;
    }
    if (!meta) {
      const allPool = [
        ...(state.catalogs.popular || []),
        ...(state.catalogs.featured || []),
        ...(state.catalogs.series || []),
        ...(state.catalogs.anime || []),
        ...(state.catalogs.recents || [])
      ];
      meta = allPool.find(x => x && x.id && x.id.startsWith(cleanId));
    }
    if (!meta && typeof CINEMA_SAGAS !== 'undefined') {
      for (const saga of CINEMA_SAGAS) {
        const match = (saga.items || []).find(i => i.id && i.id.startsWith(cleanId));
        if (match) { meta = match; break; }
      }
    }
    if (!meta) {
      const existing = User.getWatchlist();
      meta = existing[cleanId] || {
        id: cleanId,
        name: 'Filme / Série',
        poster: `https://images.metahub.space/poster/medium/${cleanId}/img`,
        type: state.currentType === 'series' ? 'series' : 'movie'
      };
    }

    const added = User.toggleWatchlist(meta);
    const displayName = PTBR_Engine.translateTitle(meta.name || '');
    Toast.show(added ? `⭐ "${displayName}" salvo na Minha Lista!` : `Removido da Minha Lista`, added ? 'success' : 'info');
    
    // Update all matching bookmark & overlay buttons on screen
    document.querySelectorAll(`.card-bookmark-btn[data-id="${cleanId}"]`).forEach(btn => {
      if (added) {
        btn.classList.add('saved');
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="#facc15" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
        btn.title = 'Remover da Minha Lista';
      } else {
        btn.classList.remove('saved');
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
        btn.title = 'Salvar na Minha Lista';
      }
    });

    document.querySelectorAll(`.card-action-btn.watchlist[data-id="${cleanId}"]`).forEach(btn => {
      if (added) {
        btn.classList.add('active');
        btn.textContent = '★';
        btn.title = 'Remover da Minha Lista';
      } else {
        btn.classList.remove('active');
        btn.textContent = '☆';
        btn.title = 'Salvar na Minha Lista';
      }
    });
    
    if (state.heroMeta && state.heroMeta.id.startsWith(cleanId)) {
      this.updateHeroWatchlistBtn();
    }

    if (state.currentMeta && state.currentMeta.id.startsWith(cleanId)) {
      this.updateModalWatchlistBtn();
    }
    
    if (state.currentType === 'watchlist' || state.currentType === 'favorites') {
      this.renderCatalogs();
    }
  },

  createCinemaMovieCard(item, index, accent = '#8b5cf6') {
    const cleanId = item.id.split(':')[0];
    const posterUrl = `https://images.metahub.space/poster/medium/${cleanId}/img`;
    const num = index + 1;
    const formattedNum = num < 10 ? `#0${num}` : `#${num}`;
    const mediaType = item.type || 'movie';
    const isSaved = User.isInWatchlist(cleanId);
    const bookmarkIcon = isSaved
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="#facc15" stroke="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
      : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

    return `
      <div class="movie-card cinema-card" onclick="UI.openModal('${cleanId}', '${mediaType}')">
        <div class="movie-poster-wrap">
          <img class="movie-poster" src="${posterUrl}" alt="${item.name}" onerror="this.style.background='linear-gradient(135deg, #141520, #1f2032)'; this.style.minHeight='270px';" loading="lazy">
          <button class="card-bookmark-btn ${isSaved ? 'saved' : ''}" data-id="${cleanId}" title="${isSaved ? 'Remover da Minha Lista' : 'Salvar na Minha Lista'}" onclick="event.stopPropagation(); UI.quickToggleWatchlist(event, '${cleanId}')">
            ${bookmarkIcon}
          </button>
          <span class="movie-card-badge" style="background:${accent}; color:white;">${formattedNum}</span>
          <span class="movie-card-audio-tag">${item.year}</span>
        </div>
        <div class="movie-card-overlay">
          <div class="movie-card-details">
            <span class="movie-card-title">${item.name}</span>
            <div class="movie-card-meta-row">
              <span class="movie-card-year">${item.timeline || `${item.year} • Capítulo ${num}`}</span>
            </div>
            <div class="movie-card-actions">
              <button class="card-action-btn play" title="Assistir Agora" onclick="event.stopPropagation(); UI.quickPlayMovie('${cleanId}', '${mediaType}')">▶</button>
              <button class="card-action-btn watchlist ${isSaved ? 'active' : ''}" data-id="${cleanId}" title="${isSaved ? 'Remover da Minha Lista' : 'Salvar na Minha Lista'}" onclick="event.stopPropagation(); UI.quickToggleWatchlist(event, '${cleanId}')">
                ${isSaved ? '★' : '☆'}
              </button>
              <button class="card-action-btn" title="Mais Informações" onclick="event.stopPropagation(); UI.openModal('${cleanId}', '${mediaType}')">ℹ</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  createCarousel(title, items, id) {
    if (!items || items.length === 0) return '';
    const cardsHtml = items.map(item => this.createMovieCard(item)).join('');
    
    return `
      <section class="catalog-section">
        <div class="catalog-section-header">
          <div class="section-title-wrap">
            <span class="section-indicator"></span>
            <h2 class="section-title">${title}</h2>
          </div>
          <a href="#" class="section-see-all" onclick="event.preventDefault();">Explorar ›</a>
        </div>
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
    
    let name = item.name || '';
    const isServerName = !name || /^(FrostStream|Brazuca|Torrentio|FenixFlix|Servidor|Stream|Embed|Player Web|Vídeo)/i.test(name) || name.includes('Stream ') || name.startsWith('🇧🇷') || name.startsWith('🌐') || name.startsWith('❄️') || name.startsWith('🧲') || name.startsWith('🔥');

    if (isServerName) {
      if (typeof CINEMA_SAGAS !== 'undefined') {
        for (const saga of CINEMA_SAGAS) {
          const match = (saga.items || []).find(i => i.id.startsWith(cleanId));
          if (match) { name = match.name; break; }
        }
      }
      if (!name || isServerName) {
        if (state.currentMeta && state.currentMeta.id.startsWith(cleanId)) {
          name = state.currentMeta.name;
        }
      }
    }

    if (!name || isServerName) {
      name = 'Filme / Série';
      // Asynchronously fetch real meta name from Cinemeta and update card on screen & storage
      API.fetchMeta(item.type || 'series', cleanId).then(meta => {
        if (meta && meta.name) {
          const cardTitleEl = document.querySelector(`.continue-card[data-id="${cleanId}"] .movie-card-title`);
          if (cardTitleEl) cardTitleEl.textContent = meta.name;
          const progressMap = User.getAllProgress();
          if (progressMap[cleanId]) {
            progressMap[cleanId].name = meta.name;
            if (meta.type) progressMap[cleanId].type = meta.type;
            localStorage.setItem('johnflix_progress', JSON.stringify(progressMap));
          }
        }
      }).catch(() => {});
    }

    const isSeries = item.type === 'series';
    const pct = item.percentage || 0;
    const epBadge = isSeries ? `T${item.season || 1}:E${item.episode || 1}` : '';

    return `
      <div class="movie-card continue-card" data-id="${cleanId}" onclick="UI.openModal('${cleanId}', '${item.type || (isSeries ? 'series' : 'movie')}')">
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

    // Favorites / Watchlist Tab Mode
    if (state.currentType === 'favorites' || state.currentType === 'watchlist') {
      const watchlistMap = User.getWatchlist();
      const favorites = Object.values(watchlistMap).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      
      const recentsPool = [
        ...(state.catalogs.popular || []),
        ...(state.catalogs.featured || [])
      ].slice(0, 10);

      const suggestionsHtml = recentsPool
        .filter(item => item && !User.isInWatchlist(item.id))
        .slice(0, 6)
        .map(item => this.createMovieCard(item))
        .join('');

      html += `
        <div class="search-results watchlist-container" style="padding-top: 100px;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:2rem; padding: 0 4%;">
            <div>
              <h1 class="section-title" style="margin-bottom:0.25rem; padding-left:0; font-size:2rem; color:#ffffff; display:flex; align-items:center; gap:10px;">
                <span>⭐</span> Minha Lista (${favorites.length})
              </h1>
              <p style="color:var(--text-secondary); font-size:0.9rem;">Seus filmes e séries favoritos salvos para assistir quando quiser.</p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <button class="btn btn-primary" onclick="document.getElementById('search-toggle')?.click(); document.getElementById('search-input')?.focus();" style="padding:10px 20px; font-size:0.9rem; gap:8px;">
                🔍 Buscar & Adicionar
              </button>
            </div>
          </div>
      `;

      if (favorites.length > 0) {
        const cardsHtml = favorites.map(item => this.createMovieCard(item)).join('');
        html += `
            <div class="search-grid" style="padding: 0 4%;">
              ${cardsHtml}
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="empty-state watchlist-container" style="text-align:center; padding: 60px 20px 40px;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem; color: #facc15;">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; color: white;">Sua lista ainda está vazia</h2>
            <p style="color: var(--text-secondary); max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Clique no ícone de <strong>Bookmark (🔖)</strong> no canto de qualquer filme ou no botão <strong>"Adicionar à Minha Lista"</strong> dentro dos detalhes!
            </p>
          </div>
        `;
        if (suggestionsHtml) {
          html += `
            <div style="margin-top: 2rem; padding: 0 4%;">
              <h3 style="color:#ffffff; font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Sugestões Populares para sua Lista:</h3>
              <div class="search-grid">
                ${suggestionsHtml}
              </div>
            </div>
          `;
        }
        html += `</div>`;
      }
      container.innerHTML = html;
      this.afterCatalogPaint(container);
      return;
    }

    // Seção Cinema Mode (Grandes Sagas e Trilogias em Ordem Cronológica)
    if (state.currentType === 'cinema') {
      CINEMA_SAGAS.forEach(saga => {
        // Automatic chronological ordering by release year:
        const sortedItems = [...saga.items].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0));
        const cardsHtml = sortedItems.map((item, idx) => this.createCinemaMovieCard(item, idx, saga.accent)).join('');
        html += `
          <section class="catalog-section cinema-saga-section" id="saga-${saga.id}">
            <div class="cinema-saga-header">
              <div class="cinema-saga-title-wrap">
                <span class="cinema-saga-indicator" style="background:${saga.accent}; color:${saga.accent};"></span>
                <h2 class="cinema-saga-title">
                  ${saga.title}
                </h2>
              </div>
            </div>
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
      this.afterCatalogPaint(container);
      return;
    }

    // Normal Movies / Series Catalog Mode
    const typeName = state.currentType === 'all' ? 'Filmes & Séries' : (state.currentType === 'movie' ? 'Filmes' : 'Séries');

    // 1. Continuar Assistindo & 2. Minha Lista Carousel
    const showPersonalRows = state.currentType === 'all' || state.currentType === 'movie' || state.currentType === 'series';
    if (showPersonalRows) {
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
    
    // Dedicated Explore Tab
    if (state.currentType === 'explore') {
      this.renderExploreHub();
      return;
    }

    if (!html) {
      html = '<div class="empty-state">Nenhum conteúdo encontrado.</div>';
    }
    
    container.innerHTML = html;
    this.afterCatalogPaint(container);
  },

  renderExploreHub() {
    const container = document.getElementById('catalog-container');
    if (!container) return;

    const currentGenre = state.exploreGenre || 'Action';
    const currentSaga = state.exploreSaga || null;
    const currentExploreType = state.exploreType || 'all';

    const genresHtml = GENRES_LIST.map(g => `
      <button class="explore-chip ${(!currentSaga && currentGenre === g.id) ? 'active' : ''}" data-genre="${g.id}">
        ${g.label}
      </button>
    `).join('');

    const sagasHtml = CINEMA_SAGAS.map(s => `
      <button class="explore-chip ${(currentSaga === s.id) ? 'active' : ''}" data-saga="${s.id}">
        ${s.title.split('(')[0].trim()}
      </button>
    `).join('');

    container.innerHTML = `
      <div class="explore-hub">
        <div class="explore-header">
          <h1 class="explore-title">🧭 Explorar & Descobrir</h1>
          <p class="explore-subtitle">Pesquise títulos ou selecione gêneros e universos do cinema para navegar</p>
        </div>

        <div class="explore-search-wrap">
          <div class="explore-search-bar">
            <span class="explore-search-icon">🔍</span>
            <input type="text" id="explore-search-input" class="explore-search-input" placeholder="Buscar filmes, séries, sagas e animes..." value="${state.exploreQuery || ''}">
            <button id="explore-search-clear" class="explore-search-clear ${state.exploreQuery ? '' : 'hidden'}" title="Limpar busca">✕</button>
          </div>
        </div>

        <div class="explore-type-filters">
          <button class="explore-type-btn ${currentExploreType === 'all' ? 'active' : ''}" data-explore-type="all">🍿 Todos</button>
          <button class="explore-type-btn ${currentExploreType === 'movie' ? 'active' : ''}" data-explore-type="movie">🎬 Filmes</button>
          <button class="explore-type-btn ${currentExploreType === 'series' ? 'active' : ''}" data-explore-type="series">📺 Séries</button>
        </div>

        <div class="explore-section-label">
          <span>🎬</span> Gêneros Populares
        </div>
        <div class="explore-chips-container" id="explore-genres-list">
          ${genresHtml}
        </div>

        <div class="explore-section-label">
          <span>⚡</span> Sagas & Universos do Cinema
        </div>
        <div class="explore-chips-container" id="explore-sagas-list">
          ${sagasHtml}
        </div>

        <div class="explore-results-container">
          <div class="explore-results-title-bar">
            <h2 class="explore-results-title" id="explore-results-title">Carregando conteúdos...</h2>
            <span class="explore-results-count" id="explore-results-count"></span>
          </div>
          <div class="search-grid" id="explore-grid">
            <div class="streams-loading" style="grid-column: 1 / -1; padding: 4rem 0;">
              <div class="spinner"></div>
              <span>Carregando títulos...</span>
            </div>
          </div>
        </div>
      </div>
    `;
    this.afterCatalogPaint(container);

    // Bind event listeners
    const searchInput = document.getElementById('explore-search-input');
    const clearBtn = document.getElementById('explore-search-clear');

    if (searchInput) {
      const debouncedSearch = debounce((q) => {
        state.exploreQuery = q.trim();
        if (state.exploreQuery) {
          if (clearBtn) clearBtn.classList.remove('hidden');
          this.searchExploreContent(state.exploreQuery);
        } else {
          if (clearBtn) clearBtn.classList.add('hidden');
          this.loadExploreContent();
        }
      }, 150);

      searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.exploreQuery = '';
        clearBtn.classList.add('hidden');
        this.loadExploreContent();
      });
    }

    // Type filter buttons
    document.querySelectorAll('[data-explore-type]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-explore-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.exploreType = btn.dataset.exploreType;
        if (state.exploreQuery) {
          this.searchExploreContent(state.exploreQuery);
        } else {
          this.loadExploreContent();
        }
      });
    });

    // Genre Chips
    document.querySelectorAll('[data-genre]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('[data-genre], [data-saga]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.exploreGenre = chip.dataset.genre;
        state.exploreSaga = null;
        state.exploreQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        this.loadExploreContent();
      });
    });

    // Saga Chips
    document.querySelectorAll('[data-saga]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('[data-genre], [data-saga]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.exploreSaga = chip.dataset.saga;
        state.exploreGenre = null;
        state.exploreQuery = '';
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
        this.loadExploreContent();
      });
    });

    // Load initial content for explore tab
    if (state.exploreQuery) {
      this.searchExploreContent(state.exploreQuery);
    } else {
      this.loadExploreContent();
    }
  },

  async loadExploreContent() {
    const grid = document.getElementById('explore-grid');
    const titleEl = document.getElementById('explore-results-title');
    const countEl = document.getElementById('explore-results-count');
    if (!grid) return;

    grid.innerHTML = `
      <div class="streams-loading" style="grid-column: 1 / -1; padding: 4rem 0;">
        <div class="spinner"></div>
        <span>Carregando títulos...</span>
      </div>
    `;

    // 1. If Saga is active
    if (state.exploreSaga) {
      const saga = CINEMA_SAGAS.find(s => s.id === state.exploreSaga);
      if (saga) {
        if (titleEl) titleEl.textContent = saga.title;
        const sortedItems = [...saga.items].sort((a, b) => (parseInt(a.year, 10) || 0) - (parseInt(b.year, 10) || 0));
        if (countEl) countEl.textContent = `${sortedItems.length} produções`;
        grid.innerHTML = sortedItems.map((item, idx) => this.createCinemaMovieCard(item, idx, saga.accent)).join('');
        return;
      }
    }

    // 2. If Genre is active
    const currentGenre = state.exploreGenre || 'Action';
    const genreObj = GENRES_LIST.find(g => g.id === currentGenre) || { label: currentGenre };
    if (titleEl) titleEl.textContent = `Em Destaque: ${genreObj.label}`;

    try {
      const type = state.exploreType || 'all';
      let items = [];

      if (type === 'all') {
        const [movTop, serTop] = await Promise.all([
          API.fetchCatalog('movie', 'top', { genre: currentGenre }).catch(() => []),
          API.fetchCatalog('series', 'top', { genre: currentGenre }).catch(() => [])
        ]);
        (movTop || []).forEach(m => m.type = 'movie');
        (serTop || []).forEach(s => s.type = 'series');
        items = this.interleaveArrays(movTop || [], serTop || []);
      } else {
        items = await API.fetchCatalog(type, 'top', { genre: currentGenre }).catch(() => []);
        (items || []).forEach(item => item.type = type);
      }

      if (countEl) countEl.textContent = `${items.length} títulos encontrados`;

      if (items.length > 0) {
        grid.innerHTML = items.map(item => this.createMovieCard(item)).join('');
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
            <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhum título encontrado para este gênero.</p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Tente selecionar outro gênero acima ou mudar o filtro entre Filmes e Séries.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Error in loadExploreContent:', err);
      grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">Erro ao carregar títulos. Tente novamente.</p>`;
    }
  },

  async searchExploreContent(query) {
    const grid = document.getElementById('explore-grid');
    const titleEl = document.getElementById('explore-results-title');
    const countEl = document.getElementById('explore-results-count');
    if (!grid) return;

    if (titleEl) titleEl.textContent = `Resultados para "${query}"`;

    grid.innerHTML = `
      <div class="streams-loading" style="grid-column: 1 / -1; padding: 4rem 0;">
        <div class="spinner"></div>
        <span>Buscando "${query}"...</span>
      </div>
    `;

    try {
      const type = state.exploreType || 'all';
      let results = [];

      if (type === 'all') {
        const [mov, ser] = await Promise.all([
          API.searchContent('movie', query).catch(() => []),
          API.searchContent('series', query).catch(() => [])
        ]);
        (mov || []).forEach(m => m.type = 'movie');
        (ser || []).forEach(s => s.type = 'series');
        results = this.interleaveArrays(mov || [], ser || []);
      } else {
        results = await API.searchContent(type, query).catch(() => []);
        (results || []).forEach(r => r.type = type);
      }

      if (countEl) countEl.textContent = `${results.length} resultados`;

      if (results.length > 0) {
        grid.innerHTML = results.map(item => this.createMovieCard(item)).join('');
      } else {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
            <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
            <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: white;">Nenhum resultado encontrado para "${query}"</p>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Verifique a ortografia ou experimente buscar por termos em inglês ou nomes de atores.</p>
          </div>
        `;
      }
    } catch (err) {
      console.error('Error in searchExploreContent:', err);
      grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-muted);">Erro ao realizar busca. Tente novamente.</p>`;
    }
  },
  
  async performSearch(query) {
    const rawQuery = (query || '').trim();
    if (rawQuery.length === 0) {
      this.hideSearchResults();
      return;
    }

    state.searchSeq = (state.searchSeq || 0) + 1;
    const currentSeq = state.searchSeq;

    const normQ = rawQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    // Instantly reveal search results container
    const resultsArea = document.getElementById('search-results');
    const grid = document.getElementById('search-grid');
    if (resultsArea) resultsArea.classList.remove('hidden');
    document.getElementById('catalog-container')?.classList.add('hidden');
    document.getElementById('hero-section')?.classList.add('hidden');

    const titleEl = resultsArea?.querySelector('.section-title');
    if (titleEl) {
      titleEl.textContent = `Resultados para "${rawQuery}"`;
    }

    // 1. INSTANT 0ms Local Title Matching (exact/prefix matches in already loaded content)
    const localMatches = [];
    const seenIds = new Set();

    const addIfMatch = (item) => {
      if (!item || !item.id || seenIds.has(item.id)) return;
      const n = (item.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      if (n.includes(normQ)) {
        seenIds.add(item.id);
        localMatches.push(item);
      }
    };

    [...(state.catalogs.popular || []), ...(state.catalogs.featured || []), ...(state.watchlist || []), ...(state.favorites || [])].forEach(addIfMatch);
    CINEMA_SAGAS.forEach(saga => (saga.items || []).forEach(addIfMatch));

    if (localMatches.length > 0) {
      if (grid) grid.innerHTML = localMatches.map(item => this.createMovieCard(item)).join('');
    } else {
      if (grid) {
        grid.innerHTML = `
          <div class="streams-loading" style="grid-column: 1 / -1; padding: 4rem 0;">
            <div class="spinner"></div>
            <span>Buscando "${rawQuery}"...</span>
          </div>
        `;
      }
    }

    // 2. Multi-threaded Remote Search (Movie + Series across Cinemeta)
    try {
      const searchType = (state.currentType === 'explore') ? (state.exploreType || 'all') : (state.currentType || 'all');
      const remoteResults = await API.searchContent(searchType, rawQuery);

      if (currentSeq !== state.searchSeq) return; // Stale query, discard!

      if (remoteResults && remoteResults.length > 0) {
        if (titleEl) titleEl.textContent = `Resultados para "${rawQuery}" (${remoteResults.length})`;
        if (grid) grid.innerHTML = remoteResults.map(item => this.createMovieCard(item)).join('');
      } else if (localMatches.length === 0) {
        if (titleEl) titleEl.textContent = `Resultados da Busca`;
        if (grid) {
          grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
              <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🔍</div>
              <p style="font-size: 1.1rem; font-weight: 700; color: #ffffff; margin-bottom: 0.4rem;">Nenhum resultado encontrado para "${rawQuery}"</p>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Verifique a ortografia ou experimente pesquisar por outro título.</p>
            </div>
          `;
        }
      }
    } catch (err) {
      if (currentSeq !== state.searchSeq) return;
      console.error('Error during search:', err);
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
    if (state.currentType !== 'watchlist' && state.currentType !== 'explore') {
      document.getElementById('hero-section')?.classList.remove('hidden');
    }
  },
  
  async openModal(id, explicitType) {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    const cleanId = (id || '').split(':')[0];
    const reqType = explicitType || state.currentType;

    // Fast instant placeholder from memory so user can click watchlist immediately
    let initialMeta = null;
    if (state.heroMeta && state.heroMeta.id.startsWith(cleanId)) initialMeta = state.heroMeta;
    if (!initialMeta) {
      const allPool = [
        ...(state.catalogs.popular || []),
        ...(state.catalogs.featured || []),
        ...(state.catalogs.series || []),
        ...(state.catalogs.anime || [])
      ];
      initialMeta = allPool.find(x => x && x.id && x.id.startsWith(cleanId));
    }
    if (!initialMeta && typeof CINEMA_SAGAS !== 'undefined') {
      for (const saga of CINEMA_SAGAS) {
        const match = (saga.items || []).find(i => i.id && i.id.startsWith(cleanId));
        if (match) { initialMeta = match; break; }
      }
    }
    if (!initialMeta) {
      const existing = User.getWatchlist();
      if (existing[cleanId]) initialMeta = existing[cleanId];
    }
    if (initialMeta) {
      state.currentMeta = initialMeta;
      this.updateModalWatchlistBtn();
    }

    const meta = await API.fetchMeta(reqType, id);
    if (!meta && !initialMeta) {
      alert('Erro ao carregar detalhes.');
      this.closeModal();
      return;
    }
    
    state.currentMeta = meta || initialMeta;
    state.feedbackConfirmed = false;
    
    const activeMeta = state.currentMeta;
    const backdropImg = document.getElementById('modal-backdrop-img');
    const poster = document.getElementById('modal-poster');
    const title = document.getElementById('modal-title');
    const metaInfo = document.getElementById('modal-meta');
    const description = document.getElementById('modal-description');
    const genres = document.getElementById('modal-genres');
    const cast = document.getElementById('modal-cast');
    
    if (backdropImg) backdropImg.src = getBackgroundUrl(activeMeta);
    if (poster) poster.src = getPosterUrl(activeMeta);
    if (title) title.textContent = PTBR_Engine.translateTitle(activeMeta.name);
    if (metaInfo) {
      const year = activeMeta.year || activeMeta.releaseInfo || '';
      const runtime = activeMeta.runtime ? `⏱ ${activeMeta.runtime}` : '';
      const format = (activeMeta.type === 'series' || state.currentType === 'series') ? 'Série' : 'Filme 4K';
      const audioTag = '<span style="color:#10b981; font-weight:600;">Dublado PT-BR</span>';
      metaInfo.innerHTML = [year, format, runtime, audioTag].filter(Boolean).join(' &nbsp;|&nbsp; ');
    }
    if (description) {
      description.textContent = activeMeta.description || 'Sem descrição.';
      if (activeMeta.description && !/[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(activeMeta.description)) {
        PTBR_Engine.translateText(activeMeta.description).then(ptText => {
          if (ptText && state.currentMeta && state.currentMeta.id === activeMeta.id) {
            state.currentMeta.description = ptText;
            description.textContent = ptText;
          }
        });
      }
    }
    if (genres && activeMeta.genres) {
      const ptGenres = PTBR_Engine.translateGenres(activeMeta.genres);
      genres.innerHTML = ptGenres.map(g => `<span>${g}</span>`).join('');
    } else if (genres) {
      genres.innerHTML = '';
    }
    if (cast) cast.textContent = activeMeta.cast ? `Elenco: ${activeMeta.cast.slice(0, 6).join(', ')}` : '';
    
    // Dynamic Series Seasons & Episodes Controls
    this.setupSeriesControls(activeMeta);

    // Check saved watch progress
    const progress = User.getProgress(activeMeta.id);
    const autoPlayBtn = document.getElementById('modal-auto-play-btn');
    if (autoPlayBtn) {
      if (progress && progress.currentTime > 10) {
        const epInfo = (activeMeta.type === 'series' || state.currentType === 'series') ? ` [T${state.currentSeason}:E${state.currentEpisode}]` : '';
        autoPlayBtn.innerHTML = `
          <span class="btn-autoplay-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </span>
          <div class="btn-autoplay-text">
            <span class="btn-autoplay-main">Continuar Assistindo${epInfo}</span>
            <span class="btn-autoplay-sub">A partir de ${formatTime(progress.currentTime)}</span>
          </div>
        `;
      } else {
        autoPlayBtn.innerHTML = `
          <span class="btn-autoplay-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </span>
          <div class="btn-autoplay-text">
            <span class="btn-autoplay-main">Reproduzir Agora</span>
            <span class="btn-autoplay-sub">⚡ Melhor Fonte Dublada PT-BR</span>
          </div>
        `;
      }
    }

    // Update watchlist button state
    this.updateModalWatchlistBtn();

    // Load streams
    this.loadStreams();
  },

  updateModalWatchlistBtn() {
    const watchlistBtn = document.getElementById('modal-watchlist-btn');
    if (!watchlistBtn || !state.currentMeta) return;
    const cleanId = (state.currentMeta.id || '').split(':')[0];
    const isSaved = User.isInWatchlist(cleanId);
    if (isSaved) {
      watchlistBtn.className = 'btn btn-secondary modal-watchlist-btn in-list';
      watchlistBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Salvo na Minha Lista</span>
      `;
    } else {
      watchlistBtn.className = 'btn btn-secondary modal-watchlist-btn';
      watchlistBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Adicionar à Minha Lista</span>
      `;
    }
  },

  toggleModalWatchlist(e) {
    if (e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
    }
    if (this._togglingWatchlist) return;
    this._togglingWatchlist = true;
    setTimeout(() => { this._togglingWatchlist = false; }, 300);

    if (!state.currentMeta) return;
    const added = User.toggleWatchlist(state.currentMeta);
    this.updateModalWatchlistBtn();
    const displayName = PTBR_Engine.translateTitle(state.currentMeta.name || '');
    Toast.show(added ? `⭐ "${displayName}" salvo na Minha Lista!` : `Removido da Minha Lista`, added ? 'success' : 'info');
    
    // Also sync hero watchlist button if it matches
    if (state.heroMeta && state.heroMeta.id.startsWith((state.currentMeta.id || '').split(':')[0])) {
      this.updateHeroWatchlistBtn();
    }

    this.renderCatalogs();
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
    state.autoPlaySessionId = Date.now();
    const sessionId = state.autoPlaySessionId;

    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');

    if (playerOverlay) playerOverlay.classList.remove('hidden');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.innerHTML = `
        <div style="text-align:center; max-width:380px; padding:24px 28px; background:rgba(18,18,30,0.92); backdrop-filter:blur(20px); border-radius:18px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 16px 48px rgba(0,0,0,0.7);">
          <div class="spinner large" style="margin:0 auto 16px; border-top-color:#8b5cf6;"></div>
          <div style="font-size:1.25rem; font-weight:800; color:#ffffff; margin-bottom:6px; letter-spacing:-0.3px;">⚡ Conectando ao Melhor Servidor</div>
          <div style="font-size:0.85rem; color:#a78bfa; font-weight:600; margin-bottom:8px;">Testando fontes em segundo plano...</div>
          <div style="font-size:0.75rem; color:#9ca3af;" id="benchmark-status">Verificando WarezCDN, BestCine, AutoEmbed e King VOD...</div>
        </div>
      `;
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
      return;
    }

    if (!rawStreams || rawStreams.length === 0) {
      alert('Nenhum servidor disponível para este título no momento.');
      if (playerLoading) playerLoading.classList.add('hidden');
      this.closePlayer();
      return;
    }

    state.activeStreams = rawStreams;

    // Filter all playable streams
    const playableCandidates = rawStreams
      .map((s, idx) => ({ index: idx, stream: s }))
      .filter(c => c.stream && (c.stream.url || c.stream.embedUrl));

    if (playableCandidates.length === 0) {
      this.testAndPlayStreamIndex(0);
      return;
    }

    // Rank candidate pool: Dublado PT-BR first, top tier engines
    playableCandidates.sort((a, b) => (b.stream.score || 0) - (a.stream.score || 0));
    const testPool = playableCandidates.slice(0, 6);

    const statusEl = document.getElementById('benchmark-status');

    // Super-fast 700ms concurrent race
    const testPromises = testPool.map(async (item) => {
      const targetUrl = item.stream.url || item.stream.embedUrl;
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 700);
        await fetch(targetUrl, { method: 'GET', mode: 'no-cors', signal: controller.signal });
        clearTimeout(timer);
        const latency = Date.now() - startTime;
        return {
          ...item,
          ok: true,
          latency: latency,
          finalScore: (item.stream.score || 0) + (item.stream.isDub ? 100 : 0) + Math.min(50, Math.max(0, 50 - Math.floor(latency / 20)))
        };
      } catch(e) {
        return {
          ...item,
          ok: false,
          latency: 9999,
          finalScore: (item.stream.score || 0) - 200
        };
      }
    });

    const testedResults = await Promise.all(testPromises);

    // Sort by tested final score (verified fast & Dublado first)
    testedResults.sort((a, b) => b.finalScore - a.finalScore);

    const winnerItem = testedResults[0] || testPool[0];
    const chosenIndex = winnerItem.index;

    if (statusEl) {
      statusEl.textContent = `Iniciando ${winnerItem.stream.name}...`;
    }

    state.currentStreamIndex = chosenIndex;
    this.updateHudStreamSelector(rawStreams, chosenIndex);
    this.testAndPlayStreamIndex(chosenIndex);
  },

  async probeStreamUrl(url, timeoutMs = 1200) {
    if (!url) return { ok: false, latency: 9999 };
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      await fetch(url, { method: 'GET', mode: 'no-cors', signal: controller.signal });
      clearTimeout(timer);
      return { ok: true, latency: Date.now() - startTime };
    } catch(e) {
      return { ok: false, latency: 9999 };
    }
  },

  selectAndPlayStream(index) {
    state.isPlayerActive = true;
    this.testAndPlayStreamIndex(index);
  },

  switchQuality(targetQuality) {
    const video = document.getElementById('video-player');
    const currentTime = (video && !isNaN(video.currentTime)) ? video.currentTime : 0;

    // 1. If HLS is active and has multiple variant levels
    if (window.currentHls && window.currentHls.levels && window.currentHls.levels.length > 1) {
      if (targetQuality === 'auto' || targetQuality === '-1') {
        window.currentHls.currentLevel = -1;
        this.showPlayerToast('📺 Qualidade: Automática (Melhor Taxa)', 1600);
        return;
      }

      let matchedIdx = -1;
      if (targetQuality === '4k') {
        matchedIdx = window.currentHls.levels.findIndex(l => (l.height && l.height >= 2160) || (l.bitrate && l.bitrate >= 12000000));
      } else if (targetQuality === '1080') {
        matchedIdx = window.currentHls.levels.findIndex(l => (l.height && l.height >= 1080) || (l.bitrate && l.bitrate >= 4000000));
      } else if (targetQuality === '720') {
        matchedIdx = window.currentHls.levels.findIndex(l => (l.height && l.height >= 720 && l.height < 1080));
      } else if (!isNaN(parseInt(targetQuality, 10))) {
        matchedIdx = parseInt(targetQuality, 10);
      }

      if (matchedIdx >= 0 && matchedIdx < window.currentHls.levels.length) {
        window.currentHls.currentLevel = matchedIdx;
        if (video) {
          video.muted = false;
          video.volume = 1.0;
        }
        if (window.currentHls.audioTracks && window.currentHls.audioTracks.length > 0 && window.currentHls.audioTrack === -1) {
          window.currentHls.audioTrack = 0;
        }
        const h = window.currentHls.levels[matchedIdx].height || '4K';
        this.showPlayerToast(`📺 Qualidade travada em: ${h}p`, 1800);
        return;
      }
    }

    // 2. Search in active streams list for a stream matching requested quality
    const streams = state.activeStreams || state.currentStreams;
    if (Array.isArray(streams) && streams.length > 0) {
      let targetIndex = -1;
      const q = String(targetQuality).toLowerCase();

      if (q === '4k' || q === '2160') {
        targetIndex = streams.findIndex(s => {
          const raw = `${s.name || ''} ${s.title || ''} ${s.quality || ''}`.toLowerCase();
          return raw.includes('4k') || raw.includes('2160') || raw.includes('uhd');
        });
      } else if (q === '1080' || q === 'fhd') {
        targetIndex = streams.findIndex(s => {
          const raw = `${s.name || ''} ${s.title || ''} ${s.quality || ''}`.toLowerCase();
          return raw.includes('1080') || raw.includes('fhd') || raw.includes('bluray') || raw.includes('remux');
        });
      } else if (q === '720' || q === 'hd') {
        targetIndex = streams.findIndex(s => {
          const raw = `${s.name || ''} ${s.title || ''} ${s.quality || ''}`.toLowerCase();
          return raw.includes('720') || raw.includes('hd');
        });
      }

      if (targetIndex >= 0 && targetIndex !== state.currentStreamIndex) {
        const stream = streams[targetIndex];
        const resLabel = q.includes('4k') ? '4K Ultra HD' : q.includes('1080') ? '1080p Full HD' : '720p HD';
        this.showPlayerToast(`📺 Alternando para ${resLabel} (${stream.provider})...`, 2000);
        this.selectAndPlayStream(targetIndex);

        if (currentTime > 0) {
          const restoreTimer = setInterval(() => {
            const vid = document.getElementById('video-player');
            if (vid && vid.readyState >= 1) {
              vid.currentTime = currentTime;
              vid.muted = false;
              vid.volume = 1.0;
              clearInterval(restoreTimer);
            }
          }, 250);
          setTimeout(() => clearInterval(restoreTimer), 6000);
        }
        return;
      }
    }

    // 3. Fallback toast
    const resName = targetQuality === '4k' ? '4K Ultra HD' : targetQuality === '1080' ? '1080p Full HD' : '720p HD';
    this.showPlayerToast(`📺 Qualidade Máxima Selecionada: ${resName}`, 1800);
  },

  testAndPlayStreamIndex(index) {
    state.isPlayerActive = true;
    if (!state.activeStreams || index >= state.activeStreams.length) {
      this.showPlayerError();
      return;
    }

    state.currentStreamIndex = index;
    if (!state.visitedServerIndices) {
      state.visitedServerIndices = new Set();
    }
    state.visitedServerIndices.add(index);
    this.updateHudStreamSelector(state.activeStreams, index);

    const stream = state.activeStreams[index];
    const playerLoading = document.getElementById('player-loading');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.innerHTML = `
        <div class="spinner large" style="margin-bottom:12px;"></div>
        <div style="font-size:1.15rem; font-weight:800; color:#ffffff; margin-bottom:6px;">⚡ Conectando</div>
        <div style="font-size:0.85rem; color:#9ca3af;">${stream.name}</div>
      `;
    }

    this.showSourceFeedbackPrompt(stream, index);

    if (stream.url) {
      this.playStream(stream.url, stream.name);
    } else if (stream.embedUrl) {
      this.playIframe(stream.embedUrl, stream.name);
    } else if (stream.magnetUrl || stream.infoHash) {
      this.playTorrent(stream.magnetUrl, stream.name);
    }
  },

  showSourceFeedbackPrompt(stream, index) {
    const feedbackPrompt = document.getElementById('hud-source-feedback');
    const serverBadge = document.getElementById('hud-feedback-server-badge');
    const questionEl = document.getElementById('hud-feedback-question');
    const yesBtn = document.getElementById('hud-feedback-yes-btn');
    const noBtn = document.getElementById('hud-feedback-no-btn');

    if (!feedbackPrompt || !state.isPlayerActive) return;

    if (this.feedbackAutoHideTimer) {
      clearTimeout(this.feedbackAutoHideTimer);
      this.feedbackAutoHideTimer = null;
    }

    const playable = (state.activeStreams || [])
      .map((s, idx) => ({ index: idx, stream: s }))
      .filter(c => c.stream && (c.stream.url || c.stream.embedUrl));
    playable.sort((a, b) => (b.stream.score || 0) - (a.stream.score || 0));

    const totalPlayable = Math.min(10, playable.length);
    const rankIndex = playable.findIndex(p => p.index === index);
    const currentRank = rankIndex >= 0 ? rankIndex + 1 : (index + 1);
    const streamName = stream ? stream.name.replace(/⚡|🎬|❄️|👑|🔥/g, '').trim() : 'Servidor';

    if (serverBadge) {
      serverBadge.textContent = `⚡ Top ${currentRank}/${totalPlayable}: ${streamName}`;
    }
    if (questionEl) {
      questionEl.textContent = 'O vídeo está rodando bem?';
    }

    feedbackPrompt.classList.remove('hidden');
    requestAnimationFrame(() => {
      feedbackPrompt.classList.add('show');
    });

    if (yesBtn) {
      yesBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.dismissFeedbackPrompt();
      };
    }

    if (noBtn) {
      noBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.playNextStream();
      };
    }

    // Auto-dismiss after 15s so it doesn't stay on screen forever
    this.feedbackAutoHideTimer = setTimeout(() => {
      this.dismissFeedbackPrompt();
    }, 15000);
  },

  dismissFeedbackPrompt() {
    const feedbackPrompt = document.getElementById('hud-source-feedback');
    if (!feedbackPrompt) return;
    if (this.feedbackAutoHideTimer) {
      clearTimeout(this.feedbackAutoHideTimer);
      this.feedbackAutoHideTimer = null;
    }
    feedbackPrompt.classList.remove('show');
    setTimeout(() => {
      feedbackPrompt.classList.add('hidden');
    }, 250);
  },

  updateHudStreamSelector(streams, activeIndex = 0) {
    const hudStreamSelect = document.getElementById('hud-stream-select');
    if (!hudStreamSelect) return;

    hudStreamSelect.innerHTML = streams.map((s, idx) => {
      const medal = idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : '';
      const label = `${medal}${s.name.replace(/—/g, '-')}`;
      const selected = idx === activeIndex ? 'selected' : '';
      return `<option value="${idx}" ${selected}>${label}</option>`;
    }).join('');
  },

  playNextStream() {
    const playerOverlay = document.getElementById('player-overlay');
    if (!state.isPlayerActive || !playerOverlay || playerOverlay.classList.contains('hidden')) return;
    if (!state.activeStreams || state.activeStreams.length === 0) return;

    // Prevent rapid double-triggering / flickering glitches (minimum 800ms cooldown)
    const now = Date.now();
    if (this._lastStreamSwitchTime && (now - this._lastStreamSwitchTime) < 800) {
      return;
    }
    this._lastStreamSwitchTime = now;

    // Clear any existing stream watchdogs before switching
    if (this.streamWatchdogTimer) {
      clearTimeout(this.streamWatchdogTimer);
      this.streamWatchdogTimer = null;
    }

    if (!state.visitedServerIndices) {
      state.visitedServerIndices = new Set();
    }
    state.visitedServerIndices.add(state.currentStreamIndex);

    const playable = state.activeStreams
      .map((s, idx) => ({ index: idx, stream: s }))
      .filter(c => c.stream && (c.stream.url || c.stream.embedUrl));

    // Sort strictly by Quality & Portuguese Dubbing Score
    playable.sort((a, b) => (b.stream.score || 0) - (a.stream.score || 0));

    if (playable.length === 0) {
      console.warn('No playable streams available.');
      return;
    }

    // Find the next BEST server that hasn't been tried yet in this session
    let nextBest = playable.find(c => !state.visitedServerIndices.has(c.index));

    if (!nextBest) {
      // If all servers in top list were visited, reset history and cycle back to #1 top server
      state.visitedServerIndices.clear();
      state.visitedServerIndices.add(state.currentStreamIndex);
      nextBest = playable.find(c => c.index !== state.currentStreamIndex) || playable[0];
    }

    state.visitedServerIndices.add(nextBest.index);

    const nextStream = nextBest.stream;
    const playerLoading = document.getElementById('player-loading');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.innerHTML = `
        <div class="spinner large" style="margin-bottom:12px;"></div>
        <div style="font-size:1.15rem; font-weight:800; color:#ffffff; margin-bottom:6px;">⚡ Conectando ao Próximo Melhor Servidor</div>
        <div style="font-size:0.85rem; color:#a78bfa;">${nextStream.name}</div>
      `;
    }

    this.selectAndPlayStream(nextBest.index);
  },
  
  async loadStreams() {
    if (!state.currentMeta) return;

    const targetMetaId = state.currentMeta.id;
    const targetSeason = state.currentSeason || 1;
    const targetEpisode = state.currentEpisode || 1;

    state.streamLoadSeq = (state.streamLoadSeq || 0) + 1;
    const currentSeq = state.streamLoadSeq;

    const streamsLoading = document.getElementById('streams-loading');
    const streamsList = document.getElementById('streams-list');

    if (streamsLoading) streamsLoading.classList.remove('hidden');

    const streams = await API.fetchStreams(
      state.currentType, 
      targetMetaId, 
      targetSeason, 
      targetEpisode
    );

    // If query is stale or user closed modal, ignore!
    if (currentSeq !== state.streamLoadSeq || !state.currentMeta || state.currentMeta.id !== targetMetaId) {
      return;
    }

    if (streamsLoading) streamsLoading.classList.add('hidden');

    if (streams && streams.length > 0) {
      state.activeStreams = streams;
      this.updateHudStreamSelector(streams, 0);
      this.renderStreams(streams);
    } else {
      if (streamsList) {
        streamsList.innerHTML = '<p style="color:#a0a0b0; text-align:center; padding:2rem;">Nenhuma fonte encontrada para este episódio/filme no momento. Tente outro servidor.</p>';
      }
    }
  },
  
  filterModalStreams(filterKey = 'all') {
    state.currentStreamFilter = filterKey;
    document.querySelectorAll('.streams-filter-btn').forEach(btn => {
      if (btn.dataset.filter === filterKey) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    if (state.activeStreams) {
      this.renderStreams(state.activeStreams, filterKey);
    }
  },

  renderStreams(streams, filterKey) {
    const streamsList = document.getElementById('streams-list');
    if (!streamsList) return;

    if (!streams || streams.length === 0) {
      streamsList.innerHTML = '<p style="color:#a0a0b0; text-align:center; padding:2rem;">Nenhuma fonte disponível no momento. Tente novamente em instantes.</p>';
      return;
    }

    const currentFilter = filterKey || state.currentStreamFilter || 'all';

    const bestcine = streams.filter(s => s.category === 'bestcine' || s.provider === 'BestCine' || (s.name && s.name.includes('BestCine')));
    const frost = streams.filter(s => (s.category === 'frost' || s.provider === 'FrostStream' || (s.name && s.name.includes('FrostStream'))) && !bestcine.includes(s));
    const kingvod = streams.filter(s => (s.category === 'kingvod' || s.provider === 'KingVOD' || (s.name && s.name.includes('King VOD'))) && !bestcine.includes(s) && !frost.includes(s));
    const fenix = streams.filter(s => (s.category === 'fenix' || s.provider === 'FenixFlix' || (s.name && s.name.includes('FenixFlix'))) && !frost.includes(s) && !bestcine.includes(s) && !kingvod.includes(s));
    const torrents = streams.filter(s => (s.category === 'torrent' || s.magnetUrl || s.infoHash) && !frost.includes(s) && !fenix.includes(s) && !bestcine.includes(s) && !kingvod.includes(s));
    const web = streams.filter(s => !fenix.includes(s) && !frost.includes(s) && !bestcine.includes(s) && !kingvod.includes(s) && !torrents.includes(s));

    // Update counts on filter buttons
    const bestcineBtn = document.querySelector('.streams-filter-btn.bestcine-tab');
    if (bestcineBtn) bestcineBtn.textContent = `🎬 BestCine (${bestcine.length})`;

    const frostBtn = document.querySelector('.streams-filter-btn.frost-tab');
    if (frostBtn) frostBtn.textContent = `❄️ FrostStream (${frost.length})`;

    const kingBtn = document.querySelector('.streams-filter-btn.king-tab');
    if (kingBtn) kingBtn.textContent = `👑 King VOD (${kingvod.length})`;

    let html = '';

    if ((currentFilter === 'all' || currentFilter === 'bestcine') && bestcine.length > 0) {
      html += '<div style="color:#10b981; font-weight:800; font-size:1.05rem; margin:1rem 0 0.5rem; display:flex; align-items:center; justify-content:space-between; background:rgba(16,185,129,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #10b981;">'
        + '<span>🎬 BestCine HD/4K (Dublado & Legendado)</span><span style="font-size:0.8rem; background:#10b981; color:#000; padding:2px 8px; border-radius:10px; font-weight:900;">' + bestcine.length + ' OPÇÕES</span></div>';
      html += bestcine.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if ((currentFilter === 'all' || currentFilter === 'frost') && frost.length > 0) {
      html += '<div style="color:#06b6d4; font-weight:800; font-size:1.05rem; margin:1rem 0 0.5rem; display:flex; align-items:center; justify-content:space-between; background:rgba(6,182,212,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #06b6d4;">'
        + '<span>❄️ FrostStream (Dublado & Legendado)</span><span style="font-size:0.8rem; background:#06b6d4; color:#000; padding:2px 8px; border-radius:10px; font-weight:900;">' + frost.length + ' OPÇÕES</span></div>';
      html += frost.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if ((currentFilter === 'all' || currentFilter === 'kingvod') && kingvod.length > 0) {
      html += '<div style="color:#eab308; font-weight:800; font-size:1.05rem; margin:1rem 0 0.5rem; display:flex; align-items:center; justify-content:space-between; background:rgba(234,179,8,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #eab308;">'
        + '<span>👑 King VOD (Nativo PT-BR)</span><span style="font-size:0.8rem; background:#eab308; color:#000; padding:2px 8px; border-radius:10px; font-weight:900;">' + kingvod.length + ' OPÇÃO</span></div>';
      html += kingvod.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if ((currentFilter === 'all' || currentFilter === 'fenix') && fenix.length > 0) {
      html += '<div style="color:#ef4444; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #ef4444;">'
        + '<span>🔥 FenixFlix Nativo (Player HTML5)</span></div>';
      html += fenix.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if ((currentFilter === 'all' || currentFilter === 'web') && web.length > 0) {
      html += '<div style="color:#8b5cf6; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(139,92,246,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #8b5cf6;">'
        + '<span>🌐 Servidores Web & Dublados PT-BR</span></div>';
      html += web.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if ((currentFilter === 'all' || currentFilter === 'web') && torrents.length > 0) {
      html += '<div style="color:#f59e0b; font-weight:800; font-size:1.05rem; margin:1.5rem 0 0.5rem; display:flex; align-items:center; gap:8px; background:rgba(245,158,11,0.12); padding:10px 14px; border-radius:8px; border-left:4px solid #f59e0b;">'
        + '<span>🧲 Torrents Nativos PT-BR (Brazuca & Torrentio)</span></div>';
      html += torrents.map(stream => {
        const idx = streams.indexOf(stream);
        return this.createStreamItem(stream, idx >= 0 ? idx : 0);
      }).join('');
    }

    if (html === '') {
      html = '<p style="color:#a0a0b0; text-align:center; padding:2rem;">Nenhuma fonte encontrada nesta categoria. Clique em "Todas" acima.</p>';
    }

    streamsList.innerHTML = html;
  },
  
  createStreamItem(stream, index = 0) {
    const name = stream.name || 'Servidor';
    const isBestCine = name.includes('BestCine') || stream.category === 'bestcine';
    const isFenix = name.includes('FenixFlix');
    const isFrost = name.includes('FrostStream') || stream.category === 'frost';
    const isTorrent = stream.category === 'torrent' || stream.magnetUrl || stream.infoHash;
    const accentColor = isBestCine ? '#10b981' : isFenix ? '#ef4444' : isFrost ? '#06b6d4' : isTorrent ? '#f59e0b' : '#8b5cf6';
    const btnColor = isTorrent || isBestCine ? '#000000' : '#ffffff';

    return `
      <div class="stream-item" style="border-left: 4px solid ${accentColor}; cursor: pointer;" onclick="UI.selectAndPlayStream(${index})">
        <div class="stream-info">
          <span class="stream-name" style="font-weight:700;">${name}</span>
          ${stream.title && stream.title !== name ? `<span class="stream-details" style="font-size:0.78rem; color:#9ca3af; white-space:pre-line;">${stream.title.replace(/</g, '&lt;')}</span>` : ''}
        </div>
        <button class="stream-play-btn" style="background:${accentColor}; color:${btnColor}; font-weight:800;"
          onclick="event.stopPropagation(); UI.selectAndPlayStream(${index})">▶ Assistir</button>
      </div>
    `;
  },

  resetMediaState() {
    const video = document.getElementById('video-player');
    const iframe = document.getElementById('iframe-player');
    if (typeof WebGLUpscaler !== 'undefined') {
      WebGLUpscaler.stop();
    }
    if (window.currentHls) {
      window.currentHls.destroy();
      window.currentHls = null;
    }
    if (window.currentTorrent) {
      try { window.currentTorrent.destroy(); } catch(e) {}
      window.currentTorrent = null;
    }
    if (iframe) {
      iframe.src = 'about:blank';
      iframe.classList.add('hidden');
    }
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.src = '';
      try { video.load(); } catch(e) {}
      video.classList.add('hidden');
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
    
    this.resetMediaState();
    state.isPlayerActive = true;
    
    playerOverlay.classList.remove('hidden');
    iframe.classList.remove('hidden');
    if (video) video.classList.add('hidden');
    if (hudBottom) hudBottom.classList.add('hidden'); // Hide dummy bottom HUD so iframe native controls are 100% unblocked and clickable!
    
    const customSubOverlay = document.getElementById('custom-subtitles-overlay');
    if (customSubOverlay) customSubOverlay.classList.add('hidden');
    
    if (openTabBtn) {
      openTabBtn.href = embedUrl;
      openTabBtn.target = '_blank';
    }

    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.innerHTML = `
        <div style="text-align:center; max-width:380px; padding:24px 28px; background:rgba(18,18,30,0.92); backdrop-filter:blur(20px); border-radius:18px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 16px 48px rgba(0,0,0,0.7);">
          <div class="spinner large" style="margin:0 auto 16px; border-top-color:#8b5cf6;"></div>
          <div style="font-size:1.2rem; font-weight:800; color:#ffffff; margin-bottom:6px;">⚡ Conectando Player Web HD</div>
          <div style="font-size:0.85rem; color:#a78bfa;">${title}</div>
        </div>
      `;
    }
    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;
    
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    
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
    VideoEnhancer.apply();
    
    // Auto-hide loading spinner quickly so iframe is 100% visible and ready for interaction
    setTimeout(() => {
      if (playerLoading) playerLoading.classList.add('hidden');
    }, 1000);
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
    
    this.resetMediaState();
    state.isPlayerActive = true;
    
    if (openTabBtn) {
      openTabBtn.href = url;
      openTabBtn.target = '_blank';
    }
    
    playerOverlay.classList.remove('hidden');
    video.classList.remove('hidden');
    if (iframe) iframe.classList.add('hidden');
    if (hudBottom) hudBottom.classList.remove('hidden');

    VideoEnhancer.apply();

    video.autoplay = true;
    video.muted = false;
    video.volume = 1.0;

    const volumeSlider = document.getElementById('hud-volume-slider');
    if (volumeSlider) volumeSlider.value = 1;

    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.innerHTML = `
        <div style="text-align:center; max-width:380px; padding:24px 28px; background:rgba(18,18,30,0.92); backdrop-filter:blur(20px); border-radius:18px; border:1px solid rgba(255,255,255,0.12); box-shadow:0 16px 48px rgba(0,0,0,0.7);">
          <div class="spinner large" style="margin:0 auto 16px; border-top-color:#8b5cf6;"></div>
          <div style="font-size:1.2rem; font-weight:800; color:#ffffff; margin-bottom:6px;">⚡ Iniciando Transmissão</div>
          <div style="font-size:0.85rem; color:#a78bfa;">${title}</div>
        </div>
      `;
    }
    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;
    
    // Always hide spinner after 1.2 seconds so it never blocks the video
    setTimeout(() => {
      if (playerLoading) playerLoading.classList.add('hidden');
    }, 1200);

    // Subtitles (disabled by default on video start)
    if (state.currentMeta) {
      const subSelect = document.getElementById('hud-subtitle-select');
      const lang = subSelect ? subSelect.value : 'off';
      if (lang && lang !== 'off') {
        Subtitles.applySubtitles(
          lang, 
          state.currentMeta.id, 
          state.currentType, 
          state.currentSeason, 
          state.currentEpisode
        );
      } else {
        Subtitles.clear();
      }
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
          name: state.currentMeta.name,
          title: state.currentMeta.name,
          season: state.currentSeason,
          episode: state.currentEpisode
        });
      }
    };
    video.onseeking = () => Subtitles.syncOverlay(video.currentTime);
    video.onseeked = () => Subtitles.syncOverlay(video.currentTime);

    video.onplay = () => {
      if (typeof WebGLUpscaler !== 'undefined') WebGLUpscaler.start();
      video.muted = false;
      if (typeof AudioEngine !== 'undefined' && AudioEngine.isInitialized) {
        AudioEngine.resume();
      }
    };
    video.onpause = () => {
      if (typeof WebGLUpscaler !== 'undefined') WebGLUpscaler.stop();
    };

    const onPlaySuccess = () => {
      if (playerLoading) playerLoading.classList.add('hidden');
      if (playerError) playerError.classList.add('hidden');
      if (typeof WebGLUpscaler !== 'undefined') WebGLUpscaler.start();
      video.muted = false;
      if (typeof AudioEngine !== 'undefined' && AudioEngine.isInitialized) {
        AudioEngine.resume();
      }
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

    video.onerror = (e) => {
      const overlay = document.getElementById('player-overlay');
      if (!state.isPlayerActive || !overlay || overlay.classList.contains('hidden') || !video.src || video.src === 'about:blank') return;
      console.warn('Direct video playback error, preparing clean transition to next server...', e);
      if (this.streamWatchdogTimer) {
        clearTimeout(this.streamWatchdogTimer);
        this.streamWatchdogTimer = null;
      }
      setTimeout(() => {
        if (state.isPlayerActive && typeof this.playNextStream === 'function') {
          this.playNextStream();
        }
      }, 400);
    };

    if (this.streamWatchdogTimer) {
      clearTimeout(this.streamWatchdogTimer);
      this.streamWatchdogTimer = null;
    }

    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        abrEwmaDefaultEstimate: 80000000, // 80 Mbps estimate to immediately lock 1080p/4K
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.9,
        abrMaxWithRealBitrate: true,
        capLevelToPlayerSize: false, // Never downsample based on player window size!
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        maxBufferSize: 100 * 1000 * 1000,
        startLevel: -1
      });
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // Auto lock to the highest available resolution level (1080p / 4K)
        if (hls.levels && hls.levels.length > 0) {
          const highestLevelIdx = hls.levels.length - 1;
          hls.currentLevel = highestLevelIdx;
          hls.loadLevel = highestLevelIdx;

          const qualitySelect = document.getElementById('hud-quality-select');
          if (qualitySelect) {
            if (hls.levels.length > 1) {
              qualitySelect.innerHTML = hls.levels.map((lvl, idx) => {
                const res = lvl.height ? `${lvl.height}p` : 'HD';
                const kbps = lvl.bitrate ? ` (${Math.round(lvl.bitrate / 1000)}k)` : '';
                return `<option value="${idx}" ${idx === highestLevelIdx ? 'selected' : ''}>🌟 ${res}${kbps}</option>`;
              }).reverse().join('') + '<option value="auto">🔄 Auto (Melhor Bitrate)</option>';
            } else {
              const h = hls.levels[0].height || 1080;
              qualitySelect.innerHTML = `
                <option value="4k">👑 4K Ultra HD</option>
                <option value="1080" ${h >= 1080 ? 'selected' : ''}>🌟 1080p Full HD</option>
                <option value="720" ${h < 1080 ? 'selected' : ''}>⚡ 720p HD</option>
                <option value="auto">🔄 Auto (Melhor)</option>
              `;
            }
          }
        }
        triggerAutoPlay();
      });

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
        if (video) {
          video.muted = false;
          video.volume = 1.0;
        }
        if (hls.audioTracks && hls.audioTracks.length > 0 && hls.audioTrack === -1) {
          hls.audioTrack = 0;
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        if (video) {
          video.muted = false;
          video.volume = 1.0;
        }
        if (hls.audioTracks && hls.audioTracks.length > 0 && hls.audioTrack === -1) {
          hls.audioTrack = 0;
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.warn('HLS fatal error, auto-advancing to next stream:', data);
          if (typeof this.playNextStream === 'function') {
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

    this.resetMediaState();
    state.isPlayerActive = true;

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

      let magnetUrl = infoHash;
      if (!magnetUrl.startsWith('magnet:')) {
        magnetUrl = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(title)}&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce&tr=wss://tracker.openwebtorrent.com`;
      }

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
    state.isAutoCycling = false;
    state.autoPlaySessionId++;
    if (this.autoCycleInterval) {
      clearInterval(this.autoCycleInterval);
      this.autoCycleInterval = null;
    }
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
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = null;
    }
    if (this.feedbackAutoHideTimer) {
      clearTimeout(this.feedbackAutoHideTimer);
      this.feedbackAutoHideTimer = null;
    }

    const feedbackPrompt = document.getElementById('hud-source-feedback');
    if (feedbackPrompt) feedbackPrompt.classList.add('hidden');

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
    state.tabEnterPending = false;
    Motion.pageEnter();
    const catalog = document.getElementById('catalog-container');
    if (catalog) Motion.reveal(catalog);
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
