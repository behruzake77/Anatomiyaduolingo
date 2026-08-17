/* CORPUS Service Worker — offline PWA.
 * Strategiya:
 *  - sahifalar (/) va statik resurslar: cache-first (o'rnatilgach internetsiz ishlaydi)
 *  - tasvir/font: cache-first, uzoq saqlanadi
 *  - boshqa so'rovlar: network-first, muvaffaqiyatsiz bo'lsa keshdan
 */
const CACHE = "corpus-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(["/"])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigatsiya → cache-first (app shell)
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("/", copy)).catch(() => {});
        return res;
      })),
    );
    return;
  }

  // Statik (rasm/font) → cache-first
  if (/\.(png|jpg|jpeg|svg|webp|woff2?|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          }),
      ),
    );
    return;
  }

  // Boshqalar → network-first, kesh fallback
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req)),
  );
});
