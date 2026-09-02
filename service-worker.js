const CACHE_NAME = "hooptrack-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./dashboard.html",
    "./stats.html",
    "./training.html",
    "./shooting.html",
    "./games.html",
    "./settings.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

const OPTIONAL_FILES = [
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(APP_FILES).then(function() {
                return Promise.all(
                    OPTIONAL_FILES.map(function(file) {
                        return cache.add(file).catch(function() {
                            return undefined;
                        });
                    })
                );
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function(cacheName) {
                        return cacheName !== CACHE_NAME;
                    })
                    .map(function(cacheName) {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                const responseCopy = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, responseCopy);
                });
                return response;
            })
            .catch(function() {
                return caches.match(event.request);
            })
    );
});
