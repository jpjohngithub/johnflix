async function testAnimeAndDorama() {
  console.log('--- Testing Anime & Dorama Catalog Fetch ---');

  // Test Anime Search / Animation Catalog
  const animeQueries = ['naruto', 'attack on titan', 'one piece', 'demon slayer', 'jujutsu kaisen', 'solo leveling'];
  const animeResults = [];

  for (const q of animeQueries) {
    try {
      const res = await fetch(`https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(q)}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data.metas && data.metas.length > 0) {
          animeResults.push(...data.metas);
        }
      }
    } catch(e) {}
  }

  // Deduplicate
  const uniqueAnime = animeResults.filter((item, idx, self) => self.findIndex(t => t.id === item.id) === idx);
  console.log(`Found ${uniqueAnime.length} Anime series!`);
  uniqueAnime.slice(0, 5).forEach(a => console.log(`- ${a.name} (${a.year})`));

  // Test Dorama Search
  const doramaQueries = ['squid game', 'all of us are dead', 'crash landing on you', 'the glory', 'vincenzo', 'sweet home', 'kingdom'];
  const doramaResults = [];

  for (const q of doramaQueries) {
    try {
      const res = await fetch(`https://v3-cinemeta.strem.io/catalog/series/top/search=${encodeURIComponent(q)}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data.metas && data.metas.length > 0) {
          doramaResults.push(...data.metas);
        }
      }
    } catch(e) {}
  }

  const uniqueDorama = doramaResults.filter((item, idx, self) => self.findIndex(t => t.id === item.id) === idx);
  console.log(`\nFound ${uniqueDorama.length} Doramas / K-Dramas!`);
  uniqueDorama.slice(0, 5).forEach(d => console.log(`- ${d.name} (${d.year})`));
}

testAnimeAndDorama();
