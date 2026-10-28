(() => {
  // Application State
  const state = {
    catalogRows: [],
    addons: [],
    heroItems: [],
    heroIndex: 0,
  heroSeq: 0,
    heroTimer: null,
    heroTrailerTimer: null,
    activeFilter: 'all',
    activeHomeCategory: 'all',
    currentItem: null,
    currentMeta: null,
    currentSeason: 1,
    currentEpisode: 1,
    currentStreams: [],
    activeAddonFilter: 'all',
    telemetryTimer: null,
    playlistTargetItem: null,
    nextEpisodeTarget: null,
    nextEpisodeDismissed: false,
    myList: JSON.parse(localStorage.getItem('johnflix_mylist') || '[]'),
    playlists: JSON.parse(localStorage.getItem('johnflix_playlists') || '[]'),
    continueWatching: JSON.parse(localStorage.getItem('johnflix_cw') || '[]'),
    prevFilter: 'all',
    myListSubTab: 'swipe',
    swipeGenres: [],
    swipeSort: 'popular',
    swipeTypeFilter: 'all',
    swipeIndex: 0,
    swipeHistory: [],
    swipeSkippedIds: new Set(JSON.parse(localStorage.getItem('johnflix_swipe_seen') || '[]')),
    swipeDiscoveryItems: [],
    swipeDiscoveryLoading: false,
    swipeRandomOrder: {},
    swipeExpandedMeta: false,
    swipeMetaCache: {},
    activeLoopPlaylistId: null,
    activeLoopIndex: 0,
    isVaultMode: false,
    normalCatalogBackup: null
  };

  // DOM Elements
  const el = {
    navbar: document.getElementById('navbar'),
    myListCount: document.getElementById('myListCount'),
    playlistsCount: document.getElementById('playlistsCount'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    searchSection: document.getElementById('searchSection'),
    searchTitle: document.getElementById('searchTitle'),
    searchGrid: document.getElementById('searchGrid'),
    closeSearchBtn: document.getElementById('closeSearchBtn'),
    heroBanner: document.getElementById('heroBanner'),
    heroBackdrop: document.getElementById('heroBackdrop'),
    heroTrailerWrap: document.getElementById('heroTrailerWrap'),
    heroRankBadge: document.getElementById('heroRankBadge'),
    heroFeaturedTag: document.getElementById('heroFeaturedTag'),
    heroTrailerLivePill: document.getElementById('heroTrailerLivePill'),
    heroTrailerPill: document.getElementById('heroTrailerPill'),
    heroMuteBtn: document.getElementById('heroMuteBtn'),
    heroMuteIcon: document.getElementById('heroMuteIcon'),
    heroFocusBtn: document.getElementById('heroFocusBtn'),
    heroSlideCounter: document.getElementById('heroSlideCounter'),
    heroAgeChip: document.getElementById('heroAgeChip'),
    heroLogo: document.getElementById('heroLogo'),
    heroTitle: document.getElementById('heroTitle'),
    heroMeta: document.getElementById('heroMeta'),
    heroDesc: document.getElementById('heroDesc'),
    heroCast: document.getElementById('heroCast'),
    heroPlayBtn: document.getElementById('heroPlayBtn'),
    heroInfoBtn: document.getElementById('heroInfoBtn'),
    heroBookmarkBtn: document.getElementById('heroBookmarkBtn'),
    heroBookmarkIcon: document.getElementById('heroBookmarkIcon'),
    heroPlaylistBtn: document.getElementById('heroPlaylistBtn'),
    heroPrevBtn: document.getElementById('heroPrevBtn'),
    heroNextBtn: document.getElementById('heroNextBtn'),
    heroIndicators: document.getElementById('heroIndicators'),
    homeCategoryBar: document.getElementById('homeCategoryBar'),
    categoryPillsContainer: document.getElementById('categoryPillsContainer'),
    continueWatchingRow: document.getElementById('continueWatchingRow'),
    continueWatchingSlider: document.getElementById('continueWatchingSlider'),
    catalogContainer: document.getElementById('catalogContainer'),
    detailsModal: document.getElementById('detailsModal'),
    closeDetailsBtn: document.getElementById('closeDetailsBtn'),
    modalHero: document.getElementById('modalHero'),
    modalTrailerWrap: document.getElementById('modalTrailerWrap'),
    modalTitle: document.getElementById('modalTitle'),
    modalMeta: document.getElementById('modalMeta'),
    modalDesc: document.getElementById('modalDesc'),
    modalCast: document.getElementById('modalCast'),
    modalMyListBtn: document.getElementById('modalMyListBtn'),
  modalPlayBtn: document.getElementById('modalPlayBtn'),
    modalPlaylistBtn: document.getElementById('modalPlaylistBtn'),
    modalRecsSection: document.getElementById('modalRecsSection'),
    modalRecsSlider: document.getElementById('modalRecsSlider'),
    seriesSelector: document.getElementById('seriesSelector'),
    seasonSelect: document.getElementById('seasonSelect'),
    episodesGrid: document.getElementById('episodesGrid'),
    streamCounter: document.getElementById('streamCounter'),
    streamAddonTabs: document.getElementById('streamAddonTabs'),
    streamsLoading: document.getElementById('streamsLoading'),
    streamsList: document.getElementById('streamsList'),
    playlistModal: document.getElementById('playlistModal'),
    closePlaylistModalBtn: document.getElementById('closePlaylistModalBtn'),
    playlistTargetLabel: document.getElementById('playlistTargetLabel'),
    newPlaylistNameInput: document.getElementById('newPlaylistNameInput'),
    createPlaylistBtn: document.getElementById('createPlaylistBtn'),
    playlistPickerList: document.getElementById('playlistPickerList'),
    playerOverlay: document.getElementById('playerOverlay'),
    playerTopbar: document.getElementById('playerTopbar'),
    playerStage: document.getElementById('playerStage'),
    closePlayerBtn: document.getElementById('closePlayerBtn'),
    playerTitle: document.getElementById('playerTitle'),
    playerServerBadge: document.getElementById('playerServerBadge'),
    torrentTelemetry: document.getElementById('torrentTelemetry'),
    telemetryPeers: document.getElementById('telemetryPeers'),
    telemetrySpeed: document.getElementById('telemetrySpeed'),
    switchServerBtn: document.getElementById('switchServerBtn'),
    playerFullscreenBtn: document.getElementById('playerFullscreenBtn'),
    cloudVideo: document.getElementById('cloudVideo'),
    cloudEmbed: document.getElementById('cloudEmbed'),
    playerLoader: document.getElementById('playerLoader'),
    playerLoaderTitle: document.getElementById('playerLoaderTitle'),
    playerLoaderSub: document.getElementById('playerLoaderSub'),
    playerLoaderSwitchBtn: document.getElementById('playerLoaderSwitchBtn'),
    playerServerDrawer: document.getElementById('playerServerDrawer'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    playerDrawerList: document.getElementById('playerDrawerList'),
    nextEpCard: document.getElementById('nextEpCard'),
    nextEpTitle: document.getElementById('nextEpTitle'),
    nextEpPlayBtn: document.getElementById('nextEpPlayBtn'),
    nextEpBtnText: document.getElementById('nextEpBtnText'),
    nextEpDismissBtn: document.getElementById('nextEpDismissBtn'),
    openServersBtn: document.getElementById('openServersBtn'),
    footerServersBtn: document.getElementById('footerServersBtn'),
    serversModal: document.getElementById('serversModal'),
    closeServersModalBtn: document.getElementById('closeServersModalBtn'),
    serversModalList: document.getElementById('serversModalList'),
    toast: document.getElementById('toastNotification')
  };

  let toastTimer = null;
  function showToast(msg) {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.add('hidden'), 2600);
  }

  const THEME_PRESETS = [
    { id: 'purple', name: 'Roxo Original', color: '#a855f7' },
    { id: 'crimson', name: 'Vermelho Cinema', color: '#e50914' },
    { id: 'royal', name: 'Azul Max', color: '#3b82f6' },
    { id: 'emerald', name: 'Verde Esmeralda', color: '#10b981' },
    { id: 'amber', name: 'Ouro Imperial', color: '#f59e0b' },
    { id: 'rose', name: 'Rosa Neon', color: '#ec4899' },
    { id: 'cyan', name: 'Ciano Cyber', color: '#06b6d4' },
    { id: 'indigo', name: 'Índigo Profundo', color: '#6366f1' }
  ];

  function hexToRgb(hex) {
    const clean = String(hex || '').replace('#', '').trim();
    const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
    if (Number.isNaN(num)) return { r: 168, g: 85, b: 247 };
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function shiftHex(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const toH = (v) => clamp(v).toString(16).padStart(2, '0');
    return `#${toH(r + amt)}${toH(g + amt)}${toH(b + amt)}`;
  }

  function loadCustomConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem('johnflix_custom') || 'null');
      return {
        siteName: (saved && typeof saved.siteName === 'string' && saved.siteName.trim()) ? saved.siteName.trim().slice(0, 28) : 'JohnFlix',
        accentColor: (saved && /^#[0-9a-fA-F]{6}$/.test(saved.accentColor)) ? saved.accentColor : '#a855f7'
      };
    } catch (e) {
      return { siteName: 'JohnFlix', accentColor: '#a855f7' };
    }
  }

  function applyCustomConfig(cfg) {
    const name = (cfg && cfg.siteName ? cfg.siteName.trim() : 'JohnFlix') || 'JohnFlix';
    const color = (cfg && /^#[0-9a-fA-F]{6}$/.test(cfg.accentColor)) ? cfg.accentColor : '#a855f7';
    const { r, g, b } = hexToRgb(color);
    const deep = shiftHex(color, -38);
    const light = shiftHex(color, 38);

    const root = document.documentElement;
    root.style.setProperty('--purple-bright', color);
    root.style.setProperty('--purple-primary', color);
    root.style.setProperty('--purple-deep', deep);
    root.style.setProperty('--purple-light', light);
    root.style.setProperty('--purple-glow', `rgba(${r}, ${g}, ${b}, 0.45)`);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--border-subtle', `rgba(${r}, ${g}, ${b}, 0.22)`);

    // Split name into main + highlighted suffix (e.g. "John" + "Flix" or last 4 chars / second word)
    let firstPart = name;
    let secondPart = '';
    if (/flix$/i.test(name) && name.length > 4) {
      firstPart = name.slice(0, -4);
      secondPart = name.slice(-4);
    } else if (name.includes(' ')) {
      const parts = name.split(/\s+/);
      secondPart = parts.pop();
      firstPart = parts.join(' ') + ' ';
    } else if (name.length > 4) {
      const cut = Math.ceil(name.length * 0.55);
      firstPart = name.slice(0, cut);
      secondPart = name.slice(cut);
    }

    document.title = name.toUpperCase();
    document.querySelectorAll('.brand-word').forEach((node) => {
      node.innerHTML = `${escapeHtml(firstPart)}<span class="brand-flix">${escapeHtml(secondPart)}</span>`;
    });
    const authBrand = document.querySelector('.auth-brand');
    if (authBrand) authBrand.textContent = name.toUpperCase();
    const copyEl = document.getElementById('footerCopyright');
    if (copyEl) copyEl.textContent = `© 2026 ${name}`;

    // Update Top 10 SVG stroke dynamically
    document.querySelectorAll('.top10-rank-svg text').forEach((t) => {
      t.setAttribute('stroke', light);
    });
  }

  async function init() {
    applyCustomConfig(loadCustomConfig());
    updateBadges();
    renderContinueWatching();
    bindEvents();
    const splashEl = document.getElementById('siteIntroSplash');
    setTimeout(() => {
      if (splashEl) splashEl.classList.add('splash-hide');
    }, 450);
    setTimeout(() => {
      if (splashEl) splashEl.remove();
    }, 900);
    await loadHomeCatalog();
    if (splashEl) splashEl.classList.add('splash-hide');
  }

  function bindEvents() {
    window.addEventListener('scroll', () => {
      el.navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
    window.addEventListener('storage', () => {
      try {
        state.myList = JSON.parse(localStorage.getItem('johnflix_mylist') || '[]');
        state.playlists = JSON.parse(localStorage.getItem('johnflix_playlists') || '[]');
        state.continueWatching = JSON.parse(localStorage.getItem('johnflix_cw') || '[]');
        applyCustomConfig(loadCustomConfig());
        updateBadges();
        renderContinueWatching();
      } catch (e) {}
    });

    const navCustBtn = document.getElementById('navCustomizeBtn');
    if (navCustBtn) {
      navCustBtn.addEventListener('click', () => {
        document.getElementById('navUserMenu')?.classList.add('hidden');
        document.querySelectorAll('.nav-link').forEach((b) => {
          b.classList.toggle('active', b.dataset.filter === 'customize');
        });
        state.activeFilter = 'customize';
        closeSearch();
        renderCatalogRows();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.getElementById('brandLogo')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/';
    });

    document.querySelectorAll('.nav-link').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetFilter = btn.dataset.filter;
        state.prevFilter = state.activeFilter;
        document.querySelectorAll('.nav-link').forEach((b) => {
          b.classList.toggle('active', b.dataset.filter === targetFilter);
        });
        state.activeFilter = targetFilter;
        const activeQuery = el.searchInput ? el.searchInput.value.trim() : '';
        if (activeQuery && !el.searchSection.classList.contains('hidden') && targetFilter !== 'mylist') {
          renderFilteredSearchResults(activeQuery);
        } else if (activeQuery && targetFilter !== 'mylist') {
          performSearch(activeQuery);
        } else {
          closeSearch();
          renderCatalogRows();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    let searchTimer = null;
    el.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      const cleanCode = val.trim().toLowerCase();
      if (cleanCode === 'johntri2' || cleanCode === 'jonhtri2') {
        clearTimeout(searchTimer);
        el.searchInput.value = '';
        el.searchClear.classList.add('hidden');
        enterSecretVaultMode();
        return;
      }
      el.searchClear.classList.toggle('hidden', !val);
      clearTimeout(searchTimer);
      if (!val.trim()) {
        state.lastSearchQuery = '';
        state.lastSearchResults = [];
        closeSearch();
        renderCatalogRows();
        return;
      }
      searchTimer = setTimeout(() => performSearch(val.trim()), 320);
    });

    const exitVaultBtn = document.getElementById('exitVaultModeBtn');
    if (exitVaultBtn) {
      exitVaultBtn.addEventListener('click', () => exitSecretVaultMode());
    }

    el.searchClear.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClear.classList.add('hidden');
      state.lastSearchQuery = '';
      state.lastSearchResults = [];
      closeSearch();
      renderCatalogRows();
    });

    el.closeSearchBtn.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClear.classList.add('hidden');
      state.lastSearchQuery = '';
      state.lastSearchResults = [];
      closeSearch();
      renderCatalogRows();
    });

    // Hero buttons
    el.heroPlayBtn.addEventListener('click', () => {
      const item = state.heroItems[state.heroIndex];
      if (item) openItemDetails(item, true);
    });
    el.heroInfoBtn.addEventListener('click', () => {
      const item = state.heroItems[state.heroIndex];
      if (item) openItemDetails(item, false);
    });
    el.heroBookmarkBtn.addEventListener('click', () => {
      const item = state.heroItems[state.heroIndex];
      if (item) {
        toggleMyList(item);
        updateHeroBookmarkIcon();
      }
    });
    el.heroPlaylistBtn.addEventListener('click', () => {
      const item = state.heroItems[state.heroIndex];
      if (item) openPlaylistModal(item);
    });
    if (el.heroPrevBtn) {
      el.heroPrevBtn.addEventListener('click', () => {
        if (!state.heroItems.length) return;
        state.heroIndex = (state.heroIndex - 1 + state.heroItems.length) % state.heroItems.length;
        updateHeroSlide();
        restartHeroTimer();
      });
    }
    if (el.heroNextBtn) {
      el.heroNextBtn.addEventListener('click', () => {
        if (!state.heroItems.length) return;
        state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
        updateHeroSlide();
        restartHeroTimer();
      });
    }
    if (el.heroMuteBtn) {
      el.heroMuteBtn.addEventListener('click', () => {
        state.heroMuted = state.heroMuted === false;
        try {
          if (state.heroPlayer) {
            if (state.heroMuted) state.heroPlayer.mute();
            else { state.heroPlayer.unMute(); state.heroPlayer.setVolume(65); }
          }
        } catch (e) {}
        if (el.heroMuteIcon) {
          el.heroMuteIcon.innerHTML = state.heroMuted
            ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
            : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
        }
      });
    }
    if (el.heroFocusBtn) {
      el.heroFocusBtn.addEventListener('click', () => {
        state.heroMoreOpen = !state.heroMoreOpen;
        el.heroBanner.classList.toggle('trailer-focus', !state.heroMoreOpen);
        el.heroFocusBtn.classList.toggle('active', state.heroMoreOpen);
        const span = el.heroFocusBtn.querySelector('span');
        if (span) span.textContent = state.heroMoreOpen ? 'Ocultar informações' : 'Informações a mais';
      });
    }

    // Home Quick Category Bar
    if (el.categoryPillsContainer) {
      el.categoryPillsContainer.querySelectorAll('.cat-pill').forEach((pill) => {
        pill.addEventListener('click', () => {
          const cat = pill.dataset.cat || 'all';
          state.activeHomeCategory = cat;
          el.categoryPillsContainer.querySelectorAll('.cat-pill').forEach((p) => {
            p.classList.toggle('active', p.dataset.cat === cat);
          });
          renderCatalogRows();
        });
      });
    }

    // Details modal actions
    el.modalMyListBtn.addEventListener('click', () => {
      if (state.currentItem) {
        toggleMyList(state.currentItem);
        updateModalMyListButton();
      }
    });
    if (el.modalPlayBtn) {
      el.modalPlayBtn.addEventListener('click', () => {
        const list = state.activeAddonFilter === 'all'
          ? state.currentStreams
          : state.currentStreams.filter((s) => s.addonId === state.activeAddonFilter);
        if (list.length) {
          launchCloudPlayer(list[0]);
        } else if (state.currentStreams.length) {
          launchCloudPlayer(state.currentStreams[0]);
        } else {
          state.pendingAutoPlay = true;
          el.playerOverlay.classList.remove('hidden', 'hud-idle');
          el.playerServerDrawer.classList.add('hidden');
          el.playerLoader.classList.remove('hidden');
          el.playerLoaderTitle.textContent = 'Iniciando reprodução rápida...';
          el.playerLoaderSub.textContent = state.currentItem?.name || 'Conectando ao melhor servidor...';
          if (el.playerLoaderSwitchBtn) el.playerLoaderSwitchBtn.classList.add('hidden');
          el.playerTitle.textContent = state.currentItem?.name || 'Reproduzindo';
          showPlayerHud();
        }
      });
    }
    el.modalPlaylistBtn.addEventListener('click', () => {
      if (state.currentItem) openPlaylistModal(state.currentItem);
    });

    el.closeDetailsBtn.addEventListener('click', closeDetailsModal);
    el.detailsModal.addEventListener('click', (e) => {
      if (e.target === el.detailsModal) closeDetailsModal();
    });

    // Playlist Modal
    el.closePlaylistModalBtn.addEventListener('click', () => {
      el.playlistModal.classList.add('hidden');
    });
    el.playlistModal.addEventListener('click', (e) => {
      if (e.target === el.playlistModal) el.playlistModal.classList.add('hidden');
    });
    el.createPlaylistBtn.addEventListener('click', createNewPlaylist);
    el.newPlaylistNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') createNewPlaylist();
    });

    // Discreet Servers Modal
    if (el.openServersBtn) {
      el.openServersBtn.addEventListener('click', openServersModal);
    }
    if (el.footerServersBtn) {
      el.footerServersBtn.addEventListener('click', openServersModal);
    }
    if (el.closeServersModalBtn) {
      el.closeServersModalBtn.addEventListener('click', () => el.serversModal.classList.add('hidden'));
    }
    if (el.serversModal) {
      el.serversModal.addEventListener('click', (e) => {
        if (e.target === el.serversModal) el.serversModal.classList.add('hidden');
      });
    }

    // Player controls
    el.closePlayerBtn.addEventListener('click', stopAndClosePlayer);
    el.switchServerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.playerServerDrawer.classList.toggle('hidden');
      showPlayerHud();
    });
    el.closeDrawerBtn.addEventListener('click', () => {
      el.playerServerDrawer.classList.add('hidden');
    });
    if (el.playerLoaderSwitchBtn) {
      el.playerLoaderSwitchBtn.addEventListener('click', () => {
        el.playerServerDrawer.classList.remove('hidden');
        showPlayerHud();
      });
    }
    if (el.playerFullscreenBtn) {
      el.playerFullscreenBtn.addEventListener('click', () => {
        togglePlayerFullscreen();
      });
    }

    // Auto-hide Player HUD on inactivity + mobile swipe on Hero
    if (el.playerOverlay) {
      ['mousemove', 'pointerdown', 'touchstart'].forEach((ev) => {
        el.playerOverlay.addEventListener(ev, () => showPlayerHud(), { passive: true });
      });
    }

    if (el.heroBanner) {
      let touchX = 0;
      let touchY = 0;
      el.heroBanner.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchX = e.touches[0].clientX;
          touchY = e.touches[0].clientY;
        }
      }, { passive: true });
      el.heroBanner.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0] || !state.heroItems.length) return;
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          state.heroIndex = dx < 0
            ? (state.heroIndex + 1) % state.heroItems.length
            : (state.heroIndex - 1 + state.heroItems.length) % state.heroItems.length;
          updateHeroSlide();
          restartHeroTimer();
        }
      }, { passive: true });
    }

    el.cloudVideo.addEventListener('waiting', () => {
      el.playerLoader.classList.remove('hidden');
    });
    el.cloudVideo.addEventListener('playing', () => {
      el.playerLoader.classList.add('hidden');
    });
    el.cloudVideo.addEventListener('canplay', () => {
      el.playerLoader.classList.add('hidden');
    });
    el.cloudVideo.addEventListener('timeupdate', () => {
      if (state.currentItem && el.cloudVideo.currentTime > 5) {
        saveContinueWatching(state.currentItem, el.cloudVideo.currentTime, el.cloudVideo.duration);
      }
      checkNextEpisodePrompt();
    });
    el.cloudVideo.addEventListener('ended', () => {
      if (state.activeLoopPlaylistId) {
        const pl = state.playlists.find((p) => p.id === state.activeLoopPlaylistId);
        if (pl && Array.isArray(pl.items) && pl.items.length > 0) {
          if (!pl.loop && state.activeLoopIndex + 1 >= pl.items.length) {
            state.activeLoopPlaylistId = null;
          } else {
            state.activeLoopIndex = (state.activeLoopIndex + 1) % pl.items.length;
            const nextEntry = pl.items[state.activeLoopIndex];
            showToast(`Reproduzindo da playlist "${pl.name}": ${nextEntry.name}`);
            openItemDetails(nextEntry, true, nextEntry.targetStreamId, nextEntry.season, nextEntry.episode);
            return;
          }
        }
      }
      if (state.currentItem?.type === 'series' && state.nextEpisodeTarget && !state.nextEpisodeDismissed) {
        triggerPlayNextEpisode();
      }
    });

    if (el.nextEpPlayBtn) {
      el.nextEpPlayBtn.addEventListener('click', () => {
        triggerPlayNextEpisode();
      });
    }

    if (el.nextEpDismissBtn) {
      el.nextEpDismissBtn.addEventListener('click', () => {
        state.nextEpisodeDismissed = true;
        hideNextEpisodePrompt();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!el.playerOverlay.classList.contains('hidden')) {
          stopAndClosePlayer();
        } else if (el.serversModal && !el.serversModal.classList.contains('hidden')) {
          el.serversModal.classList.add('hidden');
        } else if (!el.playlistModal.classList.contains('hidden')) {
          el.playlistModal.classList.add('hidden');
        } else if (!el.detailsModal.classList.contains('hidden')) {
          closeDetailsModal();
        }
        return;
      }
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (
        state.activeFilter === 'mylist' &&
        state.myListSubTab === 'swipe' &&
        el.playerOverlay.classList.contains('hidden') &&
        el.detailsModal.classList.contains('hidden') &&
        el.playlistModal.classList.contains('hidden')
      ) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          triggerSwipeDecision('skip');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          triggerSwipeDecision('like');
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          toggleSwipeTechSheet();
        } else if ((e.key === 'Backspace' || (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)))) {
          e.preventDefault();
          undoLastSwipeDecision();
        }
      }
    });
  }

  function getCleanHeroBackdrop(item) {
    if (!item) return '';
    const isImdb = item.id && String(item.id).startsWith('tt');
    const rawBg = String(item.background || '');
    const isValidWide = rawBg && (rawBg.includes('images.metahub.space') || rawBg.includes('image.tmdb.org')) && !rawBg.includes('poster');
    if (isValidWide) return rawBg;
    if (isImdb) return `https://images.metahub.space/background/large/${item.id}/img`;
    return rawBg || item.poster || '';
  }

  function applyCatalogData(data) {
    if (!data || !Array.isArray(data.rows || data.catalogs)) return;
    state.catalogRows = data.rows || data.catalogs || [];
    state.addons = data.addons || [];

    const seenHero = new Set();
    const movies = [];
    const series = [];
    state.catalogRows.forEach((r) => {
      if (r.type === 'tv' || r.isTop10) return;
      (r.items || []).slice(0, 18).forEach((item) => {
        if (!item || !item.id || !String(item.id).startsWith('tt') || seenHero.has(item.id)) return;
        if (!item.description || String(item.description).length < 40) return;
        seenHero.add(item.id);
        item.background = getCleanHeroBackdrop(item);
        (item.type === 'series' ? series : movies).push(item);
      });
    });
    const shuffle = (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };
    const pick = (arr, n) => {
      const qualityPool = arr.filter((it) => it.ytId || Number(it.imdbRating) >= 7.0);
      const source = qualityPool.length >= n ? qualityPool : arr;
      return shuffle(source).slice(0, n);
    };
    const mv = pick(movies, 5);
    const sr = pick(series, 5);
    const mixed = [];
    const startWithSeries = Math.random() > 0.5;
    for (let i = 0; i < Math.max(mv.length, sr.length); i++) {
      if (startWithSeries) {
        if (sr[i]) mixed.push(sr[i]);
        if (mv[i]) mixed.push(mv[i]);
      } else {
        if (mv[i]) mixed.push(mv[i]);
        if (sr[i]) mixed.push(sr[i]);
      }
    }
    state.heroItems = mixed.slice(0, 8);
    setupHeroCarousel();
    renderCatalogRows();
  }

  async function loadHomeCatalog() {
    let hasLoadedFromCache = false;
    try {
      const cached = sessionStorage.getItem('johnflix_catalog_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.rows?.length) {
          applyCatalogData(parsed);
          hasLoadedFromCache = true;
        }
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/catalogs');
      const data = await res.json();
      if (data?.rows?.length) {
        try { sessionStorage.setItem('johnflix_catalog_cache', JSON.stringify(data)); } catch (e) {}
        if (!hasLoadedFromCache || state.catalogRows.length === 0) {
          applyCatalogData(data);
        }
      }
    } catch (err) {
      if (!state.catalogRows.length) {
        el.heroTitle.textContent = 'Indisponível no momento';
      }
    }
  }

  // ===== Hero: YouTube IFrame API trailer engine + smart rotation =====
  let ytApiPromise = null;
  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') { try { prev(); } catch (e) {} }
        resolve(window.YT);
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = () => { ytApiPromise = null; reject(new Error('yt-api')); };
      document.head.appendChild(tag);
      setTimeout(() => { if (!(window.YT && window.YT.Player)) { ytApiPromise = null; reject(new Error('yt-timeout')); } }, 9000);
    });
    return ytApiPromise;
  }

  const badTrailers = (() => {
    try { return new Set(JSON.parse(sessionStorage.getItem('jf_bad_trailers') || '[]')); } catch (e) { return new Set(); }
  })();
  function markBadTrailer(id) {
    if (!id) return;
    badTrailers.add(id);
    try { sessionStorage.setItem('jf_bad_trailers', JSON.stringify([...badTrailers].slice(-80))); } catch (e) {}
  }

  const HERO_DWELL_NO_TRAILER = 9000;
  const HERO_DWELL_MAX_TRAILER = 48000;

  function heroBlocked() {
    return document.hidden
      || !el.detailsModal.classList.contains('hidden')
      || !el.playerOverlay.classList.contains('hidden')
      || el.heroBanner.classList.contains('hidden');
  }

  function scheduleHeroAdvance(ms) {
    clearTimeout(state.heroAdvanceTimer);
    if (!state.heroItems.length || state.heroItems.length < 2) return;
    if (el.heroIndicators) {
      el.heroIndicators.style.setProperty('--dwell', `${ms}ms`);
      const act = el.heroIndicators.querySelector('.hero-dot.active');
      if (act) {
        act.classList.remove('run');
        void act.offsetWidth;
        act.classList.add('run');
      }
    }
    const tick = () => {
      if (heroBlocked()) {
        state.heroAdvanceTimer = setTimeout(tick, 2500);
        return;
      }
      state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
      updateHeroSlide();
    };
    state.heroAdvanceTimer = setTimeout(tick, ms);
  }

  function destroyHeroPlayer() {
    if (state.heroPlayer) {
      try { state.heroPlayer.destroy(); } catch (e) {}
      state.heroPlayer = null;
    }
  }

  function stopHeroTrailer() {
    state.heroMountSeq = (state.heroMountSeq || 0) + 1;
    clearTimeout(state.heroTrailerTimer);
    clearTimeout(state.heroLoopTimer);
    clearTimeout(state.heroFocusIdleTimer);
    destroyHeroPlayer();
    if (el.heroTrailerWrap) {
      el.heroTrailerWrap.classList.remove('playing');
      el.heroTrailerWrap.innerHTML = '';
    }
    if (el.heroBanner) {
      el.heroBanner.classList.remove('trailer-on');
      el.heroBanner.classList.toggle('trailer-focus', !state.heroMoreOpen);
    }
    if (el.heroTrailerLivePill) el.heroTrailerLivePill.classList.add('hidden');
    if (el.heroTrailerPill) el.heroTrailerPill.classList.add('hidden');
    if (el.heroMuteBtn) el.heroMuteBtn.classList.add('hidden');
  }

  async function resolveTrailerCandidates(item) {
    const out = [];
    const push = (id) => { if (id && /^[\w-]{6,15}$/.test(id) && !out.includes(id) && !badTrailers.has(id)) out.push(id); };
    push(item.ytId);
    if (item.ytCandidates) item.ytCandidates.forEach(push);
    if (out.length < 2 && item.id && String(item.id).startsWith('tt')) {
      try {
        const r = await fetch(`/api/meta/${item.type}/${encodeURIComponent(item.id)}`);
        const d = await r.json();
        const m = d && d.meta;
        const list = [];
        (m && m.trailers || []).forEach((t) => list.push(t && t.source));
        (m && m.trailerStreams || []).forEach((t) => list.push(t && t.ytId));
        item.ytCandidates = list.filter(Boolean);
        item.ytCandidates.forEach(push);
      } catch (e) {}
    }
    return out;
  }

  function mountHeroTrailer(item) {
    stopHeroTrailer();
    if (!item || !el.heroTrailerWrap) return;
    const seq = state.heroMountSeq;
    const stale = () => seq !== state.heroMountSeq || state.heroItems[state.heroIndex]?.id !== item.id;

    if (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches) {
      scheduleHeroAdvance(HERO_DWELL_NO_TRAILER);
      return;
    }

    // Default: if no trailer shows up fast, keep rotating anyway
    scheduleHeroAdvance(HERO_DWELL_NO_TRAILER + 2000);

    state.heroTrailerTimer = setTimeout(async () => {
      if (stale() || heroBlocked()) return;
      const candidates = await resolveTrailerCandidates(item);
      if (stale()) return;
      if (!candidates.length) return;
      let YT;
      try { YT = await loadYouTubeApi(); } catch (e) { return; }
      if (stale()) return;

      const tryCandidate = (idx) => {
        if (stale()) return;
        if (idx >= candidates.length) {
          stopHeroTrailerKeepSeq();
          scheduleHeroAdvance(HERO_DWELL_NO_TRAILER);
          return;
        }
        const ytId = candidates[idx];
        destroyHeroPlayer();
        el.heroTrailerWrap.classList.remove('playing');
        el.heroTrailerWrap.innerHTML = '<div id="heroYtMount"></div>';
        let revealed = false;
        const failTimer = setTimeout(() => {
          if (!revealed && !stale()) { markBadTrailer(ytId); tryCandidate(idx + 1); }
        }, 5500);

        try {
          state.heroPlayer = new YT.Player('heroYtMount', {
            videoId: ytId,
            playerVars: {
              autoplay: 1, mute: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1,
              iv_load_policy: 3, disablekb: 1, fs: 0, cc_load_policy: 0, start: 6, enablejsapi: 1,
              origin: location.origin
            },
            events: {
              onReady: (ev) => {
                if (stale()) return;
                try {
                  if (state.heroMuted === false) { ev.target.unMute(); ev.target.setVolume(65); }
                  else { ev.target.mute(); state.heroMuted = true; }
                  ev.target.playVideo();
                } catch (e) {}
              },
              onStateChange: (ev) => {
                if (stale()) return;
                if (ev.data === 1 && !revealed) { // PLAYING
                  let dur = 0;
                  let vTitle = '';
                  try {
                    dur = ev.target.getDuration() || 0;
                    vTitle = (ev.target.getVideoData && ev.target.getVideoData()?.title) || '';
                  } catch (e) {}
                  if (dur > 0 && dur < 12) {
                    clearTimeout(failTimer);
                    markBadTrailer(ytId);
                    tryCandidate(idx + 1);
                    return;
                  }
                  revealed = true;
                  clearTimeout(failTimer);
                  const remaining = dur > 20 ? Math.max(15000, (dur - 6) * 1000 - 2500) : HERO_DWELL_MAX_TRAILER;
                  scheduleHeroAdvance(Math.min(HERO_DWELL_MAX_TRAILER, remaining));
                  setTimeout(() => {
                    if (stale()) return;
                    // Double check player is still playing (state === 1) and didn't error out into geo-block screen
                    try {
                      if (ev.target.getPlayerState && ev.target.getPlayerState() !== 1) {
                        markBadTrailer(ytId);
                        tryCandidate(idx + 1);
                        return;
                      }
                    } catch (e) {}
                    el.heroTrailerWrap.classList.add('playing');
                    el.heroBanner.classList.add('trailer-on');
                    if (el.heroTrailerLivePill) el.heroTrailerLivePill.classList.remove('hidden');
                    if (el.heroMuteBtn) el.heroMuteBtn.classList.remove('hidden');
                  }, 420);
                } else if (ev.data === 0) { // ENDED
                  if (!heroBlocked()) {
                    state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
                    updateHeroSlide();
                  }
                } else if (ev.data === 2 && revealed && !heroBlocked()) {
                  try { ev.target.playVideo(); } catch (e) {}
                }
              },
              onError: () => {
                clearTimeout(failTimer);
                if (stale()) return;
                markBadTrailer(ytId);
                el.heroTrailerWrap.classList.remove('playing');
                tryCandidate(idx + 1);
              }
            }
          });
        } catch (e) {
          clearTimeout(failTimer);
          tryCandidate(idx + 1);
        }
      };
      tryCandidate(0);
    }, 380);
  }

  function stopHeroTrailerKeepSeq() {
    const keep = state.heroMountSeq;
    stopHeroTrailer();
    state.heroMountSeq = keep;
  }

  function setupHeroCarousel() {
    if (!state.heroItems.length) return;
    el.heroIndicators.innerHTML = '';
    state.heroItems.forEach((item, idx) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `hero-dot hero-rec-card ${idx === 0 ? 'active' : ''}`;
      card.setAttribute('aria-label', item.name);
      const thumb = getCleanHeroBackdrop(item) || item.poster || '';
      const fallbackPoster = item.poster || '';
      const typeLabel = item.type === 'series' ? 'SÉRIE' : 'FILME';
      const ratingLabel = item.imdbRating ? `★ ${item.imdbRating}` : (item.year || '');
      card.innerHTML = `
        <div class="hero-rec-thumb" style="background-image:url('${thumb}'), url('${fallbackPoster}')">
          <span class="hero-rec-rank">#${idx + 1}</span>
          <span class="hero-rec-play-badge">▶</span>
        </div>
        <div class="hero-rec-meta">
          <span class="hero-rec-kicker">${typeLabel} ${ratingLabel ? '• ' + ratingLabel : ''}</span>
          <strong class="hero-rec-name">${escapeHtml(item.name)}</strong>
        </div>
        <span class="hero-rec-progress"></span>
      `;
      card.addEventListener('click', () => {
        state.heroIndex = idx;
        updateHeroSlide();
      });
      el.heroIndicators.appendChild(card);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearTimeout(state.heroAdvanceTimer);
        stopHeroTrailer();
      } else if (!el.heroBanner.classList.contains('hidden') && state.heroItems[state.heroIndex]) {
        mountHeroTrailer(state.heroItems[state.heroIndex]);
      }
    });
    updateHeroSlide();
  }

  // Rotation is now driven by the trailer/dwell logic (see scheduleHeroAdvance)
  function restartHeroTimer() {}

  const logoDarkCache = new Map();

  function detectDarkLogo(img) {
    try {
      const w = 48;
      const h = Math.max(8, Math.round((img.naturalHeight / img.naturalWidth) * w)) || 16;
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h).data;
      let sum = 0;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 40) {
          sum += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          n += 1;
        }
      }
      return n > 0 && (sum / n) < 95;
    } catch (e) {
      return false;
    }
  }

  function updateHeroSlide() {
    const item = state.heroItems[state.heroIndex];
    if (!item) return;
    const seq = ++state.heroSeq;

    const bgUrl = getCleanHeroBackdrop(item);
    el.heroBackdrop.style.backgroundImage = `url('${bgUrl}')`;
    const bgProbe = new Image();
    bgProbe.onerror = () => {
      if (seq !== state.heroSeq) return;
      if (item.poster) el.heroBackdrop.style.backgroundImage = `url('${item.poster}')`;
    };
    bgProbe.src = bgUrl;

    el.heroDesc.textContent = item.description || '';

    if (el.heroRankBadge) {
      el.heroRankBadge.textContent = `#${state.heroIndex + 1} EM DESTAQUE`;
    }
    if (el.heroSlideCounter) {
      const cur = String(state.heroIndex + 1).padStart(2, '0');
      const tot = String(state.heroItems.length).padStart(2, '0');
      el.heroSlideCounter.textContent = `${cur} / ${tot}`;
    }
    if (el.heroFeaturedTag) {
      el.heroFeaturedTag.textContent = item.type === 'series' ? 'SÉRIE RECOMENDADA' : 'FILME RECOMENDADO';
    }
    if (el.heroAgeChip) {
      const g = (item.genres || []).join(' ').toLowerCase();
      el.heroAgeChip.textContent = /horror|terror|crime|thriller|war/i.test(g) ? '16' : /animation|family|kids|com/i.test(g) ? '12' : '14';
    }

    // Brand: keep both hidden until the logo resolves, then show exactly one (no text->logo flicker)
    el.heroLogo.classList.add('hidden');
    el.heroTitle.classList.add('hidden');
    el.heroTitle.textContent = item.name;
    const logoUrl = item.logo || (item.id && item.id.startsWith('tt') ? `https://images.metahub.space/logo/medium/${item.id}/img` : '');
    const showTitle = () => {
      if (seq !== state.heroSeq) return;
      el.heroLogo.classList.add('hidden');
      el.heroTitle.classList.remove('hidden');
    };
    if (logoUrl) {
      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = () => {
        if (seq !== state.heroSeq) return;
        if (!logoDarkCache.has(logoUrl)) logoDarkCache.set(logoUrl, detectDarkLogo(probe));
        el.heroLogo.classList.toggle('logo-dark', logoDarkCache.get(logoUrl));
        el.heroLogo.src = logoUrl;
        el.heroLogo.alt = item.name;
        el.heroLogo.classList.remove('hidden');
      };
      probe.onerror = showTitle;
      probe.src = logoUrl;
    } else {
      showTitle();
    }

    const ratingHtml = item.imdbRating ? `<span class="meta-rating">★ ${item.imdbRating}</span>` : '';
    const yearHtml = item.year ? `<span>${item.year}</span>` : '';
    const hdHtml = `<span class="hero-quality-chip">4K</span>`;

    el.heroMeta.innerHTML = [ratingHtml, yearHtml, hdHtml].filter(Boolean).join('<span class="hero-meta-dot">•</span>');

    updateHeroBookmarkIcon();
    el.heroIndicators.querySelectorAll('.hero-dot').forEach((d, i) => {
      const isAct = i === state.heroIndex;
      d.classList.toggle('active', isAct);
      if (isAct && d.scrollIntoView) {
        try {
          el.heroIndicators.scrollTo({
            left: Math.max(0, d.offsetLeft - el.heroIndicators.clientWidth / 2 + d.clientWidth / 2),
            behavior: 'smooth'
          });
        } catch (e) {}
      }
    });

    mountHeroTrailer(item);
    prefetchStreams(item.type, item.type === 'series' ? `${item.id}:1:1` : item.id);
  }

  function updateHeroBookmarkIcon() {
    const item = state.heroItems[state.heroIndex];
    if (!item || !el.heroBookmarkIcon) return;
    const inList = isInMyList(item.id);
    el.heroBookmarkIcon.innerHTML = inList
      ? '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"/>'
      : '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none"/>';
  }

  // Render Catalog Rows or My List / Playlists Views
  function renderCatalogRows() {
    el.catalogContainer.innerHTML = '';

    // Trigger page transition animation on every tab change
    el.catalogContainer.classList.remove('tab-enter-anim', 'catalog-slide-up');
    void el.catalogContainer.offsetWidth;
    el.catalogContainer.classList.add('tab-enter-anim');

    const isAllTab = state.activeFilter === 'all';
    const isMovieOrSeriesTab = ['movie', 'series'].includes(state.activeFilter);
    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);

    if (isAllTab) {
      el.heroBanner.classList.remove('hidden', 'hero-collapsing');
      el.heroBanner.classList.add('hero-expanding');
    } else if (isMovieOrSeriesTab) {
      el.heroBanner.classList.remove('hidden', 'hero-expanding');
      el.heroBanner.classList.add('hero-collapsing');
      el.catalogContainer.classList.add('catalog-slide-up');
      stopHeroTrailer();
    } else {
      el.heroBanner.classList.remove('hero-expanding', 'hero-collapsing');
      el.heroBanner.classList.add('hidden');
      stopHeroTrailer();
    }

    const mainContentEl = document.getElementById('mainContent');
    if (mainContentEl) {
      mainContentEl.classList.toggle('no-hero-offset', isMovieOrSeriesTab || state.activeFilter === 'tv');
    }

    if (el.homeCategoryBar) {
      el.homeCategoryBar.classList.toggle('hidden', !isHomeView);
      el.homeCategoryBar.classList.toggle('cat-bar-top-offset', isMovieOrSeriesTab);
    }
    renderContinueWatching();

    if (state.activeFilter === 'explore') {
      renderExploreView();
      return;
    }

    if (state.activeFilter === 'mylist' || state.activeFilter === 'playlists') {
      if (state.activeFilter === 'playlists') {
        state.activeFilter = 'mylist';
        state.myListSubTab = 'playlists';
      }
      renderMyListHub();
      return;
    }

    if (state.activeFilter === 'customize') {
      renderCustomizeSection();
      return;
    }

    const savedTvHidden = new Set(JSON.parse(localStorage.getItem('johnflix_hidden_tv_channels') || '[]'));
    if (state.activeFilter === 'tv') {
      const allTvItems = state.catalogRows.filter((r) => r.type === 'tv').flatMap((r) => r.items || []);
      const totalCount = allTvItems.length;
      const activeCount = allTvItems.filter((it) => !savedTvHidden.has(it.id)).length;

      const tvBar = document.createElement('div');
      tvBar.className = 'tv-manage-bar';
      tvBar.innerHTML = `
        <div class="tv-manage-title">
          <span>Canais de TV Ativos:</span>
          <span class="tv-manage-badge">${activeCount} de ${totalCount} disponíveis</span>
        </div>
        <button type="button" class="btn btn-sm btn-glass" id="tvSelectChannelsBtn">Selecionar Canais</button>
      `;
      tvBar.querySelector('#tvSelectChannelsBtn').addEventListener('click', openTvChannelPickerModal);
      el.catalogContainer.appendChild(tvBar);
    }

    let rows = state.catalogRows;
    if (state.activeFilter === 'all') {
      rows = rows.filter((r) => r.type !== 'tv');
    } else if (state.activeFilter === 'movie') {
      rows = rows.filter((r) => r.type === 'movie');
    } else if (state.activeFilter === 'series') {
      rows = rows.filter((r) => r.type === 'series');
    } else if (state.activeFilter === 'tv') {
      rows = rows.filter((r) => r.type === 'tv').map((r) => ({
        ...r,
        items: (r.items || []).filter((item) => !savedTvHidden.has(item.id))
      })).filter((r) => r.items.length > 0);
    }

    if (isHomeView && state.activeHomeCategory && state.activeHomeCategory !== 'all') {
      const catFiltered = rows.filter((r) => r.category === state.activeHomeCategory);
      if (catFiltered.length > 0) {
        rows = catFiltered;
      }
    }

    rows.forEach((row) => {
      const rowEl = document.createElement('section');
      rowEl.className = 'catalog-row';
      rowEl.innerHTML = `
        <div class="row-header">
          <h2 class="row-title">${escapeHtml(row.title)}</h2>
          <div class="row-nav">
            <button class="row-more-btn" data-rowid="${escapeHtml(row.id)}">Ver mais</button>
            <button class="row-nav-btn prev-btn" aria-label="Anterior">&#10094;</button>
            <button class="row-nav-btn next-btn" aria-label="Próximo">&#10095;</button>
          </div>
        </div>
        <div class="row-slider-wrap">
          <div class="row-slider"></div>
        </div>
      `;

      rowEl.querySelector('.row-more-btn').addEventListener('click', () => {
        openRowMoreGrid(row);
      });

      const slider = rowEl.querySelector('.row-slider');
      row.items.forEach((item, idx) => {
        slider.appendChild(createMediaCard(item, { isTop10: Boolean(row.isTop10), rank: item.rank || idx + 1 }));
      });

      rowEl.querySelector('.prev-btn').addEventListener('click', () => {
        slider.scrollBy({ left: -820, behavior: 'smooth' });
      });
      rowEl.querySelector('.next-btn').addEventListener('click', () => {
        slider.scrollBy({ left: 820, behavior: 'smooth' });
      });

      el.catalogContainer.appendChild(rowEl);
    });
  }

  async function openRowMoreGrid(row) {
    el.searchSection.classList.remove('hidden');
    el.heroBanner.classList.add('hidden');
    if (el.homeCategoryBar) el.homeCategoryBar.classList.add('hidden');
    stopHeroTrailer();
    el.continueWatchingRow.classList.add('hidden');
    el.catalogContainer.classList.add('hidden');

    let currentItems = [...(row.items || [])];
    el.searchTitle.innerHTML = `${escapeHtml(row.title)} <span class="search-count-pill" id="rowMoreCount">${currentItems.length} títulos</span>`;
    const filterBar = document.getElementById('searchFilterBar');
    if (filterBar) {
      filterBar.innerHTML = `<span style="font-size:0.75rem;color:var(--text-muted);display:flex;align-items:center;gap:6px;"><span class="spinner-inline" id="rowMoreSpinner"></span> Carregando catálogo expandido...</span>`;
    }

    el.searchGrid.innerHTML = '';
    currentItems.forEach((item) => {
      el.searchGrid.appendChild(createMediaCard(item));
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const qParams = new URLSearchParams({
        id: row.id || '',
        type: row.type || 'movie',
        genre: row.genre || '',
        category: row.category || '',
        title: row.title || '',
        url: row.url || ''
      });
      const res = await fetch(`/api/catalog/more?${qParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          const seen = new Set(currentItems.map((i) => i.id));
          const newItems = data.items.filter((i) => !seen.has(i.id));
          newItems.forEach((item) => {
            currentItems.push(item);
            el.searchGrid.appendChild(createMediaCard(item));
          });
          const countEl = document.getElementById('rowMoreCount');
          if (countEl) countEl.textContent = `${currentItems.length} títulos`;
        }
      }
    } catch (e) {}

    if (filterBar) filterBar.innerHTML = '';
  }

  function openTvChannelPickerModal() {
    let picker = document.getElementById('tvChannelPickerModal');
    if (!picker) {
      picker = document.createElement('div');
      picker.id = 'tvChannelPickerModal';
      picker.className = 'modal-backdrop';
      picker.innerHTML = `
        <div class="modal-card" style="max-width: 600px; max-height: 85vh; display: flex; flex-direction: column;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff;">Selecionar Canais de TV</h3>
            <button id="closeTvPickerBtn" style="background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;">&times;</button>
          </div>
          <div style="padding: 12px 20px; display: flex; gap: 8px;">
            <input type="text" id="tvPickerSearch" placeholder="Buscar canal..." style="flex:1; padding: 8px 12px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color:#fff; font-size:0.85rem;" />
            <button id="tvPickerSelectAll" class="btn btn-sm btn-glass" style="font-size:0.75rem;">Todos</button>
            <button id="tvPickerDeselectAll" class="btn btn-sm btn-glass" style="font-size:0.75rem;">Limpar</button>
          </div>
          <div id="tvPickerList" style="flex: 1; overflow-y: auto; padding: 10px 20px; display: flex; flex-direction: column; gap: 6px;"></div>
          <div style="padding: 14px 20px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: flex-end; gap: 10px;">
            <button id="tvPickerSaveBtn" class="btn btn-primary btn-sm">Salvar Preferências</button>
          </div>
        </div>
      `;
      document.body.appendChild(picker);
    }

    const savedHidden = new Set(JSON.parse(localStorage.getItem('johnflix_hidden_tv_channels') || '[]'));
    const allChannels = state.catalogRows.filter((r) => r.type === 'tv').flatMap((r) => r.items || []);
    const uniqueChannels = [];
    const seen = new Set();
    allChannels.forEach((c) => {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        uniqueChannels.push(c);
      }
    });

    const listEl = picker.querySelector('#tvPickerList');
    const searchInput = picker.querySelector('#tvPickerSearch');

    const renderList = (filter = '') => {
      listEl.innerHTML = '';
      const filtered = uniqueChannels.filter((c) => !filter || c.name.toLowerCase().includes(filter.toLowerCase()));
      filtered.forEach((ch) => {
        const isSelected = !savedHidden.has(ch.id);
        const row = document.createElement('label');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,0.03);cursor:pointer;';
        row.innerHTML = `
          <input type="checkbox" data-cid="${escapeHtml(ch.id)}" ${isSelected ? 'checked' : ''} style="width:16px;height:16px;accent-color:var(--purple-bright);" />
          <span style="font-size:0.86rem;color:#f1f5f9;flex:1;">${escapeHtml(ch.name)}</span>
          <span style="font-size:0.7rem;color:#a855f7;font-weight:700;">${isSelected ? 'Ativo' : 'Oculto'}</span>
        `;
        row.querySelector('input').addEventListener('change', (e) => {
          if (e.target.checked) savedHidden.delete(ch.id);
          else savedHidden.add(ch.id);
          row.querySelector('span:last-child').textContent = e.target.checked ? 'Ativo' : 'Oculto';
        });
        listEl.appendChild(row);
      });
    };

    searchInput.oninput = (e) => renderList(e.target.value.trim());
    picker.querySelector('#tvPickerSelectAll').onclick = () => {
      savedHidden.clear();
      renderList(searchInput.value.trim());
    };
    picker.querySelector('#tvPickerDeselectAll').onclick = () => {
      uniqueChannels.forEach((c) => savedHidden.add(c.id));
      renderList(searchInput.value.trim());
    };
    picker.querySelector('#closeTvPickerBtn').onclick = () => picker.classList.add('hidden');
    picker.onclick = (e) => { if (e.target === picker) picker.classList.add('hidden'); };
    picker.querySelector('#tvPickerSaveBtn').onclick = () => {
      localStorage.setItem('johnflix_hidden_tv_channels', JSON.stringify(Array.from(savedHidden)));
      picker.classList.add('hidden');
      renderCatalogRows();
      showToast('Lista de canais atualizada!');
    };

    renderList();
    picker.classList.remove('hidden');
  }

  const SWIPE_GENRE_MAP = [
    { id: 'acao', label: 'Ação', match: ['action', 'ação', 'acao', 'adventure', 'aventura'] },
    { id: 'scifi', label: 'Ficção Científica', match: ['sci-fi', 'science fiction', 'ficção', 'ficcao', 'fantasy', 'fantasia'] },
    { id: 'comedia', label: 'Comédia', match: ['comedy', 'comédia', 'comedia'] },
    { id: 'terror', label: 'Terror', match: ['horror', 'terror'] },
    { id: 'suspense', label: 'Suspense / Crime', match: ['thriller', 'mystery', 'crime', 'suspense', 'mistério'] },
    { id: 'drama', label: 'Drama', match: ['drama', 'biography', 'history'] },
    { id: 'romance', label: 'Romance', match: ['romance'] },
    { id: 'animacao', label: 'Animação', match: ['animation', 'animação', 'animacao', 'family', 'família'] },
    { id: 'doc', label: 'Documentário', match: ['documentary', 'documentário', 'documentario'] }
  ];

  function saveSwipeSeenIds() {
    try {
      const arr = Array.from(state.swipeSkippedIds).slice(-600);
      localStorage.setItem('johnflix_swipe_seen', JSON.stringify(arr));
    } catch (e) {}
  }

  async function ensureSwipeDeepDiscovery() {
    if (state.swipeDiscoveryLoading || state.swipeDiscoveryItems.length >= 160) return;
    state.swipeDiscoveryLoading = true;
    try {
      const genres = ['Action', 'Sci-Fi', 'Thriller', 'Comedy', 'Horror', 'Drama', 'Animation', 'Mystery', 'Romance', 'Adventure'];
      const picked = genres.sort(() => Math.random() - 0.5).slice(0, 4);
      const tasks = [];
      for (const g of picked) {
        const skip = Math.floor(Math.random() * 3) * 50;
        tasks.push(
          fetch(`https://v3-cinemeta.strem.io/catalog/movie/top/genre=${encodeURIComponent(g)}&skip=${skip}.json`)
            .then((r) => r.json())
            .then((d) => (d?.metas || []).map((m) => ({
              id: m.id,
              type: 'movie',
              name: m.name,
              poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
              background: m.background || `https://images.metahub.space/background/large/${m.id}/img`,
              year: m.releaseInfo || m.year || '',
              imdbRating: m.imdbRating || '',
              description: m.description || '',
              genres: Array.isArray(m.genres) ? m.genres : [g],
              _rowCategory: g.toLowerCase(),
              _isDeepDiscovery: true
            })))
            .catch(() => [])
        );
        tasks.push(
          fetch(`https://v3-cinemeta.strem.io/catalog/series/top/genre=${encodeURIComponent(g)}&skip=${skip}.json`)
            .then((r) => r.json())
            .then((d) => (d?.metas || []).map((m) => ({
              id: m.id,
              type: 'series',
              name: m.name,
              poster: m.poster || `https://images.metahub.space/poster/medium/${m.id}/img`,
              background: m.background || `https://images.metahub.space/background/large/${m.id}/img`,
              year: m.releaseInfo || m.year || '',
              imdbRating: m.imdbRating || '',
              description: m.description || '',
              genres: Array.isArray(m.genres) ? m.genres : [g],
              _rowCategory: g.toLowerCase(),
              _isDeepDiscovery: true
            })))
            .catch(() => [])
        );
      }
      const batches = await Promise.all(tasks);
      const seen = new Set(state.swipeDiscoveryItems.map((i) => i.id));
      batches.flat().forEach((it) => {
        if (it && it.id && String(it.id).startsWith('tt') && !seen.has(it.id)) {
          seen.add(it.id);
          state.swipeDiscoveryItems.push(it);
        }
      });
    } catch (e) {
    } finally {
      state.swipeDiscoveryLoading = false;
    }
  }

  function getSwipePool() {
    ensureSwipeDeepDiscovery();

    // Exclude items already visible on the first screen of Home (Hero + Top 10 + Continue Watching) so TinderFlix shows fresh discoveries!
    const homeFeaturedIds = new Set([
      ...state.heroItems.map((i) => i.id),
      ...state.continueWatching.map((i) => i.id),
      ...state.myList.map((i) => i.id)
    ]);
    state.catalogRows.forEach((row) => {
      if (row.isTop10) {
        (row.items || []).forEach((it) => { if (it && it.id) homeFeaturedIds.add(it.id); });
      }
    });

    const seen = new Set();
    const allItems = [];

    // 1. Add deep discovery titles first (fresh titles not on home shelves)
    state.swipeDiscoveryItems.forEach((item) => {
      if (!item || !item.id || seen.has(item.id)) return;
      seen.add(item.id);
      allItems.push({ ...item, _isDeepDiscovery: true });
    });

    // 2. Add deeper items from catalog rows (skipping the first few obvious titles of each row unless needed)
    state.catalogRows.forEach((row) => {
      if (row.type === 'tv' || row.isTop10) return;
      (row.items || []).forEach((item, idx) => {
        if (!item || !item.id || seen.has(item.id)) return;
        seen.add(item.id);
        allItems.push({
          ...item,
          _rowCategory: row.category || '',
          _isDeepDiscovery: idx >= 5
        });
      });
    });

    // Build personalized affinity profile from Watchlist (myList) + Continue Watching (continueWatching) + playlists
    const playlistItems = state.playlists.flatMap((p) => p.items || []);
    const historySignals = [...state.continueWatching, ...state.myList, ...playlistItems];
    const genreWeights = {};
    const typeCounts = { movie: 0, series: 0 };
    const keywordBag = new Set();

    historySignals.forEach((sig, idx) => {
      if (!sig) return;
      const recencyBoost = idx < 5 ? 2.5 : 1.2;
      if (sig.type === 'series') typeCounts.series += recencyBoost;
      else if (sig.type === 'movie') typeCounts.movie += recencyBoost;

      const sigGenres = Array.isArray(sig.genres) ? sig.genres : [];
      sigGenres.forEach((g) => {
        const key = String(g || '').toLowerCase().trim();
        if (key) genreWeights[key] = (genreWeights[key] || 0) + 3 * recencyBoost;
      });
      if (sig._rowCategory) {
        const cat = String(sig._rowCategory).toLowerCase().trim();
        genreWeights[cat] = (genreWeights[cat] || 0) + 2 * recencyBoost;
      }
      String(sig.name || '')
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 4)
        .forEach((w) => keywordBag.add(w));
    });

    const filtered = allItems.filter((item) => {
      return !state.swipeSkippedIds.has(item.id) && !homeFeaturedIds.has(item.id);
    });

    filtered.forEach((item) => {
      if (state.swipeRandomOrder[item.id] === undefined) {
        state.swipeRandomOrder[item.id] = Math.random() * 14;
      }
      let score = state.swipeRandomOrder[item.id] + (item._isDeepDiscovery ? 6 : 0);

      if (historySignals.length > 0) {
        const itemGenres = Array.isArray(item.genres) ? item.genres : [];
        itemGenres.forEach((g) => {
          const key = String(g || '').toLowerCase().trim();
          if (genreWeights[key]) score += Math.min(8, genreWeights[key]);
        });
        const catKey = String(item._rowCategory || '').toLowerCase().trim();
        if (catKey && genreWeights[catKey]) score += Math.min(5, genreWeights[catKey]);

        if (item.type === 'series' && typeCounts.series > typeCounts.movie) score += 2;
        if (item.type === 'movie' && typeCounts.movie > typeCounts.series) score += 2;

        const descLower = String(item.description || '').toLowerCase();
        keywordBag.forEach((kw) => {
          if (descLower.includes(kw)) score += 1.5;
        });
      }

      score += (Number(item.imdbRating) || 7.0) * 0.25;
      item._affinityScore = score;
    });

    filtered.sort((a, b) => b._affinityScore - a._affinityScore);
    return filtered;
  }

  function renderMyListHub() {
    const hub = document.createElement('section');
    hub.className = 'mylist-hub-section';
    hub.innerHTML = `
      <div class="mylist-hub-header">
        <div class="mylist-subtabs" role="tablist">
          <button type="button" class="mylist-subtab ${state.myListSubTab === 'swipe' ? 'active' : ''}" data-subtab="swipe">
            <span>TinderFlix</span>
          </button>
          <button type="button" class="mylist-subtab ${state.myListSubTab === 'watchlist' ? 'active' : ''}" data-subtab="watchlist">
            <span>Minha Lista (${state.myList.length})</span>
          </button>
          <button type="button" class="mylist-subtab ${state.myListSubTab === 'playlists' ? 'active' : ''}" data-subtab="playlists">
            <span>Playlists (${state.playlists.length})</span>
          </button>
        </div>
      </div>
      <div class="mylist-hub-body tab-enter-anim" id="myListHubBody"></div>
    `;
    el.catalogContainer.appendChild(hub);

    hub.querySelectorAll('.mylist-subtab').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.myListSubTab = btn.dataset.subtab;
        renderCatalogRows();
      });
    });

    const body = hub.querySelector('#myListHubBody');
    if (state.myListSubTab === 'watchlist') {
      renderWatchlistSubView(body);
    } else if (state.myListSubTab === 'playlists') {
      renderPlaylistsSection(body);
    } else {
      renderSwipeDeckSubView(body);
    }
  }

  function renderWatchlistSubView(container) {
    const wrap = document.createElement('div');
    wrap.className = 'watchlist-subview';
    wrap.innerHTML = `
      <div class="media-grid" id="myListGrid"></div>
    `;
    container.appendChild(wrap);
    const grid = wrap.querySelector('#myListGrid');
    if (!state.myList.length) {
      grid.innerHTML = `<div class="swipe-empty-card" style="grid-column:1/-1;"><p style="color:var(--text-muted);margin:0 0 14px;">Sua lista ainda está vazia. Deslize para a direita no <strong>TinderFlix</strong> para salvar seus favoritos!</p><button type="button" class="btn btn-sm btn-primary" id="goToSwipeFromWatchlistBtn">Ir para o TinderFlix</button></div>`;
      grid.querySelector('#goToSwipeFromWatchlistBtn')?.addEventListener('click', () => {
        state.myListSubTab = 'swipe';
        renderCatalogRows();
      });
    } else {
      state.myList.forEach((item) => grid.appendChild(createMediaCard(item, { allowRemoveMyList: true })));
    }
  }

  function renderSwipeDeckSubView(container) {
    const pool = getSwipePool();
    if (state.swipeIndex >= pool.length) state.swipeIndex = 0;
    const current = pool[state.swipeIndex] || null;

    const deckWrap = document.createElement('div');
    deckWrap.className = 'swipe-tv-wrap';
    deckWrap.innerHTML = `
      <div class="swipe-stage" id="swipeStage"></div>
    `;
    container.appendChild(deckWrap);

    const stage = deckWrap.querySelector('#swipeStage');
    if (!current) {
      stage.innerHTML = `
        <div class="swipe-empty-card">
          <h3>Você viu todas as sugestões!</h3>
          <p>Reinicie para ver mais filmes e séries no TinderFlix.</p>
          <button type="button" class="btn btn-primary" id="resetSwipePoolBtn">Reiniciar TinderFlix</button>
        </div>
      `;
      stage.querySelector('#resetSwipePoolBtn')?.addEventListener('click', () => {
        state.swipeSkippedIds.clear();
        saveSwipeSeenIds();
        state.swipeRandomOrder = {};
        state.swipeIndex = 0;
        renderCatalogRows();
      });
      return;
    }

    const bgUrl = getCleanHeroBackdrop(current);
    const posterUrl = current.poster || `https://images.metahub.space/poster/medium/${current.id}/img`;
    const typeLabel = current.type === 'series' ? 'Série' : 'Filme';
    const genresList = Array.isArray(current.genres) && current.genres.length
      ? current.genres.slice(0, 3).join(' • ')
      : '';
    const cachedMeta = state.swipeMetaCache[`${current.type}:${current.id}`] || {};
    const runtimeText = cachedMeta.runtime || current.runtime || '';

    stage.innerHTML = `
      <div class="swipe-deck-row">
        <button type="button" class="swipe-side-arrow swipe-skip-arrow" id="swipeLeftBtn" title="Esquerda: Ignorar">
          <span class="swipe-arrow-circle skip">✕</span>
          <span class="swipe-arrow-label">Pular</span>
        </button>

        <article class="swipe-card" id="activeSwipeCard">
          <div class="swipe-card-backdrop" style="background-image:url('${bgUrl}')"></div>
          <div class="swipe-card-stamp skip-stamp" id="swipeStampSkip">PULAR</div>
          <div class="swipe-card-stamp like-stamp" id="swipeStampLike">GOSTEI ♥</div>

          <div class="swipe-card-inner">
            <div class="swipe-card-poster-col">
              <img src="${posterUrl}" alt="${escapeHtml(current.name)}" class="swipe-card-poster" onerror="this.onerror=null;this.src='https://placehold.co/340x510/160b2b/a855f7?text=${encodeURIComponent(current.name)}'" />
            </div>
            <div class="swipe-card-info-col">
              <div class="swipe-card-badges">
                <span class="swipe-badge-type">${typeLabel}</span>
                ${current.year ? `<span class="swipe-badge-meta">${escapeHtml(current.year)}</span>` : ''}
                ${runtimeText ? `<span class="swipe-badge-meta" id="swipeRuntimePill">${escapeHtml(runtimeText)}</span>` : `<span class="swipe-badge-meta hidden" id="swipeRuntimePill"></span>`}
                ${current.imdbRating ? `<span class="swipe-badge-imdb">★ ${escapeHtml(current.imdbRating)}</span>` : ''}
              </div>
              <h2 class="swipe-card-title">${escapeHtml(current.name)}</h2>
              ${genresList ? `<div class="swipe-card-genres">${escapeHtml(genresList)}</div>` : ''}
              <p class="swipe-card-synopsis">${escapeHtml(current.description || '')}</p>

              <div class="swipe-main-cta-row">
                <button type="button" class="swipe-mobile-decision skip" id="swipeMobileSkipBtn" aria-label="Pular">✕</button>
                <button type="button" class="swipe-platform-btn johnflix-direct" id="swipePlayInstantBtn">▶ Assistir no JohnFlix</button>
                <button type="button" class="swipe-mobile-decision like" id="swipeMobileLikeBtn" aria-label="Gostei">♥</button>
              </div>
            </div>
          </div>

          <div class="swipe-quick-bar">
            <button type="button" class="swipe-qbtn" id="swipeUndoBtn" ${state.swipeHistory.length === 0 ? 'disabled' : ''}>
              Desfazer
            </button>
            <button type="button" class="swipe-qbtn" id="swipeTrailerBtn">
              Trailer
            </button>
            <button type="button" class="swipe-qbtn" id="swipeDetailsSheetBtn">
              Ficha Técnica
            </button>
            <button type="button" class="swipe-qbtn" id="swipeAddPlaylistBtn">
              + Playlist
            </button>
          </div>

          <div class="swipe-tech-sheet ${state.swipeExpandedMeta ? '' : 'hidden'}" id="swipeTechSheet">
            <div class="swipe-tech-loading">Carregando ficha técnica...</div>
          </div>
        </article>

        <button type="button" class="swipe-side-arrow swipe-like-arrow" id="swipeRightBtn" title="Direita: Gostei">
          <span class="swipe-arrow-circle like">♥</span>
          <span class="swipe-arrow-label">Gostei</span>
        </button>
      </div>
    `;

    stage.querySelector('#swipeLeftBtn')?.addEventListener('click', () => triggerSwipeDecision('skip'));
    stage.querySelector('#swipeRightBtn')?.addEventListener('click', () => triggerSwipeDecision('like'));
    stage.querySelector('#swipeMobileSkipBtn')?.addEventListener('click', () => triggerSwipeDecision('skip'));
    stage.querySelector('#swipeMobileLikeBtn')?.addEventListener('click', () => triggerSwipeDecision('like'));
    stage.querySelector('#swipeUndoBtn')?.addEventListener('click', () => undoLastSwipeDecision());
    stage.querySelector('#swipePlayInstantBtn')?.addEventListener('click', () => openItemDetails(current, true));
    stage.querySelector('#swipeAddPlaylistBtn')?.addEventListener('click', () => openPlaylistModal(current));
    stage.querySelector('#swipeTrailerBtn')?.addEventListener('click', () => openSwipeTrailerPreview(current));
    stage.querySelector('#swipeDetailsSheetBtn')?.addEventListener('click', () => toggleSwipeTechSheet());

    // Touch swipe gesture on card
    const cardEl = stage.querySelector('#activeSwipeCard');
    if (cardEl) {
      let startX = 0;
      let startY = 0;
      cardEl.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        }
      }, { passive: true });
      cardEl.addEventListener('touchend', (e) => {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          triggerSwipeDecision(dx > 0 ? 'like' : 'skip');
        }
      }, { passive: true });
    }

    if (state.swipeExpandedMeta) {
      populateSwipeTechSheet(current);
    } else {
      // Background prefetch meta so runtime & cast are instant
      fetchSwipeMeta(current);
    }
  }

  async function fetchSwipeMeta(item) {
    if (!item || !item.id) return null;
    const key = `${item.type}:${item.id}`;
    if (state.swipeMetaCache[key]) return state.swipeMetaCache[key];
    try {
      const res = await fetch(`/api/meta/${item.type}/${encodeURIComponent(item.id)}`);
      const data = await res.json();
      const meta = data.meta || {};
      state.swipeMetaCache[key] = meta;
      const rtEl = document.getElementById('swipeRuntimePill');
      if (rtEl && meta.runtime) {
        rtEl.textContent = meta.runtime;
        rtEl.classList.remove('hidden');
      }
      return meta;
    } catch (e) {
      return null;
    }
  }

  function triggerSwipeDecision(action) {
    const pool = getSwipePool();
    const current = pool[state.swipeIndex];
    if (!current) return;
    const card = document.getElementById('activeSwipeCard');
    const isLike = action === 'like';

    if (card) {
      card.classList.add(isLike ? 'swiping-right' : 'swiping-left');
    }

    setTimeout(() => {
      state.swipeHistory.push({ item: current, action });
      if (isLike) {
        if (!isInMyList(current.id)) {
          state.myList.unshift({
            id: current.id,
            type: current.type,
            name: current.name,
            poster: current.poster,
            background: current.background,
            year: current.year,
            imdbRating: current.imdbRating,
            description: current.description,
            genres: current.genres || [],
            _rowCategory: current._rowCategory || ''
          });
          localStorage.setItem('johnflix_mylist', JSON.stringify(state.myList));
          updateBadges();
        }
        state.swipeSkippedIds.add(current.id);
        saveSwipeSeenIds();
        showToast(`"${current.name}" salvo na Minha Lista!`);
      } else {
        state.swipeSkippedIds.add(current.id);
        saveSwipeSeenIds();
      }
      if (getSwipePool().length < 20) {
        state.swipeDiscoveryItems = [];
        ensureSwipeDeepDiscovery();
      }
      state.swipeExpandedMeta = false;
      renderCatalogRows();
    }, 280);
  }

  function undoLastSwipeDecision() {
    if (!state.swipeHistory.length) return;
    const last = state.swipeHistory.pop();
    if (!last || !last.item) return;
    if (last.action === 'like') {
      state.myList = state.myList.filter((i) => i.id !== last.item.id);
      localStorage.setItem('johnflix_mylist', JSON.stringify(state.myList));
      updateBadges();
    }
    state.swipeSkippedIds.delete(last.item.id);
    saveSwipeSeenIds();
    state.swipeRandomOrder[last.item.id] = 9999;
    state.swipeIndex = 0;
    state.swipeExpandedMeta = false;
    showToast(`Ação desfeita: ${last.item.name}`);
    renderCatalogRows();
  }

  async function openSwipeTrailerPreview(item) {
    const meta = await fetchSwipeMeta(item);
    const ytId = item.ytId || (Array.isArray(meta?.trailers) && meta.trailers[0]?.source) || '';
    if (ytId) {
      window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(ytId)}`, '_blank', 'noopener');
    } else {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + ' ' + (item.year || '') + ' official trailer legendado')}`, '_blank', 'noopener');
    }
  }

  function toggleSwipeTechSheet() {
    state.swipeExpandedMeta = !state.swipeExpandedMeta;
    const sheet = document.getElementById('swipeTechSheet');
    if (!sheet) return;
    sheet.classList.toggle('hidden', !state.swipeExpandedMeta);
    if (state.swipeExpandedMeta) {
      const pool = getSwipePool();
      const current = pool[state.swipeIndex];
      if (current) populateSwipeTechSheet(current);
    }
  }

  async function populateSwipeTechSheet(item) {
    const sheet = document.getElementById('swipeTechSheet');
    if (!sheet) return;
    const meta = (await fetchSwipeMeta(item)) || {};
    const cast = Array.isArray(meta.cast) && meta.cast.length ? meta.cast.slice(0, 10) : (Array.isArray(item.cast) ? item.cast : []);
    const directors = Array.isArray(meta.director) && meta.director.length
      ? meta.director
      : (typeof meta.director === 'string' && meta.director ? [meta.director] : []);
    const ratingNum = Number(meta.imdbRating || item.imdbRating) || 7.6;
    const awardsText = meta.awards || (ratingNum >= 8.2
      ? 'Aclamado pela Crítica Internacional • Destaque em Premiações & IMDb Top Rated'
      : 'Seleção Oficial de Catálogo • Aprovado pelo Público');

    sheet.innerHTML = `
      <div class="swipe-tech-grid">
        <div class="swipe-tech-main">
          <h4>Sinopse Completa</h4>
          <p>${escapeHtml(meta.description || item.description || 'Sinopse detalhada indisponível.')}</p>

          <div class="swipe-awards-box">
            <div>
              <strong>Prémios, Nomeações &amp; Reconhecimento</strong>
              <p>${escapeHtml(awardsText)}</p>
            </div>
          </div>

          <h4>Elenco &amp; Equipa Técnica <small>(Clique num ator ou realizador para pesquisar a sua filmografia)</small></h4>
          <div class="swipe-cast-chips">
            ${directors.map((d) => `<button type="button" class="swipe-person-chip director" data-person="${escapeHtml(d)}">Realizador: ${escapeHtml(d)}</button>`).join('')}
            ${cast.length ? cast.map((c) => `<button type="button" class="swipe-person-chip" data-person="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('') : '<span style="color:var(--text-muted);font-size:0.84rem;">Elenco principal listado na ficha oficial.</span>'}
          </div>
        </div>

        <div class="swipe-tech-reviews">
          <h4>Críticas de Utilizadores</h4>
          <div class="swipe-review-card">
            <div class="swipe-review-head">
              <strong>Consenso da Comunidade IMDb</strong>
              <span class="swipe-review-score">★ ${ratingNum.toFixed(1)}/10</span>
            </div>
            <p>"Produção envolvente com excelente direção de fotografia e ritmo cinematográfico. Recomendado para assistir na TV com som imersivo."</p>
          </div>
          <div class="swipe-review-card">
            <div class="swipe-review-head">
              <strong>Avaliação dos Espectadores</strong>
              <span class="swipe-review-score">${Math.round(ratingNum * 10)}% Aprovação</span>
            </div>
            <p>"Um dos títulos mais procurados na categoria ${escapeHtml((Array.isArray(item.genres) && item.genres[0]) || 'Cinema')}."</p>
          </div>
        </div>
      </div>
    `;

    sheet.querySelectorAll('.swipe-person-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const person = btn.dataset.person;
        if (!person) return;
        if (el.searchInput) {
          el.searchInput.value = person;
          el.searchClear?.classList.remove('hidden');
        }
        performSearch(person);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderPlaylistsSection(targetContainer) {
    const section = document.createElement('section');
    section.className = targetContainer ? 'playlists-embedded-section' : 'search-section';
    if (!targetContainer) section.style.paddingTop = '100px';
    section.innerHTML = `
      <div class="section-header">
        <h2>Minhas Playlists</h2>
        <button class="btn btn-sm btn-primary" id="newPlaylistPageBtn">+ Nova Playlist</button>
      </div>
      <div id="playlistsWrap"></div>
    `;
    (targetContainer || el.catalogContainer).appendChild(section);

    section.querySelector('#newPlaylistPageBtn').addEventListener('click', () => {
      openPlaylistModal(null);
    });

    const wrap = section.querySelector('#playlistsWrap');
    if (!state.playlists.length) {
      wrap.innerHTML = `<p style="color:var(--text-muted);">Você ainda não criou nenhuma playlist. Crie playlists para organizar seus filmes e episódios favoritos.</p>`;
      return;
    }

    state.playlists.forEach((pl) => {
      const block = document.createElement('div');
      block.className = 'playlist-block';
      const isLoopOn = Boolean(pl.loop);
      block.innerHTML = `
        <div class="playlist-block-header">
          <div>
            <h3>${escapeHtml(pl.name)} <span style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">(${pl.items.length})</span></h3>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm btn-primary play-pl-btn" ${pl.items.length === 0 ? 'disabled' : ''}>▶ Reproduzir</button>
            <button class="btn btn-sm btn-glass loop-pl-btn ${isLoopOn ? 'active' : ''}" style="${isLoopOn ? 'border-color:var(--purple-bright);background:rgba(168,85,247,0.22);color:#fff;' : ''}" title="Repetir playlist em loop contínuo">
              Loop: ${isLoopOn ? 'Ativo' : 'Off'}
            </button>
            <button class="btn btn-sm btn-glass delete-pl-btn" style="color:#f87171;">Excluir</button>
          </div>
        </div>
        <div class="row-slider"></div>
      `;

      block.querySelector('.play-pl-btn')?.addEventListener('click', () => {
        if (!pl.items.length) return;
        state.activeLoopPlaylistId = pl.id;
        state.activeLoopIndex = 0;
        const first = pl.items[0];
        openItemDetails(first, true, first.targetStreamId, first.season, first.episode);
      });

      block.querySelector('.loop-pl-btn')?.addEventListener('click', () => {
        pl.loop = !pl.loop;
        savePlaylists();
        if (pl.loop && pl.items.length > 0 && state.activeLoopPlaylistId !== pl.id) {
          state.activeLoopPlaylistId = pl.id;
          state.activeLoopIndex = 0;
        }
        showToast(pl.loop ? `Loop ativado em "${pl.name}"` : `Loop desativado em "${pl.name}"`);
        renderCatalogRows();
      });

      block.querySelector('.delete-pl-btn').addEventListener('click', () => {
        deletePlaylist(pl.id);
      });

      const slider = block.querySelector('.row-slider');
      if (!pl.items.length) {
        slider.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;">Playlist vazia. Adicione filmes ou episódios de séries pelo ícone de salvar.</p>`;
      } else {
        pl.items.forEach((entry, idx) => {
          slider.appendChild(createMediaCard(entry, { playlistId: pl.id, playlistIndex: idx }));
        });
      }
      wrap.appendChild(block);
    });
  }

  function renderCustomizeSection() {
    const cfg = loadCustomConfig();
    const section = document.createElement('section');
    section.className = 'customize-section';
    section.innerHTML = `
      <div class="customize-container">
        <div class="customize-header">
          <div>
            <span class="customize-kicker">IDENTIDADE VISUAL</span>
            <h2>Personalizar Plataforma</h2>
            <p>Altere o nome exibido no topo e escolha a cor principal de destaque do seu streaming.</p>
          </div>
          <button type="button" class="btn btn-glass btn-sm" id="resetCustomBtn">Restaurar Padrão</button>
        </div>

        <div class="customize-grid">
          <div class="customize-card">
            <label class="customize-label" for="customSiteNameInput">Nome do Streaming</label>
            <p class="customize-hint">Exibido na barra superior, título da aba, rodapé e tela de acesso.</p>
            <input type="text" id="customSiteNameInput" class="customize-text-input" maxlength="28" value="${escapeHtml(cfg.siteName)}" placeholder="Ex: JohnFlix, CineMax, PrimeBR..." />

            <div class="customize-divider"></div>

            <label class="customize-label">Cor Principal do Tema</label>
            <p class="customize-hint">Aplica-se à marca, botões, indicadores, bordas em foco e selos.</p>
            <div class="customize-swatches" id="customSwatches">
              ${THEME_PRESETS.map((p) => `
                <button type="button" class="swatch-btn ${cfg.accentColor.toLowerCase() === p.color.toLowerCase() ? 'active' : ''}" data-color="${p.color}" title="${p.name}">
                  <span class="swatch-dot" style="background:${p.color}"></span>
                  <span class="swatch-name">${p.name}</span>
                </button>
              `).join('')}
            </div>

            <div class="customize-color-picker-row">
              <label for="customHexPicker">Ou escolha qualquer cor personalizada:</label>
              <div class="color-picker-control">
                <input type="color" id="customHexPicker" value="${escapeHtml(cfg.accentColor)}" />
                <input type="text" id="customHexText" class="customize-hex-input" maxlength="7" value="${escapeHtml(cfg.accentColor.toUpperCase())}" />
              </div>
            </div>

            <div class="customize-actions">
              <button type="button" class="btn btn-primary" id="saveCustomBtn">Salvar Personalização</button>
            </div>
          </div>

          <div class="customize-preview-card">
            <span class="customize-kicker">PRÉ-VISUALIZAÇÃO AO VIVO</span>
            <div class="preview-stage">
              <div class="preview-nav">
                <span class="brand-word" id="previewBrandWord">John<span class="brand-flix">Flix</span></span>
                <span class="preview-nav-pill">Início</span>
              </div>
              <div class="preview-hero-box">
                <span class="preview-badge">#1 EM ALTA HOJE</span>
                <h3 id="previewHeroTitle">Experiência Cinematográfica</h3>
                <p>Interface personalizada em tempo real com a identidade e cor que você escolher.</p>
                <div class="preview-btns">
                  <span class="preview-cta-primary">▶ Assistir</span>
                  <span class="preview-cta-ghost">Detalhes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    el.catalogContainer.appendChild(section);

    const nameInput = section.querySelector('#customSiteNameInput');
    const colorPicker = section.querySelector('#customHexPicker');
    const hexText = section.querySelector('#customHexText');
    let currentColor = cfg.accentColor;

    const liveUpdate = () => {
      const next = {
        siteName: nameInput.value.trim() || 'JohnFlix',
        accentColor: /^#[0-9a-fA-F]{6}$/.test(currentColor) ? currentColor : '#a855f7'
      };
      applyCustomConfig(next);
    };

    nameInput.addEventListener('input', liveUpdate);

    section.querySelectorAll('.swatch-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentColor = btn.dataset.color;
        colorPicker.value = currentColor;
        hexText.value = currentColor.toUpperCase();
        section.querySelectorAll('.swatch-btn').forEach((b) => b.classList.toggle('active', b === btn));
        liveUpdate();
      });
    });

    colorPicker.addEventListener('input', (e) => {
      currentColor = e.target.value;
      hexText.value = currentColor.toUpperCase();
      section.querySelectorAll('.swatch-btn').forEach((b) => b.classList.toggle('active', b.dataset.color.toLowerCase() === currentColor.toLowerCase()));
      liveUpdate();
    });

    hexText.addEventListener('input', (e) => {
      const v = e.target.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        currentColor = v;
        colorPicker.value = v;
        section.querySelectorAll('.swatch-btn').forEach((b) => b.classList.toggle('active', b.dataset.color.toLowerCase() === v.toLowerCase()));
        liveUpdate();
      }
    });

    section.querySelector('#saveCustomBtn').addEventListener('click', () => {
      const saved = {
        siteName: nameInput.value.trim() || 'JohnFlix',
        accentColor: /^#[0-9a-fA-F]{6}$/.test(currentColor) ? currentColor : '#a855f7'
      };
      localStorage.setItem('johnflix_custom', JSON.stringify(saved));
      applyCustomConfig(saved);
      showToast('Personalização salva com sucesso!');
    });

    section.querySelector('#resetCustomBtn').addEventListener('click', () => {
      const def = { siteName: 'JohnFlix', accentColor: '#a855f7' };
      localStorage.setItem('johnflix_custom', JSON.stringify(def));
      applyCustomConfig(def);
      renderCatalogRows();
      showToast('Padrão original restaurado.');
    });

    liveUpdate();
  }

  const BOOK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  const BOOKF_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

  // Explore view (genre / year / rating / sort filters over Cinemeta catalogs)
  const exploreState = { type: 'movie', genre: '', yearFrom: '', yearTo: '', minRating: 0, sort: 'popular', skip: 0, items: [], loading: false, done: false, seq: 0 };
  const EXPLORE_GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

  function renderExploreView() {
    const section = document.createElement('section');
    section.className = 'explore-section';
    const chip = (v, label, active, attr) => `<button class="explore-chip ${active ? 'active' : ''}" data-${attr}="${v}">${label}</button>`;
    const thisYear = new Date().getFullYear();
    section.innerHTML = `
      <div class="explore-head">
        <h2>Explorar</h2>
        <div class="explore-seg">
          ${chip('movie', 'Filmes', exploreState.type === 'movie', 'etype')}
          ${chip('series', 'Séries', exploreState.type === 'series', 'etype')}
        </div>
      </div>
      <div class="explore-filters">
        <div class="explore-chips">
          ${chip('', 'Todos', !exploreState.genre, 'egenre')}
          ${EXPLORE_GENRES.map((g) => chip(g, g, exploreState.genre === g, 'egenre')).join('')}
        </div>
        <div class="explore-controls">
          <label>Ano de <input type="number" id="exYearFrom" min="1900" max="${thisYear}" placeholder="1990" value="${exploreState.yearFrom}"></label>
          <label>até <input type="number" id="exYearTo" min="1900" max="${thisYear}" placeholder="${thisYear}" value="${exploreState.yearTo}"></label>
          <label>Nota mín. <span id="exRatingVal">${exploreState.minRating || 0}</span>
            <input type="range" id="exRating" min="0" max="9" step="0.5" value="${exploreState.minRating}"></label>
          <label>Ordenar
            <select id="exSort">
              <option value="popular" ${exploreState.sort === 'popular' ? 'selected' : ''}>Popularidade</option>
              <option value="rating" ${exploreState.sort === 'rating' ? 'selected' : ''}>Melhor avaliados</option>
              <option value="newest" ${exploreState.sort === 'newest' ? 'selected' : ''}>Mais recentes</option>
              <option value="oldest" ${exploreState.sort === 'oldest' ? 'selected' : ''}>Mais antigos</option>
            </select>
          </label>
        </div>
      </div>
      <div class="media-grid" id="exploreGrid"></div>
      <div class="explore-more"><button class="btn btn-glass" id="exploreMoreBtn">Carregar mais</button></div>
    `;
    el.catalogContainer.appendChild(section);

    const reload = () => { exploreState.skip = 0; exploreState.items = []; exploreState.done = false; exploreState.loading = false; exploreState.seq++; loadExplore(true); };
    section.querySelectorAll('[data-etype]').forEach((b) => b.addEventListener('click', () => {
      exploreState.type = b.dataset.etype; renderCatalogRows(); reload();
    }));
    section.querySelectorAll('[data-egenre]').forEach((b) => b.addEventListener('click', () => {
      exploreState.genre = b.dataset.egenre;
      section.querySelectorAll('[data-egenre]').forEach((x) => x.classList.toggle('active', x === b));
      reload();
    }));
    let t = null;
    const onYear = () => {
      exploreState.yearFrom = section.querySelector('#exYearFrom').value;
      exploreState.yearTo = section.querySelector('#exYearTo').value;
      clearTimeout(t); t = setTimeout(() => drawExplore(true), 250);
    };
    section.querySelector('#exYearFrom').addEventListener('input', onYear);
    section.querySelector('#exYearTo').addEventListener('input', onYear);
    section.querySelector('#exRating').addEventListener('input', (e) => {
      exploreState.minRating = Number(e.target.value);
      section.querySelector('#exRatingVal').textContent = exploreState.minRating;
      drawExplore(true);
    });
    section.querySelector('#exSort').addEventListener('change', (e) => { exploreState.sort = e.target.value; drawExplore(true); });
    section.querySelector('#exploreMoreBtn').addEventListener('click', () => loadExplore(false));

    if (exploreState.items.length) drawExplore(true); else reload();
  }

  async function loadExplore(fresh) {
    if (exploreState.loading || exploreState.done) return;
    const grid = document.getElementById('exploreGrid');
    if (!grid) return;
    exploreState.loading = true;
    const seq = exploreState.seq;
    const moreBtn = document.getElementById('exploreMoreBtn');
    if (moreBtn) moreBtn.textContent = 'Carregando...';
    if (fresh) grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">Carregando...</p>';
    try {
      const extra = [];
      if (exploreState.genre) extra.push(`genre=${encodeURIComponent(exploreState.genre)}`);
      if (exploreState.skip) extra.push(`skip=${exploreState.skip}`);
      const url = `https://v3-cinemeta.strem.io/catalog/${exploreState.type}/top${extra.length ? '/' + extra.join('&') : ''}.json`;
      const res = await fetch(url);
      const data = await res.json();
      if (seq !== exploreState.seq) return;
      const metas = Array.isArray(data.metas) ? data.metas : [];
      if (metas.length === 0) exploreState.done = true;
      exploreState.skip += metas.length;
      const known = new Set(exploreState.items.map((i) => i.id));
      metas.forEach((m, idx) => {
        if (known.has(m.id)) return;
        exploreState.items.push({ ...m, type: exploreState.type, _rank: exploreState.items.length + idx });
      });
    } catch (e) {
      exploreState.done = true;
    } finally {
      if (seq === exploreState.seq) {
        exploreState.loading = false;
        drawExplore(true);
      }
    }
  }

  function drawExplore() {
    const grid = document.getElementById('exploreGrid');
    if (!grid) return;
    const yf = Number(exploreState.yearFrom) || 0;
    const yt = Number(exploreState.yearTo) || 9999;
    const yearOf = (i) => parseInt(String(i.year || i.releaseInfo || '').slice(0, 4), 10) || 0;
    let list = exploreState.items.filter((i) => {
      const y = yearOf(i);
      if ((yf || yt < 9999) && !y) return false;
      return y >= yf && y <= yt && (Number(i.imdbRating) || 0) >= exploreState.minRating;
    });
    const s = exploreState.sort;
    if (s === 'rating') list.sort((a, b) => (Number(b.imdbRating) || 0) - (Number(a.imdbRating) || 0));
    else if (s === 'newest') list.sort((a, b) => yearOf(b) - yearOf(a));
    else if (s === 'oldest') list.sort((a, b) => (yearOf(a) || 9999) - (yearOf(b) || 9999));
    else list.sort((a, b) => a._rank - b._rank);
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;">${exploreState.loading ? 'Carregando...' : 'Nenhum título com esses filtros. Tente carregar mais.'}</p>`;
    } else {
      list.forEach((item) => grid.appendChild(createMediaCard(item)));
    }
    const moreBtn = document.getElementById('exploreMoreBtn');
    if (moreBtn) {
      moreBtn.textContent = 'Carregar mais';
      moreBtn.parentElement.classList.toggle('hidden', exploreState.done);
    }
  }

  function createMediaCard(item, opts = {}) {
    const card = document.createElement('article');
    card.className = opts.isTop10 ? 'media-card top10-card' : 'media-card';
    const fallbackPoster = `https://images.metahub.space/poster/medium/${item.id}/img`;
    const inList = isInMyList(item.id);

    let progressHtml = '';
    if (opts.isContinueWatching && item.duration > 0) {
      const pct = Math.min(98, Math.max(5, Math.round((item.savedTime / item.duration) * 100)));
      progressHtml = `<div class="cw-progress-bar"><div class="cw-progress-fill" style="width:${pct}%"></div></div>`;
    }

    const removeBtnHtml = opts.isContinueWatching || opts.playlistId
      ? `<button class="card-action-btn remove-btn" title="Remover">&times;</button>`
      : '';

    const genreStr = Array.isArray(item.genres) && item.genres.length > 0 ? item.genres[0] : '';
    const subText = item.epLabel
      ? escapeHtml(item.epLabel)
      : [item.year, genreStr, item.imdbRating ? `★ ${item.imdbRating}` : ''].filter(Boolean).join(' • ');

    const innerCardHtml = `
      <div class="card-poster-wrap">
        <img class="card-poster" src="${item.poster || fallbackPoster}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.onerror=null;this.src='https://placehold.co/300x450/160b2b/a855f7?text=${encodeURIComponent(item.name)}'" />
        <div class="card-quick-actions">
          <button class="card-action-btn mylist-btn ${inList ? 'active' : ''}" title="${inList ? 'Remover da Minha Lista' : 'Salvar na Minha Lista'}">${inList ? BOOKF_ICON : BOOK_ICON}</button>
          <button class="card-action-btn pl-btn" title="Adicionar à Playlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></button>
          ${removeBtnHtml}
        </div>
        <div class="card-overlay">
          <div class="card-play-circle">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
        </div>
        ${progressHtml}
      </div>
      <div class="card-info">
        <h3 class="card-title" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h3>
        <div class="card-sub">${subText ? `<span>${subText}</span>` : '&nbsp;'}</div>
      </div>
    `;

    if (opts.isTop10) {
      const rankStr = String(opts.rank || 1);
      const vbW = rankStr.length > 1 ? 230 : 120;
      card.innerHTML = `
        <svg class="top10-rank-svg ${rankStr.length > 1 ? 'wide' : ''}" viewBox="0 0 ${vbW} 170" aria-hidden="true">
          <text x="${vbW / 2}" y="152" text-anchor="middle" font-family="Outfit, Inter, sans-serif" font-size="176" font-weight="800" letter-spacing="-8"
            fill="#0c0618" stroke="#d8b4fe" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke">${rankStr}</text>
        </svg>
        <div class="card-inner-box">${innerCardHtml}</div>
      `;
    } else {
      card.innerHTML = innerCardHtml;
    }

    const playCircle = card.querySelector('.card-play-circle');
    if (playCircle) {
      playCircle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opts.playlistId) {
          state.activeLoopPlaylistId = opts.playlistId;
          state.activeLoopIndex = opts.playlistIndex || 0;
        } else {
          state.activeLoopPlaylistId = null;
        }
        state.pendingResume = opts.isContinueWatching ? (item.savedTime || 0) : 0;
        openItemDetails(item, true, item.targetStreamId, item.season, item.episode);
      });
    }

    const mylistBtn = card.querySelector('.mylist-btn');
    mylistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMyList(item);
      const nowIn = isInMyList(item.id);
      mylistBtn.classList.toggle('active', nowIn);
      mylistBtn.innerHTML = nowIn ? BOOKF_ICON : BOOK_ICON;
      if (state.activeFilter === 'mylist') renderCatalogRows();
    });

    const plBtn = card.querySelector('.pl-btn');
    plBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPlaylistModal(item);
    });

    const remBtn = card.querySelector('.remove-btn');
    if (remBtn) {
      remBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opts.isContinueWatching) {
          removeFromContinueWatching(item.id);
        } else if (opts.playlistId) {
          removeItemFromPlaylist(opts.playlistId, item.uid || item.id);
        }
      });
    }

    const triggerPrefetch = () => {
      const targetId = item.targetStreamId || (item.type === 'series' ? `${item.id}:1:1` : item.id);
      prefetchStreams(item.type, targetId);
    };
    card.addEventListener('mouseenter', triggerPrefetch, { once: true, passive: true });
    card.addEventListener('touchstart', triggerPrefetch, { once: true, passive: true });

    card.addEventListener('click', () => {
      if (opts.playlistId) {
        state.activeLoopPlaylistId = opts.playlistId;
        state.activeLoopIndex = opts.playlistIndex || 0;
      } else {
        state.activeLoopPlaylistId = null;
      }
      state.pendingResume = opts.isContinueWatching ? (item.savedTime || 0) : 0;
      if (item.targetStreamId && item.type === 'series') {
        openItemDetails(item, true, item.targetStreamId, item.season, item.episode);
      } else {
        openItemDetails(item, opts.isContinueWatching ? true : false);
      }
    });

    return card;
  }

  async function enterSecretVaultMode() {
    closeSearch();
    stopHeroTrailer();
    state.isVaultMode = true;
    if (!state.normalCatalogBackup) {
      state.normalCatalogBackup = {
        catalogRows: state.catalogRows,
        heroItems: state.heroItems,
        addons: state.addons
      };
    }

    document.body.classList.add('vault-restricted-mode');
    document.getElementById('exitVaultModeBtn')?.classList.remove('hidden');
    applyCustomConfig({ siteName: 'JohnTri 18+', accentColor: '#e11d48' });

    state.activeFilter = 'all';
    document.querySelectorAll('.nav-link').forEach((b) => {
      b.classList.toggle('active', b.dataset.filter === 'all');
    });

    showToast('Área Restrita Desbloqueada');
    el.catalogContainer.innerHTML = `
      <div class="streams-loading" style="margin:110px 4.5% 40px;">
        <div class="spinner-purple"></div>
        <span>Carregando catálogo exclusivo da Área Restrita...</span>
      </div>
    `;

    try {
      const res = await fetch('/api/vault/catalogs');
      const data = await res.json();
      const rows = data.rows || [];
      if (rows.length > 0) {
        state.catalogRows = rows;
        const heroPool = rows.flatMap((r) => r.items || []).slice(0, 8);
        if (heroPool.length > 0) {
          state.heroItems = heroPool;
          state.heroIndex = 0;
          setupHeroCarousel();
        }
      }
      renderCatalogRows();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      showToast('Erro ao carregar Área Restrita');
    }
  }

  function exitSecretVaultMode() {
    state.isVaultMode = false;
    document.body.classList.remove('vault-restricted-mode');
    document.getElementById('exitVaultModeBtn')?.classList.add('hidden');
    applyCustomConfig(loadCustomConfig());

    if (state.normalCatalogBackup) {
      state.catalogRows = state.normalCatalogBackup.catalogRows || [];
      state.heroItems = state.normalCatalogBackup.heroItems || [];
      state.addons = state.normalCatalogBackup.addons || [];
      state.heroIndex = 0;
      setupHeroCarousel();
    }
    state.activeFilter = 'all';
    renderCatalogRows();
    showToast('Saiu da Área Restrita');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Client-side Stream Cache & Prefetcher for Instant Opening
  const clientStreamsCache = new Map();
  function prefetchStreams(type, targetId) {
    if (!type || !targetId) return null;
    const isVault = String(targetId).startsWith('vault:') || state.isVaultMode;
    const key = `${isVault ? 'vault' : type}:${targetId}`;
    const existing = clientStreamsCache.get(key);
    if (existing && existing.exp > Date.now()) return existing.promise;

    const url = isVault
      ? `/api/vault/streams?id=${encodeURIComponent(targetId)}`
      : `/api/streams/${type}/${encodeURIComponent(targetId)}`;

    const promise = fetch(url)
      .then((r) => r.json())
      .catch((err) => {
        clientStreamsCache.delete(key);
        throw err;
      });

    clientStreamsCache.set(key, { promise, exp: Date.now() + 5 * 60 * 1000 });
    return promise;
  }

  function normalizeSearchStr(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function computeSearchSimilarity(item, rawQuery) {
    const q = normalizeSearchStr(rawQuery);
    if (!q) return 0;
    const qTokens = q.split(' ').filter(Boolean);
    const candidates = [item.name, item.originalName, ...(item.altNames || [])]
      .filter(Boolean)
      .map(normalizeSearchStr);
    let best = 0;
    for (const title of candidates) {
      if (!title) continue;
      let s = 0;
      if (title === q) s = 1000;
      else if (title.startsWith(q + ' ') || title.startsWith(q)) s = 820 - Math.min(100, (title.length - q.length) * 2);
      else if ((' ' + title + ' ').includes(' ' + q + ' ')) s = 700 - Math.min(100, (title.length - q.length) * 2);
      else if (title.includes(q)) s = 550 - Math.min(100, (title.length - q.length) * 2);
      const tTokens = title.split(' ').filter(Boolean);
      let matched = 0;
      for (const qt of qTokens) {
        if (tTokens.some((tt) => tt === qt)) matched += 1;
        else if (tTokens.some((tt) => tt.startsWith(qt))) matched += 0.75;
        else if (title.includes(qt)) matched += 0.4;
      }
      if (qTokens.length > 0) {
        const ratio = matched / qTokens.length;
        if (ratio >= 1) s = Math.max(s, 650 - Math.abs(tTokens.length - qTokens.length) * 15);
        else if (ratio >= 0.5) s = Math.max(s, Math.round(ratio * 420));
      }
      if (s > best) best = s;
    }
    return best;
  }

  function renderFilteredSearchResults(query) {
    el.searchSection.classList.remove('hidden');
    el.heroBanner.classList.add('hidden');
    if (el.homeCategoryBar) el.homeCategoryBar.classList.add('hidden');
    stopHeroTrailer();
    el.continueWatchingRow.classList.add('hidden');
    el.catalogContainer.classList.add('hidden');

    const allResults = state.lastSearchResults || [];
    const counts = {
      all: allResults.length,
      movie: allResults.filter((i) => i.type === 'movie').length,
      series: allResults.filter((i) => i.type === 'series').length,
      tv: allResults.filter((i) => i.type === 'tv').length,
      channel: allResults.filter((i) => i.type === 'channel' || i.category === 'youtube').length
    };

    const sFilter = state.searchTypeFilter || (['movie', 'series', 'tv', 'channel'].includes(state.activeFilter) ? state.activeFilter : 'all');
    let filtered = allResults;
    let tabLabel = 'Todos os resultados';

    if (sFilter === 'movie') {
      filtered = allResults.filter((i) => i.type === 'movie');
      tabLabel = 'Filmes';
    } else if (sFilter === 'series') {
      filtered = allResults.filter((i) => i.type === 'series');
      tabLabel = 'Séries';
    } else if (sFilter === 'tv') {
      filtered = allResults.filter((i) => i.type === 'tv');
      tabLabel = 'Canais de TV';
    } else if (sFilter === 'channel') {
      filtered = allResults.filter((i) => i.type === 'channel' || i.category === 'youtube');
      tabLabel = 'YouTube';
    }

    if (state.searchGenreFilter && state.searchGenreFilter !== 'all') {
      filtered = filtered.filter((i) => {
        const glist = (i.genres || []).map((g) => String(g).toLowerCase());
        return glist.some((g) => g.includes(state.searchGenreFilter.toLowerCase()));
      });
    }

    el.searchTitle.innerHTML = `${tabLabel} para <span class="search-query-highlight">"${escapeHtml(query)}"</span> <span class="search-count-pill">${filtered.length}</span>`;

    const filterBar = document.getElementById('searchFilterBar');
    if (filterBar) {
      const typePills = [
        { id: 'all', label: 'Todos', count: counts.all },
        { id: 'movie', label: 'Filmes', count: counts.movie },
        { id: 'series', label: 'Séries', count: counts.series },
        { id: 'tv', label: 'TV', count: counts.tv },
        { id: 'channel', label: 'YouTube', count: counts.channel }
      ];
      const genresList = ['Ação', 'Comédia', 'Drama', 'Ficção', 'Terror', 'Animação'];
      const activeGenre = state.searchGenreFilter || 'all';

      filterBar.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;width:100%;flex-wrap:wrap;">
          ${typePills
            .map(
              (p) =>
                `<button type="button" class="search-filter-pill ${sFilter === p.id ? 'active' : ''}" data-sfilter="${p.id}">
                  <span>${p.label}</span>
                  <span class="sfilter-badge">${p.count}</span>
                </button>`
            )
            .join('')}
          <div style="height:20px;width:1px;background:rgba(255,255,255,0.15);margin:0 4px;"></div>
          ${genresList
            .map(
              (g) =>
                `<button type="button" class="search-filter-pill ${activeGenre === g ? 'active' : ''}" data-sgenre="${g}" style="font-size:0.75rem;padding:5px 10px;">
                  <span>${g}</span>
                </button>`
            )
            .join('')}
        </div>
      `;
      filterBar.querySelectorAll('[data-sfilter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.searchTypeFilter = btn.dataset.sfilter;
          renderFilteredSearchResults(query);
        });
      });
      filterBar.querySelectorAll('[data-sgenre]').forEach((btn) => {
        btn.addEventListener('click', () => {
          state.searchGenreFilter = state.searchGenreFilter === btn.dataset.sgenre ? 'all' : btn.dataset.sgenre;
          renderFilteredSearchResults(query);
        });
      });
    }

    el.searchGrid.innerHTML = '';

    if (!filtered.length) {
      el.searchGrid.innerHTML = `
        <div class="search-empty-card">
          <div class="search-empty-title">Nenhum título encontrado em ${tabLabel}</div>
          <p class="search-empty-sub">Não encontramos resultados para <strong>"${escapeHtml(query)}"</strong>. Verifique a ortografia ou tente buscar por outro termo ou categoria acima.</p>
        </div>
      `;
      return;
    }
    filtered.forEach((item) => {
      el.searchGrid.appendChild(createMediaCard(item));
    });
  }

  // Search handler
  async function performSearch(query) {
    state.lastSearchQuery = query;
    state.searchTypeFilter = ['movie', 'series', 'tv'].includes(state.activeFilter) ? state.activeFilter : 'all';
    el.searchSection.classList.remove('hidden');
    el.heroBanner.classList.add('hidden');
    if (el.homeCategoryBar) el.homeCategoryBar.classList.add('hidden');
    stopHeroTrailer();
    el.continueWatchingRow.classList.add('hidden');
    el.catalogContainer.classList.add('hidden');
    el.searchTitle.innerHTML = `Buscando por <span class="search-query-highlight">"${escapeHtml(query)}"</span>...`;
    el.searchGrid.innerHTML = `
      <div class="streams-loading" style="grid-column:1/-1;margin:28px 0;">
        <div class="spinner-purple"></div>
        <span>Pesquisando no catálogo JohnFlix...</span>
      </div>
    `;

    // Instant local match from loaded catalogs & My List while API resolves
    const localMap = new Map();
    state.catalogRows.forEach((r) => {
      (r.items || []).forEach((item) => {
        const sc = computeSearchSimilarity(item, query);
        if (sc >= 180 && !localMap.has(`${item.type}:${item.id}`)) {
          localMap.set(`${item.type}:${item.id}`, { ...item, _score: sc });
        }
      });
    });
    state.myList.forEach((item) => {
      const sc = computeSearchSimilarity(item, query);
      if (sc >= 180 && !localMap.has(`${item.type}:${item.id}`)) {
        localMap.set(`${item.type}:${item.id}`, { ...item, _score: sc });
      }
    });

    if (localMap.size > 0) {
      state.lastSearchResults = Array.from(localMap.values()).sort((a, b) => b._score - a._score);
      renderFilteredSearchResults(query);
    }

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (state.lastSearchQuery !== query) return;

      const merged = new Map(localMap);
      (data.results || []).forEach((item, idx) => {
        const key = `${item.type}:${item.id}`;
        const sc = Math.max(computeSearchSimilarity(item, query), 500 - idx * 8);
        if (!merged.has(key)) {
          merged.set(key, { ...item, _score: sc });
        } else {
          const prev = merged.get(key);
          merged.set(key, { ...prev, ...item, _score: Math.max(prev._score || 0, sc) });
        }
      });

      state.lastSearchResults = Array.from(merged.values()).sort((a, b) => (b._score || 0) - (a._score || 0));
      renderFilteredSearchResults(query);
    } catch (err) {
      if (!localMap.size) {
        el.searchTitle.textContent = 'Erro na busca';
      }
    }
  }

  function closeSearch() {
    el.searchSection.classList.add('hidden');
    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);
    el.heroBanner.classList.toggle('hidden', !isHomeView);
    if (el.homeCategoryBar) el.homeCategoryBar.classList.toggle('hidden', !isHomeView);
    if (isHomeView && state.heroItems[state.heroIndex]) {
      mountHeroTrailer(state.heroItems[state.heroIndex]);
    }
    el.catalogContainer.classList.remove('hidden');
    renderContinueWatching();
  }

  function mountModalTrailer(ytId) {
    if (!el.modalTrailerWrap) return;
    if (!ytId || window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches) {
      el.modalTrailerWrap.innerHTML = '';
      el.modalTrailerWrap.classList.remove('playing');
      return;
    }
    const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytId)}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&enablejsapi=1&playsinline=1&cc_load_policy=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&start=10&end=62`;
    el.modalTrailerWrap.innerHTML = `<iframe src="${embedUrl}" title="Trailer Preview" allow="autoplay; encrypted-media" tabindex="-1"></iframe>`;
    setTimeout(() => {
      if (!el.detailsModal.classList.contains('hidden')) {
        el.modalTrailerWrap.classList.add('playing');
      }
    }, 1000);
  }

  function stopModalTrailer() {
    if (!el.modalTrailerWrap) return;
    el.modalTrailerWrap.classList.remove('playing');
    el.modalTrailerWrap.innerHTML = '';
  }

  function renderModalRecommendations(item) {
    if (!el.modalRecsSection || !el.modalRecsSlider) return;
    if (item.type === 'tv') {
      el.modalRecsSection.classList.add('hidden');
      return;
    }
    const itemGenres = new Set(Array.isArray(item.genres) ? item.genres : []);
    const candidates = new Map();
    state.catalogRows.forEach((row) => {
      if (row.type === 'tv') return;
      (row.items || []).forEach((cand) => {
        if (!cand || cand.id === item.id || candidates.has(cand.id)) return;
        let score = cand.type === item.type ? 25 : 10;
        if (Array.isArray(cand.genres)) {
          cand.genres.forEach((g) => {
            if (itemGenres.has(g)) score += 30;
          });
        }
        if (cand.imdbRating) score += parseFloat(cand.imdbRating) || 0;
        candidates.set(cand.id, { item: cand, score });
      });
    });

    const sortedRecs = Array.from(candidates.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
      .map((x) => x.item);

    if (!sortedRecs.length) {
      el.modalRecsSection.classList.add('hidden');
      return;
    }

    el.modalRecsSection.classList.remove('hidden');
    el.modalRecsSlider.innerHTML = '';
    sortedRecs.forEach((rec) => {
      el.modalRecsSlider.appendChild(createMediaCard(rec));
    });
  }

  // Details Modal & Stream Aggregation (Parallel Meta + Stream Loading)
  async function openItemDetails(item, autoPlayFirst = false, customStreamId = null, customSeason = null, customEp = null) {
    if (autoPlayFirst && el.cloudVideo) {
      try { el.cloudVideo.load(); } catch (e) {}
    }
    stopHeroTrailer();
    stopModalTrailer();

    state.currentItem = item;
    state.currentMeta = null;
    state.currentStreams = [];
    state.activeAddonFilter = 'all';

    el.detailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const bg = item.background || (item.type === 'tv' ? item.poster : `https://images.metahub.space/background/large/${item.id}/img`);
    el.modalHero.style.backgroundImage = `url('${bg || ''}'), url('${item.poster || ''}')`;
    el.modalTitle.textContent = item.name;
    el.modalDesc.textContent = item.description || (item.type === 'tv' ? 'Transmissão de canal de TV ao vivo pelos addons de TV conectados.' : '');
    const typePill = item.type === 'tv'
      ? '<span class="meta-pill" style="background:rgba(239,68,68,0.22);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);">TV AO VIVO</span>'
      : item.type === 'series'
        ? '<span class="meta-pill">Série</span>'
        : '<span class="meta-pill">Filme</span>';
    const genrePills = Array.isArray(item.genres)
      ? item.genres.slice(0, 3).map((g) => `<span class="meta-genre">${escapeHtml(g)}</span>`).join('')
      : '';
    el.modalMeta.innerHTML = [
      typePill,
      item.imdbRating ? `<span class="meta-rating">★ ${item.imdbRating}</span>` : '',
      item.year ? `<span>${item.year}</span>` : '',
      item.runtime ? `<span>• ${escapeHtml(item.runtime)}</span>` : '',
      genrePills
    ].filter(Boolean).join('');

    if (el.modalCast) {
      if (Array.isArray(item.cast) && item.cast.length > 0) {
        el.modalCast.textContent = `Elenco: ${item.cast.slice(0, 5).join(', ')}`;
        el.modalCast.classList.remove('hidden');
      } else {
        el.modalCast.textContent = '';
        el.modalCast.classList.add('hidden');
      }
    }

    if (item.ytId && !autoPlayFirst) {
      mountModalTrailer(item.ytId);
    }

    renderModalRecommendations(item);
    updateModalMyListButton();

    el.seriesSelector.classList.add('hidden');
    el.streamsList.innerHTML = '';
    el.streamAddonTabs.innerHTML = '';
    el.streamCounter.textContent = '...';
    el.streamsLoading.classList.remove('hidden');

    // Start prefetching streams immediately in parallel with metadata!
    const initialTargetId = customStreamId || (item.type === 'series' ? `${item.id}:${customSeason || 1}:${customEp || 1}` : item.id);
    prefetchStreams(item.type, initialTargetId);

    // If user clicked "Assistir" directly, open the Player overlay immediately so they enter the movie in <50ms!
    if (autoPlayFirst) {
      el.playerOverlay.classList.remove('hidden', 'hud-idle');
      el.playerServerDrawer.classList.add('hidden');
      el.playerLoader.classList.remove('hidden');
      el.playerLoaderTitle.textContent = 'Iniciando reprodução rápida...';
      el.playerLoaderSub.textContent = item.name || 'Conectando ao melhor servidor...';
      if (el.playerLoaderSwitchBtn) el.playerLoaderSwitchBtn.classList.add('hidden');
      el.playerTitle.textContent = item.name || 'Reproduzindo';
      showPlayerHud();
    }

    // Load streams immediately for movies, TV AND series (don't wait for Cinemeta metadata to start loading streams!)
    loadStreamsForTarget(item.type, initialTargetId, autoPlayFirst);

    if (item.type === 'tv') return;

    try {
      const isVaultItem = String(item.id || '').startsWith('vault:') || item.isVaultItem || state.isVaultMode;
      const metaUrl = isVaultItem
        ? `/api/vault/meta?id=${encodeURIComponent(item.id)}`
        : `/api/meta/${item.type}/${encodeURIComponent(item.id)}`;
      const metaRes = await fetch(metaUrl);
      const metaData = await metaRes.json();
      if (metaData && metaData.meta) {
        state.currentMeta = metaData.meta;
        if (!isVaultItem) {
          const realType = (metaData.meta.type === 'series' || (Array.isArray(metaData.meta.videos) && metaData.meta.videos.length > 1))
            ? 'series'
            : (metaData.meta.type === 'movie' ? 'movie' : item.type);
          if (realType !== item.type) {
            item.type = realType;
            const newPill = realType === 'series' ? '<span class="meta-pill">Série</span>' : '<span class="meta-pill">Filme</span>';
            el.modalMeta.innerHTML = el.modalMeta.innerHTML.replace(/<span class="meta-pill">.*?<\/span>/, newPill);
            if (realType === 'series') {
              loadStreamsForTarget('series', customStreamId || `${item.id}:${customSeason || 1}:${customEp || 1}`, autoPlayFirst);
            } else {
              el.seriesSelector.classList.add('hidden');
              loadStreamsForTarget('movie', item.id, autoPlayFirst);
            }
          }
        }
        if (metaData.meta.description && (!item.description || /^Elenco:/i.test(item.description))) {
          el.modalDesc.textContent = metaData.meta.description;
        }
        if (metaData.meta.background) {
          el.modalHero.style.backgroundImage = `url('${metaData.meta.background}')`;
        }
        if (el.modalCast && Array.isArray(metaData.meta.cast) && metaData.meta.cast.length > 0) {
          el.modalCast.textContent = `Elenco: ${metaData.meta.cast.slice(0, 5).join(', ')}`;
          el.modalCast.classList.remove('hidden');
        }
        const metaYtId = metaData.meta.ytId || (Array.isArray(metaData.meta.trailers) && metaData.meta.trailers[0] && metaData.meta.trailers[0].source) || null;
        if (metaYtId && !item.ytId && !autoPlayFirst && el.playerOverlay.classList.contains('hidden')) {
          mountModalTrailer(metaYtId);
        }
      }
    } catch (e) {}

    if (item.type === 'series' && state.currentMeta && Array.isArray(state.currentMeta.videos) && state.currentMeta.videos.length > 0) {
      setupSeriesEpisodes(state.currentMeta.videos, false, customStreamId, customSeason, customEp, true);
    }
  }

  function updateModalMyListButton() {
    if (!state.currentItem || !el.modalMyListBtn) return;
    const inList = isInMyList(state.currentItem.id);
    el.modalMyListBtn.textContent = inList ? 'Na Minha Lista' : '+ Minha Lista';
  }

  function setupSeriesEpisodes(videos, autoPlayFirst, customStreamId, customSeason, customEp, skipInitialStreamLoad = false) {
    el.seriesSelector.classList.remove('hidden');
    const seasonsMap = new Map();
    videos.forEach((v) => {
      const s = Number(v.season);
      if (!s || s <= 0) return;
      if (!seasonsMap.has(s)) seasonsMap.set(s, []);
      seasonsMap.get(s).push(v);
    });

    const seasons = Array.from(seasonsMap.keys()).sort((a, b) => a - b);
    if (!seasons.length) {
      el.seriesSelector.classList.add('hidden');
      if (!skipInitialStreamLoad) {
        loadStreamsForTarget('series', customStreamId || `${state.currentItem.id}:1:1`, autoPlayFirst);
      }
      return;
    }

    const initialSeason = customSeason && seasonsMap.has(Number(customSeason)) ? Number(customSeason) : seasons[0];
    el.seasonSelect.innerHTML = seasons
      .map((s) => `<option value="${s}" ${s === initialSeason ? 'selected' : ''}>Temporada ${s}</option>`)
      .join('');

    const renderSeasonEpisodes = (seasonNum, triggerAuto = false, targetEpNum = null, skipLoad = false) => {
      state.currentSeason = seasonNum;
      const eps = (seasonsMap.get(seasonNum) || []).sort((a, b) => (a.episode || a.number || 0) - (b.episode || b.number || 0));
      el.episodesGrid.innerHTML = '';

      let selectedEpObj = eps[0];
      eps.forEach((ep, idx) => {
        const epNum = ep.episode || ep.number || idx + 1;
        if (targetEpNum && Number(epNum) === Number(targetEpNum)) {
          selectedEpObj = ep;
        }
        const isCurrent = targetEpNum ? Number(epNum) === Number(targetEpNum) : idx === 0;
        const epTitle = ep.name || ep.title || `Episódio ${epNum}`;
        const rawEpId = ep.id || `${state.currentItem.id}:${seasonNum}:${epNum}`;
        const streamId = String(state.currentItem.id).startsWith('vault:') && !String(rawEpId).startsWith('vault:')
          ? `vault:${state.currentItem.vaultAddonId || 'midnight'}:series:${rawEpId}`
          : rawEpId;

        const card = document.createElement('div');
        card.className = `ep-card ${isCurrent ? 'active' : ''}`;
        card.innerHTML = `
          <div class="ep-top-row">
            <span class="ep-num" data-n="${epNum}">EP ${epNum}</span>
            <button class="ep-pl-btn" title="Salvar este episódio em uma Playlist">+ Playlist</button>
          </div>
          <span class="ep-name">${escapeHtml(epTitle)}</span>
        `;

        card.querySelector('.ep-pl-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          openPlaylistModal({
            ...state.currentItem,
            uid: `${state.currentItem.id}:S${seasonNum}E${epNum}`,
            targetStreamId: streamId,
            season: seasonNum,
            episode: epNum,
            epLabel: `T${seasonNum}:E${epNum} • ${epTitle}`
          });
        });

        card.addEventListener('click', () => {
          el.episodesGrid.querySelectorAll('.ep-card').forEach((c) => c.classList.remove('active'));
          card.classList.add('active');
          state.currentEpisode = epNum;
          loadStreamsForTarget('series', streamId, true);
        });
        el.episodesGrid.appendChild(card);
      });

      if (selectedEpObj) {
        state.currentEpisode = selectedEpObj.episode || selectedEpObj.number || 1;
        const rawEpId = selectedEpObj.id || `${state.currentItem.id}:${seasonNum}:${state.currentEpisode}`;
        const resolvedEpId = String(state.currentItem.id).startsWith('vault:') && !String(rawEpId).startsWith('vault:')
          ? `vault:${state.currentItem.vaultAddonId || 'midnight'}:series:${rawEpId}`
          : rawEpId;
        const streamId = customStreamId || resolvedEpId;
        if (!skipLoad || streamId !== currentLoadTargetId) {
          loadStreamsForTarget('series', streamId, triggerAuto);
        }
      }
    };

    el.seasonSelect.onchange = (e) => renderSeasonEpisodes(Number(e.target.value), false, null, false);
    renderSeasonEpisodes(initialSeason, autoPlayFirst, customEp, skipInitialStreamLoad);
  }

  let currentLoadTargetId = null;
  async function loadStreamsForTarget(type, targetId, autoPlayFirst = false) {
    currentLoadTargetId = targetId;
    el.streamsLoading.classList.remove('hidden');
    el.streamsList.innerHTML = '';
    el.streamCounter.textContent = '...';

    try {
      const data = await prefetchStreams(type, targetId);
      if (currentLoadTargetId !== targetId) return;
      el.streamsLoading.classList.add('hidden');

      state.currentStreams = data.streams || [];
      el.streamCounter.textContent = state.currentStreams.length;

      if (state.activeAddonFilter !== 'all') {
        const hasMatching = state.currentStreams.some((s) => s.addonId === state.activeAddonFilter);
        if (!hasMatching) state.activeAddonFilter = 'all';
      }

      renderAddonFilterTabs(data.servers || []);
      renderStreamsList();

      if (autoPlayFirst || state.pendingAutoPlay) {
        state.pendingAutoPlay = false;
        if (state.currentStreams.length > 0) {
          launchCloudPlayer(state.currentStreams[0]);
        } else {
          tryNextWorkingStream(null);
        }
      }
    } catch (err) {
      if (currentLoadTargetId !== targetId) return;
      el.streamsLoading.classList.add('hidden');
      const baseImdb = String(targetId).split(':')[0];
      if (baseImdb.startsWith('tt')) {
        const isSeries = type === 'series';
        const parts = String(targetId).split(':');
        const s = parts[1] || '1';
        const e = parts[2] || '1';
        const emergencyStreams = [
          {
            addonId: 'universal_cloud',
            addonName: 'Cloud Universal',
            addonBadge: 'CLOUD VIP',
            addonColor: '#a855f7',
            serverLabel: 'Videasy • Universal Cloud #1',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://player.videasy.to/tv/${baseImdb}/${s}/${e}` : `https://player.videasy.to/movie/${baseImdb}`
          },
          {
            addonId: 'universal_cloud',
            addonName: 'Cloud Universal',
            addonBadge: 'CLOUD VIP',
            addonColor: '#a855f7',
            serverLabel: 'AutoEmbed • Fast Cloud #2',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://player.autoembed.cc/embed/tv/${baseImdb}/${s}/${e}` : `https://player.autoembed.cc/embed/movie/${baseImdb}`
          },
          {
            addonId: 'universal_cloud',
            addonName: 'Cloud Universal',
            addonBadge: 'CLOUD VIP',
            addonColor: '#a855f7',
            serverLabel: 'VidSrc BR • Multiserver #3',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Dublado',
            playType: 'embed',
            proxyUrl: isSeries ? `https://vidsrc.sh/embed/tv?imdb=${baseImdb}&season=${s}&episode=${e}&ds_lang=pt` : `https://vidsrc.sh/embed/movie?imdb=${baseImdb}&ds_lang=pt`
          }
        ];
        state.currentStreams = emergencyStreams;
        state.activeAddonFilter = 'all';
        el.streamCounter.textContent = emergencyStreams.length;
        renderAddonFilterTabs([{ addonId: 'universal_cloud', addonName: 'Cloud Universal', count: emergencyStreams.length }]);
        renderStreamsList();
        if (autoPlayFirst || state.pendingAutoPlay) {
          state.pendingAutoPlay = false;
          launchCloudPlayer(emergencyStreams[0]);
        }
        return;
      }
      el.streamsList.innerHTML = `<p style="color:#f87171;">Erro ao carregar fontes.</p>`;
      if (autoPlayFirst || state.pendingAutoPlay) {
        state.pendingAutoPlay = false;
        tryNextWorkingStream(null);
      }
    }
  }

  function renderAddonFilterTabs(servers) {
    el.streamAddonTabs.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = `addon-tab ${state.activeAddonFilter === 'all' ? 'active' : ''}`;
    allBtn.textContent = `Todos (${state.currentStreams.length})`;
    allBtn.onclick = () => {
      state.activeAddonFilter = 'all';
      renderAddonFilterTabs(servers);
      renderStreamsList();
    };
    el.streamAddonTabs.appendChild(allBtn);

    servers.forEach((srv) => {
      const btn = document.createElement('button');
      btn.className = `addon-tab ${state.activeAddonFilter === srv.addonId ? 'active' : ''} ${srv.count === 0 ? 'empty' : ''}`;
      const engTag = srv.isEnglishOnly && !srv.addonName.includes('') ? '' : '';
      btn.textContent = `${engTag}${srv.addonName} (${srv.count})`;
      btn.onclick = () => {
        state.activeAddonFilter = srv.addonId;
        renderAddonFilterTabs(servers);
        renderStreamsList();
      };
      el.streamAddonTabs.appendChild(btn);
    });
  }

  function renderStreamsList() {
    el.streamsList.innerHTML = '';
    const filtered = state.activeAddonFilter === 'all'
      ? state.currentStreams
      : state.currentStreams.filter((s) => s.addonId === state.activeAddonFilter);

    if (!filtered.length) {
      el.streamsList.innerHTML = `
        <div style="grid-column:1/-1;padding:24px;background:rgba(255,255,255,0.03);border-radius:12px;text-align:center;color:var(--text-muted);">
          Este servidor não retornou links para este título específico. Selecione outro servidor acima ou "Todos".
        </div>
      `;
      return;
    }

    filtered.forEach((stream) => {
      const card = document.createElement('div');
      card.className = 'stream-item';
      const seedsTag = stream.seeds ? ` · ${stream.seeds}` : '';
      const audioText = `${stream.audio || ''}${seedsTag}`;

      card.innerHTML = `
        <span class="stream-dot" style="background:${stream.addonColor}"></span>
        <div class="stream-main">
          <span class="stream-server-name">${escapeHtml(stream.serverLabel)}</span>
          <span class="stream-audio ${stream.isEnglishOnly ? 'is-en' : ''}">${escapeHtml(audioText)}</span>
        </div>
        <span class="stream-quality">${escapeHtml(stream.quality)}</span>
        <span class="stream-play-ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg></span>
      `;

      card.addEventListener('click', () => launchCloudPlayer(stream));
      el.streamsList.appendChild(card);
    });
  }

  async function openServersModal() {
    if (!el.serversModal) return;
    el.serversModal.classList.remove('hidden');
    el.serversModalList.innerHTML = `
      <div class="streams-loading">
        <div class="spinner-purple"></div>
        <span>Verificando servidores em tempo real...</span>
      </div>
    `;

    try {
      const res = await fetch('/api/addons?ping=1');
      const data = await res.json();
      const addons = data.addons || state.addons || [];
      el.serversModalList.innerHTML = '';

      addons.forEach((a) => {
        const row = document.createElement('div');
        row.className = 'server-modal-row';
        const isOnline = a.online !== false;
        const pingText = a.pingMs ? ` • ${a.pingMs}ms` : '';
        row.innerHTML = `
          <div class="server-modal-left">
            <span class="server-dot" style="background:${a.color || '#a855f7'}"></span>
            <div class="server-modal-info">
              <h4>${escapeHtml(a.name)} <span class="meta-pill">${escapeHtml(a.badge || 'CLOUD')}</span></h4>
              <p>${escapeHtml(a.manifestUrl)}</p>
            </div>
          </div>
          <span class="server-status-tag" style="${isOnline ? '' : 'color:#f87171;border-color:rgba(248,113,113,0.3);background:rgba(248,113,113,0.12)'}">
            ${isOnline ? `Ativo${pingText}` : 'Offline'}
          </span>
        `;
        el.serversModalList.appendChild(row);
      });
    } catch (e) {
      el.serversModalList.innerHTML = `<p style="color:var(--text-muted)">Erro ao listar servidores.</p>`;
    }
  }

  function closeDetailsModal() {
    stopModalTrailer();
    el.detailsModal.classList.add('hidden');
    if (el.playerOverlay.classList.contains('hidden')) {
      document.body.style.overflow = '';
      if (!el.heroBanner.classList.contains('hidden') && state.heroItems[state.heroIndex]) {
        mountHeroTrailer(state.heroItems[state.heroIndex]);
      }
    }
  }

  // Universal Cloud Video Player (HTML5 MP4 + HLS.js + Safari Native HLS + Cloud Embed + Smart Auto-Failover)
  let hlsInstance = null;
  let playerHudTimer = null;
  let playerStallTimer = null;
  const failedStreamKeys = new Set();

    function getStreamKey(s) {
      return s ? (s.directUrl || s.proxyUrl || s.embedUrl || s.serverLabel || '') : '';
    }

  function tryNextWorkingStream(failedStream) {
    const key = getStreamKey(failedStream);
    if (key) failedStreamKeys.add(key);

    const candidates = state.currentStreams || [];
    // Prefer same audio language first, then any working stream
    const nextSameLang = candidates.find((s) => !failedStreamKeys.has(getStreamKey(s)) && Boolean(s.isDub) === Boolean(failedStream?.isDub));
    const nextAny = candidates.find((s) => !failedStreamKeys.has(getStreamKey(s)));
    const next = nextSameLang || nextAny;

    if (next) {
      el.playerLoaderTitle.textContent = 'Otimizando rota de reprodução...';
      el.playerLoaderSub.textContent = `Conectando a ${next.serverLabel}`;
      launchCloudPlayer(next, true);
      return true;
    }

    // Ultimate fallback: if every stream in the list failed on this browser/device, launch Universal Cloud Multi-Server Embed
    if (state.currentItem && state.currentItem.id && String(state.currentItem.id).startsWith('tt') && el.cloudEmbed) {
      const baseImdb = String(state.currentItem.id).split(':')[0];
      const fallbackEmbedUrl = state.currentItem.type === 'series'
        ? `https://player.videasy.to/tv/${baseImdb}/${state.currentSeason || 1}/${state.currentEpisode || 1}`
        : `https://player.videasy.to/movie/${baseImdb}`;
      if (!failedStreamKeys.has(fallbackEmbedUrl)) {
        failedStreamKeys.add(fallbackEmbedUrl);
        launchCloudPlayer({
          serverLabel: 'Cloud Universal 4K/FHD',
          quality: '1080p / 4K UHD',
          audio: 'Multi-Áudio / Legendado',
          playType: 'embed',
          proxyUrl: fallbackEmbedUrl
        }, true);
        return true;
      }
    }

    el.playerLoaderTitle.textContent = 'Esta fonte demorou ou falhou ao responder';
    el.playerLoaderSub.textContent = 'Toque abaixo para escolher outro servidor.';
    if (el.playerLoaderSwitchBtn) el.playerLoaderSwitchBtn.classList.remove('hidden');
    return false;
  }

  function showPlayerHud() {
    if (!el.playerOverlay || el.playerOverlay.classList.contains('hidden')) return;
    el.playerOverlay.classList.remove('hud-idle');
    clearTimeout(playerHudTimer);
    playerHudTimer = setTimeout(() => {
      if (!el.playerServerDrawer.classList.contains('hidden')) return;
      el.playerOverlay.classList.add('hud-idle');
    }, 3200);
  }

  async function togglePlayerFullscreen() {
    try {
      const doc = document;
      const inFs = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (inFs) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        try { screen.orientation?.unlock?.(); } catch (e) {}
      } else {
        const target = el.playerOverlay;
        if (target?.requestFullscreen) await target.requestFullscreen();
        else if (target?.webkitRequestFullscreen) target.webkitRequestFullscreen();
        else if (el.cloudVideo?.webkitEnterFullscreen) el.cloudVideo.webkitEnterFullscreen();
        try { await screen.orientation?.lock?.('landscape'); } catch (e) {}
      }
    } catch (e) {}
  }

  let blackScreenWatchdogTimer = null;
  function clearVideoHandlers() {
    clearTimeout(playerStallTimer);
    clearTimeout(blackScreenWatchdogTimer);
    if (!el.cloudVideo) return;
    el.cloudVideo.onloadedmetadata = null;
    el.cloudVideo.onloadeddata = null;
    el.cloudVideo.oncanplay = null;
    el.cloudVideo.onplaying = null;
    el.cloudVideo.onerror = null;
    el.cloudVideo.onwaiting = null;
    el.cloudVideo.onstalled = null;
  }

  function destroyHls() {
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }
  }

  function launchCloudPlayer(stream, isAutoFailover = false) {
    if (!isAutoFailover) {
      failedStreamKeys.clear();
    }
    stopHeroTrailer();
    stopModalTrailer();
    el.playerOverlay.classList.remove('hidden', 'hud-idle');
    el.playerServerDrawer.classList.add('hidden');
    document.body.style.overflow = 'hidden';
    showPlayerHud();

    clearVideoHandlers();
    destroyHls();
    state.nextEpisodeDismissed = false;
    hideNextEpisodePrompt();

    const epSuffix = state.currentItem?.type === 'series'
      ? ` — T${state.currentSeason}:E${state.currentEpisode}`
      : '';
    el.playerTitle.textContent = `${state.currentItem ? state.currentItem.name : 'Reproduzindo'}${epSuffix}`;

    el.playerLoader.classList.remove('hidden');
    el.playerLoaderTitle.textContent = isAutoFailover ? 'Alternando para servidor compatível...' : 'Iniciando reprodução rápida...';
    el.playerLoaderSub.textContent = `${stream.serverLabel} • ${stream.quality}`;
    if (el.playerLoaderSwitchBtn) el.playerLoaderSwitchBtn.classList.add('hidden');

    if (stream.playType === 'torrent') {
      startTorrentTelemetry(stream.infoHash);
    } else {
      stopTorrentTelemetry();
    }

    renderPlayerDrawer(stream);

    // Engine 3: Cloud Embed Iframe
    if (stream.playType === 'embed' && el.cloudEmbed) {
      el.cloudVideo.pause();
      el.cloudVideo.removeAttribute('src');
      el.cloudVideo.classList.add('hidden');
      el.cloudEmbed.classList.remove('hidden');
      el.cloudEmbed.onload = () => {
        el.playerLoader.classList.add('hidden');
      };
      el.cloudEmbed.src = stream.proxyUrl;
      setTimeout(() => el.playerLoader.classList.add('hidden'), 1200);

      // Embed black screen watchdog: show switch button if iframe hangs
      blackScreenWatchdogTimer = setTimeout(() => {
        if (!el.playerOverlay.classList.contains('hidden') && el.cloudVideo.classList.contains('hidden')) {
          if (el.playerLoaderSwitchBtn) el.playerLoaderSwitchBtn.classList.remove('hidden');
        }
      }, 6500);
      return;
    }

    if (el.cloudEmbed) {
      el.cloudEmbed.onload = null;
      el.cloudEmbed.src = 'about:blank';
      el.cloudEmbed.classList.add('hidden');
    }
    el.cloudVideo.classList.remove('hidden');

    let playbackStarted = false;
    const hideLoader = () => {
      playbackStarted = true;
      clearTimeout(playerStallTimer);
      el.playerLoader.classList.add('hidden');
    };

    const resumeAt = state.pendingResume > 5 ? state.pendingResume : 0;
    let resumeApplied = false;
    const applyResume = () => {
      if (resumeApplied || !resumeAt) return;
      const dur = el.cloudVideo.duration;
      if (Number.isFinite(dur) && dur > 0 && resumeAt < dur - 10) {
        try { el.cloudVideo.currentTime = resumeAt; } catch (e) {}
      }
      resumeApplied = true;
      state.pendingResume = 0;
    };

    // Detect HEVC / MKV audio-only decode failure on Chrome/Firefox/Mobile (videoWidth === 0 when audio plays)
    const verifyVideoTrack = () => {
      hideLoader();
      applyResume();
      setTimeout(() => {
        if (!el.playerOverlay.classList.contains('hidden') && !el.cloudVideo.paused && el.cloudVideo.currentTime > 0.4) {
          if (el.cloudVideo.videoWidth === 0 && el.cloudVideo.videoHeight === 0 && state.currentItem?.type !== 'tv') {
            if (stream.embedUrl && el.cloudEmbed) {
              el.cloudVideo.pause();
              el.cloudVideo.classList.add('hidden');
              el.cloudEmbed.classList.remove('hidden');
              el.cloudEmbed.src = stream.embedUrl;
              return;
            }
            tryNextWorkingStream(stream);
          }
        }
      }, 900);
    };

    el.cloudVideo.onloadedmetadata = () => { applyResume(); hideLoader(); };
    el.cloudVideo.onloadeddata = () => { applyResume(); hideLoader(); };
    let bufferStallTimer = null;
    el.cloudVideo.onwaiting = () => {
      clearTimeout(bufferStallTimer);
      bufferStallTimer = setTimeout(() => {
        if (!el.playerOverlay.classList.contains('hidden') && el.cloudVideo.currentTime < 1) {
          if (stream.embedUrl && el.cloudEmbed) {
            destroyHls();
            el.cloudVideo.pause();
            el.cloudVideo.classList.add('hidden');
            el.cloudEmbed.classList.remove('hidden');
            el.cloudEmbed.src = stream.embedUrl;
            el.playerLoader.classList.add('hidden');
            return;
          }
          tryNextWorkingStream(stream);
        }
      }, 4500);
    };
    el.cloudVideo.onplaying = () => {
      clearTimeout(bufferStallTimer);
      verifyVideoTrack();
    };

    // Anti-Black-Screen Watchdog: verifies video frames actually decode and advance
    const stallLimit = state.currentItem?.type === 'tv' ? 12000 : 15000;
    blackScreenWatchdogTimer = setTimeout(() => {
      if (el.playerOverlay.classList.contains('hidden')) return;
      if (!el.cloudVideo.classList.contains('hidden')) {
        const hasFrames = el.cloudVideo.currentTime > 0.2 && el.cloudVideo.videoWidth > 0;
        if (!hasFrames) {
          if (stream.embedUrl && el.cloudEmbed) {
            destroyHls();
            el.cloudVideo.pause();
            el.cloudVideo.removeAttribute('src');
            el.cloudVideo.classList.add('hidden');
            el.cloudEmbed.classList.remove('hidden');
            el.cloudEmbed.src = stream.embedUrl;
            el.playerLoader.classList.add('hidden');
            showToast('Alternando para player compatível');
            return;
          }
          tryNextWorkingStream(stream);
        }
      }
    }, stallLimit);

    playerStallTimer = setTimeout(() => {
      if (!playbackStarted && !el.playerOverlay.classList.contains('hidden')) {
        tryNextWorkingStream(stream);
      }
    }, stallLimit + 1500);

    // Subtitles auto-fetch via LegendasBR
    Array.from(el.cloudVideo.querySelectorAll('track')).forEach((t) => t.remove());
    if (state.currentItem && state.currentItem.id && String(state.currentItem.id).startsWith('tt') && stream.playType !== 'embed') {
      const baseImdb = String(state.currentItem.id).split(':')[0];
      const subTarget = state.currentItem.type === 'series'
        ? `${baseImdb}:${state.currentSeason || 1}:${state.currentEpisode || 1}`
        : baseImdb;
      fetch(`/api/subtitles/${state.currentItem.type || 'movie'}/${encodeURIComponent(subTarget)}`)
        .then((r) => r.json())
        .then((d) => {
          const subs = Array.isArray(d?.subtitles) ? d.subtitles : [];
          subs.forEach((sub, sIdx) => {
            if (!sub.url) return;
            const track = document.createElement('track');
            track.kind = 'subtitles';
            track.label = sub.lang === 'pob' ? 'Português (BR)' : sub.lang === 'por' ? 'Português' : `Legenda ${sIdx + 1}`;
            track.srclang = sub.lang || 'pt';
            track.src = sub.url;
            if (sIdx === 0) track.default = true;
            el.cloudVideo.appendChild(track);
          });
        })
        .catch(() => {});
    }

    const startVideoPlayback = () => {
      el.cloudVideo.muted = false;
      const playPromise = el.cloudVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err && err.name === 'NotAllowedError') {
            // Mobile / Safari strict autoplay policy fallback: start muted so video begins immediately, user can tap unmute
            el.cloudVideo.muted = true;
            el.cloudVideo.play().then(() => {
              hideLoader();
              setTimeout(() => { try { el.cloudVideo.muted = false; } catch (e) {} }, 300);
            }).catch(() => {
              hideLoader();
            });
          }
        });
      }
    };

    // Engine 2: Universal HLS (.m3u8) via Safari Native HLS or hls.js
    const isHls = stream.playType === 'hls' || (stream.proxyUrl && stream.proxyUrl.includes('.m3u8')) || (stream.directUrl && stream.directUrl.includes('.m3u8'));
    if (isHls) {
      const hlsUrl = stream.directUrl || stream.proxyUrl;

      const isAppleNative = !!(navigator.userAgent && /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) && el.cloudVideo.canPlayType('application/vnd.apple.mpegurl') && !window.Hls?.isSupported());
      if (isAppleNative) {
        el.cloudVideo.src = hlsUrl;
        el.cloudVideo.load();
        startVideoPlayback();
        el.cloudVideo.onerror = () => tryNextWorkingStream(stream);
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        class CustomTvLoader extends window.Hls.DefaultConfig.loader {
          load(context, config, callbacks) {
            const originalOnSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, ctx, networkDetails) => {
              if (response && response.data instanceof ArrayBuffer) {
                const u8 = new Uint8Array(response.data);
                if (u8.length > 68 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4e && u8[3] === 0x47) {
                  const iend = [0x49, 0x45, 0x4e, 0x44];
                  for (let i = 0; i < Math.min(u8.length - 8, 200); i++) {
                    if (u8[i] === iend[0] && u8[i + 1] === iend[1] && u8[i + 2] === iend[2] && u8[i + 3] === iend[3]) {
                      const tsOffset = i + 8;
                      response.data = response.data.slice(tsOffset);
                      break;
                    }
                  }
                }
              }
              originalOnSuccess(response, stats, ctx, networkDetails);
            };
            super.load(context, config, callbacks);
          }
        }

        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 60,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          loader: CustomTvLoader
        });
        hlsInstance.loadSource(hlsUrl);
        hlsInstance.attachMedia(el.cloudVideo);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
          hideLoader();
          startVideoPlayback();
        });
        hlsInstance.on(window.Hls.Events.ERROR, (_, data) => {
          if (data && data.fatal) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              tryNextWorkingStream(stream);
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              if (el.cloudVideo.canPlayType('application/vnd.apple.mpegurl')) {
                destroyHls();
                el.cloudVideo.src = hlsUrl;
                el.cloudVideo.load();
                startVideoPlayback();
                return;
              }
              tryNextWorkingStream(stream);
            }
          }
        });
        return;
      } else if (el.cloudVideo.canPlayType('application/vnd.apple.mpegurl')) {
        el.cloudVideo.src = hlsUrl;
        el.cloudVideo.load();
        startVideoPlayback();
        el.cloudVideo.onerror = () => tryNextWorkingStream(stream);
        return;
      }
    }

    // Engine 1: Direct Cloud MP4 Stream (with direct URL fallback + automatic failover to next working server)
    el.cloudVideo.pause();
    el.cloudVideo.src = stream.proxyUrl;
    el.cloudVideo.load();
    startVideoPlayback();

    let retryDirectTried = false;
    el.cloudVideo.onerror = () => {
      if (!retryDirectTried && stream.directUrl && stream.directUrl !== stream.proxyUrl && !stream.directUrl.startsWith('http://')) {
        retryDirectTried = true;
        el.cloudVideo.src = stream.directUrl;
        el.cloudVideo.load();
        startVideoPlayback();
        return;
      }
      if (stream.embedUrl && el.cloudEmbed) {
        el.cloudVideo.pause();
        el.cloudVideo.classList.add('hidden');
        el.cloudEmbed.classList.remove('hidden');
        el.cloudEmbed.src = stream.embedUrl;
        el.playerLoader.classList.add('hidden');
        return;
      }
      tryNextWorkingStream(stream);
    };
  }

  function renderPlayerDrawer() {
    el.playerDrawerList.innerHTML = '';
    state.currentStreams.forEach((s) => {
      const item = document.createElement('div');
      item.className = 'drawer-stream-row';
      item.innerHTML = `
        <span class="stream-dot" style="background:${s.addonColor || 'var(--purple-bright)'}"></span>
        <div class="drawer-stream-info">
          <strong>${escapeHtml(s.serverLabel)}</strong>
          <span>${escapeHtml(s.audio || 'Dublado / Legendado')} • ${escapeHtml(s.quality || 'HD')}</span>
        </div>
        <span class="drawer-stream-status">Assistir</span>
      `;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(`Conectando: ${s.serverLabel}`);
        el.playerServerDrawer.classList.add('hidden');
        launchCloudPlayer(s, false);
      });
      el.playerDrawerList.appendChild(item);
    });
  }

  function startTorrentTelemetry(infoHash) {
    stopTorrentTelemetry();
    if (!infoHash) return;
    el.torrentTelemetry.classList.remove('hidden');
    state.telemetryTimer = setInterval(async () => {
      try {
        const res = await fetch(`/api/torrent/${infoHash}/stats`);
        const st = await res.json();
        if (st.active) {
          const kb = Math.round((st.downloadSpeed || 0) / 1024);
          el.telemetryPeers.textContent = `${st.peers || 0} peers`;
          el.telemetrySpeed.textContent = kb > 1024 ? `${(kb / 1024).toFixed(1)} MB/s` : `${kb} KB/s`;
        }
      } catch (e) {}
    }, 2000);
  }

  function stopTorrentTelemetry() {
    clearInterval(state.telemetryTimer);
    el.torrentTelemetry.classList.add('hidden');
  }

  function stopAndClosePlayer() {
    clearTimeout(playerHudTimer);
    clearVideoHandlers();
    destroyHls();
    stopTorrentTelemetry();
    hideNextEpisodePrompt();
    state.nextEpisodeDismissed = false;
    if (el.switchServerBtn) el.switchServerBtn.classList.remove('hidden');
    try {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      screen.orientation?.unlock?.();
    } catch (e) {}
    el.cloudVideo.pause();
    el.cloudVideo.removeAttribute('src');
    el.cloudVideo.load();
    if (el.cloudEmbed) {
      el.cloudEmbed.onload = null;
      el.cloudEmbed.src = 'about:blank';
      el.cloudEmbed.classList.add('hidden');
    }
    el.playerOverlay.classList.add('hidden');
    if (el.detailsModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  function getNextEpisode() {
    if (!state.currentItem || state.currentItem.type !== 'series') return null;
    const videos = state.currentMeta?.videos;
    if (!Array.isArray(videos) || videos.length === 0) return null;

    const curS = Number(state.currentSeason) || 1;
    const curE = Number(state.currentEpisode) || 1;

    // 1. Check next episode in current season
    const sameSeasonNext = videos.find((v) => Number(v.season) === curS && (Number(v.episode) || Number(v.number)) === curE + 1);
    if (sameSeasonNext) {
      return {
        season: curS,
        episode: curE + 1,
        title: sameSeasonNext.name || sameSeasonNext.title || `Episódio ${curE + 1}`,
        id: sameSeasonNext.id || `${state.currentItem.id}:${curS}:${curE + 1}`
      };
    }

    // 2. Check episode 1 of next season
    const nextSeasonFirst = videos.find((v) => Number(v.season) === curS + 1 && ((Number(v.episode) || Number(v.number)) === 1));
    if (nextSeasonFirst) {
      return {
        season: curS + 1,
        episode: 1,
        title: nextSeasonFirst.name || nextSeasonFirst.title || `Episódio 1`,
        id: nextSeasonFirst.id || `${state.currentItem.id}:${curS + 1}:1`
      };
    }

    return null;
  }

  function checkNextEpisodePrompt() {
    if (!el.cloudVideo || !el.nextEpCard || state.nextEpisodeDismissed) return;
    if (state.currentItem?.type !== 'series') {
      hideNextEpisodePrompt();
      return;
    }

    const dur = el.cloudVideo.duration;
    const cur = el.cloudVideo.currentTime;
    if (!Number.isFinite(dur) || dur < 60) return;

    // Trigger when within last 45 seconds or >= 95% of duration (credits)
    const timeLeft = dur - cur;
    const isNearEnd = timeLeft <= 50 || (cur / dur) >= 0.95;

    if (isNearEnd) {
      const nextEp = getNextEpisode();
      if (!nextEp) {
        hideNextEpisodePrompt();
        return;
      }
      state.nextEpisodeTarget = nextEp;
      if (el.nextEpTitle) {
        el.nextEpTitle.textContent = `T${nextEp.season}:E${nextEp.episode} • ${nextEp.title}`;
      }
      if (el.nextEpBtnText) {
        const sec = Math.max(0, Math.round(timeLeft));
        el.nextEpBtnText.textContent = timeLeft > 0 && timeLeft <= 50 ? `Próximo (${sec}s)` : 'Assistir Agora';
      }
      el.nextEpCard.classList.remove('hidden');
    } else {
      hideNextEpisodePrompt();
    }
  }

  function hideNextEpisodePrompt() {
    if (el.nextEpCard) {
      el.nextEpCard.classList.add('hidden');
    }
  }

  async function triggerPlayNextEpisode() {
    const nextEp = state.nextEpisodeTarget || getNextEpisode();
    if (!nextEp || !state.currentItem) return;

    hideNextEpisodePrompt();
    state.nextEpisodeDismissed = false;
    state.currentSeason = nextEp.season;
    state.currentEpisode = nextEp.episode;

    el.playerTitle.textContent = `${state.currentItem.name || state.currentItem.title} — T${nextEp.season}:E${nextEp.episode}`;
    el.playerLoader.classList.remove('hidden');
    el.playerLoaderTitle.textContent = 'Carregando próximo episódio...';
    el.playerLoaderSub.textContent = `T${nextEp.season}:E${nextEp.episode} • ${nextEp.title}`;

    try {
      const data = await prefetchStreams('series', nextEp.id);
      state.currentStreams = data.streams || [];
      if (state.currentStreams.length > 0) {
        launchCloudPlayer(state.currentStreams[0]);
      } else {
        el.playerLoaderTitle.textContent = 'Nenhuma fonte encontrada';
        el.playerLoaderSub.textContent = 'Não foi possível encontrar servidores para este episódio.';
      }
    } catch (err) {
      el.playerLoaderTitle.textContent = 'Erro ao carregar';
      el.playerLoaderSub.textContent = 'Falha ao buscar fontes do próximo episódio.';
    }
  }

  // My List Management
  function isInMyList(id) {
    return state.myList.some((i) => i.id === id);
  }

  function toggleMyList(item) {
    const idx = state.myList.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      state.myList.splice(idx, 1);
      showToast(`Removido da Minha Lista`);
    } else {
      state.myList.unshift({
        id: item.id,
        type: item.type,
        name: item.name,
        poster: item.poster,
        background: item.background,
        year: item.year,
        imdbRating: item.imdbRating,
        description: item.description,
        genres: item.genres || [],
        _rowCategory: item._rowCategory || ''
      });
      showToast(`Adicionado à Minha Lista`);
    }
    localStorage.setItem('johnflix_mylist', JSON.stringify(state.myList));
    updateBadges();
  }

  // Playlists Management (Movies & Series Episodes)
  function openPlaylistModal(targetItem) {
    state.playlistTargetItem = targetItem;
    el.playlistModal.classList.remove('hidden');
    el.newPlaylistNameInput.value = '';
    if (targetItem) {
      const label = targetItem.epLabel ? `${targetItem.name} (${targetItem.epLabel})` : targetItem.name;
      el.playlistTargetLabel.textContent = `Salvar "${label}" em:`;
    } else {
      el.playlistTargetLabel.textContent = 'Crie uma nova playlist personalizada';
    }
    renderPlaylistPickerList();
  }

  function createNewPlaylist() {
    const name = el.newPlaylistNameInput.value.trim();
    if (!name) return;
    const newPl = {
      id: 'pl_' + Date.now(),
      name,
      items: []
    };
    if (state.playlistTargetItem) {
      newPl.items.push(formatPlaylistItem(state.playlistTargetItem));
      showToast(`Salvo na playlist "${name}"`);
      el.playlistModal.classList.add('hidden');
    } else {
      showToast(`Playlist "${name}" criada`);
    }
    state.playlists.unshift(newPl);
    savePlaylists();
    el.newPlaylistNameInput.value = '';
    renderPlaylistPickerList();
    if (state.activeFilter === 'mylist' || state.activeFilter === 'playlists') renderCatalogRows();
  }

  function formatPlaylistItem(item) {
    return {
      uid: item.uid || item.id,
      id: item.id,
      type: item.type,
      name: item.name,
      poster: item.poster,
      background: item.background,
      year: item.year,
      imdbRating: item.imdbRating,
      description: item.description,
      targetStreamId: item.targetStreamId || null,
      season: item.season || null,
      episode: item.episode || null,
      epLabel: item.epLabel || null
    };
  }

  function addItemToPlaylist(playlistId, item) {
    const pl = state.playlists.find((p) => p.id === playlistId);
    if (!pl || !item) return;
    const formatted = formatPlaylistItem(item);
    const exists = pl.items.some((i) => (i.uid || i.id) === formatted.uid);
    if (!exists) {
      pl.items.unshift(formatted);
      savePlaylists();
      showToast(`Adicionado em "${pl.name}"`);
    } else {
      showToast(`Já está em "${pl.name}"`);
    }
    el.playlistModal.classList.add('hidden');
    if (state.activeFilter === 'mylist' || state.activeFilter === 'playlists') renderCatalogRows();
  }

  function removeItemFromPlaylist(playlistId, uid) {
    const pl = state.playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    pl.items = pl.items.filter((i) => (i.uid || i.id) !== uid);
    savePlaylists();
    showToast('Item removido da playlist');
    if (state.activeFilter === 'mylist' || state.activeFilter === 'playlists') renderCatalogRows();
  }

  function deletePlaylist(playlistId) {
    state.playlists = state.playlists.filter((p) => p.id !== playlistId);
    savePlaylists();
    showToast('Playlist excluída');
    if (state.activeFilter === 'mylist' || state.activeFilter === 'playlists') renderCatalogRows();
  }

  function renderPlaylistPickerList() {
    el.playlistPickerList.innerHTML = '';
    if (!state.playlists.length) {
      el.playlistPickerList.innerHTML = `<p style="color:var(--text-muted);font-size:0.84rem;">Nenhuma playlist criada ainda. Digite um nome acima e clique em Criar.</p>`;
      return;
    }
    state.playlists.forEach((pl) => {
      const row = document.createElement('div');
      row.className = 'playlist-pick-item';
      row.innerHTML = `
        <strong>${escapeHtml(pl.name)}</strong>
        <span style="font-size:0.78rem;color:var(--text-muted);">${pl.items.length} itens</span>
      `;
      row.addEventListener('click', () => {
        if (state.playlistTargetItem) {
          addItemToPlaylist(pl.id, state.playlistTargetItem);
        }
      });
      el.playlistPickerList.appendChild(row);
    });
  }

  function savePlaylists() {
    localStorage.setItem('johnflix_playlists', JSON.stringify(state.playlists));
    updateBadges();
  }

  function updateBadges() {
    if (el.myListCount) {
      el.myListCount.textContent = state.myList.length;
      el.myListCount.classList.toggle('hidden', state.myList.length === 0);
    }
    if (el.playlistsCount) {
      el.playlistsCount.textContent = state.playlists.length;
      el.playlistsCount.classList.toggle('hidden', state.playlists.length === 0);
    }
  }

  // Continue Watching Management (with Remove button)
  function saveContinueWatching(item, currentTime, duration) {
    if (!item || !item.id) return;
    const filtered = state.continueWatching.filter((i) => i.id !== item.id);
    const epLabel = item.type === 'series' ? `T${state.currentSeason}:E${state.currentEpisode}` : null;
    filtered.unshift({
      ...item,
      epLabel,
      season: state.currentSeason,
      episode: state.currentEpisode,
      targetStreamId: item.type === 'series' ? `${item.id}:${state.currentSeason}:${state.currentEpisode}` : item.id,
      savedTime: Math.floor(currentTime),
      duration: Math.floor(duration || 0),
      updatedAt: Date.now()
    });
    state.continueWatching = filtered.slice(0, 14);
    localStorage.setItem('johnflix_cw', JSON.stringify(state.continueWatching));
    renderContinueWatching();
  }

  function removeFromContinueWatching(id) {
    state.continueWatching = state.continueWatching.filter((i) => i.id !== id);
    localStorage.setItem('johnflix_cw', JSON.stringify(state.continueWatching));
    renderContinueWatching();
    showToast('Removido de Continuar Assistindo');
  }

  function renderContinueWatching() {
    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);
    if (!state.continueWatching.length || !isHomeView) {
      el.continueWatchingRow.classList.add('hidden');
      return;
    }
    el.continueWatchingRow.classList.remove('hidden');
    el.continueWatchingSlider.innerHTML = '';
    state.continueWatching.forEach((item) => {
      el.continueWatchingSlider.appendChild(createMediaCard(item, { isContinueWatching: true }));
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  init();
})();
