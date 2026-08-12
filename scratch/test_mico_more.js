async function testMoreMico() {
  const baseUrl = 'https://27a5b2bfe3c0-stremio-brazilian-addon.baby-beamup.club';
  const movies = ['tt1877830', 'tt0816692', 'tt1375666', 'tt0468569']; // Batman, Interstellar, Inception, Dark Knight
  const series = ['tt0903747:1:1', 'tt0944947:1:1']; // Breaking Bad, Game of Thrones

  console.log('--- MOVIES ---');
  for (const m of movies) {
    const res = await fetch(`${baseUrl}/stream/movie/${m}.json`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Movie ${m} streams count:`, (data.streams || []).length);
      if ((data.streams || []).length > 0) {
        console.log(' Sample title:', data.streams[0].title);
      }
    }
  }

  console.log('--- SERIES ---');
  for (const s of series) {
    const res = await fetch(`${baseUrl}/stream/series/${s}.json`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Series ${s} streams count:`, (data.streams || []).length);
      if ((data.streams || []).length > 0) {
        console.log(' Sample title:', data.streams[0].title);
      }
    }
  }
}

testMoreMico();
