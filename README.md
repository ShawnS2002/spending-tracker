# Spending Tracker

A warm, ledger-styled spending tracker organized into **spaces** (household, trip,
business, or anything custom). Each space has its own categories, members, expenses,
and budgets. Built as a mobile-first React SPA with client-side persistence, an
OpenStreetMap-backed location/map feature, and multi-currency support.

> Rebuilt from a Claude.ai artifact prototype into a real project. See the original
> design brief in `../HANDOFF.md`.

## Stack

| Concern        | Choice                                                              |
| -------------- | ------------------------------------------------------------------ |
| Framework      | React 19 + Vite                                                    |
| Persistence    | `localStorage` (wrapped in `src/lib/storage.js` — swap-in ready)   |
| Maps / geocode | Leaflet + OpenStreetMap tiles + Nominatim + `leaflet.markercluster` (no key) |
| Exchange rates | exchangerate-api.com free tier (no key)                            |
| Tests          | Vitest + Testing Library                                          |
| Lint           | ESLint                                                            |
| Container/IaC  | Multi-stage Docker (Node build → nginx), Docker Compose profiles   |

No API keys are required — every external service is a free, key-less public endpoint,
configurable per environment via `VITE_*` vars.

## Prerequisites

Node is **not** required on the host — everything runs through Docker.
(If you do have Node 22+ locally, the `npm` scripts work directly too.)

## Environments

Endpoints are environment-configurable through `.env.<mode>` files, which Vite loads
automatically. Committed env files contain only public-API URLs (no secrets); machine-local
overrides go in `.env.local` / `.env.*.local` (gitignored). See `.env.example`.

### Development (hot-reloading dev server on :5173)

```bash
docker compose --profile dev up
# → http://localhost:5173   (loads .env.development)
```

### Production (optimized bundle served by nginx on :8080)

```bash
docker compose --profile prod up --build
# → http://localhost:8080   (built with .env.production)
```

The production image is a two-stage build: Node compiles the static bundle, then nginx
serves it with a SPA fallback and long-lived caching for fingerprinted assets
(`nginx.conf`).

## Scripts

Run inside the Node container (or directly if Node is installed):

```bash
npm run dev       # Vite dev server
npm run build     # production build → dist/
npm run preview   # preview the built bundle
npm run lint      # ESLint
npm run test      # Vitest (single run)
npm run test:watch
npm run verify    # lint → test → build  (the pre-build gate)
```

One-off in Docker without Compose:

```bash
docker run --rm -p 5173:5173 -v "$PWD:/app" -w /app node:22-alpine \
  sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

## Project layout

```
src/
  App.jsx                 root: spaces index, global settings, wizard routing
  components/             screens & UI (SpaceShell, Home/History/Budgets/Settings,
                          ExpenseEditor, SpaceWizard, MapCard, BottomNav, Icon)
  hooks/useStorage.js     localStorage-backed state hook
  lib/
    storage.js            persistence boundary (replace to add a backend)
    constants.js          THEMES, curated currencies, storage keys
    colors.js             light/dark token sets
    styles.js             shared inline-style helpers
    currency.js           formatCurrency / conversion helpers
    exchangeRates.js      rate fetching + session cache
    config.js             env-driven endpoint configuration
    utils.js              date/money helpers
  test/setup.js           Vitest setup
```

## Design notes carried over from the brief

- **"Space" vs "Budget":** the top-level container is a *space*; "budget" means only a
  per-category monthly limit. The naming is deliberate — don't reintroduce the overload.
- **Dark mode is global**, not per-space.
- **Currency (Option A):** every expense can be logged in any of the ~24 curated
  currencies; the space wizard picks the *default*, used for budgets and totals.
- **Exchange-rate behavior:** an expense stores a **snapshot** rate at save time, used
  for the per-row "≈ converted" line so historical entries stay stable.
  **Totals and budget bars currently also use the snapshot rate** (deterministic,
  offline-friendly). The original brief specified *live* rates for aggregates — that's a
  small swap in `src/lib/currency.js` (`expenseInDefault`) if/when desired.
- **Out of scope** (per brief, don't add unless asked): CSV import, per-space dark mode,
  user accounts/auth.
