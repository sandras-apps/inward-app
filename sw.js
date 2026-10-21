/* Inward service worker: keeps a copy of every app file so Inward works offline.
   Bump VERSION whenever a file changes, so phones fetch the new copy.

   Updates: the browser checks this file for changes when the app opens, and the
   app asks again whenever it comes back to the foreground. A changed VERSION
   installs a fresh copy, takes over at once (skipWaiting + clients.claim), and
   the app then reloads quietly on the prompt screen (see app.js). */

var VERSION = "inward-v11";

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
      // Straight from the network: the browser's own cache could still hold old files.
      return cache.addAll(FILES.map(function (file) {
        return new Request(file, { cache: "reload" });
      }));
    }).then(function () {
      return self.skipWaiting(); // don't wait for every open window to close
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
      return self.clients.claim(); // take over open windows right away
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
