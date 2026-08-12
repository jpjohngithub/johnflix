async function testMoreSubtitles() {
  const addons = [
    'https://opensubtitles-v3.strem.fun',
    'https://opensubtitles.strem.fun',
    'https://opensubtitles.stremio.com',
    'https://subtitles.strem.fun',
    'https://v3-cinemeta.strem.io',
    'https://cinemeta-catalogs.strem.io',
    'https://opensubtitles.stremio.app',
    'https://subscene-stremio.strem.fun'
  ];

  console.log('--- TESTING MANIFESTS ---');
  for (const base of addons) {
    try {
      const res = await fetch(`${base}/manifest.json`);
      if (res.ok) {
        const manifest = await res.json();
        console.log(`[OK] ${base} -> Name: ${manifest.name}, Resources: ${JSON.stringify(manifest.resources)}`);
      } else {
        console.log(`[${res.status}] ${base}`);
      }
    } catch(e) {
      console.log(`[ERR] ${base}: ${e.message}`);
    }
  }

  console.log('\n--- TESTING STREAM SUBTITLES FOR MOVIE tt0111161 AND SERIES tt0903747:1:1 ---');
  const testUrls = [
    'https://opensubtitles.strem.fun/subtitles/movie/tt0111161.json',
    'https://opensubtitles.stremio.com/subtitles/movie/tt0111161.json',
    'https://subtitles.strem.fun/subtitles/movie/tt0111161.json',
    'https://opensubtitles.strem.fun/subtitles/series/tt0903747:1:1.json'
  ];

  for (const url of testUrls) {
    try {
      const res = await fetch(url);
      console.log(`[${res.status}] ${url}`);
      if (res.ok) {
        const data = await res.json();
        console.log(' Count:', (data.subtitles || []).length);
        if ((data.subtitles || []).length > 0) {
          console.log(' Sample:', data.subtitles[0]);
        }
      }
    } catch(e) {
      console.log(`[ERR] ${url}: ${e.message}`);
    }
  }
}

testMoreSubtitles();
