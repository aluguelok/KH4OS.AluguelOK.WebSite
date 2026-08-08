// wwwroot/service-worker.js

const CACHE_NAME = 'aluguelok-v1';
const URLS_TO_CACHE = [
    '/',
    '/css/main.css',
    '/js/main.js',
    '/favicon/favicon-32x32.png',
    '/img/logo/aluguelok-white.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
