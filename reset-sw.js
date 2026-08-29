const CACHE_NAME = 'reset30-v3';
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
  // CacheStorage is shared by every app on thealchemist-code.github.io.
  // Only delete OLD VERSIONS OF THIS APP — deleting every cache that is not
  // ours would wipe the tracker and training caches on every activation.
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('reset30-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
