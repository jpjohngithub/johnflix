async function testOpenSubRest() {
  const urls = [
    'https://rest.opensubtitles.org/search/imdbid-0111161/sublanguageid-pob,por,eng',
    'https://rest.opensubtitles.org/search/imdbid-1877830/sublanguageid-pob,por,eng',
    'https://api.vidsrc.me/embed/movie?imdb=tt0111161',
    'https://vidsrc.me/sub/movie?imdb=tt0111161'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'TemporaryUserAgent v1.0'
        }
      });
      console.log(`[${res.status}] ${u}`);
      if (res.ok) {
        const text = await res.text();
        console.log(' Length:', text.length);
        try {
          const json = JSON.parse(text);
          console.log(' Count:', Array.isArray(json) ? json.length : Object.keys(json).length);
          if (Array.isArray(json) && json.length > 0) {
            console.log(' Sample item:', {
              SubFileName: json[0].SubFileName,
              SubLanguageID: json[0].SubLanguageID,
              SubDownloadLink: json[0].SubDownloadLink,
              ZipDownloadLink: json[0].ZipDownloadLink,
              SubFormat: json[0].SubFormat
            });
          }
        } catch(e) {
          console.log(' Not JSON:', text.slice(0, 100));
        }
      }
    } catch(e) {
      console.log(`[ERR] ${u}: ${e.message}`);
    }
  }
}

testOpenSubRest();
