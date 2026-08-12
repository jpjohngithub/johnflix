async function testSubAPIs() {
  const tests = [
    'https://opensubtitles-v3.strem.fun/subtitles/movie/tt0111161.json',
    'https://v3-cinemeta.strem.io/subtitles/movie/tt0111161.json',
    'https://subtitles.stremio.com/subtitles/movie/tt0111161.json',
    'https://subdl.strem.fun/subtitles/movie/tt0111161.json',
    'https://community-subtitles.strem.fun/subtitles/movie/tt0111161.json'
  ];

  for (const url of tests) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      console.log(`[${res.status}] ${url}`);
      if (res.ok) {
        const data = await res.json();
        console.log('  Found subtitles:', (data.subtitles || []).length);
        if ((data.subtitles || []).length > 0) {
          console.log('  Sample:', data.subtitles[0]);
        }
      }
    } catch(e) {
      console.log(`[ERR] ${url}: ${e.message}`);
    }
  }
}

testSubAPIs();
