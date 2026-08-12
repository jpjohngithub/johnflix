async function testOpenSubUserAgents() {
  const userAgents = [
    'VLC/3.0.18',
    'Stremio',
    'OpenSubtitlesPlayer v4.7',
    'popcorn-time',
    'mpv 0.35.0'
  ];

  const url = 'https://rest.opensubtitles.org/search/imdbid-0111161/sublanguageid-pob,por,eng';

  for (const ua of userAgents) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': ua }
      });
      console.log(`[${res.status}] UA: "${ua}"`);
      if (res.ok) {
        const data = await res.json();
        console.log('  Count:', data.length);
        if (data.length > 0) {
          console.log('  Sample 1:', {
            Lang: data[0].SubLanguageID,
            LanguageName: data[0].LanguageName,
            SubFileName: data[0].SubFileName,
            SubDownloadLink: data[0].SubDownloadLink,
            ZipDownloadLink: data[0].ZipDownloadLink,
            SubFormat: data[0].SubFormat
          });
          console.log('  Sample PT-BR:', data.find(d => d.SubLanguageID === 'pob' || d.SubLanguageID === 'pb' || d.SubLanguageID === 'por')?.SubDownloadLink);
        }
      }
    } catch(e) {
      console.log(`[ERR] UA "${ua}": ${e.message}`);
    }
  }
}

testOpenSubUserAgents();
