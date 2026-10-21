/* Inward service worker: keeps a copy of every app file so Inward works offline.
   Bump VERSION whenever a file changes, so phones fetch the new copy.

   Updates: people open Inward, read the prompt and close it within seconds, so
   updates can't wait for the app to stay open.
   - The core files (the page, app.js, styles.css, prompts.json) come from the
     network first, so an online open always shows the latest version. If the
     network takes longer than 2 seconds, or is off, the offline copy is used.
   - When the offline copy was used, the network answer keeps coming in the
     background and refreshes the copy; if it brought something new, the page is
     told, and shows a quiet "Update" link (see app.js).
   - A changed VERSION installs fresh copies of every file and takes over at once
     (skipWaiting + clients.claim). */

var VERSION = "inward-v14";

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

var FRESH_FIRST = ["./", "index.html", "app.js", "styles.css", "prompts.json"];
var NETWORK_WAIT = 2000; // ms before falling back to the offline copy
var SLOW_SPELL = 15000; // after one slow answer, don't wait again for this long
var slowUntil = 0;

// Path relative to the app's folder ("app.js", "./"), or null for other sites.
function appPath(url) {
  var scope = self.registration.scope;
  if (url.indexOf(scope) !== 0) return null;
  return url.slice(scope.length).split(/[?#]/)[0] || "./";
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var path = appPath(request.url);
  if (path === null) return;

  if (request.mode === "navigate" || FRESH_FIRST.indexOf(path) !== -1) {
    var key = FRESH_FIRST.indexOf(path) !== -1 ? path : "index.html";
    event.respondWith(freshFirst(event, key));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

// Fonts and icons rarely change: offline copy first, network only if missing.
function cacheFirst(request) {
  return caches.match(request, { ignoreSearch: true }).then(function (cached) {
    return cached || fetch(request);
  });
}

function freshFirst(event, key) {
  // "no-cache": ask the server, not the browser's own short-term cache.
  var network = fetch(event.request.url, { cache: "no-cache" }).then(function (response) {
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response;
  });
  // The page, its script and the prompts load one after another: once one of them
  // had to use the offline copy, the next ones use it straight away instead of
  // each waiting again (they still refresh in the background).
  var wait = Date.now() < slowUntil ? 0 : NETWORK_WAIT;
  var timeout = new Promise(function (resolve) {
    setTimeout(resolve, wait);
  });
  var first = network.then(function (response) {
    return response.clone();
  }, function () {
    return null;
  });

  return Promise.race([first, timeout.then(function () { return null; })]).then(function (fresh) {
    if (fresh) {
      event.waitUntil(keep(key, network));
      return fresh;
    }
    return caches.match(key).then(function (cached) {
      if (!cached) return network; // nothing saved yet: wait for the network after all
      slowUntil = Date.now() + SLOW_SPELL;
      var servedCopy = cached.clone();
      tell(event, { type: "inward-offline-copy" });
      // Let the network finish in the background; if it brings a newer file,
      // keep it and tell the page an update is ready.
      event.waitUntil(network.then(function (response) {
        return Promise.all([servedCopy.text(), response.clone().text()]).then(function (texts) {
          return keep(key, Promise.resolve(response)).then(function () {
            if (texts[0] !== texts[1]) tell(event, { type: "inward-update-ready" });
          });
        });
      }).catch(function () {}));
      return cached;
    });
  });
}

function keep(key, responsePromise) {
  return responsePromise.then(function (response) {
    return caches.open(VERSION).then(function (cache) {
      return cache.put(key, response.clone());
    });
  }).catch(function () {});
}

// Message the page this request belongs to (or, for a page still loading, every open page).
function tell(event, message) {
  var id = event.resultingClientId || event.clientId;
  return self.clients.get(id).then(function (client) {
    if (client) return [client];
    return self.clients.matchAll({ type: "window" });
  }).then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(message);
    });
  });
}
