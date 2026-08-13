async function testFrostFinalGateways() {
  console.log('--- Testing Final 100% Reliable Embed Gateways ---');

  const testIds = ['tt0316654', 'tt10872600', 'tt1877830'];

  for (const id of testIds) {
    console.log(`\nTesting IMDb ${id}:`);
    const urls = [
      `https://vidsrc.to/embed/movie/${id}`,
      `https://vidsrc.cc/v2/embed/movie/${id}`,
      `https://autoembed.cc/embed/movie/${id}`
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        console.log(` [${res.status}] ${url}`);
      } catch(e) {
        console.log(` [ERR] ${url}: ${e.message}`);
      }
    }
  }
}

testFrostFinalGateways();
