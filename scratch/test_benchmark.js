async function benchmarkServers(imdbId = 'tt10872600') { // Spider-Man No Way Home
  console.log('--- Starting Ultra-Fast Server Parallel Tester ---');
  const startTime = Date.now();

  const candidates = [
    { name: 'WarezCDN HD (Dublado)', url: 'https://embed.warezcdn.link/filme/tt10872600', isDub: true, type: 'embed' },
    { name: 'SuperFlix 1080P (Dublado)', url: 'https://superflixapi.dev/filme/tt10872600', isDub: true, type: 'embed' },
    { name: 'EmbedFlix VIP (Dublado)', url: 'https://embedflix.top/filme/tt10872600', isDub: true, type: 'embed' },
    { name: 'PrimeCine Ultra', url: 'https://primecine.org/embed/tt10872600', isDub: true, type: 'embed' },
    { name: 'FenixFlix MP4', url: 'https://fenixflix.fenixhub.online/stream/movie/tt10872600.json', isDub: true, type: 'json' },
    { name: 'FrostStream IPTV', url: 'https://froststream.cloutteam.com/stream/movie/tt10872600.json', isDub: true, type: 'json' }
  ];

  const testCandidate = async (candidate) => {
    const start = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch(candidate.url, { 
        method: candidate.type === 'json' ? 'GET' : 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeout);
      const latency = Date.now() - start;
      const ok = res.status >= 200 && res.status < 400;
      return {
        ...candidate,
        ok,
        status: res.status,
        latency: ok ? latency : 9999,
        score: ok ? (10000 - latency + (candidate.isDub ? 2000 : 0)) : -1
      };
    } catch(e) {
      clearTimeout(timeout);
      return { ...candidate, ok: false, latency: 9999, score: -1 };
    }
  };

  const results = await Promise.all(candidates.map(testCandidate));
  const elapsed = Date.now() - startTime;

  console.log(`Parallel Benchmark completed in ${elapsed}ms!`);
  console.log('Results:');
  results.sort((a, b) => b.score - a.score).forEach((r, idx) => {
    console.log(`${idx + 1}. ${r.name} - Status: ${r.status || 'ERR'}, Latency: ${r.latency}ms, Score: ${r.score}`);
  });

  const winner = results.find(r => r.ok);
  console.log('WINNER:', winner ? winner.name : 'None');
}

benchmarkServers();
