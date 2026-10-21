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
      updateReady: "Una nuova versione di Inward ti aspetta · Aggiorna",
      home: "Home",
      language: "Lingua",
      perDay: "Spunti al giorno",
      times: { one: "L'ora del tuo spunto", many: "Gli orari dei tuoi spunti" },
      timesNote: { one: "A quest'ora trovi uno spunto nuovo, qui nell'app.", many: "A questi orari trovi uno spunto nuovo, qui nell'app." },
      timesNext: "Per ricevere anche un promemoria, c'è un passo in più subito dopo.",
      daily: "Ogni giorno alle",
      slots: ["Primo spunto", "Secondo spunto", "Terzo spunto"],
      remindersTitle: "Promemoria",
      addCalendar: "Aggiungi i promemoria al mio calendario",
      calendarHelp: "Il promemoria arriva dal calendario del telefono: toccalo per aprire Inward. Per cambiare gli orari, elimina il vecchio evento Inward dal calendario e aggiungi quello nuovo.",
      addTime: "Aggiungi le {time}",
      calendarStep1: {
        one: "Tocca il pulsante: si apre Google Calendar.",
        many: "Tocca un pulsante alla volta: si apre Google Calendar."
      },
      calendarStep2: "Prima di salvare, tocca ‘30 minuti prima’ e scegli ‘All'ora dell'evento’.",
      calendarReady: "File pronto: apri il file scaricato e scegli la tua app Calendario.",
      calendarAgain: "Non hai ancora aggiunto il promemoria al calendario? Tocca qui",
      calendarAgainTime: "Non hai ancora aggiunto il promemoria delle {time}? Tocca qui",
      calendarFoldedHint: "Prima di salvare, scegli la notifica ‘All'ora dell'evento’.",
      calendarChanged: "Hai cambiato orario: elimina il vecchio evento Inward dal calendario e aggiungi quello nuovo.",
      calendarTitle: "Inward · Un momento per te",
      calendarDescription: "Un momento per te. Prendi il quaderno e apri Inward.",
      remindersStepTitle: "Un promemoria, se vuoi",
      remindersStepText: {
        one: "Inward non può mandarti notifiche da sola. Se vuoi un promemoria, puoi aggiungerlo al calendario del tuo telefono: arriverà all'ora che hai scelto, e toccandolo aprirai Inward.",
        many: "Inward non può mandarti notifiche da sola. Se vuoi un promemoria, puoi aggiungerlo al calendario del tuo telefono: arriverà agli orari che hai scelto, e toccandolo aprirai Inward."
      },
      remindersStepHelp: "Se un giorno cambi gli orari, trovi questo pulsante anche nelle impostazioni.",
      notNow: "Non ora",
      install: "Installa l'app",
      installIos: "Per installare l'app: tocca Condividi, poi ‘Aggiungi alla schermata Home’.",
      rereadWelcome: "Rileggi il benvenuto",
      aboutTitle: "Informazioni e privacy",
      about: "Inward è gratuita e non raccoglie nessun dato: niente account, niente tracciamento, niente cookie. Le tue impostazioni restano solo su questo dispositivo. I promemoria vivono nel tuo calendario, non qui. E quello che scrivi resta sulla carta.",
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
      updateReady: "A new version of Inward is ready · Update",
      home: "Home",
      language: "Language",
      perDay: "Prompts per day",
      times: { one: "Time of your prompt", many: "Times of your prompts" },
      timesNote: { one: "At this time, a new prompt is waiting for you here in the app.", many: "At these times, a new prompt is waiting for you here in the app." },
      timesNext: "If you'd also like a reminder, there's one more step right after this.",
      daily: "Every day at",
      slots: ["First prompt", "Second prompt", "Third prompt"],
      remindersTitle: "Reminders",
      addCalendar: "Add reminders to my calendar",
      calendarHelp: "The reminder comes from your phone's calendar: tap it to open Inward. To change the times, delete the old Inward event from your calendar and add the new one.",
      addTime: "Add {time}",
      calendarStep1: {
        one: "Tap the button: Google Calendar opens.",
        many: "Tap each button in turn: Google Calendar opens."
      },
      calendarStep2: "Before saving, tap ‘30 minutes before’ and choose ‘At time of event’.",
      calendarReady: "File ready: open the downloaded file and choose your Calendar app.",
      calendarAgain: "Haven't added the reminder to your calendar yet? Tap here",
      calendarAgainTime: "Haven't added the {time} reminder yet? Tap here",
      calendarFoldedHint: "Before saving, choose the notification ‘At time of event’.",
      calendarChanged: "You changed the time: delete the old Inward event from your calendar and add the new one.",
      calendarTitle: "Inward · A moment for you",
      calendarDescription: "A moment for yourself. Take your notebook and open Inward.",
      remindersStepTitle: "A reminder, if you like",
      remindersStepText: {
        one: "Inward can't send you notifications by itself. If you'd like a reminder, you can add one to your phone's calendar: it will arrive at the time you chose, and tapping it opens Inward.",
        many: "Inward can't send you notifications by itself. If you'd like a reminder, you can add one to your phone's calendar: it will arrive at the times you chose, and tapping it opens Inward."
      },
      remindersStepHelp: "If you change the times later, you'll find this button in Settings too.",
      notNow: "Not now",
      install: "Install the app",
      installIos: "To install the app: tap Share, then ‘Add to Home Screen’.",
      rereadWelcome: "Re-read the welcome",
      aboutTitle: "About & privacy",
      about: "Inward is free and collects no data: no accounts, no tracking, no cookies. Your settings stay on this device only. Reminders live in your own calendar, not here. And what you write stays on paper.",
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
  var CALENDAR_KEY = "inward.calendar";

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

  function removeKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // Storage disabled: nothing to remove.
    }
  }

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

  // A new prompt appears at each chosen time, not at midnight. The current period is
  // the latest time slot that has started: today's, or, before today's first time,
  // the last slot of the previous day (so its prompt simply stays until then).
  function currentPeriod(d) {
    var now = d.getHours() * 60 + d.getMinutes();
    var slot = -1;
    for (var i = 0; i < settings.times.length; i++) {
      if (minutesOf(settings.times[i]) <= now) slot = i;
    }
    if (slot === -1) {
      return { day: new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1), slot: settings.times.length - 1 };
    }
    return { day: new Date(d.getFullYear(), d.getMonth(), d.getDate()), slot: slot };
  }

  function periodKey(period) {
    return dateKey(period.day) + "#" + period.slot + "#" + settings.perDay;
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

  // Skips for the prompt on screen: { period: "2026-10-21#0#1", count: 1 }.
  // They are gone as soon as the next prompt appears.
  function skipsFor(period) {
    var skips = readJSON(SKIP_KEY);
    if (!skips || skips.period !== periodKey(period) || typeof skips.count !== "number") return 0;
    return skips.count;
  }

  function promptFor(period) {
    var n = order.length;
    var day = daysSinceFixedDate(period.day);
    var slot = period.slot;
    var index = mod(day * settings.perDay + slot, n);
    var steps = skipsFor(period);

    // Never land on a prompt that belongs to another slot of the same day.
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
  // Calendar reminders. On Android: one Google Calendar "add event" link per time,
  // so the event opens pre-filled. Elsewhere: an .ics file made here, in the browser.

  var EVENT_MINUTES = 30; // long enough not to rush anyone

  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }

  // Start and end of today's event at this time, as local "YYYYMMDDTHHMMSS".
  function eventTimes(now, time) {
    var start = minutesOf(time);
    var end = start + EVENT_MINUTES;
    var endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (end >= 1440 ? 1 : 0));
    return {
      start: icsDate(now) + "T" + time.replace(":", "") + "00",
      end: icsDate(endDay) + "T" + pad(Math.floor(end / 60) % 24) + pad(end % 60) + "00"
    };
  }

  // Google's add-event link can't set the alert; the note under the button explains that.
  function googleCalendarLink(time) {
    var times = eventTimes(new Date(), time);
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: STRINGS[settings.lang].calendarTitle,
      dates: times.start + "/" + times.end,
      details: STRINGS[settings.lang].calendarDescription + "\n" + appURL(),
      recur: "RRULE:FREQ=DAILY"
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

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
      var times = eventTimes(now, time);
      lines.push(
        "BEGIN:VEVENT",
        "UID:inward-reminder-" + (i + 1) + "@sandras-apps.github.io",
        "DTSTAMP:" + stamp,
        "LAST-MODIFIED:" + stamp,
        "SEQUENCE:" + sequence,
        // Floating local time (no time zone): the reminder follows the phone's clock.
        "DTSTART:" + times.start,
        "DTEND:" + times.end,
        "RRULE:FREQ=DAILY",
        "SUMMARY:" + icsEscape(t.calendarTitle),
        "DESCRIPTION:" + icsEscape(t.calendarDescription + "\n" + url),
        "URL:" + url,
        "TRANSP:TRANSPARENT",
        // Apple Calendar honours this alert; Google Calendar ignores it.
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:" + icsEscape(t.calendarTitle),
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
    $all(".calendar-status").forEach(function (el) {
      el.textContent = STRINGS[settings.lang].calendarReady;
    });
    rememberReminder(settings.times);
    reminderAdded();
  }

  // Which reminder buttons were tapped, for the current times:
  // { sig: "10:00,18:00", used: ["10:00"], changed: false }.
  // A tap only means the calendar opened; the app never claims the event was saved.
  function timesSignature() {
    return settings.times.slice().sort().join(",");
  }

  function calendarState() {
    var state = readJSON(CALENDAR_KEY);
    if (!state || typeof state !== "object" || !Array.isArray(state.used)) {
      return { sig: timesSignature(), used: [], changed: false };
    }
    if (state.sig !== timesSignature()) {
      // The number of prompts or a time changed since: start over, and say so
      // if an old reminder may already be in the calendar.
      state = { sig: timesSignature(), used: [], changed: state.used.length > 0 || state.changed === true };
      writeJSON(CALENDAR_KEY, state);
    }
    return state;
  }

  function allRemindersUsed(state) {
    return settings.times.every(function (time) {
      return state.used.indexOf(time) !== -1;
    });
  }

  function rememberReminder(times) {
    var state = calendarState();
    times.forEach(function (time) {
      if (state.used.indexOf(time) === -1) state.used.push(time);
    });
    if (allRemindersUsed(state)) state.changed = false;
    writeJSON(CALENDAR_KEY, state);
  }

  // In the setup step, "Not now" becomes "Continue" once a reminder is on its way.
  function reminderAdded() {
    var done = $("#reminders-done");
    done.setAttribute("data-i18n", "continue");
    done.textContent = STRINGS[settings.lang].continue;
  }

  // Before making a reminder, take the times as they are in Settings right now.
  function syncTimesFromSettings() {
    if (!$("#settings").hidden) {
      readTimes($("#settings [data-choices]"));
      saveSettings();
    }
  }

  // The first-setup step always shows every button. Settings shows only the ones
  // not tapped yet; once all have been tapped, they fold into quiet links that
  // still open the calendar directly (no unfolding step).
  function renderCalendarActions() {
    var t = STRINGS[settings.lang];
    var android = isAndroid();
    var state = calendarState();
    $all("[data-calendar]").forEach(function (wrap) {
      var folding = wrap.getAttribute("data-calendar") === "settings";
      var slots = [];
      settings.times.forEach(function (time, i) {
        if (!folding || state.used.indexOf(time) === -1) slots.push(i);
      });
      if (!android && slots.length) slots = [0]; // elsewhere, one file holds every time
      var folded = slots.length === 0;

      var box = $(".calendar-actions", wrap);
      box.textContent = "";
      slots.forEach(function (i) {
        var label = settings.perDay === 1 ? t.addCalendar : t.addTime.replace("{time}", settings.times[i]);
        box.appendChild(android ? googleLink(i, "button", label, folding) : downloadControl("button", t.addCalendar));
      });

      var guide = $(".calendar-android-note", wrap);
      guide.hidden = !android || folded;
      $("[data-i18n='calendarStep1']", guide).textContent =
        slots.length > 1 ? t.calendarStep1.many : t.calendarStep1.one;

      var changed = $(".calendar-changed", wrap);
      if (changed) changed.hidden = folded || !state.changed;

      var again = $(".calendar-folded", wrap);
      if (!again) return;
      again.textContent = "";
      if (folded && android) {
        settings.times.forEach(function (time, i) {
          var label = settings.perDay === 1 ? t.calendarAgain : t.calendarAgainTime.replace("{time}", time);
          again.appendChild(googleLink(i, "link calendar-again", label, false));
        });
      } else if (folded) {
        again.appendChild(downloadControl("link calendar-again", t.calendarAgain));
      }
      again.hidden = !folded;
      $(".calendar-folded-hint", wrap).hidden = !(folded && android);
    });
  }

  function downloadControl(className, label) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("click", function () {
      syncTimesFromSettings();
      tidyTimes();
      downloadCalendar();
      renderCalendarActions();
    });
    return button;
  }

  function googleLink(i, className, label, redraw) {
    var link = document.createElement("a");
    link.className = className;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = label;
    link.href = googleCalendarLink(settings.times[i]);
    link.addEventListener("click", function () {
      syncTimesFromSettings();
      link.href = googleCalendarLink(settings.times[i]);
      rememberReminder([settings.times[i]]);
      reminderAdded();
      // Redraw a moment later, so removing the link doesn't cancel opening it.
      if (redraw) setTimeout(renderCalendarActions, 400);
    });
    return link;
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

  // Some texts have a singular and a plural form, depending on prompts per day.
  function text(key) {
    var value = STRINGS[settings.lang][key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return settings.perDay === 1 ? value.one : value.many;
    }
    return value;
  }

  function applyLanguage() {
    document.documentElement.lang = settings.lang;
    $all("[data-i18n]").forEach(function (el) {
      el.textContent = text(el.getAttribute("data-i18n"));
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

  // how: "push" adds a step to the browser history (Settings, and the welcome
  // re-read from Settings), so Android's back gesture returns from it instead of
  // closing the app; "pop" is that back step arriving; anything else replaces.
  function showScreen(id, how) {
    var current = $all(".screen").filter(function (el) { return !el.hidden; })[0];
    // Leaving Settings by any way (link, Home, back gesture): keep the times tidy.
    if (current && current.id === "settings" && id !== "settings") {
      readTimes($("#settings [data-choices]"));
      saveSettings();
      tidyTimes();
    }
    $all(".screen").forEach(function (el) {
      el.hidden = el.id !== id;
    });
    // Keep the open screen in the address (#settings…), so a reload reopens it.
    if (how !== "pop") {
      try {
        var url = id === "today" ? location.pathname + location.search : "#" + id;
        if (how === "push") history.pushState({ inward: "pushed" }, "", url);
        else history.replaceState(null, "", url);
      } catch (e) {
        // Not allowed in some sandboxed views: a reload then simply starts on the prompt.
      }
    }
    window.scrollTo(0, 0);
    // Redraw the form each time, so it always shows what is saved
    // (a time changed during setup must also appear in Settings).
    if (id === "setup" || id === "settings") renderChoices();
    if (id === "today") renderPrompt();
  }

  function renderPrompt(force) {
    if (!order.length) return;
    var prompt = promptFor(currentPeriod(new Date()));
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
        // Some phones only report a new time on "input", or late on "change".
        form.addEventListener("input", function (e) {
          if (e.target.name === "time") onChoiceChange(e);
        });
        form.addEventListener("submit", function (e) { e.preventDefault(); });
      }
      $all("[data-i18n]", form).forEach(function (el) {
        el.textContent = text(el.getAttribute("data-i18n"));
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
    renderCalendarActions();
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
      applyLanguage();
      shown = null;
    } else if (input.name === "time") {
      if (!isTime(input.value)) return;
      settings.times[Number(input.getAttribute("data-slot"))] = input.value;
      saveSettings();
      renderCalendarActions();
      shown = null;
    }
    $all(".calendar-status").forEach(function (el) {
      el.textContent = "";
    });
  }

  // Read the times straight from the form too, in case the phone's time picker
  // was still open and hadn't reported the change yet.
  function readTimes(form) {
    $all('input[name="time"]', form).forEach(function (input) {
      var slot = Number(input.getAttribute("data-slot"));
      if (isTime(input.value) && slot < settings.perDay) settings.times[slot] = input.value;
    });
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
    var period = currentPeriod(new Date());
    writeJSON(SKIP_KEY, { period: periodKey(period), count: skipsFor(period) + 1 });
    renderPrompt();
  }

  // Go back one screen: through the history when the screen was pushed (so our
  // links and Android's back gesture agree), otherwise straight to the fallback.
  function goBack(fallback) {
    if (history.state && history.state.inward === "pushed") history.back();
    else showScreen(fallback);
  }

  function finishSetup() {
    tidyTimes();
    settings.welcomed = true;
    saveSettings();
    showScreen("reminders");
  }

  // ---------------------------------------------------------------------------
  // Installing: Chrome on Android offers a prompt the app can open; iPhone has
  // none, so there we only say how. Nothing shows once the app is installed.

  var installPrompt = null;

  function isInstalled() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      navigator.standalone === true;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function renderInstall() {
    var installed = isInstalled();
    var canPrompt = !installed && installPrompt !== null;
    var ios = !installed && !canPrompt && isIOS();
    $all(".install").forEach(function (el) {
      el.hidden = !(canPrompt || ios);
      $(".install-button", el).hidden = !canPrompt;
      $(".install-ios", el).hidden = !ios;
    });
  }

  function bindInstall() {
    window.addEventListener("beforeinstallprompt", function (event) {
      event.preventDefault(); // no automatic banner: only our quiet link
      installPrompt = event;
      renderInstall();
    });
    window.addEventListener("appinstalled", function () {
      installPrompt = null;
      renderInstall();
    });
    if (window.matchMedia) {
      var standalone = window.matchMedia("(display-mode: standalone)");
      if (standalone.addEventListener) standalone.addEventListener("change", renderInstall);
    }
    $all(".install-button").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!installPrompt) return;
        var prompt = installPrompt;
        installPrompt = null; // each prompt can only be used once
        prompt.prompt();
        renderInstall();
      });
    });
    renderInstall();
  }

  // ---------------------------------------------------------------------------
  // Start

  function bindEvents() {
    $("#welcome-continue").addEventListener("click", function () {
      if (settings.welcomed) goBack("settings");
      else showScreen("setup");
    });
    $("#setup-start").addEventListener("click", function () {
      readTimes($("#setup [data-choices]"));
      finishSetup();
    });
    $("#setup-skip").addEventListener("click", function () {
      settings = { lang: settings.lang, perDay: 1, times: DEFAULT_TIMES[1].slice(), welcomed: false };
      applyLanguage();
      finishSetup();
    });
    $("#reminders-done").addEventListener("click", function () {
      showScreen("today");
    });
    $("#another").addEventListener("click", anotherPrompt);
    $("#open-settings").addEventListener("click", function () {
      showScreen("settings", "push");
    });
    $("#back-home").addEventListener("click", function () {
      goBack("today");
    });
    $("#close-settings").addEventListener("click", function () {
      goBack("today");
    });
    $("#reread-welcome").addEventListener("click", function () {
      showScreen("welcome", "push");
    });
    // Android back gesture / button, and the browser's back button.
    window.addEventListener("popstate", function () {
      showScreen(firstScreen(), "pop");
    });

    // Keep the prompt and colours current while the app stays open: check at the
    // start of every minute (so a new prompt appears right at its time), and
    // whenever the app comes back to the foreground.
    function refresh() {
      applyPhase();
      if (!$("#today").hidden) renderPrompt();
    }
    function everyMinute() {
      refresh();
      setTimeout(everyMinute, 60000 - (Date.now() % 60000) + 50);
    }
    setTimeout(everyMinute, 60000 - (Date.now() % 60000) + 50);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refresh();
    });
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
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

  function firstScreen() {
    var saved = location.hash.slice(1);
    if (!settings.welcomed) return saved === "setup" ? "setup" : "welcome";
    var screens = ["welcome", "reminders", "settings"];
    return screens.indexOf(saved) !== -1 ? saved : "today";
  }

  // ---------------------------------------------------------------------------
  // Saved data must survive every update. Keys never change name; missing or
  // unknown fields fall back to defaults (see loadSettings). If the shape of a
  // saved value has to change, convert the old value here instead of dropping it.

  function migrateStorage() {
    // inward.skip, before prompts changed at the chosen time:
    // { date: "YYYY-MM-DD", perDay: n, slots: { "0": 1 } } → { period, count }.
    var skips = readJSON(SKIP_KEY);
    if (skips && typeof skips === "object" && skips.slots && !skips.period) {
      var period = currentPeriod(new Date());
      var count = skips.date === dateKey(period.day) && skips.perDay === settings.perDay ?
        Number(skips.slots[period.slot]) || 0 : 0;
      if (count > 0) writeJSON(SKIP_KEY, { period: periodKey(period), count: count });
      else removeKey(SKIP_KEY);
    }
  }

  // ---------------------------------------------------------------------------
  // Updates. Online, every open already loads the latest files (see sw.js). Only
  // when this page had to use the offline copy (slow or no network) can a newer
  // version arrive while it's open; then a quiet link on the prompt screen offers
  // it. Never on the very first visit, and never a reload the user didn't ask for.

  function showUpdateLink() {
    $("#update-now").hidden = false;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    var sw = navigator.serviceWorker;
    var hadVersion = !!sw.controller; // on the very first visit there is nothing to update
    var offlineCopy = false;
    sw.addEventListener("message", function (event) {
      var type = event.data && event.data.type;
      if (type === "inward-offline-copy") offlineCopy = true;
      if (type === "inward-update-ready" && hadVersion) showUpdateLink();
    });
    // A new version took over: it matters only if this page runs the offline copy.
    sw.addEventListener("controllerchange", function () {
      if (hadVersion && offlineCopy) showUpdateLink();
      hadVersion = true;
    });
    $("#update-now").addEventListener("click", function () {
      location.reload();
    });
    sw.register("sw.js").then(function (registration) {
      function check() {
        registration.update().catch(function () {}); // offline: try again later
      }
      check();
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) check();
      });
    }).catch(function () {});
  }

  function start() {
    migrateStorage();
    applyPhase();
    applyLanguage();
    bindEvents();
    bindInstall();
    // After a reload, start at the top of the screen that was open.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    showScreen(firstScreen());

    loadPrompts().then(function () {
      if (!$("#today").hidden) renderPrompt(true);
    }, showLoadError);

    registerServiceWorker();
  }

  start();
})();
