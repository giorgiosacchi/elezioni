// PWA Elezioni: rete prioritaria; cache usata solo se manca la connessione.
const CACHE_NAME = "elezioni-pwa-stable-1";
const APP_PAGE = "./index.html";
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.add(new Request(APP_PAGE, { cache: "reload" })))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names.filter(name => name.startsWith("elezioni-pwa-") && name !== CACHE_NAME)
      .map(name => caches.delete(name))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.mode !== "navigate" || url.origin !== self.location.origin ||
      !url.pathname.startsWith("/elezioni/")) return;
  event.respondWith(fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(APP_PAGE, copy)));
    }
    return response;
  }).catch(() => caches.match(APP_PAGE)));
});
