// AnatomiLingo service worker — offline rejim
const CACHE = "anatomilingo-v5";
const CORE = [
  ".", "index.html", "manifest.webmanifest",
  "css/style.css", "js/app.js", "js/data.js",
  "assets/fonts/inter-latin-400-normal.woff2", "assets/fonts/inter-latin-600-normal.woff2",
  "assets/fonts/inter-latin-700-normal.woff2", "assets/fonts/inter-latin-800-normal.woff2",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/favicon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache-first, keyin tarmoq; rasmlar dinamik keshlanadi
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => hit))
  );
});
