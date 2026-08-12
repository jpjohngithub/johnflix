async function testTorrentProxy() {
  const infoHash = 'e7edc59ebbd7fb729ab4b0c660467f616279e8a8'; // Shawshank Redemption from Mico-Leao
  const title = 'Shawshank Redemption';

  const gateways = [
    `https://stremio-torrent-proxy.vercel.app/stream/${infoHash}`,
    `https://torrent.fail/stream/${infoHash}`,
    `https://torrentio.strem.fun/stream/movie/tt0111161.json`,
    `https://videoproxy.stremio.workers.dev/${infoHash}`
  ];

  for (const g of gateways) {
    try {
      console.log('Testing gateway:', g);
      const res = await fetch(g, { method: 'HEAD' }).catch(() => null);
      if (res) console.log('  Status:', res.status);
    } catch(e) {
      console.log('  Error:', e.message);
    }
  }
}

testTorrentProxy();
