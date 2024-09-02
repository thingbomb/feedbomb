const CACHE_NAME = 'feedbomb';
const FILES_TO_CACHE = [
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
    '/404.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    const sameOrigin = requestUrl.origin === location.origin;

    if (!sameOrigin) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match('/404.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => caches.match('/404.html'));
            })
    );
});
