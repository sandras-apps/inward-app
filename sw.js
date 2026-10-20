/* Inward service worker: keeps a copy of every app file so Inward works offline.
   Bump VERSION whenever a file changes, so phones fetch the new copy. */

var VERSION = "inward-v5";

var FILES = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "prompts.json",
  "manifest.webmanifest",
  "fonts/fraunces-latin-normal.woff2",
  "fonts/fraunces-latin-italic.woff2",
  "icons/favicon-16.png",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      return cache.addAll(FILES);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== VERSION) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Cache first: the app opens instantly and offline. Pages fall back to index.html.
self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(function (cached) {
      if (cached) return cached;
      return fetch(request).catch(function () {
        if (request.mode === "navigate") return caches.match("index.html");
        return Response.error();
      });
    })
  );
});
