# Inward

A free, quiet web app that offers one journal prompt at a time, for people to answer **on paper**, in their own notebook. It is grounding and introspection, a small reflective pause in the day instead of doomscrolling.

Part of the `sandras-apps` GitHub organization (same spirit as Easy Recipes). Hosted on GitHub Pages.

## Principles (do not break these)

- **Free.** No AI, no costs, no accounts, no email, no backend, no server.
- **Private.** The app never asks for, stores or sends anything personal. Users write on paper. The only thing saved is their settings, in `localStorage` on their own device.
- **No tracking.** No cookies, no user IDs, no custom events. The only analytics is GoatCounter's anonymous pageview count (the official script, `inward-app.goatcounter.com`, loaded `async` just before `</body>`); if it fails to load, the app works as normal, and the service worker never caches or touches GoatCounter requests. No other third-party requests. Self-host the fonts (no Google Fonts requests at runtime).
- **No pressure.** No streaks, no stats, no history, no badges, no "you missed a day". Never guilt the user.
- **Honest.** The app never promises what it doesn't do. If something is a limitation (for example, reminders come through the phone calendar), say so plainly.
- **Simple.** Static files, vanilla HTML, CSS and JavaScript, no framework, no build step.
- All project documents (README, comments, commit messages) in English.

## Stack and structure

```
index.html
styles.css
app.js
prompts.json          ← provided, 140 prompts in IT/EN/ES (do not rewrite them; ES added 23 October 2026 at Alessandra's request)
manifest.webmanifest
sw.js                 ← service worker, offline cache of all app files
fonts/                ← self-hosted serif font files (OFL licence)
icons/                ← app icons, generated from icons/source.png (arched doorway)
README.md
```

It must work as an installable PWA and fully offline after the first visit.

## Content: `prompts.json`

- `categories`: 7 categories with `id`, `it`, `en` labels.
- `prompts`: 140 items with `id`, `category`, `type` (question, letter, complete, describe, image), `it`, `en`.
- Treat the text as final. If a prompt looks wrong, flag it to me; don't edit it silently.

## Screens (MVP)

### 1. Welcome (first launch only, re-readable from Settings)
Shown in the user's language:

> IT: *Prima di cominciare, prendi un quaderno, un diario o un piccolo libretto, e una penna che ti piace usare. Sarà il tuo spazio. Qui trovi solo gli spunti: quello che scrivi resta sulla carta, ed è solo tuo.*
>
> EN: *Before you begin, find a notebook, a journal or a small booklet, and a pen you love writing with. That will be your space. This app only holds the prompts: what you write stays on paper, and it's yours alone.*

Then a gentle button to continue, and a short step to choose language, how many prompts per day and at what times (with sensible defaults, can be skipped).

### 2. Today's prompt (main screen)
- The prompt, large, in serif italic. Above it, the category name, small and quiet.
- Under it, the invitation line:
  - IT: *Rallenta, respira, e scrivi finché c'è qualcosa da dire.*
  - EN: *Slow down, breathe, and write until there's nothing left to say.*
- A discreet text link to get a different prompt:
  - IT: *Non oggi, un'altra* · EN: *Not today, another one*
- A small link to Settings.
- Nothing else on screen.

### 3. Settings
- At the top and at the bottom, the same quiet back control: a drawn "←" arrow followed by *Home* (same word in IT and EN; *Inicio* in ES), same quiet italic style as the other links. It goes back to the prompt screen.
- Language: Italiano / English / Español (default: browser language, fallback English). Spanish added 23 October 2026: every text has an `es` version (STRINGS, prompts and categories, the Info & Privacy page).
- Prompts per day: 1, 2 or 3 (default 1).
- One time for each prompt (defaults: 1 → 18:00; 2 → 10:00, 18:00; 3 → 09:00, 14:00, 20:00).
- **Add reminders to my calendar** button (see below).
- Re-read the welcome text.
- **Share and other apps** (added 23 October 2026, Alessandra's decision): above About, "Ti sta piacendo? / Enjoying it?" with a *Condividi Inward / Share Inward* link that opens the phone's share menu (`navigator.share`) with a short message and the app link, or copies them where there is no share menu. Under it, "Altre app di Sandra / More apps by Sandra", built from `OTHER_APPS` in `app.js`: only apps with `live: true` are shown, and the section stays hidden while there are none. The same list lives in every Sandra's Apps app; "free, no account" is written only where it is true of that app.
- A short, honest "About & privacy" note: no personal data collected, settings stay on this device, reminders live in the user's own calendar. Then one italic line: IT *Solo un conteggio anonimo delle visite. Niente cookie, nessun dato personale.* · EN *Anonymous visit count only. No cookies, no personal data.* Under it, a quiet link to the Info & Privacy page: IT *Leggi tutto: informazioni e privacy* · EN *Read more: info & privacy*.

### 4. Info & Privacy
- A screen of `index.html` (`#info`), so it is in the offline copy and follows the app's language. Both languages are written out in the page (`.info-text[lang]`); the app shows the one in use. Also opens directly at `…/inward-app/#info` (linked from the README), for everyone, including new visitors.
- Same calm style; the drawn "←" back control at the top and bottom says *Impostazioni/Settings* when opened from Settings (and returns there), otherwise *Home*.
- No cookie banner: there are no cookies, and the only storage is strictly necessary.
- Sections: who makes Inward (Sandra's Apps, contact `sandras.apps.studio@gmail.com`); no cookies, only GoatCounter's anonymous visit count (what it receives, its privacy policy); what is stored and where (settings incl. whether the welcome was seen, tapped reminder buttons, the "Not today" choice for the current prompt, plus the offline copy of the app's files), that it never leaves the device, and how to delete it; what you write; hosting (GitHub Pages, GitHub's privacy statement); calendar reminders (Google Calendar link carries title, time and app link to Google; the `.ics` is made on the device); not therapy; credits (Fraunces by Undercase Type, SIL OFL 1.1; icon made with the help of AI (ChatGPT) and refined by Sandra's Apps; code written with the help of AI (Claude, by Anthropic)); use as is; last updated date.
- **Everything it says must stay literally true of the code.** When something changes (a new stored value, a new outside service, a new link), update the page and its "last updated" date.

## How the daily prompt is chosen

- A new prompt appears **at each chosen time** (as Settings says: "A quest'ora trovi uno spunto nuovo"), not at midnight. It then stays until the next chosen time, even if the app is reopened.
- Deterministic, no randomness at runtime. Shuffle the 140 prompts once with a fixed seed (so categories and types are mixed), then pick by `(daysSinceFixedDate × promptsPerDay + slotIndex) mod 140`.
- The current slot is the latest slot whose time has passed today. Before today's first time, keep showing the previous day's last slot (its day and slot index), not a new prompt.
- While the app is open, check at the start of every minute and when it comes back to the foreground, so the prompt changes right at its time without a reload.
- "Not today, another one" moves to another prompt in the shuffled order for the current slot. Store that small offset in `localStorage` with the slot it belongs to (day, slot, prompts per day); it is discarded as soon as the next prompt appears.
  - Implementation note: each skip jumps 71 places in the shuffled order (71 shares no factor with 140), not just one. The very next prompt is tomorrow's (or the next slot's), so a one-step skip would show it again the following day. Skips never land on another of today's slots.

## Reminders: the calendar approach (no push notifications)

PWAs can't schedule local notifications at fixed times without a server, and we don't want a server. So reminders go through the user's own phone calendar. They are offered in the first setup (a step right after the times) and in Settings.

Every reminder is a daily event of **30 minutes** (not shorter: we don't want to rush anyone), starting at the chosen time, titled in the app's language (gender-neutral): IT *Inward · Un momento per te* · EN *Inward · A moment for you*. Description: one gentle line in the user's language plus the app URL.

**On Android** (Google Calendar), a downloaded `.ics` needs too many steps (find the file, choose to open it with Calendar), and Google ignores its alert. So instead:

- One Google Calendar "add event" link per chosen time: `https://calendar.google.com/calendar/render?action=TEMPLATE` with `text`, `dates` (local times, no `Z`), `details` and `recur=RRULE:FREQ=DAILY`. It opens Google Calendar with the event pre-filled; the user just taps Save.
- With one time, one button ("Add reminders to my calendar"); with 2 or 3 times, one button per time ("Aggiungi le 10:00", "Aggiungi le 18:00"…).
- Google's link can't set the alert, and Google applies its own default (30 minutes before). So **above** the button(s), a short 2-step guide in the same quiet style (a one-line hint under the buttons was easy to miss):
  - IT: *1. Tocca il pulsante: si apre Google Calendar. 2. Prima di salvare, tocca ‘30 minuti prima’ e scegli ‘All'ora dell'evento’.*
  - EN: *1. Tap the button: Google Calendar opens. 2. Before saving, tap ‘30 minutes before’ and choose ‘At time of event’.*
  - With 2 or 3 buttons, step 1 reads *Tocca un pulsante alla volta* / *Tap each button in turn*.

**On iPhone and other devices**, the button generates an `.ics` file in the browser (Blob download, nothing leaves the device):

- One `VEVENT` per chosen time, `RRULE:FREQ=DAILY`, a `VALARM` (`TRIGGER:PT0M`, `ACTION:DISPLAY`) at the start time. Apple Calendar honours the alert.
- Use floating local times (no `TZID`), so the reminder follows the user's local clock. Also set the `URL` field.
- Stable `UID`s per slot, so re-importing doesn't create confusing duplicates where calendars support that.
- After the download, say plainly what to do: open the downloaded file and choose the Calendar app.

Next to the button(s), explain in one or two plain lines: the reminder opens the calendar, tap it to open Inward; to change times, delete the old Inward event from the calendar and add the new one.

**After a button has been used.** The app can't know whether the event was really saved, so it must never say it was. It only remembers, in `localStorage`, which buttons were tapped for the current times.

- The first-setup reminder step always shows every button, as it is.
- In Settings, once every button has been tapped (on Android with 2 or 3 times, each one; elsewhere, the single download), hide the button(s) and the 2-step guide. In their place show quiet text links, same style as "Not today, another one", that **act like the button** (no unfolding step): on Android each opens Google Calendar directly, elsewhere the link starts the `.ics` download directly.
  - One time (or not Android): IT *Non hai ancora aggiunto il promemoria al calendario? Tocca qui* · EN *Haven't added the reminder to your calendar yet? Tap here*.
  - Android with 2 or 3 times, one link per time: IT *Non hai ancora aggiunto il promemoria delle 18:00? Tocca qui* · EN *Haven't added the 18:00 reminder yet? Tap here*.
  - On Android, right under the link(s), one short line: IT *Prima di salvare, scegli la notifica ‘All'ora dell'evento’.* · EN *Before saving, choose the notification ‘At time of event’.*
- On Android with 2 or 3 times, until all have been tapped, show only the buttons not tapped yet.
- If the number of prompts or any time changes, forget what was tapped and show the button(s) again. If a reminder had already been added for the old times, add one plain line above them: IT *Hai cambiato orario: elimina il vecchio evento Inward dal calendario e aggiungi quello nuovo.* · EN *You changed the time: delete the old Inward event from your calendar and add the new one.*

Test on Android (Google Calendar) and iPhone (Apple Calendar).

## Design

- Elegant, calm, lots of space. Serif throughout. **Italic instead of bold** for emphasis; avoid bold almost entirely.
- Font: *Fraunces* (preferred, for its italic) or *Cormorant Garamond*, self-hosted.
- Palette (CSS custom properties):
  - Deep teal night `#1F3A4A`
  - Sage green `#8FA89B`
  - Dusty lavender `#A99BC4`
  - Cream `#F4F0E8`
- **Each category has its own colour**, used for the category name and for a soft gradient tint of the prompt screen's background (never flat colour). Base accents: Emotions dusty lavender `#A99BC4`, Relationships antique rose `#C49A9F`, Memory soft ochre `#C8A96A`, Longing misty blue `#8FAAC4`, Gratitude sage green `#8FA89B`, Fears slate blue-grey `#7F8FA3`, Identity sea green `#7FB0A8`.
  - Light mode: pale creamy backgrounds tinted with the accent; prompt text deep teal; the category name in a darker shade of the accent.
  - Dark mode: deep, muted backgrounds tinted with the accent; prompt text cream; the category name in a lighter shade of the accent.
  - The exact shades live in `styles.css` (`html[data-category="…"]`), adjusted so every pairing passes WCAG AA (text, soft text and category name, on both ends of the gradient).
  - Settings, the welcome, the setup and the reminder step use a neutral look (no category): cream in light mode, deep teal in dark mode.
  - When the prompt changes, the colours fade gently to the new ones (registered CSS colour properties, about 1.6 s); no fade with `prefers-reduced-motion`, and none on the first paint.
- **Warm night mode, 21:00–05:00.** One fixed warm palette with no blue light replaces the category colours, on every screen and in both phone modes: background `#2A2019` → `#1E1712`, text `#EADBC4`, soft text `#CDB89C`, category name `#C9A06A`. It switches automatically at 21:00 and 05:00, also while the app is open (the per-minute check), with a slow fade (about 6 s).
- The `theme-color` meta tag follows the current background, so the phone's status bar matches.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Mobile-first; it should also look good on desktop.
- Soft fade when the prompt appears. No other animations needed.
- Full-height screens use `100dvh` (with a `100vh` fallback), so the prompt screen fits the phone exactly, with no extra scroll.

## Reloading

- Pull-to-refresh is disabled (`overscroll-behavior-y: contain` on `html` and `body`).
- Settings, and the welcome re-read from Settings, are pushed onto the browser history, so the Android back gesture/button goes back a screen (welcome → Settings → prompt) instead of closing the app. The app's own back links go back through the history the same way.
- Any reload, including the one from the update link, reopens exactly the screen that was open (Settings, welcome, setup, reminder step or prompt), scrolled to the top.
- The open screen is kept in the URL hash (`#settings`, `#welcome`, `#setup`, `#reminders`; the prompt screen has none), so a reload reopens the same screen, scrolled to the top. A new user who hasn't finished the welcome always starts there (or back in the setup step).

## Updates

Updates must reach people on their own. People open Inward, read the prompt and close it within seconds, so an update can't depend on the app staying open.

- Every change to any file ships with a new `VERSION` in `sw.js`.
- **Network first for the core files** (the page, `app.js`, `styles.css`, `prompts.json`), fetched with `cache: "no-cache"` so the browser's short-term cache can't serve old copies. An online open therefore always shows the latest version.
- **2-second fallback:** if the network hasn't answered within about 2 seconds, or is off, the offline copy is used at once. After one such fallback, the next core files in the same load use the offline copy straight away (no chain of 2-second waits). Fonts and icons stay offline-first.
- When the offline copy was used, the network answer still arrives in the background and refreshes the copy. If it differs, the service worker tells the page.
- The browser also checks `sw.js` when the app opens, and the app calls `registration.update()` whenever it comes back to the foreground. A new `VERSION` installs fresh copies of every file (`cache: "reload"`) and takes over at once (`skipWaiting()` + `clients.claim()`).
- **No automatic reload.** When this page runs an older copy and a newer one is ready, a quiet link appears near the bottom of the prompt screen, same discreet italic style as "Not today, another one": IT *Una nuova versione di Inward ti aspetta · Aggiorna* · EN *A new version of Inward is ready · Update*. Tapping it reloads into the new version on the prompt screen. It never shows on the very first visit, nor when the page is already up to date.

**Saved data survives every update.** `localStorage` keys (`inward.settings`, `inward.skip`, `inward.calendar`) never change name; missing or unknown fields fall back to defaults. If the shape of a saved value ever has to change, convert the old value in `migrateStorage()` in `app.js` (it runs before anything reads saved data) instead of dropping it.

## Out of scope for now

Choosing categories, favourites, history, streaks, more than 3 prompts per day, push notifications, any account or backend.

## Working with me

- I'm not a developer: explain choices in plain words, briefly.
- Before big structural changes, tell me what you plan to do.
- Show me the app running locally before publishing. Then help me set up GitHub Pages for the repo.
- Keep commits small, with clear messages in English.
