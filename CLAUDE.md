# Sarnami Bol Naa — Claude guidance

## Running the project

```bash
source ~/.nvm/nvm.sh   # required — nvm is already installed, Node is not on PATH by default
npm install
npm run dev            # http://localhost:5173 (auto-bumps to 5174 if occupied)
```

## Commands

| Command | What it does |
|---|---|
| `npm run typecheck` | TSC type-check (no emit) |
| `npm test` | Vitest unit tests |
| `npm run test:ci` | Vitest with JSON output → `test-results.json` |
| `npm run build` | Type-check + Vite production build → `dist/` |
| `npm run test:e2e` | Playwright E2E visual tests (needs `npm run build` first) |

## Architecture

- **React 18 + TypeScript + Vite** PWA (`vite-plugin-pwa`)
- **React Router v6** — routes: `/` (Path), `/lesson/:lessonId`, `/review`, `/profile`
- **Tailwind CSS v3** with custom tokens (see Design system below)
- **FontAwesome 6 Free Solid** via `@fortawesome/react-fontawesome` — no emoji in UI

### Service layer (`src/services/index.ts`)

Reads `VITE_API_BASE_URL` at build time. If set, uses `HttpContentRepository` + `HttpProgressRepository`; otherwise falls back to `LocalJsonContentRepository` + `LocalStorageProgressRepository`. No code change needed to switch — just set the env var.

### Domain logic

- **Leitner spaced repetition** — 5 boxes, intervals 1/2/4/7/14 days (`src/domain/leitner.ts`)
- **XP** — base 10 XP, 1.5× multiplier for 0 mistakes (`src/domain/gamification.ts`)
- **Streaks** — consecutive calendar-day tracking (YYYY-MM-DD strings)
- **Badges** — 4 milestone badges evaluated on every progress update (`src/data/badges.ts`)
- **Progress storage key** — `sarnami-progress-v1` in localStorage

### Lesson IDs

Actual lesson IDs come from `src/data/units/unit-01-basics.ts` (e.g. `"lesson-1-greetings"`), not numeric slugs like `u01-l01`.

### `useLessonSession` exercise contract

Exercise components receive `onAnswer` (= `submitAnswer`) and must follow this contract:

- Call `onAnswer(true)` **exactly once**, when the exercise is fully solved — this advances `currentIndex` and ends the lesson on the last exercise.
- Call `onAnswer(false)` for **every individual wrong attempt** — this deducts a heart and increments `mistakeCount`, but does **not** advance `currentIndex`.

Single-step exercises (multiple-choice, fill-blank, word-bank) call it once either way. Multi-step exercises like `Matching` (`src/components/exercises/Matching.tsx`) call `onAnswer(false)` per mismatched pair attempt and `onAnswer(true)` only once all pairs are matched — a wrong attempt does not reset progress on already-matched pairs.

## Content authoring

Sarnami romanization uses diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ) that `pdftotext` and similar raw text extraction commonly corrupt or drop (e.g. ā → ä, or the diacritic vanishing entirely). Don't trust extracted text from book-source PDFs directly — verify spellings against rendered page images.

Vocab entries sourced from the book carry `book-pNN` tags for traceability; entries not yet cross-checked against a second source carry `needs-verification` (see `src/data/vocab/greetings.ts`).

## Design system

Colors derived from the Suriname flag:

| Token | Hex | Use |
|---|---|---|
| `forest-600` | `#377E3F` | Primary — buttons, active nav, XP text |
| `flame-600` | `#B40A2D` | Hearts, fail states |
| `gold-400` | `#ECC81D` | Stars, XP bar, streak fire |
| `cream-50/100` | `#fdf6ec / #f8e8c8` | Background, card borders |

All emoji replaced with FontAwesome icons. See `src/components/ui/Icon.tsx` for the wrapper.

## CI

9-job graph on every PR:

```
install ──► typecheck ──────────────────────────────────────► report
        └─► unit-tests ──────────────────────────────────────►
        └─► build ──► visual-home ──────────────────────────►
                  └─► visual-lesson-node ──────────────────►
                  └─► visual-lesson-summary ──────────────►
                  └─► visual-nav ────────────────────────►
                  └─► visual-profile ──────────────────►
```

- `node_modules` cached by `package-lock.json` hash (`node-modules-*` cache key)
- Playwright Chromium binary cached by `package-lock.json` hash (`playwright-*` cache key); visual jobs only run `playwright install-deps chromium` (OS libs, ~5s) on a warm cache
- `dist/` shared as an artifact from `build` to all visual jobs
- `report` job posts a sticky PR comment with a 7-row summary table + per-file unit test detail table

## Deploy

Merge to `main` triggers `deploy.yml`: builds with `VITE_API_BASE_URL=${{ secrets.TAILSCALE_BACKEND_URL }}` and deploys `dist/` to Hetzner `/public_html/sarnami_bol/` via FTPS.

Required secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `TAILSCALE_BACKEND_URL`.
