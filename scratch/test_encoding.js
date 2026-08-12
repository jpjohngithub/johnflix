const zlib = require('zlib');

async function testEncoding() {
  const url = 'https://dl.opensubtitles.org/en/download/src-api/vrf-197e0c46/filead/1952206103.gz';
  const res = await fetch(url, { headers: { 'User-Agent': 'TemporaryUserAgent' } });
  const buf = Buffer.from(await res.arrayBuffer());
  const decompressedBuffer = zlib.gunzipSync(buf);

  // Try utf-8
  const utf8Text = new TextDecoder('utf-8').decode(decompressedBuffer);
  console.log('UTF-8 snippet with special chars:', utf8Text.slice(utf8Text.indexOf('difficil') - 50, utf8Text.indexOf('difficil') + 50));

  // Try iso-8859-1 / latin1
  const latin1Text = new TextDecoder('iso-8859-1').decode(decompressedBuffer);
  console.log('\nISO-8859-1 snippet with special chars:', latin1Text.slice(latin1Text.indexOf('dif') - 20, latin1Text.indexOf('dif') + 60));
}

testEncoding();
