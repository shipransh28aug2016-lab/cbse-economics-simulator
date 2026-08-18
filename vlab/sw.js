// ══════════════════════════════════════════════════════════════
// CBSE V-LAB — service worker (spec §3, §19).
// Cache-first app shell: after the first successful load, every file
// below is served from Cache Storage with zero network dependency.
// Bump CACHE_NAME on any app-shell change to force a refresh.
// ══════════════════════════════════════════════════════════════
const CACHE_NAME = 'vlab-shell-v1';
const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.webmanifest',
    './src/curriculum/registry.js',
    './src/core/state-machine.js',
    './src/simulation/permanganometry-model.js',
    './src/experiments/xii-chem-permanganometry.js',
    './src/offline/db.js',
    './src/offline/progress-store.js',
    './src/ui/render.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
            .then(() => self.clients.claim())
    );
});

// Cache-first with a network fallback that re-populates the cache —
// keeps the app usable offline while still picking up updates when a
// connection is available.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request)
                .then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() => cached);
        })
    );
});
