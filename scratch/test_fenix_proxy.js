async function testFenix() {
  const directUrl = 'https://fenixflix.fenixhub.online/stream/movie/tt0111161.json';
  
  const testProxy = async (name, url) => {
    try {
      const res = await fetch(url);
      console.log(`[${name}] Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`[${name}] Count: ${(data.streams || []).length}`);
      }
    } catch(e) {
      console.log(`[${name}] Error: ${e.message}`);
    }
  };

  await testProxy('AllOrigins Raw', `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`);
  await testProxy('Codetabs', `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(directUrl)}`);
  await testProxy('Corsproxy.org', `https://corsproxy.org/?${encodeURIComponent(directUrl)}`);
}

testFenix();
