async function testFrostAllEndpoints() {
  console.log('--- Testing FrostStream All Formats ---');

  const urls = [
    'https://froststream.cloutteam.com/stream/movie/tt10872600.json',
    'https://froststream.cloutteam.com/stream/series/tt0903747:1:1.json',
    'https://froststream.cloutteam.com/catalog/movie/froststream.json',
    'https://froststream.cloutteam.com/meta/movie/tt10872600.json'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Stremio/4.4.150' } });
      const text = await res.text();
      console.log(`[${res.status}] ${url} -> length ${text.length}`);
      if (text.length > 0 && text.length < 500) {
        console.log('   Response:', text);
      }
    } catch(e) {
      console.log('Err:', e.message);
    }
  }
}

testFrostAllEndpoints();
