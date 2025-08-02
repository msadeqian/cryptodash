self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cryptodash-v1').then((cache) => {
      return cache.addAll([
        '/cryptodash/index.html',
        '/cryptodash/icon-192.png',
        '/cryptodash/icon-512.png'
        // Add other assets (CSS, JS, etc.) here if needed
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});