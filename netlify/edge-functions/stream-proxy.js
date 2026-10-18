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

  const rangeHeader = request.headers.get('range') || 'bytes=0-';

  try {
    let currentUrl = targetUrl;
    let upstreamRes = null;

    // Follow up to 5 redirects manually to preserve Range & Stremio User-Agent headers across HTTP/HTTPS hops
    for (let i = 0; i < 5; i++) {
      const fetchHeaders = new Headers({
        'User-Agent': 'Stremio/4.4.168 (Lavf/58.76.100)',
        'Accept': '*/*'
      });
      if (rangeHeader) {
        fetchHeaders.set('Range', rangeHeader);
      }

      upstreamRes = await fetch(currentUrl, {
        method: request.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: fetchHeaders,
        redirect: 'manual'
      });

      if ([301, 302, 303, 307, 308].includes(upstreamRes.status)) {
        const loc = upstreamRes.headers.get('location');
        if (loc) {
          currentUrl = new URL(loc, currentUrl).toString();
          continue;
        }
      }
      break;
    }

    if (!upstreamRes) {
      return new Response('Upstream unreachable', { status: 502 });
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
      resHeaders.set('content-type', 'video/mp4');
    }
    if (!resHeaders.has('accept-ranges')) {
      resHeaders.set('accept-ranges', 'bytes');
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
