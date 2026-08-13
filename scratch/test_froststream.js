async function testFrostStreamDirect() {
  console.log('--- Testing FrostStream Addon API Direct ---');

  const testIds = [
    { name: 'Spider-Man No Way Home', type: 'movie', id: 'tt10872600' },
    { name: 'Batman', type: 'movie', id: 'tt1877830' },
    { name: 'Breaking Bad', type: 'series', id: 'tt0903747:1:1' },
    { name: 'Stranger Things', type: 'series', id: 'tt4574334:1:1' },
    { name: 'Avatar The Way of Water', type: 'movie', id: 'tt1630029' }
  ];

  const urls = [
    'https://froststream.cloutteam.com',
    'https://froststream.strem.fun',
    'https://froststream.fly.dev'
  ];

  for (const item of testIds) {
    console.log(`\nTesting ${item.name} (${item.id}):`);
    for (const baseUrl of urls) {
      try {
        const url = `${baseUrl}/stream/${item.type.includes(':') ? 'series' : item.type}/${item.id}.json`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          const streams = data.streams || [];
          console.log(` [${res.status}] ${baseUrl} -> Found ${streams.length} streams!`);
          if (streams.length > 0) {
            console.log(`   Sample stream 1:`, streams[0].title || streams[0].name || streams[0].url);
          }
        } else {
          console.log(` [${res.status}] ${baseUrl}`);
        }
      } catch(e) {
        console.log(` [ERR] ${baseUrl}: ${e.message}`);
      }
    }
  }
}

testFrostStreamDirect();
