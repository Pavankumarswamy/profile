const CACHE = 'img-cache-v1';

const CACHEABLE = [
  'play-lh.googleusercontent.com',
  'res.cloudinary.com',
];

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!CACHEABLE.some(host => url.hostname.includes(host))) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      // Store both ok and opaque (cross-origin) responses
      if (response.status === 200 || response.type === 'opaque') {
        cache.put(request, response.clone());
      }
      return response;
    })
  );
});
