# Inward

A free, quiet web app that offers one journal prompt at a time, for people to answer **on paper**, in their own notebook. It is grounding and introspection, a small reflective pause in the day instead of doomscrolling.

Part of the `sandras-apps` GitHub organization (same spirit as Easy Recipes). Hosted on GitHub Pages.

## Principles (do not break these)

- **Free.** No AI, no costs, no accounts, no email, no backend, no server.
- **Private.** The app never asks for, stores or sends anything personal. Users write on paper. The only thing saved is their settings, in `localStorage` on their own device.
- **No tracking.** No analytics, no cookies, no third-party requests. Self-host the fonts (no Google Fonts requests at runtime).
- **No pressure.** No streaks, no stats, no history, no badges, no "you missed a day". Never guilt the user.
- **Honest.** The app never promises what it doesn't do. If something is a limitation (for example, reminders come through the phone calendar), say so plainly.
- **Simple.** Static files, vanilla HTML, CSS and JavaScript, no framework, no build step.
- All project documents (README, comments, commit messages) in English.

## Stack and structure

```
index.html
styles.css
app.js
prompts.json          ← provided, 140 prompts in IT/EN (do not rewrite them)
manifest.webmanifest
sw.js                 ← service worker, offline cache of all app files
fonts/                ← self-hosted serif font files (OFL licence)
icons/                ← app icons (placeholders for now)
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
- Language: Italiano / English (default: browser language, fallback English).
- Prompts per day: 1, 2 or 3 (default 1).
- One time for each prompt (defaults: 1 → 18:00; 2 → 10:00, 18:00; 3 → 09:00, 14:00, 20:00).
- **Add reminders to my calendar** button (see below).
- Re-read the welcome text.
- A short, honest "About & privacy" note: no data collected, settings stay on this device, reminders live in the user's own calendar.

## How the daily prompt is chosen

- Deterministic, no randomness at runtime: the same prompt stays all day for each time slot, even if the app is reopened.
- Shuffle the 140 prompts once with a fixed seed (so categories and types are mixed), then pick by `(daysSinceFixedDate × promptsPerDay + slotIndex) mod 140`.
- The current slot is the latest slot whose time has passed today (before the first slot, show the first one).
- "Not today, another one" moves to another prompt in the shuffled order for that slot, for today only. Store that small offset in `localStorage` with today's date and discard it the next day.
  - Implementation note: each skip jumps 71 places in the shuffled order (71 shares no factor with 140), not just one. The very next prompt is tomorrow's (or the next slot's), so a one-step skip would show it again the following day. Skips never land on another of today's slots.

## Reminders: the calendar approach (no push notifications)

PWAs can't schedule local notifications at fixed times without a server, and we don't want a server. So reminders go through the user's own phone calendar:

- The **Add reminders to my calendar** button generates an `.ics` file in the browser (Blob download, nothing leaves the device).
- One `VEVENT` per chosen time, `RRULE:FREQ=DAILY`, duration 10 minutes, a `VALARM` (`TRIGGER:PT0M`, `ACTION:DISPLAY`) at the start time.
- Use floating local times (no `TZID`), so the reminder follows the user's local clock.
- Event title: `Inward ✦`. Description: one gentle line in the user's language plus the app URL. Also set the `URL` field.
- Stable `UID`s per slot, so re-importing doesn't create confusing duplicates where calendars support that.
- Next to the button, explain in one or two plain lines: the reminder opens the calendar, tap it to open Inward; to change times, delete the old Inward event from the calendar and add the new one.
- Test that the file imports correctly on Android (Google Calendar) and iPhone (Apple Calendar).

## Design

- Elegant, calm, lots of space. Serif throughout. **Italic instead of bold** for emphasis; avoid bold almost entirely.
- Font: *Fraunces* (preferred, for its italic) or *Cormorant Garamond*, self-hosted.
- Palette (CSS custom properties):
  - Deep teal night `#1F3A4A`
  - Sage green `#8FA89B`
  - Dusty lavender `#A99BC4`
  - Cream `#F4F0E8`
- The background gently shifts with the time of day: greener in the morning, bluer in the afternoon, violet towards evening (dark, deep-teal base at night). Keep text contrast accessible (WCAG AA) in every state.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Mobile-first; it should also look good on desktop.
- Soft fade when the prompt appears. No other animations needed.

## Out of scope for now

Choosing categories, favourites, history, sharing, streaks, more than 3 prompts per day, push notifications, any account or backend.

## Working with me

- I'm not a developer: explain choices in plain words, briefly.
- Before big structural changes, tell me what you plan to do.
- Show me the app running locally before publishing. Then help me set up GitHub Pages for the repo.
- Keep commits small, with clear messages in English.
