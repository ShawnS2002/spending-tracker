# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it accurate; update it
when a convention changes.

## What this is

A mobile-first spending tracker (React + Vite SPA) organized into **spaces**
(household / trip / business / custom). Client-side persistence via
`localStorage`, OpenStreetMap-based location/map, and multi-currency support.
Rebuilt from a Claude.ai artifact prototype — see `../HANDOFF.md` for the
original design brief.

## Environment (read first)

- **Node is NOT installed on the host. Everything runs through Docker.** Do not
  suggest installing Node locally.
  - Build / test / lint: `node:22-alpine`
  - E2E: `mcr.microsoft.com/playwright:v1.61.0-noble`
- Docker Desktop must be running, or every command fails.
- `node_modules` is built for Alpine (musl). The Playwright e2e run uses a
  Debian image with an **isolated** `node_modules` volume so the two builds
  don't clobber each other — don't run e2e against the host `node_modules`.

### Run a one-off command

```bash
docker run --rm -v "$PWD/..:/app" -w //app/spending-tracker node:22-alpine \
  sh -c "npm run <script>"
```

### Run the app

```bash
docker compose --profile dev up            # dev server  -> http://localhost:5173
docker compose --profile prod up --build   # nginx build -> http://localhost:8080
```

Dev server runs in a container named `spending-tracker-dev`. Changes to
`vite.config.js` or `.env*` require a **restart**, not just hot reload.

## Quality gate — always

Run **lint → test → build**, in that order, before considering work done. Never
build without linting and testing first.

```bash
npm run verify     # lint → test → build
npm run test:e2e   # Playwright (separate; needs the Playwright image)
```

## Testing is mandatory per feature

Every feature or change ships with the relevant tests at the right layer(s):

- **Unit** — `src/**/*.test.{js,jsx}` — pure logic (Vitest).
- **Integration** — `src/integration/*.integration.test.jsx` — full flows
  against `localStorage` (Vitest + Testing Library). Shared helpers in
  `src/test/flows.js`.
- **E2E** — `e2e/*.spec.js` — real-browser journeys (Playwright). Shared helpers
  in `e2e/helpers.js`. Stub external APIs with `page.route(...)`.

Vitest is scoped to `src/`; Playwright to `e2e/`. They must not collect each
other's files. Always report which layers ran and whether they passed.

## Architecture

```
src/
  App.jsx                root: spaces index, global settings, wizard routing
  components/            screens & UI (SpaceShell, Home/History/Budgets/Settings,
                         ExpenseEditor, SpaceWizard, MapCard, BottomNav, Icon)
  hooks/useStorage.js    localStorage-backed state hook
  lib/
    storage.js           persistence boundary — change here to add a backend
    constants.js         THEMES, curated currencies, storage keys
    colors.js            light/dark token sets
    styles.js            shared inline-style helpers
    currency.js          formatCurrency / snapshot conversion helpers
    exchangeRates.js     rate fetching + session cache
    config.js            env-driven endpoint configuration (VITE_*)
    utils.js             date/money helpers
```

State is plain React state persisted to `localStorage` per space
(`space:{id}:{categories|members|expenses|budgets}`). No backend, no auth.

## Locked design decisions (don't re-litigate or undo without asking)

- **"Space" vs "Budget":** a *space* is the top-level container; *budget* means
  only a per-category monthly limit. Don't reintroduce the overload.
- **Dark mode is global**, not per-space.
- **Currency = Option A:** any expense can be logged in any of the ~24 curated
  currencies; the wizard picks the space's *default*, used for budgets/totals.
- **Exchange rates:** each expense stores a **snapshot** rate at save time, used
  for the per-row "≈ converted" line. Totals/budget bars currently also use the
  snapshot rate (deterministic/offline). The brief wanted *live* rates for
  aggregates — that's a one-line swap in `lib/currency.js` if requested.

## Out of scope (don't build unless asked)

CSV import, per-space dark mode, user accounts/auth.

## Conventions

- Match the surrounding code: inline-style objects via the `lib/styles.js` and
  `lib/colors.js` helpers, lucide-react icons through `components/Icon.jsx`.
- Endpoints come from `lib/config.js` (env-configurable), never hardcoded.
- Prefer bundled npm dependencies over runtime CDN injection.
- Committed `.env.development` / `.env.production` hold public-API URLs only — no
  secrets. Machine-local overrides go in `.env.local` (gitignored).
