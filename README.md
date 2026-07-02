# Career Compass — Architect → Australian PR

A private, offline-first web app that helps an architecture graduate target the
**shortest realistic route to Australian permanent residency (PR)** based on
their expertise (computational design, robotic fabrication, AR/XR, BIM,
parametric, generative AI/ML, digital fabrication, sustainability, etc.).

Everything runs client-side (React + Vite + Tailwind) and persists to
`localStorage` — no backend, no accounts, nothing uploaded.

## Features

- **Company Matcher** — a curated, Australia-wide employer shortlist (incl.
  regional firms and Tasmania) scored live against your expertise. Each card
  shows skill fit, win chance, PR leverage, why it suits, and future
  opportunity. Adjust your skills and the whole list re-ranks instantly (the
  "skill loop").
- **PR Route Analyzer** — a transparent estimator of the GSM points test
  (subclasses 189 / 190 / 491) for Architect (ANZSCO 232111), the recommended
  visa pathway sequence, and the **highest-impact levers** to raise your score
  (e.g. moving English from Competent → Superior is +20).
- **Application Review** — paste your CV / cover letter (and optionally a job
  description) for an instant heuristic score with tailored fixes.
- Plus the original Dashboard, Applications tracker, Daily routine, Guidelines,
  and Career plan.

## Important disclaimer

The company data is a hand-curated research shortlist with **estimated**
tech-maturity / visa-sponsorship signals — not live jobs or official
information. The PR analyzer is an **educational estimate**, not migration
advice. Immigration rules, occupation lists, and invitation cut-offs change
regularly, and **no tool can guarantee a visa outcome**. Always verify roles on
each firm's careers page and confirm migration details with the Department of
Home Affairs and a registered (MARA) migration agent.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```
