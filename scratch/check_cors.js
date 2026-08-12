const addons = [
  { key: 'fenixflix', url: 'https://fenixflix.fenixhub.online' },
  { key: 'froststream', url: 'https://froststream.cloutteam.com' },
  { key: 'brazuca', url: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club' },
  { key: 'torrentio', url: 'https://torrentio.strem.fun' }
];

async function checkHeaders() {
  console.log('--- Checking CORS headers from Node ---');
  for (const a of addons) {
    try {
      const target = `${a.url}/stream/movie/tt0111161.json`;
      const res = await fetch(target, { method: 'GET' });
      console.log(`\n[${a.key}] Status: ${res.status}`);
      console.log(`  Access-Control-Allow-Origin: ${res.headers.get('access-control-allow-origin')}`);
      console.log(`  Content-Type: ${res.headers.get('content-type')}`);
      const text = await res.text();
      console.log(`  Body length: ${text.length}`);
      console.log(`  Body sample: ${text.slice(0, 150)}`);
    } catch(e) {
      console.log(`\n[${a.key}] ERROR: ${e.message}`);
    }
  }
}

checkHeaders();
