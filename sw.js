/*
 * Pyntra service worker — offline app shell + asset cache.
 * Navigation requests use network-first (cache the visited route's HTML so it
 * loads offline next time); hashed static assets use cache-first (immutable).
 * Everything is same-origin only — cross-origin requests pass straight through.
 * Bump CACHE on release to drop stale assets.
 */
const CACHE = 'pdfcraft-v4';
// The folder this worker was registered under: "/" on its own host, or
// "/pyntra/" when the site is published inside another one.
const ROOT = new URL(self.registration.scope).pathname;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave cross-origin alone

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        return (await caches.match(req))
          || (await caches.match(ROOT + 'app'))
          || (await caches.match(ROOT))
          || Response.error();
      }
    })());
    return;
  }

  const cacheable = url.pathname.includes('/assets/')
    || url.pathname.endsWith('/manifest.webmanifest')
    || url.pathname.endsWith('.svg');

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res.ok && cacheable) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});

// Focus (or open) the app when a collaboration notification is tapped.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) { await c.focus(); return; } }
    if (self.clients.openWindow) await self.clients.openWindow(ROOT + 'app');
  })());
});
