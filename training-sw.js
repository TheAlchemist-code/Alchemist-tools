const CACHE_NAME = 'training-lab-v1';
const ASSETS = [
  './',
  './training.html',
  './training-manifest.json',
  './training-icon-192.png',
  './training-icon-512.png',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
