# Versioning policy

This repo publishes Sarnami's content and settings (`content/sarnami/`,
`settings/sarnami/`) as a live source for the consuming server, which syncs it
via a git-sync sidecar (see [issue #76](https://github.com/VITAL-Development/sarnami-bol-naa/issues/76)
and `docs/deployment.md`). Because a running server reads these files
directly, a change to their **shape** can break a deployment that expects
the old shape. This document defines how we version releases so consumers
can pin to a known-good point and upgrade deliberately, instead of always
tracking whatever `main` happens to be.

## Scheme: SemVer via annotated git tags

Releases are marked with **annotated, SemVer git tags** of the form
`vMAJOR.MINOR.PATCH` (e.g. `v1.4.0`), cut on `main`.

**The git tag is the single source of truth for "what version is this?"**
There is deliberately no `VERSION` file and no `package.json` version field:

- This repo has no `package.json` anymore — the app was extracted into
  separate engine repos in issue #64, so there is nothing that
  reads a `version` field. A `VERSION` file would be a second thing to keep
  in sync with the tag and would inevitably drift.
- git-sync (the consumer's sync mechanism) already speaks refs natively — it
  can track a tag directly (see "Pinning" below), so tags need no
  translation to be useful to the one consumer that matters.

A tag is immutable and points at an exact tree, so "pinned to `v1.4.0`" is
unambiguous and reproducible. `main` is the integration branch and is *not*
a stable target for a production deployment.

### What each part means

Given `content/sarnami/**` and `settings/sarnami/language-settings.json`,
and the fact that the consuming server parses
these files and serves them over its HTTP content contract:

| Bump | When | Consumer impact |
|---|---|---|
| **MAJOR** (`1.x.x` → `2.0.0`) | A **breaking** schema/shape change (see below). | A server on the old version may fail to parse or serve content. Requires a coordinated server upgrade. |
| **MINOR** (`1.3.x` → `1.4.0`) | **Additive** content or schema — new vocab/units/lessons, or a new *optional* field. | Safe. Old consumers ignore what they don't read; new content simply appears. |
| **PATCH** (`1.4.0` → `1.4.1`) | **Content fixes** that don't change shape — spelling/diacritic corrections, translation fixes, fixing a dangling `*Ref`, note edits. | Safe. Same shape, corrected values. |

Pre-1.0.0 (`0.y.z`) the schema is still considered unstable; treat a MINOR
bump as the "may break" signal until the first `v1.0.0` is cut.

## BREAKING vs NON-BREAKING — precise definitions

"Breaking" is defined **relative to what the consuming server reads**, not to
any internal convenience. The authoritative shape is the server's HTTP
content contract (`GET /content`, `GET /settings`); the on-disk files
below are the source those responses are built from.

### BREAKING (MAJOR)

A change is breaking if a server build that predates it could
fail to parse the files, serve malformed responses, or violate the
referential integrity the frontend relies on. Concretely:

- **Renaming or removing a consumed field.** e.g. `word`, `translations`,
  `id`, `tags` on a vocab item (`content/sarnami/vocab/*.json`); `id`,
  `title`, `order`, `lessons`, `newVocab`, `exercises`, `kind`, `contentRef`,
  `xpReward` on a unit/lesson (`content/sarnami/units/*.json`); `lessonId`,
  `exampleSentences`, `exercises`, `correctIndex`, `correctTargetTokens`,
  `sentenceTemplate`, `correctAnswer` in lesson content
  (`content/sarnami/lessons/*.json`); `code`, `scriptDirection`,
  `romanization`, `alphabet`, `audio`, `branding` in
  `settings/sarnami/language-settings.json`.
- **Changing a field's type or meaning.** e.g. `translations` from an object
  to a string, `correctIndex` from a number to a label, `order` from a
  number to a string.
- **Adding a new *required* field** that old content lacks, or making a
  previously optional field required.
- **Changing the set of allowed enum values** consumers switch on — exercise
  `kind` (`multiple-choice` | `word-bank` | `fill-blank` | `matching` |
  `flashcard`), `direction` (`target-to-native` | `native-to-target`).
- **Breaking referential integrity** — removing/renaming a vocab `id`,
  `contentRef`, `exampleSentenceRef`, `grammarNoteRef`, or lesson/unit `id`
  that is still referenced elsewhere, so a ref no longer resolves.
- **Changing the on-disk layout** — renaming/moving `content/sarnami/` or
  `settings/sarnami/`, changing the `{vocab,units,lessons}` subdirectory
  names, or changing the language code segment (`sarnami`). These are wired
  to the server's `CONTENT_DIR`/`SETTINGS_DIR` mounts (see the deployment
  section below); moving them silently empties a deployment.

### NON-BREAKING — additive (MINOR)

Old consumers keep working; new capability is opt-in:

- **New content** — new vocab entries, new units, new lessons, new example
  sentences / grammar notes / exercises. This is the common case.
- **New *optional* fields** — e.g. adding `en` to a `translations` map (which
  is already typed `{ nl: string; en?: string }`), adding an `audioUrl` to a
  vocab item, adding an optional field to `language-settings.json`. Old
  consumers ignore the extra key.
- **New optional exercise metadata** that older engines can safely skip.

### NON-BREAKING — fixes (PATCH)

Same shape, corrected values:

- Fixing a spelling or a dropped/wrong diacritic (ā/ī/ū, ṭ/ḍ/ṇ, ñ/ṅ).
- Fixing or improving a `translations` value or a `notes` string.
- Correcting a wrong `correctIndex`/`correctAnswer`, or fixing a `*Ref` that
  pointed at the wrong (but still existing) id.
- Editing `docs/**` only (grammar reference, this policy) — no served-content
  change at all; still worth a PATCH tag if you want it recorded, otherwise
  it can ride along with the next release.

When a single release mixes levels, take the **highest** applicable bump
(one breaking change in a release full of additions is still a MAJOR).

## Release process

1. Land the changes on `main` via PR as usual.
2. Move the `## [Unreleased]` entries in `CHANGELOG.md` under a new
   `## [X.Y.Z] - YYYY-MM-DD` heading, choosing X.Y.Z per the table above.
3. Commit that changelog edit, then cut an **annotated** tag on it:
   ```bash
   git tag -a vX.Y.Z -m "vX.Y.Z — <one-line summary>"
   git push origin vX.Y.Z
   ```
4. A MAJOR release should be coordinated with the consuming server (open/link
   an issue there) before any deployment repins to it.

## How a git-sync deployment pins and upgrades

> Out of scope for this repo: the server's git-sync implementation
> itself. This section documents how an *operator deploying it* pins to a
> version — a deployment-config choice, no code change required.

The reference `docker-compose.yml` for the server (issue #76) runs a
git-sync sidecar that clones this repo into a shared volume, which
the server mounts read-only via `CONTENT_DIR`/`SETTINGS_DIR`. By
default the sidecar tracks the `main` branch — so it picks up every commit,
including a breaking one, on its next sync interval.

git-sync tracks whatever ref it is told to. **To pin, point it at a tag
instead of `main`:**

- Set the sidecar's ref (`GITSYNC_REF`, or the `--ref` flag) to a release
  tag, e.g. `GITSYNC_REF=v1.4.0` instead of `GITSYNC_REF=main`.
- A tag is immutable, so the sidecar stays on exactly that tree. New commits
  to `main` — including breaking ones — are **not** pulled until an operator
  changes the ref. This is the whole point: production no longer tracks HEAD.

**To upgrade:**

1. Read this repo's `CHANGELOG.md` for the entries between the pinned tag and
   the target tag; note any MAJOR bump.
2. For a MINOR/PATCH upgrade, bump `GITSYNC_REF` to the new tag and let the
   sidecar re-sync (restart the sidecar, or wait for `GITSYNC_PERIOD`). No
   server restart needed — it reads fresh per request.
3. For a MAJOR upgrade, first confirm the running server build
   understands the new shape (per the coordinated release above), then repin.

A deployment that deliberately wants continuous delivery of Sarnami content
can still track `main` — but it accepts that a breaking change here can reach
it unreviewed. Pinning to a tag is the recommended posture for anything
user-facing.
