const CACHE_NAME = 'wooly-wonders-v2';
const ASSETS_TO_CACHE = [
  './',
  'landing.html',
  'woolywonders.html',
  'auth.html',
  'customer.html',
  'admin.html',
  'dashboard.html',
  'assets/css/base.css',
  'assets/css/pages.css',
  'assets/js/ww-data.js',
  'assets/js/ui.js',
  'assets/js/store.js',
  'assets/js/admin.js',
  'assets/js/auth.js',
  'assets/js/landing.js',
  'assets/js/customer.js',
  'assets/js/dashboard.js',
  'assets/images/logo-social.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
