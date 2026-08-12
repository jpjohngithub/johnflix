const zlib = require('zlib');

async function testDownloadSub() {
  const downloadUrl = 'https://dl.opensubtitles.org/en/download/src-api/vrf-19d30c5a/filead/1953599017.gz';
  
  try {
    console.log('Downloading sub from:', downloadUrl);
    const res = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'TemporaryUserAgent'
      }
    });
    console.log('Download status:', res.status);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      console.log('Downloaded buffer size:', buffer.length, 'bytes');
      
      // Gunzip
      const decompressed = zlib.gunzipSync(buffer).toString('utf8');
      console.log('Decompressed SRT text length:', decompressed.length);
      console.log('--- FIRST 200 CHARACTERS ---');
      console.log(decompressed.slice(0, 200));

      // Test converting SRT to WebVTT format
      const vttText = srtToVtt(decompressed);
      console.log('--- CONVERTED WEBVTT FIRST 200 CHARACTERS ---');
      console.log(vttText.slice(0, 200));
    }
  } catch(e) {
    console.error('Error downloading sub:', e.message);
  }
}

function srtToVtt(srt) {
  return 'WEBVTT\n\n' + srt
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2');
}

testDownloadSub();
