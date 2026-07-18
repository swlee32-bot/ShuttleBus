const CACHE_NAME = 'shuttle-cache-v3.0'; // 시간표 수정 시 이 숫자를 올려주세요!
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 설치 시 파일들 캐싱
self.addEventListener('install', event => {
  self.skipWaiting(); // 🔥 추가됨: 대기하지 않고 즉시 새 버전으로 설치를 강제함
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 구버전 캐시 삭제 및 제어권 즉시 탈환
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 예전 버전 캐시 삭제
          }
        })
      );
    }).then(() => self.clients.claim()) // 🔥 추가됨: 설치 즉시 화면에 새 버전을 적용함
  );
});

// 오프라인 상태일 때 캐시된 파일 제공
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});