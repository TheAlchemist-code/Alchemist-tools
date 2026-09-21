const CACHE_NAME = 'mizan-v1';
const ASSETS = [
  './mizan.html',
  './mizan-manifest.json',
  './mizan-icon-192.png',
  './mizan-icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // CacheStorage delas av ALLA appar på thealchemist-code.github.io.
  // Radera endast gamla versioner av Mizan — annars töms cachen för
  // tracker.html, training.html och din andra 30 day reset.
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('mizan-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network-first: ny kod syns direkt efter push, men appen funkar offline.
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
