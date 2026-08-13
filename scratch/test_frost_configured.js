async function testFrostConfiguredUrl() {
  console.log('--- Testing FrostStream Configured Provider URL ---');

  const configuredBaseUrl = 'https://froststream.cloutteam.com/providers.iptv=checked&providers.cdmoviedb=checked&providers.redeflix=checked&providers.tomato=checked&providers.myembed=checked&providers.anizone=checked';
  
  const testIds = [
    { type: 'movie', id: 'tt10872600', name: 'Spider-Man No Way Home' },
    { type: 'movie', id: 'tt0111161', name: 'The Shawshank Redemption' },
    { type: 'series', id: 'tt0903747:1:1', name: 'Breaking Bad' },
    { type: 'movie', id: 'tt1877830', name: 'The Batman' }
  ];

  for (const item of testIds) {
    try {
      const url = `${configuredBaseUrl}/stream/${item.type}/${item.id}.json`;
      console.log(`\nFetching ${item.name} (${url})...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        const streams = data.streams || [];
        console.log(`FOUND ${streams.length} STREAMS for ${item.name}!`);
        if (streams.length > 0) {
          console.log('Sample stream title:', streams[0].title || streams[0].name);
          console.log('Sample stream url/embed:', streams[0].url || streams[0].embedUrl);
        }
      }
    } catch(e) {
      console.log('Error:', e.message);
    }
  }
}

testFrostConfiguredUrl();
