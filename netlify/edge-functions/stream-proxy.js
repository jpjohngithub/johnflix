const redirectCache = new Map();
const ALLOWED_HDR_RE = /^(referer|origin|user-agent|accept|cookie|authorization|x-mb-token|x-requested-with)$/i;

function decodeProxyHeaders(hdrParam) {
  if (!hdrParam) return {};
  try {
    const parsed = JSON.parse(atob(hdrParam));
    if (!parsed || typeof parsed !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'string' && ALLOWED_HDR_RE.test(k.trim())) {
        const cleanVal = v.replace(/[\r\n]+/g, ' ').trim();
        if (cleanVal && cleanVal.length <= 2048) out[k.trim()] = cleanVal;
      }
    }
    return out;
  } catch (e) {
    return {};
  }
}

export default async (request, context) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges'
      }
    });
  }

  const url = new URL(request.url);
  let targetUrl = url.searchParams.get('url');
  const hdrParam = url.searchParams.get('hdr') || '';
  const extraHeaders = decodeProxyHeaders(hdrParam);
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // Upgrade fenixflix http to https to avoid extra redirect hop
  if (targetUrl.startsWith('http://fenixflix.fenixhub.online/')) {
    targetUrl = targetUrl.replace('http://', 'https://');
  }

  const clientRange = request.headers.get('range');
  const rangeHeader = clientRange || (request.method === 'HEAD' ? 'bytes=0-1' : 'bytes=0-');

  try {
    const cached = redirectCache.get(targetUrl);
    let currentUrl = (cached && cached.expires > Date.now()) ? cached.finalUrl : targetUrl;
    let upstreamRes = null;

    // Follow up to 6 redirects manually using GET, then cache the final storage URL
    for (let i = 0; i < 6; i++) {
      const isArchive = currentUrl.includes('archive.org');
      const isHakuna = /hakunaymatata\.com|mzfi\.me|stravo\.site/i.test(currentUrl);
      const fetchHeaders = new Headers({
        'User-Agent': (isArchive || isHakuna)
          ? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
          : 'Stremio/4.4.168 (Lavf/58.76.100)',
        'Accept': '*/*'
      });
      if (isHakuna) {
        fetchHeaders.set('Referer', 'https://mzfi.me/');
        fetchHeaders.set('Origin', 'https://mzfi.me');
      } else if (/zunderflix\.lat|fenixflix\.fenixhub\.online/i.test(currentUrl)) {
        fetchHeaders.set('Referer', 'https://zunderflix.lat/');
      } else if (/tiktokcdn\.live|dadinhodetapioca/i.test(currentUrl)) {
        fetchHeaders.set('Referer', 'https://dadinhodetapioca.fun/play/discoverychannel.html');
      }
      for (const [k, v] of Object.entries(extraHeaders)) {
        fetchHeaders.set(k, v);
      }
      if (rangeHeader) {
        fetchHeaders.set('Range', rangeHeader);
      }

      const abortCtrl = new AbortController();
      const abortTimer = setTimeout(() => abortCtrl.abort(), 5500);
      try {
        upstreamRes = await fetch(currentUrl, {
          method: 'GET',
          headers: fetchHeaders,
          redirect: 'manual',
          signal: abortCtrl.signal
        });
      } finally {
        clearTimeout(abortTimer);
      }

      if ([301, 302, 303, 307, 308].includes(upstreamRes.status)) {
        const loc = upstreamRes.headers.get('location');
        try { await upstreamRes.body?.cancel(); } catch {}
        if (loc) {
          currentUrl = new URL(loc, currentUrl).toString();
          continue;
        }
      }
      break;
    }

    if (currentUrl !== targetUrl && upstreamRes && upstreamRes.status >= 200 && upstreamRes.status < 300) {
      redirectCache.set(targetUrl, { finalUrl: currentUrl, expires: Date.now() + 15 * 60 * 1000 });
    }

    if (!upstreamRes) {
      return new Response('Upstream unreachable', { status: 502 });
    }

    const upstreamType = (upstreamRes.headers.get('content-type') || '').toLowerCase();
    if (upstreamType.includes('mpegurl') || /\.m3u8(?:$|[?#])/i.test(currentUrl)) {
      try { await upstreamRes.body?.cancel(); } catch {}
      const hlsTarget = `/api/hls-proxy?url=${encodeURIComponent(currentUrl)}${hdrParam ? `&hdr=${encodeURIComponent(hdrParam)}` : ''}`;
      return new Response(null, {
        status: 302,
        headers: { 'Location': hlsTarget, 'Access-Control-Allow-Origin': '*' }
      });
    }
    if (upstreamType.includes('text/html')) {
      try { await upstreamRes.body?.cancel(); } catch {}
      return new Response('Esta fonte respondeu com uma página de bloqueio, não com vídeo.', {
        status: 451,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'X-JohnFlix-Source-Error',
          'X-JohnFlix-Source-Error': 'upstream-policy'
        }
      });
    }

    const resHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges'
    });

    const passthrough = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified'];
    for (const h of passthrough) {
      const val = upstreamRes.headers.get(h);
      if (val) resHeaders.set(h, val);
    }

    const ct = (resHeaders.get('content-type') || '').toLowerCase();
    if (!ct || ct.includes('text/plain') || ct.includes('octet-stream')) {
      const pathname = new URL(currentUrl).pathname.toLowerCase();
      const ext = pathname.match(/\.(mp4|m4v|webm|mkv|ts|mp3|aac|m4a)$/)?.[1];
      const mime = ({ mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mkv: 'video/x-matroska', ts: 'video/mp2t', mp3: 'audio/mpeg', aac: 'audio/aac', m4a: 'audio/mp4' })[ext];
      if (mime) resHeaders.set('content-type', mime);
    }
    if (!resHeaders.has('accept-ranges')) {
      resHeaders.set('accept-ranges', 'bytes');
    }

    if (request.method === 'HEAD') {
      try { await upstreamRes.body?.cancel(); } catch {}
      return new Response(null, {
        status: clientRange ? upstreamRes.status : 200,
        headers: resHeaders
      });
    }

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: resHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
};
