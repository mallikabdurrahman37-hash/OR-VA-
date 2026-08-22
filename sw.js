const CACHE_NAME = 'oreva-shell-v1';

const APP_SHELL = [
  './',
  './index.html',
  './shop.html',
  './product.html',
  './cart.html',
  './checkout.html',
  './account.html',
  './wishlist.html',
  './about.html',
  './contact.html',
  './faq.html',
  './shipping-policy.html',
  './cancellation-policy.html',
  './return-policy.html',
  './privacy-policy.html',
  './terms.html',
  './my-orders.html',
  './order-details.html',
  './order-confirmation.html',
  './track-order.html',
  './css/styles.css',
  './js/ui.js',
  './js/cart.js',
  './js/auth.js',
  './js/products.js',
  './js/orders.js',
  './js/firebase-config.js',
  './assets/logo.png',
  './assets/bg.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Let Firebase, APIs and other cross-origin requests use the network normally.
  if (url.origin !== self.location.origin) return;

  // HTML/navigation: network first, cached page as offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Static files: cache first, then network.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
