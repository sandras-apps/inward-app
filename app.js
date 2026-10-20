/* Inward — one journal prompt at a time, to answer on paper.
   No accounts, no tracking, no server. Only settings are saved, in localStorage. */

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Texts

  var STRINGS = {
    it: {
      welcome: "Prima di cominciare, prendi un quaderno, un diario o un piccolo libretto, e una penna che ti piace usare. Sarà il tuo spazio. Qui trovi solo gli spunti: quello che scrivi resta sulla carta, ed è solo tuo.",
      continue: "Continua",
      setupTitle: "Qualche piccola scelta",
      setupNote: "Puoi cambiarle quando vuoi dalle impostazioni.",
      start: "Inizia",
      skip: "Salta, va bene così",
      invitation: "Rallenta, respira, e scrivi finché c'è qualcosa da dire.",
      another: "Non oggi, un'altra",
      settings: "Impostazioni",
      language: "Lingua",
      perDay: "Spunti al giorno",
      times: "A che ora",
      daily: "Ogni giorno alle",
      slots: ["Primo spunto", "Secondo spunto", "Terzo spunto"],
      remindersTitle: "Promemoria",
      addCalendar: "Aggiungi i promemoria al mio calendario",
      calendarHelp: "Il promemoria arriva dal calendario del telefono: toccalo per aprire Inward. Per cambiare gli orari, elimina il vecchio evento Inward dal calendario e aggiungi quello nuovo.",
      calendarReady: "File pronto. Aprilo per aggiungerlo al tuo calendario.",
      calendarDescription: "Un momento per te. Prendi il quaderno e apri Inward.",
      rereadWelcome: "Rileggi il benvenuto",
      aboutTitle: "Informazioni e privacy",
      about: "Inward è gratuita e non raccoglie nessun dato: niente account, niente tracciamento, niente cookie. Le tue impostazioni restano solo su questo dispositivo. I promemoria vivono nel tuo calendario, non qui. E quello che scrivi resta sulla carta.",
      back: "Torna allo spunto",
      loadError: "Gli spunti non si sono caricati. Riprova tra poco."
    },
    en: {
      welcome: "Before you begin, find a notebook, a journal or a small booklet, and a pen you love writing with. That will be your space. This app only holds the prompts: what you write stays on paper, and it's yours alone.",
      continue: "Continue",
      setupTitle: "A few small choices",
      setupNote: "You can change these any time in Settings.",
      start: "Start",
      skip: "Skip, the defaults are fine",
      invitation: "Slow down, breathe, and write until there's nothing left to say.",
      another: "Not today, another one",
      settings: "Settings",
      language: "Language",
      perDay: "Prompts per day",
      times: "At what time",
      daily: "Every day at",
      slots: ["First prompt", "Second prompt", "Third prompt"],
      remindersTitle: "Reminders",
      addCalendar: "Add reminders to my calendar",
      calendarHelp: "The reminder comes from your phone's calendar: tap it to open Inward. To change the times, delete the old Inward event from your calendar and add the new one.",
      calendarReady: "File ready. Open it to add it to your calendar.",
      calendarDescription: "A moment for yourself. Take your notebook and open Inward.",
      rereadWelcome: "Re-read the welcome",
      aboutTitle: "About & privacy",
      about: "Inward is free and collects no data: no accounts, no tracking, no cookies. Your settings stay on this device only. Reminders live in your own calendar, not here. And what you write stays on paper.",
      back: "Back to the prompt",
      loadError: "The prompts couldn't load. Please try again in a moment."
    }
  };

  var DEFAULT_TIMES = {
    1: ["18:00"],
    2: ["10:00", "18:00"],
    3: ["09:00", "14:00", "20:00"]
  };

  // ---------------------------------------------------------------------------
  // Settings (the only thing Inward saves, and only on this device)

  var SETTINGS_KEY = "inward.settings";
  var SKIP_KEY = "inward.skip";

  function browserLanguage() {
    var langs = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < langs.length; i++) {
      var code = String(langs[i]).toLowerCase();
      if (code.indexOf("it") === 0) return "it";
      if (code.indexOf("en") === 0) return "en";
    }
    return "en";
  }

  function defaultSettings() {
    return { lang: browserLanguage(), perDay: 1, times: DEFAULT_TIMES[1].slice(), welcomed: false };
  }

  function readJSON(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Private mode or storage disabled: the app still works, it just won't remember.
    }
  }

  function isTime(value) {
    return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  }

  function loadSettings() {
    var s = defaultSettings();
    var saved = readJSON(SETTINGS_KEY);
    if (saved && typeof saved === "object") {
      if (saved.lang === "it" || saved.lang === "en") s.lang = saved.lang;
      if ([1, 2, 3].indexOf(saved.perDay) !== -1) s.perDay = saved.perDay;
      s.times = DEFAULT_TIMES[s.perDay].slice();
      if (Array.isArray(saved.times) && saved.times.length === s.perDay && saved.times.every(isTime)) {
        s.times = saved.times.slice().sort();
      }
      s.welcomed = saved.welcomed === true;
    }
    return s;
  }

  var settings = loadSettings();

  function saveSettings() {
    writeJSON(SETTINGS_KEY, settings);
  }

  // ---------------------------------------------------------------------------
  // Dates and time slots

  var FIXED_DATE = Date.UTC(2026, 0, 1);
  var DAY_MS = 86400000;

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function dateKey(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  // Whole local days since the fixed date (immune to daylight-saving changes).
  function daysSinceFixedDate(d) {
    return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - FIXED_DATE) / DAY_MS);
  }

  function minutesOf(time) {
    var parts = time.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  // The latest slot whose time has passed today; before the first one, the first one.
  function currentSlot(d) {
    var now = d.getHours() * 60 + d.getMinutes();
    var slot = 0;
    for (var i = 0; i < settings.times.length; i++) {
      if (minutesOf(settings.times[i]) <= now) slot = i;
    }
    return slot;
  }

  function phaseOf(d) {
    var h = d.getHours();
    if (h >= 5 && h < 12) return "morning";
    if (h >= 12 && h < 17) return "afternoon";
    if (h >= 17 && h < 22) return "evening";
    return "night";
  }

  // ---------------------------------------------------------------------------
  // Choosing the prompt: deterministic, no randomness at runtime.

  var SEED = 20260101;
  // "Not today, another one" jumps this far in the shuffled order. It shares no
  // factor with 140, so repeated skips visit every prompt before repeating, and
  // it lands far from the next days' prompts, so a skipped-to prompt doesn't
  // come back tomorrow.
  var SKIP_STRIDE = 71;

  var categories = {};
  var order = [];

  // Small seeded random generator (mulberry32), used only for the one fixed shuffle.
  function seededRandom(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(items, seed) {
    var random = seededRandom(seed);
    var list = items.slice();
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // Today's skips: { date: "YYYY-MM-DD", perDay: n, slots: { "0": 1 } }. Gone the next day.
  function todaysSkips(d) {
    var skips = readJSON(SKIP_KEY);
    if (!skips || skips.date !== dateKey(d) || skips.perDay !== settings.perDay || typeof skips.slots !== "object") {
      return { date: dateKey(d), perDay: settings.perDay, slots: {} };
    }
    return skips;
  }

  function promptFor(d, slot) {
    var n = order.length;
    var day = daysSinceFixedDate(d);
    var index = mod(day * settings.perDay + slot, n);
    var steps = todaysSkips(d).slots[slot] || 0;

    // Never land on a prompt that belongs to another of today's slots.
    var taken = {};
    for (var j = 0; j < settings.perDay; j++) {
      if (j !== slot) taken[mod(day * settings.perDay + j, n)] = true;
    }
    while (steps > 0) {
      index = mod(index + SKIP_STRIDE, n);
      if (!taken[index]) steps--;
    }
    return order[index];
  }

  // ---------------------------------------------------------------------------
  // Calendar reminders: an .ics file made here, in the browser. Nothing is sent.

  function icsEscape(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  // Lines longer than 75 bytes are folded, without splitting a character.
  function icsFold(line) {
    var encoder = new TextEncoder();
    var out = [];
    var current = "";
    var bytes = 0;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      var code = line.charCodeAt(i);
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < line.length) {
        ch += line[++i];
      }
      var size = encoder.encode(ch).length;
      if (bytes + size > 75) {
        out.push(current);
        current = " ";
        bytes = 1;
      }
      current += ch;
      bytes += size;
    }
    out.push(current);
    return out.join("\r\n");
  }

  function icsDate(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  }

  function icsUTC(d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
  }

  function appURL() {
    return new URL("./", location.href).href;
  }

  function buildCalendar() {
    var t = STRINGS[settings.lang];
    var now = new Date();
    var url = appURL();
    var stamp = icsUTC(now);
    // Grows with every new file, so calendars that track UIDs treat it as an update.
    var sequence = Math.floor((now.getTime() - FIXED_DATE) / 60000);

    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//sandras-apps//Inward//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:Inward"
    ];

    settings.times.forEach(function (time, i) {
      var start = minutesOf(time);
      var end = start + 10;
      var endTime = pad(Math.floor(end / 60) % 24) + pad(end % 60) + "00";
      var endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (end >= 1440 ? 1 : 0));
      lines.push(
        "BEGIN:VEVENT",
        "UID:inward-reminder-" + (i + 1) + "@sandras-apps.github.io",
        "DTSTAMP:" + stamp,
        "LAST-MODIFIED:" + stamp,
        "SEQUENCE:" + sequence,
        // Floating local time (no time zone): the reminder follows the phone's clock.
        "DTSTART:" + icsDate(now) + "T" + time.replace(":", "") + "00",
        "DTEND:" + icsDate(endDay) + "T" + endTime,
        "RRULE:FREQ=DAILY",
        "SUMMARY:" + icsEscape("Inward ✦"),
        "DESCRIPTION:" + icsEscape(t.calendarDescription + "\n" + url),
        "URL:" + url,
        "TRANSP:TRANSPARENT",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:" + icsEscape("Inward ✦"),
        "TRIGGER:PT0M",
        "END:VALARM",
        "END:VEVENT"
      );
    });

    lines.push("END:VCALENDAR");
    return lines.map(icsFold).join("\r\n") + "\r\n";
  }

  function downloadCalendar() {
    var blob = new Blob([buildCalendar()], { type: "text/calendar;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inward-reminders.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 60000);
    $("#calendar-status").textContent = STRINGS[settings.lang].calendarReady;
  }

  // ---------------------------------------------------------------------------
  // Screens

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var shown = null; // which prompt is on screen, to fade only when it changes

  function applyLanguage() {
    var t = STRINGS[settings.lang];
    document.documentElement.lang = settings.lang;
    $all("[data-i18n]").forEach(function (el) {
      el.textContent = t[el.getAttribute("data-i18n")];
    });
    renderChoices();
  }

  function applyPhase() {
    var phase = phaseOf(new Date());
    var html = document.documentElement;
    if (html.getAttribute("data-phase") !== phase) {
      html.setAttribute("data-phase", phase);
    }
    var meta = $('meta[name="theme-color"]');
    var color = getComputedStyle(html).getPropertyValue("--bg-top").trim();
    if (meta && color) meta.setAttribute("content", color);
  }

  function showScreen(id) {
    $all(".screen").forEach(function (el) {
      el.hidden = el.id !== id;
    });
    window.scrollTo(0, 0);
    if (id === "today") renderPrompt();
  }

  function renderPrompt(force) {
    if (!order.length) return;
    var now = new Date();
    var prompt = promptFor(now, currentSlot(now));
    var key = prompt.id + "|" + settings.lang;
    if (!force && key === shown) return;
    shown = key;

    var category = categories[prompt.category];
    var block = $(".prompt-block");
    $("#prompt-category").textContent = category ? category[settings.lang] : "";
    $("#prompt-text").textContent = prompt[settings.lang];
    block.classList.remove("fade-in");
    void block.offsetWidth; // restart the fade
    block.classList.add("fade-in");
  }

  function showLoadError() {
    $("#prompt-category").textContent = "";
    $("#prompt-text").textContent = STRINGS[settings.lang].loadError;
  }

  // Language, prompts per day and times: the same small form in setup and in settings.
  function renderChoices() {
    var t = STRINGS[settings.lang];
    $all("[data-choices]").forEach(function (form) {
      if (!form.firstElementChild) {
        form.appendChild($("#choices-template").content.cloneNode(true));
        form.addEventListener("change", onChoiceChange);
        form.addEventListener("submit", function (e) { e.preventDefault(); });
      }
      $all("[data-i18n]", form).forEach(function (el) {
        el.textContent = t[el.getAttribute("data-i18n")];
      });
      $all('input[name="lang"]', form).forEach(function (input) {
        input.checked = input.value === settings.lang;
      });
      $all('input[name="perDay"]', form).forEach(function (input) {
        input.checked = Number(input.value) === settings.perDay;
      });

      var times = $("[data-times]", form);
      times.textContent = "";
      settings.times.forEach(function (time, i) {
        var label = document.createElement("label");
        label.className = "time";
        var span = document.createElement("span");
        span.textContent = settings.perDay === 1 ? t.daily : t.slots[i];
        var input = document.createElement("input");
        input.type = "time";
        input.name = "time";
        input.value = time;
        input.setAttribute("data-slot", i);
        input.required = true;
        label.appendChild(span);
        label.appendChild(input);
        times.appendChild(label);
      });
    });
  }

  function onChoiceChange(event) {
    var input = event.target;
    if (input.name === "lang") {
      settings.lang = input.value;
      saveSettings();
      applyLanguage();
      renderPrompt(true);
    } else if (input.name === "perDay") {
      settings.perDay = Number(input.value);
      settings.times = DEFAULT_TIMES[settings.perDay].slice();
      saveSettings();
      renderChoices();
      shown = null;
    } else if (input.name === "time") {
      if (!isTime(input.value)) return;
      settings.times[Number(input.getAttribute("data-slot"))] = input.value;
      saveSettings();
      shown = null;
    }
    $("#calendar-status").textContent = "";
  }

  // Times can be typed in any order; slots always run from earliest to latest.
  function tidyTimes() {
    var sorted = settings.times.slice().sort();
    if (sorted.join() !== settings.times.join()) {
      settings.times = sorted;
      saveSettings();
      renderChoices();
    }
  }

  function anotherPrompt() {
    var now = new Date();
    var slot = currentSlot(now);
    var skips = todaysSkips(now);
    skips.slots[slot] = (skips.slots[slot] || 0) + 1;
    writeJSON(SKIP_KEY, skips);
    renderPrompt();
  }

  function finishWelcome() {
    tidyTimes();
    settings.welcomed = true;
    saveSettings();
    showScreen("today");
  }

  // ---------------------------------------------------------------------------
  // Start

  function bindEvents() {
    $("#welcome-continue").addEventListener("click", function () {
      showScreen(settings.welcomed ? "settings" : "setup");
    });
    $("#setup-start").addEventListener("click", finishWelcome);
    $("#setup-skip").addEventListener("click", function () {
      settings = { lang: settings.lang, perDay: 1, times: DEFAULT_TIMES[1].slice(), welcomed: false };
      applyLanguage();
      finishWelcome();
    });
    $("#another").addEventListener("click", anotherPrompt);
    $("#open-settings").addEventListener("click", function () {
      showScreen("settings");
    });
    $("#close-settings").addEventListener("click", function () {
      tidyTimes();
      showScreen("today");
    });
    $("#reread-welcome").addEventListener("click", function () {
      showScreen("welcome");
    });
    $("#add-calendar").addEventListener("click", function () {
      tidyTimes();
      downloadCalendar();
    });

    // Keep the prompt and colours current if the app stays open across a time slot or midnight.
    function refresh() {
      applyPhase();
      if (!$("#today").hidden) renderPrompt();
    }
    setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refresh();
    });
    window.addEventListener("pageshow", refresh);
  }

  function loadPrompts() {
    return fetch("prompts.json")
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        data.categories.forEach(function (c) {
          categories[c.id] = c;
        });
        order = shuffled(data.prompts, SEED);
      });
  }

  function start() {
    applyPhase();
    applyLanguage();
    bindEvents();
    showScreen(settings.welcomed ? "today" : "welcome");

    loadPrompts().then(function () {
      if (!$("#today").hidden) renderPrompt(true);
    }, showLoadError);

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  start();
})();
