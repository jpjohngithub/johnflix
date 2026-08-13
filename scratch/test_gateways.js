async function testEmbedGateways() {
  console.log('--- Testing FrostStream Embed Gateways ---');

  const testMovies = ['tt10872600', 'tt1877830', 'tt1630029', 'tt0111161'];
  const gateways = [
    { name: 'SuperFlix.net', build: id => `https://superflixapi.net/filme/${id}` },
    { name: 'WarezCDN.link', build: id => `https://embed.warezcdn.link/filme/${id}` },
    { name: 'EmbedFlix.top', build: id => `https://embedflix.top/filme/${id}` },
    { name: 'FlixAPI.org', build: id => `https://flixapi.org/embed/movie/${id}` },
    { name: 'AutoEmbed.cc', build: id => `https://autoembed.cc/embed/movie/${id}` },
    { name: 'VidSrc.pro', build: id => `https://vidsrc.pro/embed/movie/${id}` },
    { name: 'VidSrc.to', build: id => `https://vidsrc.to/embed/movie/${id}` }
  ];

  for (const id of testMovies) {
    console.log(`\nTesting IMDb: ${id}`);
    for (const gw of gateways) {
      const url = gw.build(id);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        console.log(` [${res.status}] ${gw.name} -> ${url}`);
      } catch(e) {
        console.log(` [ERR] ${gw.name} -> ${e.message}`);
      }
    }
  }
}

testEmbedGateways();
