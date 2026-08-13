async function testIframeGateways() {
  console.log('--- Testing Iframe Web Embed Gateways ---');

  const testMovies = ['tt0316654', 'tt10872600', 'tt1877830'];
  const gateways = [
    { name: 'VidSrc.to', build: id => `https://vidsrc.to/embed/movie/${id}` },
    { name: 'VidSrc.cc', build: id => `https://vidsrc.cc/v2/embed/movie/${id}` },
    { name: 'AutoEmbed.cc', build: id => `https://autoembed.cc/embed/movie/${id}` },
    { name: 'VidSrc.me', build: id => `https://vidsrc.me/embed/movie?imdb=${id}` },
    { name: 'VidSrc.xyz', build: id => `https://vidsrc.xyz/embed/movie?imdb=${id}` },
    { name: 'Embed.su', build: id => `https://embed.su/embed/movie/${id}` },
    { name: 'SmashyStream', build: id => `https://player.smashy.stream/movie/${id}` },
    { name: 'MultiEmbed', build: id => `https://multiembed.mov/directstream.php?video_id=${id}` }
  ];

  for (const id of testMovies) {
    console.log(`\nTesting IMDb: ${id}`);
    for (const gw of gateways) {
      const url = gw.build(id);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { 
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        clearTimeout(timer);
        const xframe = res.headers.get('x-frame-options');
        console.log(` [${res.status}] ${gw.name} (X-Frame: ${xframe || 'None'}) -> ${url}`);
      } catch(e) {
        console.log(` [ERR] ${gw.name} -> ${e.message}`);
      }
    }
  }
}

testIframeGateways();
