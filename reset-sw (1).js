const CACHE_NAME = 'reset30-v6';
const ASSETS = [
  './reset.html',
  './reset-manifest.json',
  './reset-icon-192.png',
  './reset-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // CacheStorage delas av alla appar på thealchemist-code.github.io.
  // Radera ENDAST gamla versioner av den här appen — annars tömmer varje
  // aktivering cachen för tracker.html och training.html.
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('reset30-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network-first: du hämtar ny kod direkt efter en deploy, men appen
  // fungerar ändå offline när nätet saknas.
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});
