const zlib = require('zlib');

async function testSubRanking() {
  const imdbId = 'tt0111161'; // Shawshank
  const cleanId = imdbId.replace('tt', '').padStart(7, '0');
  const url = `https://rest.opensubtitles.org/search/imdbid-${cleanId}/sublanguageid-pob`;

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
    if (res.ok) {
      const data = await res.json();
      console.log('Total PT-BR subtitles found:', data.length);
      
      // Filter out low quality and sort by SubDownloadsCnt
      const sorted = data.sort((a, b) => (parseInt(b.SubDownloadsCnt) || 0) - (parseInt(a.SubDownloadsCnt) || 0));

      console.log('\nTop 5 PT-BR Subtitles by Downloads:');
      sorted.slice(0, 5).forEach((s, idx) => {
        console.log(`[#${idx+1}] File: ${s.SubFileName} | Downloads: ${s.SubDownloadsCnt} | Rating: ${s.SubRating} | Format: ${s.SubFormat}`);
      });

      // Test downloading top 3 to inspect first 5 cues
      for (let i = 0; i < Math.min(3, sorted.length); i++) {
        const sub = sorted[i];
        console.log(`\n--- Inspecting Sub #${i+1}: ${sub.SubFileName} ---`);
        const dlRes = await fetch(sub.SubDownloadLink, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
        if (dlRes.ok) {
          const buf = Buffer.from(await dlRes.arrayBuffer());
          const srt = zlib.gunzipSync(buf).toString('utf8');
          const cues = parseCues(srt);
          console.log('Clean Cues Count:', cues.length);
          console.log('First 3 Cues:');
          cues.slice(0, 3).forEach(c => console.log(`  ${c.start}s -> ${c.end}s: "${c.text.replace(/\n/g, ' ')}"`));
        }
      }
    }
  } catch(e) {
    console.error('Error:', e.message);
  }
}

function parseCues(srt) {
  const lines = srt.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const cues = [];
  let current = null;

  const timeToSec = (t) => {
    const p = t.trim().split(':');
    if (p.length === 3) {
      const s = p[2].split(',');
      return parseInt(p[0]) * 3600 + parseInt(p[1]) * 60 + parseInt(s[0]) + (parseInt(s[1]||'0')/1000);
    }
    return 0;
  };

  for (let l of lines) {
    l = l.trim();
    if (l.includes('-->')) {
      const [st, en] = l.split('-->');
      current = { start: timeToSec(st), end: timeToSec(en), text: '' };
    } else if (current && l !== '' && isNaN(l)) {
      // Filter out spam
      if (l.toLowerCase().includes('opensubtitles') || l.toLowerCase().includes('legendas por') || l.toLowerCase().includes('tryray.app')) continue;
      current.text += (current.text ? '\n' : '') + l;
    } else if (current && l === '') {
      if (current.text.trim()) cues.push(current);
      current = null;
    }
  }
  if (current && current.text.trim()) cues.push(current);
  return cues;
}

testSubRanking();
