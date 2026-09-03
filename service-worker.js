const CACHE_NAME = "hooptrack-v3";

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
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then(function(response) {
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    const responseCopy = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseCopy);
                    });
                    return response;
                })
                .catch(function() {
                    if (event.request.mode === "navigate") {
                        return caches.match("./index.html");
                    }

                    return new Response("Offline", {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain"
                        }
                    });
                });
        })
    );
});
