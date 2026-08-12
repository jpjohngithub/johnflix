async function simulateFetchStreams() {
  const cleanId = 'tt0111161';
  const realType = 'movie';
  const streamId = 'tt0111161';

  const fetchAddon = async (name, baseUrl) => {
    try {
      const url = `${baseUrl}/stream/${realType}/${streamId}.json`;
      console.log(`Fetching ${name}: ${url}`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      console.log(`  ${name} Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  ${name} Count: ${(data.streams || []).length}`);
        return data.streams || [];
      }
    } catch(e) {
      console.log(`  ${name} Error: ${e.message}`);
    }
    return [];
  };

  const results = await Promise.all([
    fetchAddon('Fenix', 'https://fenixflix.fenixhub.online'),
    fetchAddon('Frost', 'https://froststream.cloutteam.com'),
    fetchAddon('Brazuca', 'https://94c8cb9f702d-brazuca-torrents.baby-beamup.club'),
    fetchAddon('Torrentio', 'https://torrentio.strem.fun')
  ]);

  console.log('Total fetched streams across all addons:', results.flat().length);
}

simulateFetchStreams().then(() => console.log('Done'));
