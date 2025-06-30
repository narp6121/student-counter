self.addEventListener('install', function(e) {
  console.log('[SW] Installed');
  self.skipWaiting(); // 새로운 서비스워커 바로 활성화
  e.waitUntil(
    caches.open('v1').then(function(cache) {
      console.log('[SW] Caching files...');
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon.png'
      ]);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[SW] Activated');
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[SW] Fetching:', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
