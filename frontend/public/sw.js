// Minimal Vitória service worker — cache app shell with stale-while-revalidate.
const CACHE = "vitoria-v1";
const SHELL = ["/", "/manifest.webmanifest", "/logo.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // network-first for API / supabase
  if (url.pathname.startsWith("/api") || url.host.includes("supabase.co")) return;
  event.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            caches.open(CACHE).then((c) => c.put(req, resp.clone()));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || net;
    })
  );
});
