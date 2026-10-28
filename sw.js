/**
 * sw.js — service worker de Proyecto Beta.
 *
 *  · Al instalarse guarda una copia de la app (PRECACHE) para que abra sin conexión.
 *  · Con conexión pide SIEMPRE la versión más reciente a la red y actualiza la copia;
 *    sin conexión (o si la red tarda más de NETWORK_TIMEOUT_MS) responde con la copia.
 *
 * REGLA: al añadir, borrar o renombrar archivos de la app, actualiza PRECACHE y sube VERSION.
 * Las rutas son relativas a este archivo, así funciona igual en la raíz que en una subcarpeta
 * (por ejemplo en GitHub Pages).
 */

const VERSION = 'v1';
const CACHE = `beta-${VERSION}`;
const NETWORK_TIMEOUT_MS = 4000;

const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'src/styles/tokens.css',
  'src/styles/base.css',
  'src/styles/layout.css',
  'src/styles/motion.css',
  'src/styles/components/buttons.css',
  'src/styles/components/hero.css',
  'src/styles/components/message.css',
  'src/styles/components/composer.css',
  'src/styles/components/sheet.css',
  'src/styles/components/structure.css',
  'src/scripts/main.js',
  'src/scripts/state.js',
  'src/scripts/storage.js',
  'src/scripts/theme.js',
  'src/scripts/agent.js',
  'src/scripts/hero.js',
  'src/scripts/pager.js',
  'src/scripts/composer.js',
  'src/scripts/sheets.js',
  'src/scripts/history.js',
  'src/scripts/settings.js',
  'src/scripts/structure.js',
  'src/scripts/structure-data.js',
  'src/icons/icons.js',
  'src/icons/app/favicon.svg',
  'src/icons/app/icon-192.png',
  'src/icons/app/icon-512.png',
  'src/icons/app/icon-maskable-512.png',
  'src/icons/app/apple-touch-icon.png',
  'src/media/hero.js',
  'src/media/hero-placeholder.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function networkFirst(request) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      caches.match(request).then((hit) => { if (hit) resolve(hit); });
    }, NETWORK_TIMEOUT_MS);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        resolve(response);
      })
      .catch(() => {
        clearTimeout(timer);
        caches.match(request).then((hit) => resolve(hit || Response.error()));
      });
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;   // fuentes y demás: la red
  event.respondWith(networkFirst(request));
});
