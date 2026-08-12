async function testSeriesSubtitles() {
  const urls = [
    'https://rest.opensubtitles.org/search/episode-1/imdbid-0903747/season-1/sublanguageid-pob',
    'https://rest.opensubtitles.org/search/episode-1/imdbid-0903747/season-1/sublanguageid-eng',
    'https://rest.opensubtitles.org/search/episode-4/imdbid-0944947/season-2/sublanguageid-pob' // Game of Thrones S2E4
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'TemporaryUserAgent' }
      });
      console.log(`[${res.status}] ${u}`);
      if (res.ok) {
        const data = await res.json();
        console.log(' Count:', data.length);
        if (data.length > 0) {
          console.log(' Sample 1:', {
            SubLanguageID: data[0].SubLanguageID,
            LanguageName: data[0].LanguageName,
            SubFileName: data[0].SubFileName,
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

testSeriesSubtitles();
