async function testPlayersList() {
  console.log('--- Testing Alternative Stream Players ---');

  const testIds = ['tt0316654', 'tt10872600', 'tt1877830', 'tt1630029'];
  const players = [
    { name: 'VidSrc.me', build: id => `https://vidsrc.me/embed/movie?imdb=${id}` },
    { name: 'VidSrc.xyz', build: id => `https://vidsrc.xyz/embed/movie?imdb=${id}` },
    { name: 'VidSrc.pm', build: id => `https://vidsrc.pm/embed/movie/${id}` },
    { name: 'VidSrc.in', build: id => `https://vidsrc.in/embed/movie/${id}` },
    { name: 'VidSrc.net', build: id => `https://vidsrc.net/embed/movie/${id}` },
    { name: '2Embed.org', build: id => `https://2embed.org/embed/movie/${id}` },
    { name: '2Embed.skin', build: id => `https://2embed.skin/embed/movie/${id}` },
    { name: 'Embed.su', build: id => `https://embed.su/embed/movie/${id}` },
    { name: 'SmashyStream', build: id => `https://player.smashy.stream/movie/${id}` },
    { name: 'BlackVid', build: id => `https://blackvid.space/embed?imdb=${id}` }
  ];

  for (const id of testIds) {
    console.log(`\nTesting IMDb: ${id}`);
    for (const p of players) {
      const url = p.build(id);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { 
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        clearTimeout(timer);
        const xframe = res.headers.get('x-frame-options');
        console.log(` [${res.status}] ${p.name} (X-Frame: ${xframe || 'None'}) -> ${url}`);
      } catch(e) {
        console.log(` [ERR] ${p.name} -> ${e.message}`);
      }
    }
  }
}

testPlayersList();
