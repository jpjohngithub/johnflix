async function testFrostStreamManifest() {
  console.log('--- Testing FrostStream Manifest & Endpoints ---');

  try {
    const manifestRes = await fetch('https://froststream.cloutteam.com/manifest.json');
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      console.log('Manifest:', JSON.stringify(manifest, null, 2));
    } else {
      console.log('Manifest status:', manifestRes.status);
    }
  } catch(e) {
    console.log('Manifest fetch error:', e.message);
  }

  // Test sample stream requests
  const testCases = [
    { type: 'movie', id: 'tt10872600' },
    { type: 'series', id: 'tt0903747:1:1' }
  ];

  for (const tc of testCases) {
    try {
      const streamUrl = `https://froststream.cloutteam.com/stream/${tc.type}/${tc.id}.json`;
      console.log(`\nFetching ${streamUrl}...`);
      const res = await fetch(streamUrl);
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Streams found:`, (data.streams || []).length);
        if (data.streams && data.streams.length > 0) {
          console.log('Sample stream:', JSON.stringify(data.streams[0], null, 2));
        }
      }
    } catch(e) {
      console.log('Stream fetch error:', e.message);
    }
  }
}

testFrostStreamManifest();
