async function testOpenSubFormats() {
  const urls = [
    'https://rest.opensubtitles.org/search/imdbid-0111161',
    'https://rest.opensubtitles.org/search/imdbid-0111161/sublanguageid-pob',
    'https://rest.opensubtitles.org/search/imdbid-111161',
    'https://api.opensubtitles.org/relink/search/imdbid-0111161'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'TemporaryUserAgent' }
      });
      console.log(`[${res.status}] ${u}`);
      if (res.ok) {
        const data = await res.json();
        console.log(' Count:', Array.isArray(data) ? data.length : 'not array');
        if (Array.isArray(data) && data.length > 0) {
          console.log(' First:', {
            SubLanguageID: data[0].SubLanguageID,
            LanguageName: data[0].LanguageName,
            SubDownloadLink: data[0].SubDownloadLink,
            ZipDownloadLink: data[0].ZipDownloadLink,
            SubFormat: data[0].SubFormat
          });
        }
      }
    } catch(e) {
      console.log(`[ERR] ${u}: ${e.message}`);
    }
  }
}

testOpenSubFormats();
