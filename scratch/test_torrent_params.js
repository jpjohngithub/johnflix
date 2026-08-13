async function testTorrentEmbedParams() {
  const hash = 'e7edc59ebbd7fb729ab4b0c660467f616279e8a8';
  const magnet = `magnet:?xt=urn:btih:${hash}&dn=Homem-Aranha`;

  const options = [
    `https://webtor.io/show?magnet=${encodeURIComponent(magnet)}&autoplay=true`,
    `https://webtor.io/show?magnet=${encodeURIComponent(magnet)}&embed=true`,
    `https://instant.io/#${hash}`,
    `https://btor.strem.fun/${hash}/0`,
    `https://stremio-torrent-proxy.baby-beamup.club/stream/${hash}`
  ];

  for (const opt of options) {
    try {
      const res = await fetch(opt, { method: 'HEAD' });
      console.log(`[${res.status}] ${opt}`);
    } catch(e) {
      console.log(`[ERR] ${opt}: ${e.message}`);
    }
  }
}

testTorrentEmbedParams();
