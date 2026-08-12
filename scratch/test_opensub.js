async function testOpenSubEndpoints() {
  const urls = [
    'https://opensubtitles.stremio.app/subtitles/movie/tt0111161.json',
    'https://opensubtitles-v3.stremio.app/subtitles/movie/tt0111161.json',
    'https://stremio-opensubtitles-v3.strem.fun/subtitles/movie/tt0111161.json',
    'https://opensubtitles.strem.club/subtitles/movie/tt0111161.json',
    'https://subtitles.stremio.cloud/subtitles/movie/tt0111161.json',
    'https://opensubtitles.strem.io/subtitles/movie/tt0111161.json',
    'https://api.opensubtitles.com/api/v1/subtitles?imdb_id=0111161'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'JohnFlix/1.0.0',
          'Api-Key': 'Consumer-API-Key'
        }
      });
      console.log(`[${res.status}] ${u}`);
      if (res.ok) {
        const text = await res.text();
        console.log(' Length:', text.length, 'Snippet:', text.slice(0, 150));
      }
    } catch(e) {
      console.log(`[ERR] ${u}: ${e.message}`);
    }
  }
}

testOpenSubEndpoints();
