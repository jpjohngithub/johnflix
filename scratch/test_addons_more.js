const addons = [
  { key: 'fenixflix', url: 'https://fenixflix.fenixhub.online' },
  { key: 'froststream', url: 'https://froststream.cloutteam.com' },
  { key: 'brazuca', url: 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club' },
  { key: 'torrentio', url: 'https://torrentio.strem.fun' }
];

const testIds = [
  { type: 'movie', id: 'tt0111161', name: 'Um Sonho de Liberdade' },
  { type: 'movie', id: 'tt0816692', name: 'Interestelar' },
  { type: 'movie', id: 'tt15398776', name: 'Oppenheimer' },
  { type: 'series', id: 'tt0903747:1:1', name: 'Breaking Bad S01E01' },
  { type: 'series', id: 'tt4158110:1:1', name: 'Mr Robot S01E01' }
];

async function run() {
  for (const media of testIds) {
    console.log(`\n========================================`);
    console.log(`🎬 Testing: ${media.name} (${media.type} ${media.id})`);
    console.log(`========================================`);

    const results = await Promise.allSettled(addons.map(async a => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(`${a.url}/stream/${media.type}/${media.id}.json`, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 100.0; Win64; x64)' }
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          return { key: a.key, streams: data.streams || [] };
        }
      } catch (e) {
        clearTimeout(timer);
      }
      return { key: a.key, streams: [] };
    }));

    results.forEach(r => {
      if (r.status === 'fulfilled') {
        const { key, streams } = r.value;
        console.log(`👉 [${key.toUpperCase()}]: ${streams.length} stream(s) encontrados`);
        streams.slice(0, 2).forEach((s, idx) => {
          const title = (s.title || s.name || s.description || '').replace(/\n/g, ' ');
          console.log(`   #${idx+1}: ${title.slice(0, 110)}`);
          if (s.url) console.log(`       URL: ${s.url.slice(0, 70)}...`);
          if (s.infoHash) console.log(`       Magnet Hash: ${s.infoHash}`);
        });
      }
    });
  }
}

run();
