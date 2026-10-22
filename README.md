# Inward

**[Open Inward →](https://sandras-apps.github.io/inward-app/)**

*A quiet pause in a loud world. One journal prompt at a time, to answer on paper.*

A free, quiet web app that offers one journal prompt at a time, for you to answer **on paper**, in your own notebook. A small reflective pause in the day instead of doomscrolling.

- 140 prompts in Italian and English, across seven themes.
- One prompt a day by default, or up to three, at the times you choose.
- Reminders come through your own phone calendar: Inward makes a small calendar file you add once. There are no push notifications.
- Works offline and can be installed on your phone's home screen.

## Install it on your phone

Inward is a web page you can keep on your home screen like an app. After the first visit it also works offline.

- **Android (Chrome):** open the link above, tap the menu **⋮**, then **Install app** (on some phones it says **Add to Home screen**).
- **iPhone (Safari):** open the link above, tap **Share**, then **Add to Home Screen**.

Installing doesn't add notifications: reminders still come from your phone calendar, if you choose to add them.

## Privacy

Inward collects no personal data. No accounts, no cookies, no ads, and the font is included in the app. The only outside request is an anonymous visit count with [GoatCounter](https://www.goatcounter.com/help/privacy) (pageviews only, no cookies). The only thing saved is your settings, in your browser's storage on your own device. What you write stays on paper.

The full details are in the app: **[Info & Privacy](https://sandras-apps.github.io/inward-app/#info)** (in Italian or English, following the app's language).

## Running it locally

It's plain HTML, CSS and JavaScript with no build step. Serve the folder with any static server, for example:

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The screens: welcome, first setup, today's prompt, settings |
| `styles.css` | Look and feel: a colour for each category, a neutral look elsewhere, and a warm night palette from 21:00 to 05:00 |
| `app.js` | Chooses the daily prompt, saves settings, makes the calendar file |
| `prompts.json` | The 140 prompts and the theme names, in Italian and English |
| `sw.js` | Service worker that keeps a copy of the app for offline use |
| `manifest.webmanifest` | Lets phones install Inward like an app |
| `fonts/` | Fraunces, self-hosted (SIL Open Font License, see `fonts/OFL.txt`) |
| `icons/` | App icons and favicons, all made from `icons/source.png` (the doorway) |

## Updating the app

When you change any file, also change `VERSION` at the top of `sw.js` (for example `inward-v1` → `inward-v2`). That's what tells phones there's a new version.

How an update reaches people, on its own:

1. **Online, the next time Inward opens, it shows the new version straight away.** The page, its script, its styles and the prompts are always asked from the network first.
2. On a slow connection (no answer within about 2 seconds) or offline, Inward opens with its saved copy instead, so it's never stuck waiting. The download carries on in the background.
3. If that download brings a newer version while the app is open, a quiet link appears near the bottom of the prompt screen: *"A new version of Inward is ready · Update"*. Tapping it switches to the new version. The app never reloads by itself.
4. Separately, when `VERSION` in `sw.js` changes, a fresh offline copy of every file (fonts and icons included) is saved for next time.

Settings are never lost: saved values keep their names, and if one ever needs a new shape, the old value is converted (see `migrateStorage()` in `app.js`).

## How the daily prompt is chosen

The prompts are shuffled once with a fixed seed, so themes and kinds of prompt are mixed. Each day and time slot then points to the next places in that list. A new prompt appears at each time you chose and stays until the next one, even if you reopen the app; before your first time of the day, yesterday's last prompt stays. "Not today, another one" picks a different prompt until the next one is due.

## Licence

The font is licensed under the SIL Open Font License 1.1.
