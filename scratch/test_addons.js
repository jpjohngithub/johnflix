const addons = [
  { key: 'fenixflix', url: 'https://fenixflix.fenixhub.online' },
  { key: 'froststream_clout', url: 'https://froststream.cloutteam.com' },
  { key: 'froststream_railway', url: 'https://froststream.up.railway.app' },
  { key: 'brazuca', url: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club' }
];

async function testSingle(addon, type, id) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(`${addon.url}/stream/${type}/${id}.json`, { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      return { key: addon.key, streams: data.streams || [] };
    }
  } catch (e) {
    clearTimeout(timer);
  }
  return { key: addon.key, streams: [] };
}

async function testAll() {
  const ids = [
    { type: 'movie', id: 'tt0111161', name: 'Shawshank Redemption' },
    { type: 'series', id: 'tt0903747:1:1', name: 'Breaking Bad S1E1' }
  ];

  for (const item of ids) {
    console.log(`\n=== Testing ${item.name} (${item.type} ${item.id}) ===`);
    const results = await Promise.allSettled(addons.map(a => testSingle(a, item.type, item.id)));
    results.forEach(r => {
      if (r.status === 'fulfilled') {
        console.log(`  ${r.value.key}: ${r.value.streams.length} streams`);
        if (r.value.streams.length > 0) {
          console.log(`    Sample:`, JSON.stringify(r.value.streams[0]).slice(0, 100));
        }
      }
    });
  }
}

testAll();
