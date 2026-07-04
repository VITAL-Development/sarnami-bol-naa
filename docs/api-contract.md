# Content/Settings HTTP API Contract

This document is the single source of truth for the HTTP API shared between the
Sarnami Bol Naa frontend and any backend implementation. It exists so
frontend PRs (`src/services/content/HttpContentRepository.ts`,
`src/services/progress/HttpProgressRepository.ts`, a future
`HttpSettingsRepository` / `HttpUiStringsRepository`) and backend PRs
(`server/server.mjs` and successors) can be built independently against the
same shape.

Status: **contract only** — no code changes are made by this document. See
issue #26. A related issue (#27) is generalizing the frontend's hardcoded
`dutch` field on vocab/example-sentence types into a `translations` map; the
shapes below are written in terms of that target shape (`translations: { nl,
en? }`) rather than the current literal `dutch` field, since that is the
direction both frontend and backend are headed.

## Language axes

The app has two independent language axes:

- **Learning language** — the language being taught (the content/vocab/lessons).
  Query parameter: `lang`. Valid values:
  | Code | Display name | Status |
  |---|---|---|
  | `sarnami` | Sarnami Hindoestani | fully implemented |
  | `sranantongo` | Sranan Tongo | stub — route exists, content bundle may be minimal/empty |

- **UI language** — the language of interface chrome (buttons, labels, nav).
  Query parameter: `lang`. Valid values:
  | Code | Display name |
  |---|---|
  | `nl` | Nederlands |
  | `en` | English |

Both axes use the same query parameter name (`lang`) but on different routes
(content-axis routes vs. `/ui-strings`), so there is no ambiguity per-request.
The `GET /languages` route is the discovery endpoint for both lists so
clients never need to hardcode them.

## Conventions

- Base URL is whatever the client configures (`VITE_API_BASE_URL` in the
  frontend, e.g. `http://localhost:8787` for local dev, or the Tailscale
  backend URL in production). All paths below are relative to that base URL.
- All responses are `application/json`, UTF-8. Sarnami romanization uses
  diacritics (ā/ī/ū macrons, ṭ/ḍ/ṇ underdots, ñ/ṅ) — content must be
  transmitted and stored as proper Unicode, not corrupted/stripped ASCII.
- All routes are read-only `GET` except the progress-mutation routes, which
  are `PUT`/`POST`.
- **CORS is fully open** (`Access-Control-Allow-Origin: *`), matching the
  prototype in `server/server.mjs`. The frontend is a statically-hosted PWA
  served from a different origin than the backend, so this is required, not
  incidental. `OPTIONS` preflight requests must return 204 with:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, PUT, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```
- Errors are always `{ "error": "<message>" }` with a non-2xx status code.
  Unknown/invalid language codes on any `lang`-scoped route return **404**
  (not a fallback language, not a 400) — this lets clients distinguish "typo
  in code" from "malformed request" and matches the prototype's 404-for-
  unknown-id behavior on `/units/:id`, `/lessons/:id`, `/vocab/:id`.
- No authentication in this contract's scope. Progress is a single
  authentication-free user's state (see prototype's comment in
  `server/server.mjs`) — carried over as-is, not redesigned here.

---

## `GET /languages`

Lists the available learning languages and UI languages, so the frontend
never has to hardcode the axis lists from the "Language axes" section above.

**Request:** no parameters.

**Response `200`:**

```json
{
  "learningLanguages": [
    { "code": "sarnami", "displayName": "Sarnami Hindoestani", "status": "available" },
    { "code": "sranantongo", "displayName": "Sranan Tongo", "status": "stub" }
  ],
  "uiLanguages": [
    { "code": "nl", "displayName": "Nederlands" },
    { "code": "en", "displayName": "English" }
  ]
}
```

`status` on a learning language is `"available"` (has real content) or
`"stub"` (route resolves but content bundle is minimal/placeholder). This
lets the frontend grey out or badge not-yet-real languages in a language
picker without a separate capability check.

---

## `GET /content?lang={learningLanguage}`

Full content bundle for one learning language: units, their lessons, the
shared vocab pool, and (per issue #31) the lesson-adjacent content pool
(`lessonContent`). Fully self-contained — no lesson/exercise/vocab text lives
in the frontend bundle anymore; everything referenced by id is resolvable
within the same response:

- `newVocab`, `vocabRefs`, `promptVocabRef`, `vocabRef` → resolved against
  the top-level `vocab` array (unchanged since #30).
- `Lesson.exampleSentenceRefs` / `Lesson.grammarNoteRefs` → resolved against
  `lessonContent.exampleSentences` / `lessonContent.grammarNotes`.
- `LessonExercise.contentRef` (on `multiple-choice`, `word-bank`,
  `fill-blank`, `matching` — `flashcard` has none, see below) → resolved
  against `lessonContent.exerciseContent`, a map keyed by that same id.

**Request:** `?lang=sarnami` (required). Example: `GET /content?lang=sarnami`

**Response `200`** — shape generalizes `ContentBundle` / `Unit` / `Lesson` /
`VocabItem` / `LessonContentBundle` from `src/domain/types.ts`, with the
`dutch` field replaced by a `translations` map (per issue #27's direction:
`{ nl: string; en?: string }`, `nl` required since it's the currently-authored
language, `en` optional until backfilled):

```json
{
  "units": [
    {
      "id": "unit-01-basics",
      "title": "De basis",
      "description": "Begroetingen, families en de eerste zinnen.",
      "order": 1,
      "bookChapterRef": "book-p12",
      "lessons": [
        {
          "id": "lesson-1-greetings",
          "unitId": "unit-01-basics",
          "order": 1,
          "title": "Begroetingen",
          "description": "Leer de belangrijkste groeten.",
          "newVocab": ["vocab-ram-ram"],
          "exampleSentenceRefs": ["ex-greet-1"],
          "grammarNoteRefs": ["gram-greet-register"],
          "exercises": [
            {
              "id": "ex1",
              "kind": "multiple-choice",
              "contentRef": "ex1",
              "promptVocabRef": "vocab-ram-ram"
            }
          ],
          "xpReward": 10
        }
      ]
    }
  ],
  "vocab": [
    {
      "id": "vocab-ram-ram",
      "sarnami": "Rām Rām",
      "translations": { "nl": "gegroet (formeel/religieus)", "en": "greetings (formal/religious)" },
      "audioUrl": "/audio/sarnami/ram-ram.mp3",
      "tags": ["greetings", "book-p12"],
      "notes": "Gebruikt bij het begroeten van ouderen of in religieuze context."
    }
  ],
  "lessonContent": {
    "exampleSentences": [
      {
        "id": "ex-greet-1",
        "sarnami": "Rām Rām, kaise ho?",
        "translations": { "nl": "Gegroet, hoe gaat het?", "en": "Greetings, how are you?" },
        "vocabRefs": ["vocab-ram-ram"]
      }
    ],
    "grammarNotes": [
      {
        "id": "gram-greet-register",
        "title": "Formeel vs. informeel",
        "body": "Rām Rām is een formele/religieuze groet; Pranām wordt gebruikt richting ouderen.",
        "relatedVocab": ["vocab-ram-ram"]
      }
    ],
    "exerciseContent": {
      "ex1": {
        "prompt": "Wat betekent 'Rām Rām'?",
        "options": ["Hallo/gegroet", "Tot ziens", "Dank je wel", "Alsjeblieft"],
        "correctIndex": 0
      }
    }
  }
}
```

Notes on exercise kinds carried through unchanged from `LessonExercise` in
`src/domain/types.ts` (`multiple-choice`, `word-bank`, `fill-blank`,
`matching`, `flashcard`):

- As of issue #31, `multiple-choice`/`word-bank`/`fill-blank`/`matching`
  exercises carry no literal text at all — only `id`, `kind`, `contentRef`,
  and (for `multiple-choice`) an optional `promptVocabRef`. Their prompt/
  options/answer text lives in `lessonContent.exerciseContent[contentRef]`,
  shaped as `MultipleChoiceContent` / `WordBankContent` / `FillBlankContent`
  / `MatchingContent` respectively (see `src/domain/types.ts`).
- `flashcard` has no `contentRef` — its front/back text is resolved from
  `vocabRef` against `vocab`, not from `lessonContent`.
- Fields with a hardcoded `Dutch`/`dutch` name are renamed to be
  translation-map-based for consistency with #27, now living on the content
  shapes above rather than the exercise itself:
  - `WordBankContent.promptTranslations: { nl, en? }` (was
    `WordBankExercise.promptDutch`)
  - `FillBlankContent.translations: { nl, en? }` (was
    `FillBlankExercise.dutchTranslation`)
  - `FlashcardExercise.direction`: still `"sarnami-to-dutch" |
    "dutch-to-sarnami"` as of this writing — renaming it to
    `"sarnami-to-ui" | "ui-to-sarnami"` is out of scope for #31 (no literal
    text to extract there) and remains open follow-on work.

**Errors:**
- `404 { "error": "Unknown learning language: <code>" }` if `lang` isn't one
  of the codes from `GET /languages`.
- `400 { "error": "Missing required query parameter: lang" }` if `lang` is
  omitted.

---

## `GET /settings?lang={learningLanguage}`

Language-specific settings for a learning language: romanization/diacritic
rules, alphabet, script direction, and audio configuration. This is metadata
*about* the language, distinct from the lesson/vocab content itself.

On disk, each learning language's settings are authored as their own file:
`server/settings/{learningLanguage}/language-settings.json` (e.g.
`server/settings/sarnami/language-settings.json`). The server reads these at
startup and serves them verbatim from `GET /settings`.

**Request:** `?lang=sarnami` (required). Example: `GET /settings?lang=sarnami`

**Response `200`:**

```json
{
  "code": "sarnami",
  "displayName": "Sarnami Hindoestani",
  "scriptDirection": "ltr",
  "romanization": {
    "scheme": "IAST-derived",
    "diacritics": [
      { "char": "ā", "description": "long a (macron)" },
      { "char": "ī", "description": "long i (macron)" },
      { "char": "ū", "description": "long u (macron)" },
      { "char": "ṭ", "description": "retroflex t (underdot)" },
      { "char": "ḍ", "description": "retroflex d (underdot)" },
      { "char": "ṇ", "description": "retroflex n (underdot)" },
      { "char": "ñ", "description": "palatal nasal" },
      { "char": "ṅ", "description": "velar nasal" }
    ],
    "notes": "Raw text extraction from book-source PDFs commonly corrupts or drops these diacritics (e.g. ā → ä, or vanishing entirely); content must be verified against rendered page images, not trusted from pdftotext output."
  },
  "alphabet": {
    "vowels": ["a", "ā", "i", "ī", "u", "ū", "e", "o"],
    "consonants": ["k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m", "y", "r", "l", "v", "ś", "s", "h"]
  },
  "audio": {
    "baseUrl": "/audio/sarnami/",
    "format": "mp3",
    "voice": "single-speaker-tts"
  }
}
```

For a stub language (`sranantongo`), the same shape is returned with
placeholder/minimal values (e.g. empty `diacritics` array) rather than a 404
— the language is "registered" per `GET /languages`, just not content-complete.
`scriptDirection` is still populated (`"ltr"`) even for a stub, since script
direction is a known fact about the language regardless of content
completeness; Sranan Tongo's `romanization.notes` explicitly calls out that
it does **not** use Sarnami's macron/underdot diacritics — it's written in
plain Dutch-derived Latin orthography, per the grammar docs.

**Errors:**
- `404 { "error": "Unknown learning language: <code>" }` if `lang` isn't a
  registered learning language code.
- `400 { "error": "Missing required query parameter: lang" }` if omitted.

---

## `GET /ui-strings?lang={uiLanguage}`

Locale string table for interface chrome. Replaces the
`src/i18n/strings.nl.ts` compile-time pattern (see `src/i18n/t.ts`) with a
runtime-fetched table, so adding a UI language doesn't require a frontend
rebuild. The nested shape mirrors the existing `strings.nl.ts` object
structure exactly (`nav.*`, `path.*`, `lesson.*`, `review.*`, `profile.*`)
so the dot-path lookup in `t.ts` (`DotPaths<Strings>`) continues to work
unchanged against the fetched object.

On disk, each UI language's string table is authored as its own file:
`server/settings/ui/{uiLanguage}/strings.json` (e.g.
`server/settings/ui/nl/strings.json`, `server/settings/ui/en/strings.json`).
The server reads these at startup and serves them verbatim from
`GET /ui-strings`.

**Request:** `?lang=nl` (required). Example: `GET /ui-strings?lang=nl`

**Response `200`:**

```json
{
  "appName": "Sarnami Bol Naa",
  "nav": {
    "path": "Pad",
    "review": "Oefenen",
    "profile": "Profiel"
  },
  "path": {
    "title": "Jouw leerpad",
    "lessonLocked": "Voltooi de vorige les om deze te ontgrendelen.",
    "startLesson": "Start les"
  },
  "lesson": {
    "checkAnswer": "Controleren",
    "continue": "Verder",
    "correct": "Goed zo!",
    "incorrect": "Niet helemaal — proberen we het nog eens?",
    "heartsRemaining": "levens over",
    "lessonComplete": "Les voltooid!",
    "lessonFailed": "Geen levens meer — probeer het opnieuw.",
    "backToPath": "Terug naar het pad",
    "tryAgain": "Opnieuw proberen",
    "xpEarned": "XP verdiend"
  },
  "review": {
    "title": "Herhalen",
    "empty": "Niets te herhalen vandaag — kom morgen terug!",
    "showAnswer": "Toon antwoord",
    "knewIt": "Wist ik!",
    "didntKnowIt": "Wist ik niet"
  },
  "profile": {
    "title": "Profiel",
    "xp": "XP",
    "streak": "dagen op rij",
    "badges": "Badges",
    "noBadgesYet": "Nog geen badges verdiend — ga aan de slag!"
  }
}
```

An `en` response has the same key structure with English values. Every key
present in the `nl` table must be present in every other UI language's table
(no partial locales) — the client has no per-key fallback logic.

**Errors:**
- `404 { "error": "Unknown UI language: <code>" }` if `lang` isn't `nl` or
  `en`.
- `400 { "error": "Missing required query parameter: lang" }` if omitted.

---

## Progress routes (carried over, not lang-scoped)

These routes existed in the prior backend prototype
(`server/server.mjs` in the `agent-a7709a5db98bdad0c` worktree) and are
documented here unchanged. Progress is per-user state, not per-language
content, so none of these take a `lang` parameter — a user's XP/streak/
hearts/Leitner boxes are tracked once regardless of which learning language
they're studying. (If multi-learning-language progress tracking is wanted
later, that's a separate, larger change — out of scope here.)

Types referenced (`UserProgress`, `LessonResult`) are defined in
`src/domain/types.ts` and used as-is by
`src/services/progress/HttpProgressRepository.ts`.

### `GET /progress`

Returns the current user's progress. If none exists yet, the backend
initializes and returns a fresh `UserProgress` (does not 404).

**Response `200`:**

```json
{
  "xp": 240,
  "streak": { "count": 3, "lastCompletedDate": "2026-07-03" },
  "hearts": { "current": 5, "max": 5 },
  "completedLessons": {
    "lesson-1-greetings": { "stars": 3, "completedAt": "2026-07-01" }
  },
  "leitnerBoxes": {
    "vocab-ram-ram": { "box": 2, "lastReviewedAt": "2026-07-03" }
  },
  "earnedBadges": ["first-lesson"]
}
```

### `PUT /progress`

Overwrites the current user's progress wholesale (used for local ↔ remote
migration/sync, not incremental updates).

**Request body:** a full `UserProgress` object (same shape as the `GET`
response above).

**Response:** `204 No Content`.

### `POST /progress/lesson-completion`

Records a completed lesson attempt; server recomputes XP (with the 1.5x
no-mistakes multiplier), streak, star rating, and any newly-introduced
vocab's initial Leitner box, then re-evaluates badges.

**Request body** (`LessonResult` shape):

```json
{
  "lessonId": "lesson-1-greetings",
  "mistakeCount": 0,
  "passed": true,
  "vocabIntroduced": ["vocab-ram-ram"]
}
```

**Response `200`:** the updated `UserProgress` (same shape as `GET
/progress`). If `passed: false`, progress is returned unchanged (no XP/streak
side effects) — matching the prototype's behavior.

### `POST /progress/review-result`

Records the outcome of one spaced-repetition review card; server advances or
resets that vocab item's Leitner box and re-evaluates badges.

**Request body:**

```json
{
  "vocabId": "vocab-ram-ram",
  "correct": true
}
```

**Response `200`:** the updated `UserProgress` (same shape as `GET
/progress`).

---

## Error response summary

| Status | When | Body |
|---|---|---|
| `400` | Required `lang` query param missing | `{ "error": "Missing required query parameter: lang" }` |
| `404` | Unknown/unregistered language code on any `lang`-scoped route | `{ "error": "Unknown learning language: <code>" }` or `{ "error": "Unknown UI language: <code>" }` |
| `404` | Unknown route entirely | `{ "error": "Not found" }` |
| `500` | Unhandled server error | `{ "error": "Internal server error" }` |

204 (no body) is used for successful writes that don't return a resource
(`OPTIONS` preflight, `PUT /progress`).
