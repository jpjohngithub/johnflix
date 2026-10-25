(() => {
  const cfg = window.JOHNFLIX_CONFIG || {};
  const configured = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  const KEY = 'johnflix_session';
  const gate = document.getElementById('authGate');
  if (!gate) return;

  const $ = (id) => document.getElementById(id);
  const form = $('authForm');
  const err = $('authError');
  const state = { mode: 'login', busy: false };

  const showError = (msg) => {
    err.textContent = msg || '';
    err.classList.toggle('hidden', !msg);
  };

  const loadSession = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  };
  const saveSession = (s) => localStorage.setItem(KEY, JSON.stringify(s));

  const openGate = () => {
    gate.classList.remove('hidden');
    document.body.classList.add('auth-locked');
    setTimeout(() => $('authEmail').focus(), 50);
  };
  const closeGate = () => {
    gate.classList.add('hidden');
    document.body.classList.remove('auth-locked');
  };

  const setMode = (mode) => {
    state.mode = mode;
    const signup = mode === 'signup';
    $('authTitle').textContent = signup ? 'Criar conta' : 'Entrar';
    $('authSub').textContent = signup ? 'Cadastre-se para salvar sua lista e progresso.' : 'Acesse sua conta para continuar assistindo.';
    $('authSubmitBtn').textContent = signup ? 'Criar conta' : 'Entrar';
    $('authSwitchText').textContent = signup ? 'Já tem conta?' : 'Não tem conta?';
    $('authSwitchBtn').textContent = signup ? 'Entrar' : 'Criar conta';
    $('authNameField').hidden = !signup;
    $('authPassword').autocomplete = signup ? 'new-password' : 'current-password';
    showError('');
  };

  const api = async (path, body) => {
    const res = await fetch(`${cfg.supabaseUrl}/auth/v1/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: cfg.supabaseAnonKey },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error_description || data.msg || data.message || 'Falha na autenticação.');
    return data;
  };

  const notConfigured = () => showError('Login com conta ainda não configurado. Use "Continuar como convidado".');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (state.busy) return;
    if (!configured) return notConfigured();
    const email = $('authEmail').value.trim();
    const password = $('authPassword').value;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError('Informe um e-mail válido.');
    if (password.length < 8) return showError('A senha deve ter no mínimo 8 caracteres.');
    state.busy = true;
    $('authSubmitBtn').disabled = true;
    showError('');
    try {
      let data;
      if (state.mode === 'signup') {
        data = await api('signup', { email, password, data: { name: $('authName').value.trim() } });
        if (!data.access_token) {
          showError('Conta criada. Confirme seu e-mail para entrar.');
          setMode('login');
          return;
        }
      } else {
        data = await api('token?grant_type=password', { email, password });
      }
      saveSession({ token: data.access_token, refresh: data.refresh_token, email, at: Date.now() });
      closeGate();
    } catch (ex) {
      showError(ex.message);
    } finally {
      state.busy = false;
      $('authSubmitBtn').disabled = false;
      $('authPassword').value = '';
    }
  });

  $('authGoogleBtn').addEventListener('click', () => {
    if (!configured) return notConfigured();
    const redirect = encodeURIComponent(location.origin + '/');
    location.href = `${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirect}`;
  });
  $('authSwitchBtn').addEventListener('click', () => setMode(state.mode === 'login' ? 'signup' : 'login'));
  $('authGuestBtn').addEventListener('click', () => {
    saveSession({ guest: true, at: Date.now() });
    closeGate();
  });

  // Retorno do OAuth do Google: tokens vem no hash da URL
  if (location.hash.includes('access_token=')) {
    const p = new URLSearchParams(location.hash.slice(1));
    saveSession({ token: p.get('access_token'), refresh: p.get('refresh_token'), at: Date.now() });
    history.replaceState(null, '', location.pathname);
  }

  if (!loadSession()) openGate();
})();
