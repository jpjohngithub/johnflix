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
    continueWatching: JSON.parse(localStorage.getItem('johnflix_cw') || '[]')
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
    heroFeaturedTag: document.getElementById('heroFeaturedTag'),
    heroTrailerPill: document.getElementById('heroTrailerPill'),
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
    closePlayerBtn: document.getElementById('closePlayerBtn'),
    playerTitle: document.getElementById('playerTitle'),
    playerServerBadge: document.getElementById('playerServerBadge'),
    torrentTelemetry: document.getElementById('torrentTelemetry'),
    telemetryPeers: document.getElementById('telemetryPeers'),
    telemetrySpeed: document.getElementById('telemetrySpeed'),
    switchServerBtn: document.getElementById('switchServerBtn'),
    cloudVideo: document.getElementById('cloudVideo'),
    cloudEmbed: document.getElementById('cloudEmbed'),
    playerLoader: document.getElementById('playerLoader'),
    playerLoaderTitle: document.getElementById('playerLoaderTitle'),
    playerLoaderSub: document.getElementById('playerLoaderSub'),
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

  async function init() {
    updateBadges();
    renderContinueWatching();
    bindEvents();
    await loadHomeCatalog();
  }

  function bindEvents() {
    window.addEventListener('scroll', () => {
      el.navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    document.querySelectorAll('.nav-link').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetFilter = btn.dataset.filter;
        document.querySelectorAll('.nav-link').forEach((b) => {
          b.classList.toggle('active', b.dataset.filter === targetFilter);
        });
        state.activeFilter = targetFilter;
        const activeQuery = el.searchInput ? el.searchInput.value.trim() : '';
        if (activeQuery && !el.searchSection.classList.contains('hidden') && targetFilter !== 'playlists') {
          renderFilteredSearchResults(activeQuery);
        } else if (activeQuery && targetFilter !== 'playlists') {
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
        } else {
          document.querySelector('.streams-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    el.switchServerBtn.addEventListener('click', () => {
      el.playerServerDrawer.classList.toggle('hidden');
    });
    el.closeDrawerBtn.addEventListener('click', () => {
      el.playerServerDrawer.classList.add('hidden');
    });

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
      }
    });
  }

  async function loadHomeCatalog() {
    try {
      const res = await fetch('/api/catalogs');
      const data = await res.json();
      state.catalogRows = data.rows || data.catalogs || [];
      state.addons = data.addons || [];

      const withTrailers = [];
      const fallbackPool = [];
      state.catalogRows.forEach((r) => {
        if (r.type === 'tv' || r.isTop10) return;
        r.items.slice(0, 6).forEach((item) => {
          if (withTrailers.some((p) => p.id === item.id) || fallbackPool.some((p) => p.id === item.id)) return;
          if (item.ytId) withTrailers.push(item);
          else fallbackPool.push(item);
        });
      });
      state.heroItems = [...withTrailers, ...fallbackPool].slice(0, 12);
      setupHeroCarousel();
      renderCatalogRows();
    } catch (err) {
      el.heroTitle.textContent = 'Indisponível no momento';
    }
  }

  function stopHeroTrailer() {
    clearTimeout(state.heroTrailerTimer);
    clearTimeout(state.heroLoopTimer);
    if (el.heroTrailerWrap) {
      el.heroTrailerWrap.classList.remove('playing');
      el.heroTrailerWrap.innerHTML = '';
    }
    if (el.heroTrailerPill) {
      el.heroTrailerPill.classList.add('hidden');
    }
  }

  function mountHeroTrailer(item) {
    stopHeroTrailer();
    if (!item || !el.heroTrailerWrap) return;
    if (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches) return;

    const injectIframe = (ytId) => {
      if (!ytId || state.heroItems[state.heroIndex]?.id !== item.id) return;
      if (!el.detailsModal.classList.contains('hidden') || !el.playerOverlay.classList.contains('hidden')) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytId)}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&enablejsapi=1&playsinline=1&cc_load_policy=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&start=10&end=62`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.onload = () => {
        if (state.heroItems[state.heroIndex]?.id === item.id) {
          setTimeout(() => {
            if (state.heroItems[state.heroIndex]?.id === item.id) {
              el.heroTrailerWrap.classList.add('playing');
              if (el.heroTrailerPill) el.heroTrailerPill.classList.remove('hidden');
            }
          }, 550);
        }
      };
      el.heroTrailerWrap.innerHTML = '';
      el.heroTrailerWrap.appendChild(iframe);
      state.heroLoopTimer = setTimeout(() => {
        if (state.heroItems[state.heroIndex]?.id === item.id && !el.heroBanner.classList.contains('hidden')) {
          el.heroTrailerWrap.classList.remove('playing');
          setTimeout(() => mountHeroTrailer(item), 400);
        }
      }, 50000);
    };

    state.heroTrailerTimer = setTimeout(async () => {
      if (item.ytId) {
        injectIframe(item.ytId);
        return;
      }
      if (item.id && item.id.startsWith('tt')) {
        try {
          const r = await fetch(`/api/meta/${item.type}/${encodeURIComponent(item.id)}`);
          const d = await r.json();
          const m = d?.meta;
          const ytId = m?.trailers?.[0]?.source || m?.trailerStreams?.[0]?.ytId || '';
          if (ytId) {
            item.ytId = ytId;
            injectIframe(ytId);
          }
        } catch (e) {}
      }
    }, 750);
  }

  function setupHeroCarousel() {
    if (!state.heroItems.length) return;
    el.heroIndicators.innerHTML = '';
    state.heroItems.forEach((item, idx) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', item.name);
      dot.addEventListener('click', () => {
        state.heroIndex = idx;
        updateHeroSlide();
        restartHeroTimer();
      });
      el.heroIndicators.appendChild(dot);
    });
    updateHeroSlide();
    restartHeroTimer();
  }

  function restartHeroTimer() {
    clearInterval(state.heroTimer);
    state.heroTimer = setInterval(() => {
      if (!el.detailsModal.classList.contains('hidden') || !el.playerOverlay.classList.contains('hidden')) return;
      state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
      updateHeroSlide();
    }, 16000);
  }

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

    const bgUrl = item.background || `https://images.metahub.space/background/large/${item.id}/img`;
    el.heroBackdrop.style.backgroundImage = `url('${bgUrl}'), url('${item.poster || ''}')`;
    el.heroDesc.textContent = item.description || '';

    if (el.heroFeaturedTag) {
      el.heroFeaturedTag.textContent = `TOP ${state.heroIndex + 1} EM DESTAQUE`;
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
    const runtimeHtml = item.runtime ? `<span>${escapeHtml(item.runtime)}</span>` : '';
    const genresList = Array.isArray(item.genres) && item.genres.length ? item.genres.slice(0, 2).join(' · ') : '';
    const genresHtml = genresList ? `<span>${escapeHtml(genresList)}</span>` : '';

    el.heroMeta.innerHTML = [ratingHtml, yearHtml, runtimeHtml, genresHtml].filter(Boolean).join('');

    updateHeroBookmarkIcon();
    el.heroIndicators.querySelectorAll('.hero-dot').forEach((d, i) => {
      d.classList.toggle('active', i === state.heroIndex);
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

    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);
    el.heroBanner.classList.toggle('hidden', !isHomeView);
    if (el.homeCategoryBar) {
      el.homeCategoryBar.classList.toggle('hidden', !isHomeView);
    }
    if (!isHomeView) {
      stopHeroTrailer();
    }
    renderContinueWatching();

    if (state.activeFilter === 'explore') {
      renderExploreView();
      return;
    }

    if (state.activeFilter === 'mylist') {
      const section = document.createElement('section');
      section.className = 'search-section';
      section.style.paddingTop = '100px';
      section.innerHTML = `
        <div class="section-header">
          <h2>Minha Lista (${state.myList.length})</h2>
        </div>
        <div class="media-grid" id="myListGrid"></div>
      `;
      el.catalogContainer.appendChild(section);
      const grid = section.querySelector('#myListGrid');
      if (!state.myList.length) {
        grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;">Nenhum título salvo na sua lista. Clique no ícone "+" em qualquer filme ou série para adicionar.</p>`;
      } else {
        state.myList.forEach((item) => grid.appendChild(createMediaCard(item, { allowRemoveMyList: true })));
      }
      return;
    }

    if (state.activeFilter === 'playlists') {
      renderPlaylistsSection();
      return;
    }

    let rows = state.catalogRows;
    if (state.activeFilter === 'all') {
      rows = rows.filter((r) => r.type !== 'tv');
    } else if (state.activeFilter === 'movie') {
      rows = rows.filter((r) => r.type === 'movie');
    } else if (state.activeFilter === 'series') {
      rows = rows.filter((r) => r.type === 'series');
    } else if (state.activeFilter === 'tv') {
      rows = rows.filter((r) => r.type === 'tv');
      const tvHeader = document.createElement('section');
      tvHeader.style.padding = '96px 4% 8px';
      tvHeader.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.22);border-radius:14px;padding:16px 20px;">
          <div>
            <h2 style="font-size:1.35rem;font-weight:800;margin:0 0 4px;">Canais de TV ao Vivo</h2>
            <p style="color:var(--text-muted);font-size:0.86rem;margin:0;">Esportes, Filmes, Séries, Abertos e Eventos transmitidos pelos addons dedicados de TV.</p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="meta-pill" style="background:rgba(249,115,22,0.2);color:#fdba74;border:1px solid rgba(249,115,22,0.35);">Fenix TV</span>
            <span class="meta-pill" style="background:rgba(6,182,212,0.2);color:#67e8f9;border:1px solid rgba(6,182,212,0.35);">NexoTV</span>
            <span class="meta-pill" style="background:rgba(234,179,8,0.2);color:#fde047;border:1px solid rgba(234,179,8,0.35);">Eh! Tudo TV</span>
          </div>
        </div>
      `;
      el.catalogContainer.appendChild(tvHeader);
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
            <button class="row-nav-btn prev-btn" aria-label="Anterior">&#10094;</button>
            <button class="row-nav-btn next-btn" aria-label="Próximo">&#10095;</button>
          </div>
        </div>
        <div class="row-slider-wrap">
          <div class="row-slider"></div>
        </div>
      `;

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

  function renderPlaylistsSection() {
    const section = document.createElement('section');
    section.className = 'search-section';
    section.style.paddingTop = '100px';
    section.innerHTML = `
      <div class="section-header">
        <h2>Minhas Playlists</h2>
        <button class="btn btn-sm btn-primary" id="newPlaylistPageBtn">+ Nova Playlist</button>
      </div>
      <div id="playlistsWrap"></div>
    `;
    el.catalogContainer.appendChild(section);

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
      block.innerHTML = `
        <div class="playlist-block-header">
          <div>
            <h3>${escapeHtml(pl.name)} <span style="font-size:0.8rem;color:var(--text-muted);font-weight:500;">(${pl.items.length})</span></h3>
          </div>
          <button class="btn btn-sm btn-glass delete-pl-btn" style="color:#f87171;">Excluir Playlist</button>
        </div>
        <div class="row-slider"></div>
      `;

      block.querySelector('.delete-pl-btn').addEventListener('click', () => {
        deletePlaylist(pl.id);
      });

      const slider = block.querySelector('.row-slider');
      if (!pl.items.length) {
        slider.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;">Playlist vazia. Adicione filmes ou episódios de séries pelo ícone de salvar.</p>`;
      } else {
        pl.items.forEach((entry) => {
          slider.appendChild(createMediaCard(entry, { playlistId: pl.id }));
        });
      }
      wrap.appendChild(block);
    });
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

    const reload = () => { exploreState.skip = 0; exploreState.items = []; exploreState.done = false; exploreState.seq++; loadExplore(true); };
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
      state.pendingResume = opts.isContinueWatching ? (item.savedTime || 0) : 0;
      if (item.targetStreamId && item.type === 'series') {
        openItemDetails(item, true, item.targetStreamId, item.season, item.episode);
      } else {
        openItemDetails(item, opts.isContinueWatching ? true : false);
      }
    });

    return card;
  }

  // Client-side Stream Cache & Prefetcher for Instant Opening
  const clientStreamsCache = new Map();
  function prefetchStreams(type, targetId) {
    if (!type || !targetId) return null;
    const key = `${type}:${targetId}`;
    const existing = clientStreamsCache.get(key);
    if (existing && existing.exp > Date.now()) return existing.promise;

    const promise = fetch(`/api/streams/${type}/${encodeURIComponent(targetId)}`)
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
    let filtered = allResults;
    let tabLabel = 'Resultados';

    if (state.activeFilter === 'movie') {
      filtered = allResults.filter((i) => i.type === 'movie');
      tabLabel = 'Filmes';
    } else if (state.activeFilter === 'series') {
      filtered = allResults.filter((i) => i.type === 'series');
      tabLabel = 'Séries';
    } else if (state.activeFilter === 'tv') {
      filtered = allResults.filter((i) => i.type === 'tv');
      tabLabel = 'Canais de TV';
    } else if (state.activeFilter === 'mylist') {
      filtered = allResults.filter((i) => isInMyList(i.id));
      tabLabel = 'Na Minha Lista';
    }

    el.searchTitle.textContent = `${tabLabel} para "${query}" (${filtered.length})`;
    el.searchGrid.innerHTML = '';

    if (!filtered.length) {
      el.searchGrid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;">Nenhum resultado em <strong>${tabLabel}</strong> para "${escapeHtml(query)}".</p>`;
      return;
    }
    filtered.forEach((item) => {
      el.searchGrid.appendChild(createMediaCard(item));
    });
  }

  // Search handler
  async function performSearch(query) {
    state.lastSearchQuery = query;
    el.searchSection.classList.remove('hidden');
    el.heroBanner.classList.add('hidden');
    if (el.homeCategoryBar) el.homeCategoryBar.classList.add('hidden');
    stopHeroTrailer();
    el.continueWatchingRow.classList.add('hidden');
    el.catalogContainer.classList.add('hidden');
    el.searchTitle.textContent = `Buscando "${query}"...`;
    el.searchGrid.innerHTML = '';

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

    if (item.type !== 'series') {
      // For movies and live TV channels, load streams immediately without waiting for metadata
      loadStreamsForTarget(item.type, initialTargetId, autoPlayFirst);
    }

    if (item.type === 'tv') return;

    try {
      const metaRes = await fetch(`/api/meta/${item.type}/${encodeURIComponent(item.id)}`);
      const metaData = await metaRes.json();
      if (metaData && metaData.meta) {
        state.currentMeta = metaData.meta;
        if (metaData.meta.description && !item.description) {
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

    if (item.type === 'series') {
      if (state.currentMeta && Array.isArray(state.currentMeta.videos) && state.currentMeta.videos.length > 0) {
        setupSeriesEpisodes(state.currentMeta.videos, autoPlayFirst, customStreamId, customSeason, customEp);
      } else {
        await loadStreamsForTarget(item.type, initialTargetId, autoPlayFirst);
      }
    }
  }

  function updateModalMyListButton() {
    if (!state.currentItem || !el.modalMyListBtn) return;
    const inList = isInMyList(state.currentItem.id);
    el.modalMyListBtn.textContent = inList ? 'Na Minha Lista' : '+ Minha Lista';
  }

  function setupSeriesEpisodes(videos, autoPlayFirst, customStreamId, customSeason, customEp) {
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
      loadStreamsForTarget('series', customStreamId || `${state.currentItem.id}:1:1`, autoPlayFirst);
      return;
    }

    const initialSeason = customSeason && seasonsMap.has(Number(customSeason)) ? Number(customSeason) : seasons[0];
    el.seasonSelect.innerHTML = seasons
      .map((s) => `<option value="${s}" ${s === initialSeason ? 'selected' : ''}>Temporada ${s}</option>`)
      .join('');

    const renderSeasonEpisodes = (seasonNum, triggerAuto = false, targetEpNum = null) => {
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
        const streamId = ep.id || `${state.currentItem.id}:${seasonNum}:${epNum}`;

        const card = document.createElement('div');
        card.className = `ep-card ${isCurrent ? 'active' : ''}`;
        card.innerHTML = `
          <div class="ep-top-row">
            <span class="ep-num">EP ${epNum}</span>
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
          loadStreamsForTarget('series', streamId, false);
        });
        el.episodesGrid.appendChild(card);
      });

      if (selectedEpObj) {
        state.currentEpisode = selectedEpObj.episode || selectedEpObj.number || 1;
        const streamId = customStreamId || selectedEpObj.id || `${state.currentItem.id}:${seasonNum}:${state.currentEpisode}`;
        loadStreamsForTarget('series', streamId, triggerAuto);
      }
    };

    el.seasonSelect.onchange = (e) => renderSeasonEpisodes(Number(e.target.value), false, null);
    renderSeasonEpisodes(initialSeason, autoPlayFirst, customEp);
  }

  async function loadStreamsForTarget(type, targetId, autoPlayFirst = false) {
    el.streamsLoading.classList.remove('hidden');
    el.streamsList.innerHTML = '';
    el.streamCounter.textContent = '...';

    try {
      const data = await prefetchStreams(type, targetId);
      el.streamsLoading.classList.add('hidden');

      state.currentStreams = data.streams || [];
      el.streamCounter.textContent = state.currentStreams.length;

      renderAddonFilterTabs(data.servers || []);
      renderStreamsList();

      if (autoPlayFirst && state.currentStreams.length > 0) {
        launchCloudPlayer(state.currentStreams[0]);
      }
    } catch (err) {
      el.streamsLoading.classList.add('hidden');
      el.streamsList.innerHTML = `<p style="color:#f87171;">Erro ao carregar fontes.</p>`;
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
        <span>Verificando os 13 servidores...</span>
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

  // Universal Cloud Video Player (HTML5 MP4 + HLS.js + Safari Native HLS + Cloud Embed — No Auto-Switching)
  let hlsInstance = null;

  function clearVideoHandlers() {
    if (!el.cloudVideo) return;
    el.cloudVideo.onloadedmetadata = null;
    el.cloudVideo.onloadeddata = null;
    el.cloudVideo.oncanplay = null;
    el.cloudVideo.onplaying = null;
    el.cloudVideo.onerror = null;
  }

  function destroyHls() {
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }
  }

  function launchCloudPlayer(stream) {
    stopHeroTrailer();
    stopModalTrailer();
    el.playerOverlay.classList.remove('hidden');
    el.playerServerDrawer.classList.add('hidden');
    document.body.style.overflow = 'hidden';

    clearVideoHandlers();
    destroyHls();
    state.nextEpisodeDismissed = false;
    hideNextEpisodePrompt();

    const epSuffix = state.currentItem?.type === 'series'
      ? ` — T${state.currentSeason}:E${state.currentEpisode}`
      : '';
    el.playerTitle.textContent = `${state.currentItem ? state.currentItem.name : 'Reproduzindo'}${epSuffix}`;

    el.playerLoader.classList.remove('hidden');
    el.playerLoaderTitle.textContent = 'Carregando servidor selecionado...';
    el.playerLoaderSub.textContent = `${stream.serverLabel} (${stream.quality})`;

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
      setTimeout(() => el.playerLoader.classList.add('hidden'), 2000);
      return;
    }

    if (el.cloudEmbed) {
      el.cloudEmbed.onload = null;
      el.cloudEmbed.src = 'about:blank';
      el.cloudEmbed.classList.add('hidden');
    }
    el.cloudVideo.classList.remove('hidden');

    const hideLoader = () => {
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

    el.cloudVideo.onloadedmetadata = () => { applyResume(); hideLoader(); };
    el.cloudVideo.onloadeddata = () => { applyResume(); hideLoader(); };
    el.cloudVideo.oncanplay = () => { applyResume(); hideLoader(); };
    el.cloudVideo.onplaying = hideLoader;
    el.cloudVideo.onerror = () => {
      el.playerLoaderTitle.textContent = 'Esta fonte demorou ou falhou ao responder';
      el.playerLoaderSub.textContent = 'Se desejar, clique em "Opções de Player" acima para escolher outro servidor.';
    };

    const startVideoPlayback = () => {
      const playPromise = el.cloudVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err && err.name === 'NotAllowedError') {
            hideLoader();
          }
        });
      }
    };

    // Engine 2: Universal HLS (.m3u8) via hls.js or Safari Native HLS
    const isHls = stream.playType === 'hls' || (stream.proxyUrl && stream.proxyUrl.includes('.m3u8')) || (stream.directUrl && stream.directUrl.includes('.m3u8'));
    if (isHls) {
      const hlsUrl = stream.directUrl || stream.proxyUrl;
      if (window.Hls && window.Hls.isSupported()) {
        class CustomTvLoader extends window.Hls.DefaultConfig.loader {
          load(context, config, callbacks) {
            const originalOnSuccess = callbacks.onSuccess;
            callbacks.onSuccess = (response, stats, ctx, networkDetails) => {
              if (response && response.data instanceof ArrayBuffer) {
                const u8 = new Uint8Array(response.data);
                // Detect PNG header (89 50 4E 47) and unmask MPEG-TS payload after IEND chunk
                if (u8.length > 68 && u8[0] === 0x89 && u8[1] === 0x50 && u8[2] === 0x4e && u8[3] === 0x47) {
                  const iend = [0x49, 0x45, 0x4e, 0x44];
                  for (let i = 0; i < Math.min(u8.length - 8, 200); i++) {
                    if (u8[i] === iend[0] && u8[i + 1] === iend[1] && u8[i + 2] === iend[2] && u8[i + 3] === iend[3]) {
                      const tsOffset = i + 8; // Skip IEND (4 bytes) + CRC (4 bytes)
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
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              el.playerLoaderTitle.textContent = 'Sinal indisponível no momento';
              el.playerLoaderSub.textContent = 'Clique em "Opções de Player" acima se quiser escolher outra fonte.';
            }
          }
        });
        return;
      } else if (el.cloudVideo.canPlayType('application/vnd.apple.mpegurl')) {
        el.cloudVideo.src = hlsUrl;
        el.cloudVideo.load();
        startVideoPlayback();
        return;
      }
    }

    // Engine 1: Direct Cloud MP4 Stream
    el.cloudVideo.pause();
    el.cloudVideo.src = stream.proxyUrl;
    el.cloudVideo.load();
    startVideoPlayback();
  }

  function renderPlayerDrawer(activeStream) {
    el.playerDrawerList.innerHTML = '';
    state.currentStreams.forEach((s) => {
      const item = document.createElement('div');
      item.className = 'stream-item';
      if (s.proxyUrl === activeStream.proxyUrl) {
        item.style.borderColor = '#4ade80';
      }
      item.innerHTML = `
        <div class="stream-top">
          <span class="stream-server-name">${escapeHtml(s.serverLabel)}</span>
          <span class="stream-quality">${escapeHtml(s.quality)}</span>
        </div>
        <div class="stream-bottom">
          <span>${escapeHtml(s.audio)}</span>
          <span class="stream-play-tag">${s.proxyUrl === activeStream.proxyUrl ? 'Ativo' : '▶ Trocar'}</span>
        </div>
      `;
      item.addEventListener('click', () => launchCloudPlayer(s));
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
    clearVideoHandlers();
    destroyHls();
    stopTorrentTelemetry();
    hideNextEpisodePrompt();
    state.nextEpisodeDismissed = false;
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
        description: item.description
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
    if (state.activeFilter === 'playlists') renderCatalogRows();
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
    if (state.activeFilter === 'playlists') renderCatalogRows();
  }

  function removeItemFromPlaylist(playlistId, uid) {
    const pl = state.playlists.find((p) => p.id === playlistId);
    if (!pl) return;
    pl.items = pl.items.filter((i) => (i.uid || i.id) !== uid);
    savePlaylists();
    showToast('Item removido da playlist');
    if (state.activeFilter === 'playlists') renderCatalogRows();
  }

  function deletePlaylist(playlistId) {
    state.playlists = state.playlists.filter((p) => p.id !== playlistId);
    savePlaylists();
    showToast('Playlist excluída');
    if (state.activeFilter === 'playlists') renderCatalogRows();
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
