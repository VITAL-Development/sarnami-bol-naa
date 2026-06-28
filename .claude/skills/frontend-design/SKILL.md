---
name: frontend-design
description: Use this skill when making any visual, styling, or design changes to the Sarnami Bol Naa app — including colour palette changes, icon replacements, component restyling, layout tweaks, Tailwind config changes, or adding new UI libraries. Also use when the user mentions the Suriname flag colours, FontAwesome, emoji replacement, dark/light mode, or asks for the app to "look better", "feel more polished", or references a visual design direction.
version: 1.0.0
---

# Frontend Design Skill — Sarnami Bol Naa

This skill captures the design system, constraints, and workflow for making visual changes to the Sarnami Bol Naa PWA.

---

## Design System

### Colour Palette

The palette is derived from the **Suriname national flag** (green, white, red, yellow) plus a warm cream background.

Defined in `tailwind.config.ts`. Current token names (check the file — they may have been renamed as the project evolves):

| Token group | Purpose | Key hex |
|---|---|---|
| `forest-*` | Primary interactive: buttons, active nav, unlocked lessons, success states | #377E3F (flag green) |
| `flame-*` | Hearts / danger / failure states | #B40A2D (flag red) |
| `gold-*` | XP, streaks, star ratings | #ECC81D (flag yellow) |
| `cream-*` | Page background, card borders | #fdf6ec / #f8e8c8 |
| `stone-*` | Body text, locked states, empty indicators | Tailwind default |

Always read `tailwind.config.ts` before editing colours — confirm the exact token names are still correct.

### Icons

The app uses **FontAwesome 6 Free Solid** via `@fortawesome/react-fontawesome`. Never use raw emoji in UI components.

Thin wrapper lives at `src/components/ui/Icon.tsx`:
```tsx
<Icon icon={faHeart} className="text-flame-600" />
```

Current icon mappings:
| UI element | FA icon |
|---|---|
| Heart / lives | `faHeart` |
| Fire / streak | `faFire` |
| Star / XP & ratings | `faStar` |
| Lock / gated lesson | `faLock` |
| Pass / correct | `faCircleCheck` |
| Fail / broken heart | `faHeartCrack` |
| Path nav | `faRoute` |
| Review nav | `faRotate` |
| Profile nav | `faUser` |
| Badge: first lesson | `faSeedling` |
| Badge: unit complete | `faTrophy` |
| Badge: streak | `faFire` |
| Badge: perfect lesson | `faMedal` |

### Typography & Shape

- Body: `text-stone-800`, background: `bg-cream-50`
- Buttons: `rounded-2xl px-5 py-3 font-semibold`
- Cards: `rounded-3xl border border-cream-100 bg-white shadow-sm`
- Keep friendly, rounded shapes — don't introduce sharp corners

---

## File Map

Key files to touch for design changes:

| File | What it controls |
|---|---|
| `tailwind.config.ts` | Colour tokens, any custom theme extensions |
| `src/styles/index.css` | Global body defaults |
| `src/components/ui/Button.tsx` | Button variants (primary / secondary / ghost) |
| `src/components/ui/Card.tsx` | Card wrapper |
| `src/components/ui/Icon.tsx` | FA icon wrapper |
| `src/components/hud/` | XPBar, StreakBadge, HeartsBar |
| `src/components/layout/AppShell.tsx` | Header, bottom nav |
| `src/components/path/SkillNode.tsx` | Lesson node (locked / active / complete) |
| `src/components/feedback/LessonSummary.tsx` | Pass/fail card |
| `src/routes/Profile.tsx` | Badge grid, stats display |
| `src/routes/HomePath.tsx` | HUD placement, lesson list |
| `src/data/badges.ts` | Badge icon identifiers (strings mapped to FA icons in Profile.tsx) |

---

## Workflow

### 1. Read before editing

Always read `tailwind.config.ts` and any component file before editing it. Colour token names and component structure may have drifted from this skill's snapshot.

### 2. Work on a dedicated branch

Design changes go on their own branch (e.g. `design/...`) and are submitted as a separate PR from feature work. This makes visual diffs easier to review.

```bash
git checkout main && git pull
git checkout -b design/<short-description>
```

### 3. Install new packages if needed

If adding a new icon set, animation library, or font:
```bash
source ~/.nvm/nvm.sh && npm install <package>
```

For FontAwesome (already installed, but if starting fresh):
```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

### 4. Make changes bottom-up

Edit in this order to avoid cascading surprises:
1. `tailwind.config.ts` (tokens)
2. `src/styles/index.css` (globals)
3. Primitive components (`Button`, `Card`, `Icon`)
4. HUD components
5. Layout / nav
6. Route-level components

### 5. Typecheck and test

```bash
source ~/.nvm/nvm.sh
npm run typecheck   # must pass — no TS errors
npm test            # 61 domain tests must still pass (they don't touch styles)
```

### 6. Run and verify visually

```bash
source ~/.nvm/nvm.sh && npm run dev -- --host
```

Check these views in the browser:
- **Home (/)** — HUD (XP star, fire streak, heart lives), lesson nodes (locked / active / complete with star ratings)
- **Lesson (/lesson/:id)** — progress bar, hearts in header, exercise flow
- **Lesson summary** — pass (green check) and fail (red broken heart) states
- **Review (/review)** — flashcard queue or empty state
- **Profile (/profile)** — XP + streak stats, badge grid with FA icons

No emoji should be visible in the UI. All interactive elements should use `forest-*` green as their primary colour.

### 7. Commit and open PR

```bash
git add <files>
git commit -m "design: <description>"
gh pr create --title "..." --body "..."
```

---

## Common Pitfalls

- **`sarnami-*` colour classes**: The original palette used `sarnami-600` etc. If you see these in a component, they're stale — replace with the new token names.
- **Emoji in badge icons**: `src/data/badges.ts` stores icon identifiers as strings (e.g. `"trophy"`). The rendering layer (`Profile.tsx`) maps these to FA icon objects. Don't store FA icon objects in the data layer.
- **`nvm` not on PATH**: Always `source ~/.nvm/nvm.sh` before running npm commands in a shell that doesn't have it loaded.
- **PWA service worker**: After a visual build, the PWA service worker may serve a cached old version. Hard refresh (Ctrl+Shift+R) or open in an incognito window.
