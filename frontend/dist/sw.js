const CACHE_NAME = 'zorvex-v2';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];
const API_PATHS = ['/api/', '/socket.io/'];

const shouldBypassCache = (requestUrl) => API_PATHS.some((path) => requestUrl.pathname.startsWith(path));

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const requestUrl = new URL(e.request.url);

  if (shouldBypassCache(requestUrl)) {
    e.respondWith(fetch(e.request));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
      if (res.status === 200) {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, resClone));
      }
      return res;
    }).catch(() => caches.match('/index.html')))
  );
});
