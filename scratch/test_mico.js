async function testMicoLeao() {
  const baseUrl = 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club';
  try {
    const manifestRes = await fetch(`${baseUrl}/manifest.json`);
    console.log('Manifest status:', manifestRes.status);
    if (manifestRes.ok) {
      const manifest = await manifestRes.json();
      console.log('Manifest name:', manifest.name);
      console.log('Manifest id:', manifest.id);
      console.log('Manifest types:', manifest.types);
      console.log('Manifest resources:', manifest.resources);
    }

    // Test stream query for movie (The Shawshank Redemption tt0111161 or Batman tt1877830)
    const streamRes = await fetch(`${baseUrl}/stream/movie/tt0111161.json`);
    console.log('Stream status:', streamRes.status);
    if (streamRes.ok) {
      const data = await streamRes.json();
      console.log('Stream count:', (data.streams || []).length);
      console.log('First 2 streams:', JSON.stringify((data.streams || []).slice(0, 2), null, 2));
    }
  } catch(e) {
    console.error('Error testing Mico Leao:', e.message);
  }
}

testMicoLeao();
