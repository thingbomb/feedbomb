const CACHE_NAME = 'feedbomb';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/home.css',
    '/favicon.ico',
    '/css/reader.css',
    '/js/home.js',
    '/js/reader.js',
    '/assets/masked_logo.png',
    '/read/index.html',
    '/404.html',
    '/offline.html',
    '/assets/poster.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; 
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return caches.match('/offline.html');
            }
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      }).catch(() => caches.match('/offline.html'))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
