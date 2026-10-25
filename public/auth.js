(() => {
  const KEY = 'johnflix_session';
  const DATA_KEYS = ['johnflix_mylist', 'johnflix_playlists', 'johnflix_cw', 'johnflix_custom'];
  const gate = document.getElementById('authGate');
  if (!gate) return;

  const $ = (id) => document.getElementById(id);
  const form = $('authForm');
  const err = $('authError');
  const state = { mode: 'login', busy: false, user: null, googleClientId: '' };

  const showError = (msg) => {
    err.textContent = msg || '';
    err.classList.toggle('hidden', !msg);
  };

  const loadLocal = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  };
  const saveLocal = (s) => {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  };

  const openGate = () => {
    gate.classList.remove('hidden');
    document.body.classList.add('auth-locked');
    setTimeout(() => $('authEmail')?.focus(), 50);
  };
  const closeGate = () => {
    gate.classList.add('hidden');
    document.body.classList.remove('auth-locked');
  };

  const renderNavUser = (user, isGuest) => {
    state.user = user || null;
    const lbl = $('navUserLabel');
    const av = $('navUserAvatar');
    const mName = $('navMenuName');
    const mEmail = $('navMenuEmail');
    const outBtn = $('navLogoutBtn');
    if (!lbl || !av) return;
    if (user) {
      const name = user.name || user.email.split('@')[0];
      lbl.textContent = name;
      av.textContent = name.charAt(0).toUpperCase();
      if (mName) mName.textContent = name;
      if (mEmail) mEmail.textContent = user.email;
      if (outBtn) outBtn.textContent = 'Sair da conta';
    } else {
      lbl.textContent = isGuest ? 'Convidado' : 'Entrar';
      av.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      if (mName) mName.textContent = 'Visitante';
      if (mEmail) mEmail.textContent = 'Modo convidado';
      if (outBtn) outBtn.textContent = 'Entrar / Criar conta';
    }
  };

  const setMode = (mode) => {
    state.mode = mode;
    const signup = mode === 'signup';
    $('authTitle').textContent = signup ? 'Criar conta' : 'Entrar';
    $('authSub').textContent = signup ? 'Cadastre-se para salvar sua lista e progresso na nuvem.' : 'Acesse sua conta para continuar assistindo.';
    $('authSubmitBtn').textContent = signup ? 'Criar conta' : 'Entrar';
    $('authSwitchText').textContent = signup ? 'Já tem conta?' : 'Não tem conta?';
    $('authSwitchBtn').textContent = signup ? 'Entrar' : 'Criar conta';
    $('authNameField').hidden = !signup;
    $('authPassword').autocomplete = signup ? 'new-password' : 'current-password';
    showError('');
  };

  const api = async (path, method = 'POST', body = null) => {
    const opts = {
      method,
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'johnflix' }
    };
    if (body !== null) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(`/auth/${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Falha na autenticação.');
    return data;
  };

  const pullCloudData = async () => {
    try {
      const { data } = await api('data', 'GET');
      if (!data) return;
      let changed = false;
      for (const k of DATA_KEYS) {
        if (typeof data[k] === 'string' && data[k] !== localStorage.getItem(k)) {
          localStorage.setItem(k, data[k]);
          changed = true;
        }
      }
      if (changed) window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  let syncTimer = null;
  const pushCloudData = () => {
    if (!state.user) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      const payload = {};
      for (const k of DATA_KEYS) payload[k] = localStorage.getItem(k) || '[]';
      api('data', 'PUT', { data: payload }).catch(() => {});
    }, 1200);
  };

  const origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (k, v) => {
    origSetItem(k, v);
    if (DATA_KEYS.includes(k)) pushCloudData();
  };

  const onAuthenticated = async (user) => {
    saveLocal({ user, at: Date.now() });
    renderNavUser(user, false);
    closeGate();
    await pullCloudData();
    pushCloudData();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.busy) return;
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) return showError('Informe um e-mail válido.');
    if (password.length < 8) return showError('A senha deve ter no mínimo 8 caracteres.');
    if (state.mode === 'signup' && (!/[a-zA-Z]/.test(password) || !/\d/.test(password))) {
      return showError('A senha deve conter letras e números.');
    }
    state.busy = true;
    $('authSubmitBtn').disabled = true;
    showError('');
    try {
      const action = state.mode === 'signup' ? 'register' : 'login';
      const payload = state.mode === 'signup'
        ? { email, password, name: $('authName').value.trim() }
        : { email, password };
      const { user } = await api(action, 'POST', payload);
      await onAuthenticated(user);
    } catch (ex) {
      showError(ex.message);
    } finally {
      state.busy = false;
      $('authSubmitBtn').disabled = false;
      $('authPassword').value = '';
    }
  });

  $('authGoogleBtn').addEventListener('click', () => {
    if (window.google?.accounts?.id && state.googleClientId) {
      window.google.accounts.id.prompt();
    } else {
      showError('Use e-mail e senha para entrar ou criar sua conta instantaneamente.');
      $('authEmail')?.focus();
    }
  });

  $('authSwitchBtn').addEventListener('click', () => setMode(state.mode === 'login' ? 'signup' : 'login'));
  $('authGuestBtn').addEventListener('click', () => {
    saveLocal({ guest: true, at: Date.now() });
    renderNavUser(null, true);
    closeGate();
  });

  // Navbar profile menu
  const userBtn = $('navUserBtn');
  const userMenu = $('navUserMenu');
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.user && !loadLocal()?.guest) {
        openGate();
        return;
      }
      userMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', () => userMenu.classList.add('hidden'));
  }

  $('navLogoutBtn')?.addEventListener('click', async () => {
    $('navUserMenu')?.classList.add('hidden');
    if (state.user) {
      await api('logout', 'POST', {}).catch(() => {});
    }
    saveLocal(null);
    renderNavUser(null, false);
    openGate();
  });

  // Boot session check + Google GSI
  (async () => {
    const local = loadLocal();
    if (local?.user) renderNavUser(local.user, false);
    else if (local?.guest) renderNavUser(null, true);
    else openGate();

    try {
      const { user } = await api('me', 'GET');
      if (user) await onAuthenticated(user);
    } catch (e) {
      if (local?.user) {
        saveLocal(null);
        renderNavUser(null, false);
        openGate();
      }
    }

    try {
      const { googleClientId } = await api('config', 'GET');
      if (googleClientId) {
        state.googleClientId = googleClientId;
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = () => {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (resp) => {
              try {
                const { user } = await api('google', 'POST', { credential: resp.credential });
                await onAuthenticated(user);
              } catch (ex) {
                showError(ex.message);
              }
            }
          });
        };
        document.head.appendChild(s);
      }
    } catch (e) {}
  })();
})();
