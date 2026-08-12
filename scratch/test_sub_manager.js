const zlib = require('zlib');

const Subtitles = {
  async fetchList(imdbId, type, season = 1, episode = 1, lang = 'pob') {
    const cleanId = (imdbId || '').replace('tt', '').padStart(7, '0');
    let url = `https://rest.opensubtitles.org/search/imdbid-${cleanId}/sublanguageid-${lang}`;
    if (type === 'series') {
      url = `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanId}/season-${season}/sublanguageid-${lang}`;
    }

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      }
    } catch(e) {}
    return [];
  },

  srtToVtt(srtText) {
    return 'WEBVTT\n\n' + srtText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
  },

  parseVttCues(vttText) {
    const lines = vttText.split('\n');
    const cues = [];
    let currentCue = null;

    const timeToSeconds = (tStr) => {
      const parts = tStr.trim().split(':');
      if (parts.length === 3) {
        const secsParts = parts[2].split('.');
        return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(secsParts[0]) + (parseInt(secsParts[1] || '0') / 1000);
      }
      return 0;
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
        currentCue.text += (currentCue.text ? '\n' : '') + line;
      } else if (currentCue && line === '') {
        cues.push(currentCue);
        currentCue = null;
      }
    }
    if (currentCue) cues.push(currentCue);
    return cues;
  }
};

async function testFullFlow() {
  console.log('Fetching movie subs...');
  const movieSubs = await Subtitles.fetchList('tt0111161', 'movie', 1, 1, 'pob');
  console.log('Movie subs found:', movieSubs.length);

  if (movieSubs.length > 0) {
    const chosen = movieSubs[0];
    console.log('Chosen sub:', chosen.SubFileName, 'URL:', chosen.SubDownloadLink);
    const dlRes = await fetch(chosen.SubDownloadLink, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
    if (dlRes.ok) {
      const buf = Buffer.from(await dlRes.arrayBuffer());
      const srt = zlib.gunzipSync(buf).toString('utf8');
      const vtt = Subtitles.srtToVtt(srt);
      const cues = Subtitles.parseVttCues(vtt);
      console.log('Cues parsed successfully! Total cues:', cues.length);
      console.log('Cue 1 (start 2.82s):', cues[0]);
    }
  }
}

testFullFlow();
