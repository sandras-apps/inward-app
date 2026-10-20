# Inward

A free, quiet web app that offers one journal prompt at a time, for you to answer **on paper**, in your own notebook. A small reflective pause in the day instead of doomscrolling.

- 140 prompts in Italian and English, across seven themes.
- 1, 2 or 3 prompts a day, at the times you choose.
- Reminders come through your own phone calendar: Inward makes a small calendar file you add once. There are no push notifications.
- Works offline and can be installed on your phone's home screen.

## Privacy

Inward collects nothing. No accounts, no analytics, no cookies, no requests to other sites (the font is included in the app). The only thing saved is your settings, in your browser's storage on your own device. What you write stays on paper.

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
| `styles.css` | Look and feel, including the background that follows the time of day |
| `app.js` | Chooses the daily prompt, saves settings, makes the calendar file |
| `prompts.json` | The 140 prompts and the theme names, in Italian and English |
| `sw.js` | Service worker that keeps a copy of the app for offline use |
| `manifest.webmanifest` | Lets phones install Inward like an app |
| `fonts/` | Fraunces, self-hosted (SIL Open Font License, see `fonts/OFL.txt`) |
| `icons/` | App icons (placeholders for now) |

## Updating the app

When you change any file, also change `VERSION` at the top of `sw.js` (for example `inward-v1` → `inward-v2`). Otherwise phones that already opened Inward keep showing the old copy.

## How the daily prompt is chosen

The prompts are shuffled once with a fixed seed, so themes and kinds of prompt are mixed. Each day and time slot then points to the next places in that list, so everyone sees the same prompt on the same day and it stays the same if you reopen the app. "Not today, another one" picks a different prompt for that slot, for today only.

## Licence

The font is licensed under the SIL Open Font License 1.1.
