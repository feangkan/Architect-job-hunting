# Career Compass

A daily job-hunting companion built for **RMIT Master of Architecture** students specializing in **AI** and **digital fabrication**.

## Features

- **Dashboard** — daily progress, application pipeline, streak tracking
- **Daily Routine** — structured checklist for consistent job hunting
- **Applications Tracker** — log and manage roles from saved to offer
- **Guidelines** — tailored career advice for the Australian architecture + tech market
- **Career Plan** — roadmap, goals, and skills tracker

All data is saved locally in your browser (no account or server required).

## Mobile

The app works on phone browsers with a bottom tab bar and sticky header.

### Option A — Same WiFi (quick test)

1. On your computer, run `npm run dev`
2. Note the **Network** URL Vite prints (e.g. `http://192.168.1.5:5173`)
3. Open that URL on your phone (same WiFi network)

### Option B — Deploy online (best for daily use)

Deploy the `dist` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) for a permanent URL.

On iPhone: open the URL in Safari → Share → **Add to Home Screen**  
On Android: Chrome menu → **Install app** or **Add to Home screen**

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4

## Customization

Edit `src/data/content.ts` to update guidelines and career roadmap content.
Edit `src/storage.ts` to change default daily tasks, goals, and skills.
