async function testTorrentGateways() {
  const hash = 'e7edc59ebbd7fb729ab4b0c660467f616279e8a8';
  const magnet = `magnet:?xt=urn:btih:${hash}`;

  const gateways = [
    `https://webtor.io/show?magnet=${encodeURIComponent(magnet)}`,
    `https://instant.io/#${hash}`,
    `https://btor.strem.fun/${hash}/0`,
    `https://torrentio.strem.fun/stream/movie/tt0111161.json`
  ];

  for (const g of gateways) {
    try {
      const res = await fetch(g, { method: 'HEAD' });
      console.log(`[${res.status}] ${g}`);
    } catch(e) {
      console.log(`[ERR] ${g}: ${e.message}`);
    }
  }
}

testTorrentGateways();
