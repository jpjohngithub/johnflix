async function testFrostStreamGateways() {
  console.log('--- Testing FrostStream Alternative Stream Players ---');
  const cleanId = 'tt0316654';

  const gateways = [
    { name: 'VidSrc.cc', url: `https://vidsrc.cc/v2/embed/movie/${cleanId}` },
    { name: 'VidSrc.in', url: `https://vidsrc.in/embed/movie/${cleanId}` },
    { name: 'VidSrc.me Direct', url: `https://vidsrc.me/embed/movie?imdb=${cleanId}&autoplay=1` },
    { name: '2Embed.skin', url: `https://2embed.skin/embed/movie/${cleanId}` },
    { name: 'MultiEmbed', url: `https://multiembed.mov/directstream.php?video_id=${cleanId}` },
    { name: 'AutoEmbed.co', url: `https://autoembed.co/movie/imdb/${cleanId}` }
  ];

  for (const g of gateways) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(g.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      clearTimeout(timer);
      const xframe = res.headers.get('x-frame-options');
      console.log(` [${res.status}] ${g.name} (X-Frame: ${xframe || 'None'}) -> ${g.url}`);
    } catch(e) {
      console.log(` [ERR] ${g.name} -> ${e.message}`);
    }
  }
}

testFrostStreamGateways();
