const SubtitlesTest = {
  activeCues: [],
  currentLang: 'pob',
  syncOffset: 0,

  parseVttCues(vttText) {
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

    const isSpamLine = (txt) => {
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
        if (!isSpamLine(line)) {
          currentCue.text += (currentCue.text ? '\n' : '') + line;
        }
      } else if (currentCue && line === '') {
        if (currentCue.text.trim()) cues.push(currentCue);
        currentCue = null;
      }
    }
    if (currentCue && currentCue.text.trim()) cues.push(currentCue);
    return cues;
  },

  getCueForTime(currentTime) {
    if (this.currentLang === 'off' || !this.activeCues || this.activeCues.length === 0) return null;
    const adjustedTime = currentTime + (this.syncOffset || 0);
    return this.activeCues.find(c => adjustedTime >= c.start && adjustedTime <= c.end) || null;
  }
};

const vttSample = `WEBVTT

1
00:00:05.000 --> 00:00:08.000
Olá, bem-vindo ao filme!

2
00:00:10.500 --> 00:00:15.200
Esta é a segunda frase da legenda.
`;

SubtitlesTest.activeCues = SubtitlesTest.parseVttCues(vttSample);

console.log('Testing time seek 6.0s (Cue 1):', SubtitlesTest.getCueForTime(6.0)?.text);
console.log('Testing time seek 9.0s (No cue):', SubtitlesTest.getCueForTime(9.0));
console.log('Testing time seek 12.0s (Cue 2):', SubtitlesTest.getCueForTime(12.0)?.text);

// Test seek offset +2s
SubtitlesTest.syncOffset = 2.0;
console.log('Testing time 3.5s with +2s offset (should hit Cue 1 at 5.5s):', SubtitlesTest.getCueForTime(3.5)?.text);
