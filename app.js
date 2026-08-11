// Force HTTPS SSL redirect for secure connection padlock
if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
  window.location.href = window.location.href.replace('http:', 'https:');
}

const ADDONS = {
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

function fetchWithTimeout(url, options = {}) {
  const timeout = 12000; // 12 seconds
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, { ...options, signal: controller.signal })
    .then(response => {
      clearTimeout(id);
      return response;
    })
    .catch(async (error) => {
      clearTimeout(id);
      console.warn(`Direct fetch failed for ${url}, trying fallback...`, error);
      
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (res.ok) return res;
      } catch (e) {
        console.warn('Proxy fallback failed:', e);
      }

      throw error;
    });
}

function getPosterUrl(meta) {
  return meta.poster || (meta.id ? `https://images.metahub.space/poster/medium/${meta.id}/img` : '');
}

function getBackgroundUrl(meta) {
  return meta.background || (meta.id ? `https://images.metahub.space/background/medium/${meta.id}/img` : '');
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



// --- State Management ---

const state = {
  currentType: 'movie', // 'movie' or 'series'
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
  heroMeta: null
};

// --- API Module ---

const API = {
  async fetchCatalog(type, catalogId, extra = {}) {
    try {
      let url = '';
      if (extra.search) {
        url = `https://v3-cinemeta.strem.io/catalog/${type}/top/search=${encodeURIComponent(extra.search)}.json`;
      } else if (catalogId === 'imdbRating') {
        url = `https://cinemeta-catalogs.strem.io/imdbRating/catalog/${type}/imdbRating`;
        if (extra.genre) url += `/genre=${encodeURIComponent(extra.genre)}`;
        if (extra.skip) url += `/skip=${extra.skip}`;
        url += '.json';
      } else {
        url = `https://cinemeta-catalogs.strem.io/top/catalog/${type}/top`;
        if (extra.genre) url += `/genre=${encodeURIComponent(extra.genre)}`;
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
      const url = `https://v3-cinemeta.strem.io/meta/${type}/${id}.json`;
      const res = await fetchWithTimeout(url);
      const data = await res.json();
      return data.meta || null;
    } catch (error) {
      console.error('Error fetching meta:', error);
      return null;
    }
  },
  
  async fetchStreams(type, id, season = 1, episode = 1) {
    try {
      const streamId = type === 'series' ? `${id}:${season}:${episode}` : id;
      
      const fetchAddon = async (baseUrl) => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(`${baseUrl}/stream/${type}/${streamId}.json`, { signal: controller.signal });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json();
            return data.streams || [];
          }
        } catch(e) {
          console.warn(`Failed to fetch from ${baseUrl}:`, e);
        }
        return [];
      };

      const [fenixStreams, frostStreams, brazucaStreams] = await Promise.all([
        fetchAddon('https://fenixflix.fenixhub.online'),
        fetchAddon('https://froststream.cloutteam.com'),
        fetchAddon('https://94c8cb9f702d-brazuca-torrents.baby-beamup.club')
      ]);

      const streamsList = [];

      // Process FenixFlix streams (PT-BR Dublado)
      fenixStreams.forEach(s => {
        if (s.url && !s.url.includes('koyeb.app')) {
          const rawTitle = (s.title || s.name || s.description || 'FenixFlix HD').replace(/\n/g, ' ');
          const titleLower = rawTitle.toLowerCase();
          const urlLower = s.url.toLowerCase();
          const isDub = titleLower.includes('dublado') || titleLower.includes('dub') || urlLower.includes('dub') || urlLower.includes('primevicio') || (titleLower.includes('português') && !titleLower.includes('inglês'));

          streamsList.push({
            name: `${isDub ? '🇧🇷 Dublado PT-BR' : '🌐 Multi-Áudio / Dual'} — FenixFlix ${rawTitle}`,
            title: 'Servidor Nativo HD • Alta Velocidade Brasil',
            url: s.url,
            isDub: isDub,
            category: isDub ? 'dubbed' : 'web',
            score: (urlLower.includes('primevicio') ? 10 : 0) + (urlLower.includes('mediafire') ? 8 : 0) + (isDub ? 5 : 0)
          });
        }
      });

      // Process FrostStream streams (PT-BR Dublado)
      frostStreams.forEach(s => {
        if (s.url && !s.url.includes('koyeb.app')) {
          const rawTitle = (s.title || s.name || s.description || 'FrostStream HD').replace(/\n/g, ' ');
          const titleLower = rawTitle.toLowerCase();
          const urlLower = s.url.toLowerCase();
          const isDub = titleLower.includes('redeflix') || urlLower.includes('primevicio') || (titleLower.includes('português') && !titleLower.includes('inglês'));

          streamsList.push({
            name: `${isDub ? '🇧🇷 Dublado PT-BR' : '🌐 Multi-Áudio / Dual'} — FrostStream ${rawTitle}`,
            title: 'Servidor Nativo HD • Alta Velocidade',
            url: s.url,
            isDub: isDub,
            category: isDub ? 'dubbed' : 'web',
            score: (urlLower.includes('primevicio') ? 10 : 0) + (urlLower.includes('cdteam') ? 7 : 0) + (isDub ? 5 : 0)
          });
        }
      });

      // Process Brazuca Torrents (PT-BR Dublado)
      brazucaStreams.forEach(s => {
        const rawTitle = (s.title || s.name || s.description || 'Brazuca Torrents').replace(/\n/g, ' ');
        const titleLower = rawTitle.toLowerCase();
        const isDub = titleLower.includes('dublado') || titleLower.includes('dub') || titleLower.includes('dual') || titleLower.includes('pt-br') || titleLower.includes('português');

        if (s.url && !s.url.startsWith('magnet:')) {
          streamsList.push({
            name: `🇧🇷 Dublado PT-BR — Brazuca Direct ${rawTitle}`,
            title: 'Rede Brazuca Torrents • Stream Direct HD',
            url: s.url,
            isDub: isDub,
            category: isDub ? 'dubbed' : 'web',
            score: 9
          });
        } else if (s.infoHash || (s.url && s.url.startsWith('magnet:'))) {
          const hash = s.infoHash || (s.url.match(/btih:([a-zA-Z0-9]+)/) || [])[1];
          if (hash) {
            const magnetUrl = s.url && s.url.startsWith('magnet:') ? s.url : `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(rawTitle)}`;
            streamsList.push({
              name: `🧲 Brazuca Torrent Magnet — ${rawTitle}`,
              title: 'Link Magnético Torrent • Áudio Brasil',
              magnetUrl: magnetUrl,
              isDub: isDub,
              category: 'web',
              score: 2
            });
          }
        }
      });

      // Dedicated PT-BR Dubbed & Web Embed Players (WarezCDN, SuperFlix, EmbedFlix, MegaFlix, VidSrc, AutoEmbed, SmashyStream, 2Embed)
      const cleanImdbId = (id || '').split(':')[0];
      const isMovie = type === 'movie';

      const warezLink = isMovie 
        ? `https://warezcdn.link/embed/filme/${cleanImdbId}?autoplay=1`
        : `https://warezcdn.link/embed/serie/${cleanImdbId}/${season}/${episode}?autoplay=1`;

      const superflixUrl = isMovie
        ? `https://superflixapi.top/filme/${cleanImdbId}`
        : `https://superflixapi.top/serie/${cleanImdbId}/${season}/${episode}`;

      const embedflixUrl = isMovie
        ? `https://embedflix.net/filme/${cleanImdbId}`
        : `https://embedflix.net/serie/${cleanImdbId}/${season}/${episode}`;

      const megaflixUrl = isMovie
        ? `https://megaflix.cx/embed/filme/${cleanImdbId}`
        : `https://megaflix.cx/embed/serie/${cleanImdbId}/${season}/${episode}`;

      const vidsrcDubUrl = isMovie 
        ? `https://vidsrc.me/embed/movie?imdb=${cleanImdbId}&ds_lang=pt&autoplay=1` 
        : `https://vidsrc.me/embed/tv?imdb=${cleanImdbId}&season=${season}&episode=${episode}&ds_lang=pt&autoplay=1`;

      const autoembedUrl = isMovie
        ? `https://player.autoembed.cc/embed/movie/${cleanImdbId}`
        : `https://player.autoembed.cc/embed/tv/${cleanImdbId}/${season}/${episode}`;

      const vidsrcccUrl = isMovie
        ? `https://vidsrc.cc/v2/embed/movie/${cleanImdbId}`
        : `https://vidsrc.cc/v2/embed/tv/${cleanImdbId}/${season}/${episode}`;

      const smashystreamUrl = isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${cleanImdbId}`
        : `https://embed.smashystream.com/playere.php?tmdb=${cleanImdbId}&s=${season}&e=${episode}`;

      const embed2Url = isMovie
        ? `https://www.2embed.cc/embed/${cleanImdbId}`
        : `https://www.2embed.cc/embedtv/${cleanImdbId}&s=${season}&e=${episode}`;

      const vidlinkUrl = isMovie
        ? `https://vidlink.pro/movie/${cleanImdbId}?autoplay=true`
        : `https://vidlink.pro/tv/${cleanImdbId}/${season}/${episode}?autoplay=true`;

      streamsList.push(
        {
          name: '🇧🇷 Dublado PT-BR — WarezCDN Brasil (Player Web HD)',
          title: 'Servidor Web Dedicado ao Brasil • Áudio Dublado PT-BR',
          embedUrl: warezLink,
          isDub: true,
          category: 'dubbed',
          score: 10
        },
        {
          name: '🇧🇷 Dublado PT-BR — SuperFlix HD (Rede Português BR)',
          title: 'Servidor 100% Dublado Brasil • Full HD 1080p',
          embedUrl: superflixUrl,
          isDub: true,
          category: 'dubbed',
          score: 9
        },
        {
          name: '🇧🇷 Dublado PT-BR — EmbedFlix Brasil (Player HD)',
          title: 'Servidor Alternativo Dublado PT-BR',
          embedUrl: embedflixUrl,
          isDub: true,
          category: 'dubbed',
          score: 9
        },
        {
          name: '🇧🇷 Dublado PT-BR — MegaFlix HD (Áudio Português)',
          title: 'Servidor Otimizado Áudio Dublado BR',
          embedUrl: megaflixUrl,
          isDub: true,
          category: 'dubbed',
          score: 8
        },
        {
          name: '🇧🇷 Dublado / Legendado — VidSrc PT-BR (Player Web HD)',
          title: 'Servidor Legendado/Dublado PT-BR',
          embedUrl: vidsrcDubUrl,
          isDub: true,
          category: 'dubbed',
          score: 7
        },
        {
          name: '🌐 Player Web AutoEmbed CC (Ultra-Fast 1080p)',
          title: 'Servidor HD Ultra-Rápido Global',
          embedUrl: autoembedUrl,
          isDub: false,
          category: 'web',
          score: 6
        },
        {
          name: '🌐 Player Web VidSrc.cc (HD 1080p)',
          title: 'Servidor 1080p Full HD Séries & Filmes',
          embedUrl: vidsrcccUrl,
          isDub: false,
          category: 'web',
          score: 5
        },
        {
          name: '🌐 Player Web SmashyStream (Multi-Servidores)',
          title: 'Servidor com Seleção Automática de Legendas',
          embedUrl: smashystreamUrl,
          isDub: false,
          category: 'web',
          score: 5
        },
        {
          name: '🌐 Player Web 2Embed HD (Backup)',
          title: 'Servidor Backup HD Séries & Filmes',
          embedUrl: embed2Url,
          isDub: false,
          category: 'web',
          score: 4
        },
        {
          name: '🌐 Player Web VidLink Pro (HD)',
          title: 'Servidor Otimizado para Celular e TV',
          embedUrl: vidlinkUrl,
          isDub: false,
          category: 'web',
          score: 3
        }
      );

      return streamsList;
    } catch (error) {
      console.error('Error fetching streams:', error);
      return [];
    }
  },
  
  async searchContent(type, query) {
    return this.fetchCatalog(type, 'top', { search: query });
  }
};

// --- UI Module ---

const UI = {
  init() {
    this.bindEvents();
    this.loadInitialData();
  },
  
  bindEvents() {
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
          heroTypeName.textContent = state.currentType === 'movie' ? 'Filmes' : 'Séries';
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
      playerOverlay.addEventListener('touchstart', resetHudTimer);
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
      playBtn.addEventListener('click', () => {
        if (!video || video.classList.contains('hidden')) return;
        if (video.paused) {
          video.play();
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

    // Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        const container = document.getElementById('player-overlay') || document.documentElement;
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
        } else {
          document.exitFullscreen().catch(err => console.warn('Exit Fullscreen error:', err));
        }
      });
    }
  },
  
  async loadInitialData() {
    try {
      this.hideSearchResults();
      const catalogContainer = document.getElementById('catalog-container');
      if (catalogContainer) catalogContainer.innerHTML = '<div class="loading-spinner"></div>';
      
      const extra = state.currentGenre ? { genre: state.currentGenre } : {};
      
      const [popular, featured] = await Promise.all([
        API.fetchCatalog(state.currentType, 'top', extra),
        API.fetchCatalog(state.currentType, 'imdbRating', extra)
      ]).catch(() => [[], []]);
      
      state.catalogs.popular = popular || [];
      state.catalogs.featured = featured || [];
      
      if (popular && popular.length > 0) {
        this.setHero(popular[0]);
      }
      
      this.renderCatalogs();
    } catch (err) {
      console.error('Error in loadInitialData:', err);
    } finally {
      this.hideLoadingScreen();
    }
  },
  
  setHero(meta) {
    state.heroMeta = meta;
    const heroSection = document.getElementById('hero-section');
    const heroBackdrop = document.getElementById('hero-backdrop');
    const heroTitle = document.getElementById('hero-title');
    const heroMeta = document.getElementById('hero-meta');
    const heroDescription = document.getElementById('hero-description');
    const heroTypeName = document.getElementById('hero-type-name');

    if (heroTypeName) {
      heroTypeName.textContent = state.currentType === 'movie' ? 'Filmes 🎬' : 'Séries 📺';
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
  },
  
  createMovieCard(item) {
    const posterUrl = getPosterUrl(item);
    const isSeries = (item.type === 'series') || (state.currentType === 'series');
    return `
      <div class="movie-card" onclick="UI.openModal('${item.id}')">
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
  
  renderCatalogs() {
    const container = document.getElementById('catalog-container');
    if (!container) return;
    
    let html = '';
    const typeName = state.currentType === 'movie' ? 'Filmes' : 'Séries';
    
    if (state.catalogs.popular.length > 0) {
      html += this.createCarousel(`${typeName} Populares`, state.catalogs.popular, 'popular');
    }
    if (state.catalogs.featured.length > 0) {
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
  
  async openModal(id) {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    const meta = await API.fetchMeta(state.currentType, id);
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
    const seriesControls = document.getElementById('series-controls');
    if (seriesControls) {
      if (state.currentType === 'series') {
        seriesControls.classList.remove('hidden');
      } else {
        seriesControls.classList.add('hidden');
      }
    }

    // Reset season/episode to 1
    state.currentSeason = 1;
    state.currentEpisode = 1;
    const seasonSelect = document.getElementById('season-select');
    const episodeSelect = document.getElementById('episode-select');
    if (seasonSelect) seasonSelect.value = '1';
    if (episodeSelect) episodeSelect.value = '1';

    // Load streams
    this.loadStreams();
  },
  
  closeModal() {
    const modal = document.getElementById('movie-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
    state.currentMeta = null;
  },

  async autoPlayBestStream() {
    if (!state.currentMeta) return;

    const playerOverlay = document.getElementById('player-overlay');
    const playerLoading = document.getElementById('player-loading');
    const playerTitle = document.getElementById('player-title');
    const hudTitle = document.getElementById('hud-title');

    // Immediately show player overlay with quick loading status so it launches INSTANTLY
    if (playerOverlay) playerOverlay.classList.remove('hidden');
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = '⚡ Conectando à melhor fonte Dublada PT-BR...';
    }

    const titleText = state.currentMeta.name;
    if (playerTitle) playerTitle.textContent = titleText;
    if (hudTitle) hudTitle.textContent = titleText;

    const streams = await API.fetchStreams(
      state.currentType, 
      state.currentMeta.id, 
      state.currentSeason, 
      state.currentEpisode
    );

    // Filter playable video streams only for Auto-Play
    const playable = streams.filter(s => (s.url && !s.url.startsWith('magnet:')) || s.embedUrl);
    if (!playable || playable.length === 0) {
      alert('Nenhum player web direto disponível para este título no momento.');
      if (playerLoading) playerLoading.classList.add('hidden');
      this.closePlayer();
      return;
    }

    // Sort streams: Dubbed PT-BR first, then highest score
    const sorted = [...playable].sort((a, b) => {
      if (a.isDub && !b.isDub) return -1;
      if (!a.isDub && b.isDub) return 1;
      return (b.score || 0) - (a.score || 0);
    });

    state.activeStreams = sorted;
    this.updateHudStreamSelector(sorted, 0);

    const bestStream = sorted[0];

    if (bestStream.url) {
      this.playStream(bestStream.url, bestStream.name);
    } else if (bestStream.embedUrl) {
      this.playIframe(bestStream.embedUrl, bestStream.name);
    }
  },

  updateHudStreamSelector(streams, activeIndex = 0) {
    const hudStreamSelect = document.getElementById('hud-stream-select');
    if (!hudStreamSelect) return;

    hudStreamSelect.innerHTML = streams.map((s, idx) => {
      const label = s.name.replace(/—/g, '-');
      const selected = idx === activeIndex ? 'selected' : '';
      return `<option value="${idx}" ${selected}>${label}</option>`;
    }).join('');
  },

  playNextStream() {
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
    
    const dubbed = streams.filter(s => s.category === 'dubbed');
    const web = streams.filter(s => s.category === 'web');

    let html = '';

    if (dubbed.length > 0) {
      html += '<div style="color:#22c55e; font-weight:800; font-size:1rem; margin:1rem 0 0.5rem; display:flex; align-items:center; gap:6px;"><span>🟢</span> FONTES 100% DUBLADAS EM PORTUGUÊS (ÁUDIO BRASIL)</div>';
      html += dubbed.map(stream => this.createStreamItem(stream)).join('');
    }

    if (web.length > 0) {
      html += '<div style="color:#3b82f6; font-weight:800; font-size:1rem; margin:1.8rem 0 0.5rem; display:flex; align-items:center; gap:6px;"><span>🔵</span> PLAYERS WEB HD DE ALTA VELOCIDADE (SERVIDORES WEB)</div>';
      html += web.map(stream => this.createStreamItem(stream)).join('');
    }

    streamsList.innerHTML = html;
  },
  
  createStreamItem(stream) {
    let titleParts = ((stream.title || stream.description || '')).split('\n');
    let qualityDetails = titleParts.join(' | ');
    let name = stream.name;
    
    if (stream.magnetUrl) {
      return `
        <div class="stream-item">
          <div class="stream-info">
            <span class="stream-name">${name}</span>
            <span class="stream-details">🧲 Link Magnético Torrent • Abrir no BitTorrent/uTorrent</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <a href="${stream.magnetUrl}" target="_self" class="stream-play-btn" style="background:#f59e0b; color:black; font-weight:700; text-decoration:none;">🧲 Abrir Magnet Link</a>
          </div>
        </div>
      `;
    }
    
    if (stream.url) {
      const escapedUrl = stream.url.replace(/'/g, "\\'");
      const escapedTitle = name.replace(/'/g, "\\'");
      return `
        <div class="stream-item">
          <div class="stream-info">
            <span class="stream-name">${name}</span>
            <span class="stream-details">${qualityDetails}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="stream-play-btn" onclick="UI.playStream('${escapedUrl}', '${escapedTitle}')">▶ Assistir no App</button>
            <a href="${stream.url}" target="_blank" rel="noopener" class="stream-play-btn" style="background:rgba(255,255,255,0.15); text-decoration:none;" title="Abrir direto em nova aba para Brave/Safari">🔗 Nova Aba</a>
          </div>
        </div>
      `;
    } else if (stream.embedUrl) {
      const escapedEmbed = stream.embedUrl.replace(/'/g, "\\'");
      const escapedTitle = name.replace(/'/g, "\\'");
      return `
        <div class="stream-item">
          <div class="stream-info">
            <span class="stream-name">${name}</span>
            <span class="stream-details">${qualityDetails}</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button class="stream-play-btn" onclick="UI.playIframe('${escapedEmbed}', '${escapedTitle}')">▶ Assistir no App</button>
            <a href="${stream.embedUrl}" target="_blank" rel="noopener" class="stream-play-btn" style="background:rgba(255,255,255,0.15); text-decoration:none;" title="Abrir direto em nova aba para Brave/Safari">🔗 Nova Aba</a>
          </div>
        </div>
      `;
    }
    return '';
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
    
    if (!playerOverlay || !iframe) return;
    
    this.closePlayer();
    
    playerOverlay.classList.remove('hidden');
    iframe.classList.remove('hidden');
    if (video) video.classList.add('hidden');
    if (hudBottom) hudBottom.classList.add('hidden');
    
    if (playerLoading) {
      playerLoading.classList.remove('hidden');
      playerLoading.querySelector('p').textContent = 'Carregando Player Web HD...';
    }
    if (playerError) playerError.classList.add('hidden');
    if (playerTitle) playerTitle.textContent = title;
    if (hudTitle) hudTitle.textContent = title;
    
    iframe.src = embedUrl;
    
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
    
    if (!video || !playerOverlay) return;
    
    this.closePlayer(); // Reset any previous playback
    
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
      console.warn('Direct video error, attempting fallback...');
      if (!url.includes('allorigins') && url.startsWith('http:')) {
        const fallbackUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
        video.src = fallbackUrl;
        triggerAutoPlay();
      }
    };

    if (url.includes('.m3u8') && typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        triggerAutoPlay();
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) console.warn('HLS error:', data);
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
      iframe.src = 'about:blank';
      iframe.classList.add('hidden');
    }
    if (video) {
      video.pause();
      video.src = '';
      video.classList.remove('hidden');
    }
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
