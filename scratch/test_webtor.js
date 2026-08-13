async function testWebtorEmbed() {
  console.log('--- Testing Webtor Direct Player Embed Formats ---');

  const testMagnet = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel';

  const formats = [
    `https://webtor.io/embed?magnet=${encodeURIComponent(testMagnet)}`,
    `https://webtor.io/embed?magnet=${encodeURIComponent(testMagnet)}&autostream=1`,
    `https://webtor.io/show?magnet=${encodeURIComponent(testMagnet)}`,
    `https://webtor.io/v1/embed?magnet=${encodeURIComponent(testMagnet)}`
  ];

  for (const url of formats) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`[${res.status}] ${url.slice(0, 70)}...`);
    } catch(e) {
      console.log(`[ERR] ${url.slice(0, 70)}...: ${e.message}`);
    }
  }
}

testWebtorEmbed();
