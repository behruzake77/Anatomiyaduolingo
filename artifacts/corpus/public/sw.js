/* CORPUS Service Worker — offline PWA.
 * Strategiya:
 *  - sahifalar (/) va statik resurslar: cache-first (o'rnatilgach internetsiz ishlaydi)
 *  - tasvir/font: cache-first, uzoq saqlanadi
 *  - PDF kitoblar: SW umuman aralashmaydi (to'g'ridan-to'g'ri yuklanadi, keshga olinmaydi)
 *  - boshqa so'rovlar: network-first, muvaffaqiyatsiz bo'lsa keshdan
 */
// Increment whenever the app shell changes so installed PWAs do not stay on an
// old build (which made new profile menu items appear to disappear).
const CACHE = "corpus-v4";

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

  const pathname = url.pathname;

  // PDF kitoblar — SW aralashmaydi (aks holda iframe ichida ilova ochilib ketadi).
  if (/\.pdf($|\?)/i.test(pathname)) {
    return;
  }

  // Navigatsiya → avval tarmoqdan oling. Cache-first HTML eski JS chunk'larni
  // qaytarib, yangi deploydan keyin ayrim telefonlarda oq ekran chiqarishi mumkin.
  if (req.mode === "navigate" && req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("/", copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("/")),
    );
    return;
  }

  // Statik (rasm/font) → cache-first
  if (/\.(png|jpg|jpeg|svg|webp|woff2?|ico)$/.test(pathname)) {
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
