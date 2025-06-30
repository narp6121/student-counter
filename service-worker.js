const CACHE_VERSION = 'v3'; // 다음 업데이트 때 'v3', 'v4'로 바꾸기
const CACHE_NAME = `my-cache-${CACHE_VERSION}`;
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 설치 이벤트
self.addEventListener('install', function(e) {
  console.log('[SW] Installed');
  self.skipWaiting(); // 새 서비스워커 바로 활성화
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[SW] Caching files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 활성화 이벤트 - 이전 캐시 삭제
self.addEventListener('activate', function(e) {
  console.log('[SW] Activated');
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// fetch 이벤트
self.addEventListener('fetch', function(e) {
  console.log('[SW] Fetching:', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
