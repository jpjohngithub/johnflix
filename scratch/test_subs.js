async function testSubtitles() {
  const endpoints = [
    'https://opensubtitles-v3.strem.fun/subtitles/movie/tt0111161.json',
    'https://v3-cinemeta.strem.io/subtitles/movie/tt0111161.json',
    'https://subtitles.strem.fun/subtitles/movie/tt0111161.json'
  ];

  for (const ep of endpoints) {
    try {
      console.log('Fetching:', ep);
      const res = await fetch(ep);
      console.log(' Status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log(' Subtitles count:', (data.subtitles || []).length);
        if ((data.subtitles || []).length > 0) {
          console.log(' Sample subtitle:', JSON.stringify(data.subtitles.slice(0, 3), null, 2));
        }
      }
    } catch(e) {
      console.log(' Error:', e.message);
    }
  }
}

testSubtitles();
