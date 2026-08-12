const zlib = require('zlib');

function filterAndSortSubtitles(data, movieName, movieYear) {
  const cleanTitle = (movieName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return (data || [])
    .filter(s => {
      // Must have download link & format srt/vtt
      if (!s.SubDownloadLink || (s.SubFormat !== 'srt' && s.SubFormat !== 'vtt')) return false;

      // Match movie title or file name
      const subName = ((s.MovieName || '') + ' ' + (s.SubFileName || '')).toLowerCase().replace(/[^a-z0-9]/g, '');
      const yearMatch = !movieYear || !s.MovieYear || s.MovieYear == movieYear;

      return (subName.includes(cleanTitle) || cleanTitle.includes(subName.slice(0, 8))) && yearMatch;
    })
    .sort((a, b) => (parseInt(b.SubDownloadsCnt) || 0) - (parseInt(a.SubDownloadsCnt) || 0));
}

function cleanCues(vttText) {
  const lines = vttText.split('\n');
  const cues = [];
  let currentCue = null;

  const timeToSeconds = (tStr) => {
    const parts = (tStr || '').trim().split(':');
    if (parts.length === 3) {
      const secsParts = parts[2].split('.');
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(secsParts[0]) + (parseInt(secsParts[1] || '0') / 1000);
    }
    return 0;
  };

  const isSpam = (txt) => {
    const l = txt.toLowerCase();
    return l.includes('opensubtitles') || l.includes('getray.app') || l.includes('tryray.app') 
        || l.includes('osdb.link') || l.includes('legendas por') || l.includes('ansado de procurar')
        || l.includes('watch online movies');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('-->')) {
      const [start, end] = line.split('-->');
      currentCue = {
        start: timeToSeconds(start),
        end: timeToSeconds(end),
        text: ''
      };
    } else if (currentCue && line !== '' && !line.startsWith('WEBVTT') && isNaN(line)) {
      if (!isSpam(line)) {
        currentCue.text += (currentCue.text ? '\n' : '') + line;
      }
    } else if (currentCue && line === '') {
      if (currentCue.text.trim()) cues.push(currentCue);
      currentCue = null;
    }
  }
  if (currentCue && currentCue.text.trim()) cues.push(currentCue);
  return cues;
}

async function testCleanSub() {
  const res = await fetch('https://rest.opensubtitles.org/search/imdbid-0111161/sublanguageid-pob', {
    headers: { 'User-Agent': 'TemporaryUserAgent' }
  });
  const data = await res.json();

  const filtered = filterAndSortSubtitles(data, 'The Shawshank Redemption', '1994');
  console.log('Filtered clean subtitles count:', filtered.length);
  filtered.slice(0, 3).forEach((f, idx) => console.log(`Option ${idx+1}:`, f.SubFileName, 'Downloads:', f.SubDownloadsCnt));

  const dlRes = await fetch(filtered[0].SubDownloadLink, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
  const buf = Buffer.from(await dlRes.arrayBuffer());
  const srt = zlib.gunzipSync(buf).toString('utf8');
  const vtt = 'WEBVTT\n\n' + srt.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
  const cues = cleanCues(vtt);

  console.log('\n--- FIRST 5 PURGED CUES ---');
  cues.slice(0, 5).forEach(c => console.log(`  [${c.start}s - ${c.end}s] ${c.text}`));
}

testCleanSub();
