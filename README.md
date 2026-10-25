# WITHIN — One Mind, Many Selves

A private, guided space for focused intention and reflective journaling. WITHIN is inspired by a philosophical question about the self. It does **not** claim to communicate with parallel universes or detect external messages.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```bash
npm run build
npm run preview
```

## What it does

- Versioned first-launch consent and a full introduction.
- Guided 1, 3, 5, or 10 minute sessions with pause and resume.
- Optional browser speech guidance and atmospheric cue, both off by default.
- Optional microphone recording, explicitly requested and stored in IndexedDB on this device.
- Local journal with search, filters, notes editing, deletion, JSON import and export, CSV export, and individual audio downloads.
- Offline support after the production app is loaded successfully, where the browser supports service workers.

## Privacy and limits

No accounts, analytics, advertising, external AI, or backend. Session text is stored in browser localStorage and recordings in IndexedDB. Data does not sync between devices. Clearing browser data or switching browsers can erase it. JSON and CSV exports include text only; recordings must be downloaded separately. The app's timer measures local elapsed time. The core animation is decorative.

The interface supports desktop and mobile browsers, keyboard navigation, and reduced-motion preferences. Microphone recording requires a secure context (HTTPS or localhost), compatible browser, and permission.

## Technology

React, TypeScript, Vite, native Web APIs, and locally bundled fonts. MIT licensed.
