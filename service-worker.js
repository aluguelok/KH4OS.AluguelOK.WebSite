// wwwroot/service-worker.js

const CACHE_NAME = 'aluguelok-v2';
const URLS_TO_CACHE = [
    '/',
    '/css/main.css',
    '/js/main.js',
    '/favicon/favicon-32x32.png',
    '/img/logo/aluguelok-white.png'
];

self.addEventListener('install', event => {
    // Força a nova versão a assumir o controle imediatamente
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    // Limpa caches antigos (ex: aluguelok-v1)
    const cacheAllowlist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estratégia: Stale-While-Revalidate
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Atualiza o cache com a versão nova apenas para requests básicos com sucesso
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Em caso de falha de rede, ignora e o usuário verá a versão do cache
            });
            
            // Retorna a resposta do cache imediatamente (se existir). 
            // Senão, aguarda a resposta da rede.
            return cachedResponse || fetchPromise;
        })
    );
});
