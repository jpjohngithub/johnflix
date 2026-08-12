const proxies = [
  url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  url => `https://thingproxy.freeboard.io/fetch/${url}`,
  url => `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`
];

const targetUrl = 'https://froststream.cloutteam.com/stream/movie/tt0111161.json';

async function testProxies() {
  console.log('Testing proxy access to FrostStream...');
  for (let i = 0; i < proxies.length; i++) {
    const pUrl = proxies[i](targetUrl);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(pUrl, { signal: controller.signal });
      clearTimeout(timer);
      console.log(`Proxy #${i+1} (${pUrl.slice(0, 45)}...): Status ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`   Sample: ${text.slice(0, 100)}`);
      }
    } catch(e) {
      console.log(`Proxy #${i+1} Error: ${e.message}`);
    }
  }
}

testProxies();
