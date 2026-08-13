async function testStremioAddons() {
  const addons = [
    'https://froststream.cloutteam.com',
    'https://froststream.fly.dev',
    'https://redeflix.strem.fun',
    'https://brazilian-addon.baby-beamup.club',
    'https://fenixflix.fenixhub.online',
    'https://vidsrc.me',
    'https://warezcdn.link'
  ];

  const testId = 'tt10872600'; // Spider-Man No Way Home

  console.log('Testing Addons for', testId);
  for (const baseUrl of addons) {
    try {
      const url = `${baseUrl}/stream/movie/${testId}.json`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        console.log(`[${res.status}] ${baseUrl} -> ${(data.streams || []).length} streams`);
      } else {
        console.log(`[${res.status}] ${baseUrl}`);
      }
    } catch(e) {
      console.log(`[ERR] ${baseUrl}: ${e.message}`);
    }
  }
}

testStremioAddons();
