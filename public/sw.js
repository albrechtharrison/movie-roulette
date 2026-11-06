// Minimal app-shell service worker: cache the shell for offline/instant loads,
// but let everything else (API calls, TMDB images) hit the network normally —
// a "pick a movie" result must always be fresh, never served from cache.
const CACHE_NAME = "movieroulette-shell-v1";
const SHELL_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Only ever serve the app shell itself from cache; API routes and images
  // always go to the network so results/filters/posters are never stale.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (request.mode !== "navigate" && !SHELL_URLS.includes(url.pathname)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? caches.match("/")))
  );
});
