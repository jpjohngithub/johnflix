(() => {
  // Application State
  const state = {
    catalogRows: [],
    addons: [],
    heroItems: [],
    heroIndex: 0,
    heroTimer: null,
    activeFilter: 'all',
    currentItem: null,
    currentMeta: null,
    currentSeason: 1,
    currentEpisode: 1,
    currentStreams: [],
    activeAddonFilter: 'all',
    telemetryTimer: null,
    playlistTargetItem: null,
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
    heroTitle: document.getElementById('heroTitle'),
    heroMeta: document.getElementById('heroMeta'),
    heroDesc: document.getElementById('heroDesc'),
    heroPlayBtn: document.getElementById('heroPlayBtn'),
    heroInfoBtn: document.getElementById('heroInfoBtn'),
    heroBookmarkBtn: document.getElementById('heroBookmarkBtn'),
    heroBookmarkIcon: document.getElementById('heroBookmarkIcon'),
    heroPlaylistBtn: document.getElementById('heroPlaylistBtn'),
    heroIndicators: document.getElementById('heroIndicators'),
    continueWatchingRow: document.getElementById('continueWatchingRow'),
    continueWatchingSlider: document.getElementById('continueWatchingSlider'),
    catalogContainer: document.getElementById('catalogContainer'),
    detailsModal: document.getElementById('detailsModal'),
    closeDetailsBtn: document.getElementById('closeDetailsBtn'),
    modalHero: document.getElementById('modalHero'),
    modalTitle: document.getElementById('modalTitle'),
    modalMeta: document.getElementById('modalMeta'),
    modalDesc: document.getElementById('modalDesc'),
    modalMyListBtn: document.getElementById('modalMyListBtn'),
    modalPlaylistBtn: document.getElementById('modalPlaylistBtn'),
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
        closeSearch();
        renderCatalogRows();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    let searchTimer = null;
    el.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      el.searchClear.classList.toggle('hidden', !val);
      clearTimeout(searchTimer);
      if (!val.trim()) {
        closeSearch();
        return;
      }
      searchTimer = setTimeout(() => performSearch(val.trim()), 380);
    });

    el.searchClear.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClear.classList.add('hidden');
      closeSearch();
    });

    el.closeSearchBtn.addEventListener('click', closeSearch);

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

    // Details modal actions
    el.modalMyListBtn.addEventListener('click', () => {
      if (state.currentItem) {
        toggleMyList(state.currentItem);
        updateModalMyListButton();
      }
    });
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
    });

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

      const pool = [];
      state.catalogRows.forEach((r) => {
        r.items.slice(0, 4).forEach((item) => {
          if (pool.length < 6 && !pool.some((p) => p.id === item.id)) {
            pool.push(item);
          }
        });
      });
      state.heroItems = pool;
      setupHeroCarousel();
      renderCatalogRows();
    } catch (err) {
      el.heroTitle.textContent = 'Indisponível no momento';
    }
  }

  function setupHeroCarousel() {
    if (!state.heroItems.length) return;
    el.heroIndicators.innerHTML = '';
    state.heroItems.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
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
      state.heroIndex = (state.heroIndex + 1) % state.heroItems.length;
      updateHeroSlide();
    }, 8000);
  }

  function updateHeroSlide() {
    const item = state.heroItems[state.heroIndex];
    if (!item) return;

    const bgUrl = item.background || `https://images.metahub.space/background/large/${item.id}/img`;
    el.heroBackdrop.style.backgroundImage = `url('${bgUrl}'), url('${item.poster || ''}')`;
    el.heroTitle.textContent = item.name;
    el.heroDesc.textContent = item.description || '';

    const typeLabel = item.type === 'series' ? 'Série' : 'Filme';
    const ratingHtml = item.imdbRating ? `<span class="meta-rating">★ ${item.imdbRating}</span>` : '';
    const yearHtml = item.year ? `<span>${item.year}</span>` : '';

    el.heroMeta.innerHTML = `
      <span class="meta-pill">${typeLabel}</span>
      ${ratingHtml}
      ${yearHtml}
    `;

    updateHeroBookmarkIcon();
    const dots = el.heroIndicators.querySelectorAll('.hero-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === state.heroIndex));
    prefetchStreams(item.type, item.type === 'series' ? `${item.id}:1:1` : item.id);
  }

  function updateHeroBookmarkIcon() {
    const item = state.heroItems[state.heroIndex];
    if (!item || !el.heroBookmarkIcon) return;
    const inList = isInMyList(item.id);
    el.heroBookmarkIcon.innerHTML = inList
      ? '<path d="M20 6L9 17l-5-5"/>'
      : '<path d="M12 5v14M5 12h14"/>';
  }

  // Render Catalog Rows or My List / Playlists Views
  function renderCatalogRows() {
    el.catalogContainer.innerHTML = '';

    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);
    el.heroBanner.classList.toggle('hidden', !isHomeView);
    renderContinueWatching();

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
    if (state.activeFilter === 'movie') {
      rows = rows.filter((r) => r.type === 'movie');
    } else if (state.activeFilter === 'series') {
      rows = rows.filter((r) => r.type === 'series');
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
      row.items.forEach((item) => {
        slider.appendChild(createMediaCard(item));
      });

      rowEl.querySelector('.prev-btn').addEventListener('click', () => {
        slider.scrollBy({ left: -750, behavior: 'smooth' });
      });
      rowEl.querySelector('.next-btn').addEventListener('click', () => {
        slider.scrollBy({ left: 750, behavior: 'smooth' });
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

  function createMediaCard(item, opts = {}) {
    const card = document.createElement('article');
    card.className = 'media-card';
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

    const subText = item.epLabel
      ? escapeHtml(item.epLabel)
      : [item.year, item.imdbRating ? `★ ${item.imdbRating}` : ''].filter(Boolean).join(' • ');

    card.innerHTML = `
      <div class="card-poster-wrap">
        <img class="card-poster" src="${item.poster || fallbackPoster}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x450/160b2b/a855f7?text=${encodeURIComponent(item.name)}'" />
        <div class="card-quick-actions">
          <button class="card-action-btn mylist-btn ${inList ? 'active' : ''}" title="${inList ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}">${inList ? '✓' : '+'}</button>
          <button class="card-action-btn pl-btn" title="Adicionar à Playlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
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
        ${subText ? `<div class="card-sub"><span>${subText}</span></div>` : ''}
      </div>
    `;

    const mylistBtn = card.querySelector('.mylist-btn');
    mylistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMyList(item);
      const nowIn = isInMyList(item.id);
      mylistBtn.classList.toggle('active', nowIn);
      mylistBtn.textContent = nowIn ? '✓' : '+';
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

  // Search handler
  async function performSearch(query) {
    el.searchSection.classList.remove('hidden');
    el.heroBanner.classList.add('hidden');
    el.continueWatchingRow.classList.add('hidden');
    el.catalogContainer.classList.add('hidden');
    el.searchTitle.textContent = `Buscando "${query}"...`;
    el.searchGrid.innerHTML = '';

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const results = data.results || [];
      el.searchTitle.textContent = `Resultados para "${query}"`;

      if (!results.length) {
        el.searchGrid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;">Nenhum título encontrado.</p>`;
        return;
      }
      results.forEach((item) => {
        el.searchGrid.appendChild(createMediaCard(item));
      });
    } catch (err) {
      el.searchTitle.textContent = 'Erro na busca';
    }
  }

  function closeSearch() {
    el.searchSection.classList.add('hidden');
    const isHomeView = ['all', 'movie', 'series'].includes(state.activeFilter);
    el.heroBanner.classList.toggle('hidden', !isHomeView);
    el.catalogContainer.classList.remove('hidden');
    renderContinueWatching();
  }

  // Details Modal & Stream Aggregation (Parallel Meta + Stream Loading)
  async function openItemDetails(item, autoPlayFirst = false, customStreamId = null, customSeason = null, customEp = null) {
    if (autoPlayFirst && el.cloudVideo) {
      try { el.cloudVideo.load(); } catch (e) {}
    }
    state.currentItem = item;
    state.currentMeta = null;
    state.currentStreams = [];
    state.activeAddonFilter = 'all';

    el.detailsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const bg = item.background || `https://images.metahub.space/background/large/${item.id}/img`;
    el.modalHero.style.backgroundImage = `url('${bg}'), url('${item.poster || ''}')`;
    el.modalTitle.textContent = item.name;
    el.modalDesc.textContent = item.description || '';
    el.modalMeta.innerHTML = [
      item.type === 'series' ? '<span class="meta-pill">Série</span>' : '<span class="meta-pill">Filme</span>',
      item.imdbRating ? `<span class="meta-rating">★ ${item.imdbRating}</span>` : '',
      item.year ? `<span>${item.year}</span>` : ''
    ].filter(Boolean).join('');

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
      // For movies, load streams immediately without waiting for metadata
      loadStreamsForTarget(item.type, initialTargetId, autoPlayFirst);
    }

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
    el.modalMyListBtn.textContent = inList ? '✓ Na Minha Lista' : '+ Minha Lista';
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
      btn.textContent = `${srv.addonName} (${srv.count})`;
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
      const seedsTag = stream.seeds ? ` • 👤 ${stream.seeds}` : '';

      card.innerHTML = `
        <div class="stream-top">
          <span class="stream-server-name">
            <span style="width:8px;height:8px;border-radius:50%;background:${stream.addonColor};display:inline-block;"></span>
            ${escapeHtml(stream.serverLabel)}
          </span>
          <span class="stream-quality">${escapeHtml(stream.quality)}</span>
        </div>
        <div class="stream-bottom">
          <span>${escapeHtml(stream.audio)}${seedsTag}</span>
          <span class="stream-play-tag">▶ Assistir</span>
        </div>
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
        <span>Verificando os 6 servidores...</span>
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
    el.detailsModal.classList.add('hidden');
    if (el.playerOverlay.classList.contains('hidden')) {
      document.body.style.overflow = '';
    }
  }

  // Universal Cloud Video Player (HTML5 H.264 MP4 + HLS.js + Safari Native HLS + Cloud Embed + Auto-Failover)
  let failoverWatchdog = null;
  let hlsInstance = null;

  function destroyHls() {
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }
  }

  function launchCloudPlayer(stream, triedUrls = new Set()) {
    el.playerOverlay.classList.remove('hidden');
    el.playerServerDrawer.classList.add('hidden');
    document.body.style.overflow = 'hidden';

    triedUrls.add(stream.proxyUrl);
    destroyHls();

    const epSuffix = state.currentItem?.type === 'series'
      ? ` — T${state.currentSeason}:E${state.currentEpisode}`
      : '';
    el.playerTitle.textContent = `${state.currentItem ? state.currentItem.name : 'Reproduzindo'}${epSuffix}`;

    el.playerLoader.classList.remove('hidden');
    el.playerLoaderTitle.textContent = 'Conectando ao servidor na nuvem...';
    el.playerLoaderSub.textContent = `${stream.serverLabel} (${stream.quality})`;

    if (stream.playType === 'torrent') {
      startTorrentTelemetry(stream.infoHash);
    } else {
      stopTorrentTelemetry();
    }

    renderPlayerDrawer(stream);

    const tryNextWorkingStream = () => {
      clearTimeout(failoverWatchdog);
      destroyHls();
      // Prefer 1080p H.264 (!is4k) direct streams first for universal browser decoding
      const nextStream = state.currentStreams.find(
        (s) => s.proxyUrl && !triedUrls.has(s.proxyUrl) && s.playType === 'direct' && !s.is4k
      ) || state.currentStreams.find(
        (s) => s.proxyUrl && !triedUrls.has(s.proxyUrl) && s.playType === 'direct'
      ) || state.currentStreams.find(
        (s) => s.proxyUrl && !triedUrls.has(s.proxyUrl)
      );

      if (nextStream && triedUrls.size < 8) {
        el.playerLoaderTitle.textContent = `Alternando para rota compatível (${nextStream.serverLabel})...`;
        launchCloudPlayer(nextStream, triedUrls);
      } else {
        // Universal fallback to Multi-Browser Embed if all direct routes failed
        const baseImdb = (state.currentItem?.id || '').split(':')[0];
        if (baseImdb.startsWith('tt') && el.cloudEmbed && !triedUrls.has('embed_fallback')) {
          triedUrls.add('embed_fallback');
          const fallbackEmbed = state.currentItem?.type === 'series'
            ? `https://vidsrc.cc/v2/embed/tv/${baseImdb}/${state.currentSeason || 1}/${state.currentEpisode || 1}`
            : `https://vidsrc.cc/v2/embed/movie/${baseImdb}`;
          launchCloudPlayer({
            addonId: 'universal',
            serverLabel: 'Player Universal Multi-Browser',
            quality: '1080p Full HD',
            audio: 'Multi-Áudio / Legendas',
            playType: 'embed',
            proxyUrl: fallbackEmbed
          }, triedUrls);
          return;
        }
        el.playerLoaderTitle.textContent = 'Fonte indisponível neste navegador';
        el.playerLoaderSub.textContent = 'Toque em "Opções de Player" acima para selecionar outro servidor.';
      }
    };

    // Engine 3: Universal Cloud Embed Iframe
    if (stream.playType === 'embed' && el.cloudEmbed) {
      clearTimeout(failoverWatchdog);
      el.cloudVideo.pause();
      el.cloudVideo.removeAttribute('src');
      el.cloudVideo.classList.add('hidden');
      el.cloudEmbed.classList.remove('hidden');
      el.cloudEmbed.src = stream.proxyUrl;
      el.cloudEmbed.onload = () => {
        el.playerLoader.classList.add('hidden');
      };
      setTimeout(() => el.playerLoader.classList.add('hidden'), 2500);
      return;
    }

    if (el.cloudEmbed) {
      el.cloudEmbed.src = 'about:blank';
      el.cloudEmbed.classList.add('hidden');
    }
    el.cloudVideo.classList.remove('hidden');

    clearTimeout(failoverWatchdog);
    failoverWatchdog = setTimeout(() => {
      if (el.cloudVideo.readyState < 2 && !el.playerOverlay.classList.contains('hidden')) {
        tryNextWorkingStream();
      }
    }, 8500);

    el.cloudVideo.onloadeddata = () => {
      // Detect unsupported video codec (e.g. 4K HEVC/H.265 playing audio-only with black screen)
      if (el.cloudVideo.videoWidth === 0 && el.cloudVideo.readyState >= 2) {
        tryNextWorkingStream();
        return;
      }
      clearTimeout(failoverWatchdog);
      el.playerLoader.classList.add('hidden');
    };

    el.cloudVideo.oncanplay = () => {
      if (el.cloudVideo.videoWidth === 0 && el.cloudVideo.readyState >= 2) {
        tryNextWorkingStream();
        return;
      }
      clearTimeout(failoverWatchdog);
      el.playerLoader.classList.add('hidden');
    };

    el.cloudVideo.onerror = () => {
      tryNextWorkingStream();
    };

    const startVideoPlayback = () => {
      const playPromise = el.cloudVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // On iOS/Android mobile browsers, if unmuted autoplay is blocked by gesture expiry, hide loader so user can tap video play button
          if (err && err.name === 'NotAllowedError') {
            clearTimeout(failoverWatchdog);
            el.playerLoader.classList.add('hidden');
          }
        });
      }
    };

    // Engine 2: Universal HLS (.m3u8) via hls.js or Safari Native HLS
    const isHls = stream.playType === 'hls' || (stream.proxyUrl && stream.proxyUrl.includes('.m3u8'));
    if (isHls) {
      const hlsUrl = stream.directUrl || stream.proxyUrl;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: false });
        hlsInstance.loadSource(hlsUrl);
        hlsInstance.attachMedia(el.cloudVideo);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
          clearTimeout(failoverWatchdog);
          el.playerLoader.classList.add('hidden');
          startVideoPlayback();
        });
        hlsInstance.on(window.Hls.Events.ERROR, (_, data) => {
          if (data && data.fatal) {
            tryNextWorkingStream();
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

    // Engine 1: Direct Cloud MP4 Stream (Universal H.264 / MP4)
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
          <span class="stream-play-tag">${s.proxyUrl === activeStream.proxyUrl ? '● Ativo' : '▶ Trocar'}</span>
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
    clearTimeout(failoverWatchdog);
    destroyHls();
    stopTorrentTelemetry();
    el.cloudVideo.pause();
    el.cloudVideo.removeAttribute('src');
    el.cloudVideo.load();
    if (el.cloudEmbed) {
      el.cloudEmbed.src = 'about:blank';
      el.cloudEmbed.classList.add('hidden');
    }
    el.playerOverlay.classList.add('hidden');
    if (el.detailsModal.classList.contains('hidden')) {
      document.body.style.overflow = '';
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
