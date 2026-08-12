async function testWyzie() {
  const urls = [
    'https://subtitles.wyzie.ru/subtitles/movie/tt0111161.json',
    'https://wyzie.ru/subtitles/movie/tt0111161.json',
    'https://opensubtitles.elfhosted.com/subtitles/movie/tt0111161.json',
    'https://subdl.elfhosted.com/subtitles/movie/tt0111161.json',
    'https://submaker.elfhosted.com/subtitles/movie/tt0111161.json'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u);
      console.log(`[${res.status}] ${u}`);
      if (res.ok) {
        const data = await res.json();
        console.log(' Count:', (data.subtitles || []).length);
        if ((data.subtitles || []).length > 0) {
          console.log(' Sample:', data.subtitles[0]);
        }
      }
    } catch(e) {
      console.log(`[ERR] ${u}: ${e.message}`);
    }
  }
}

testWyzie();
