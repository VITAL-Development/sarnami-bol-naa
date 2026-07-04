// Language/UI-language registry plus loaders for the per-language settings
// and per-UI-language string tables authored under ./settings (issue #32).
//
// `/languages` derives its two lists from directory listings rather than a
// hand-maintained inline array (issue #33), so adding a new learning
// language's `server/content/<code>/` directory or a new UI language's
// `server/settings/ui/<code>/` directory automatically registers it here:
//   - Learning languages: `listLearningLanguageCodes()` /
//     `hasRealContent()` from `content.mjs` (reads `server/content/*`).
//     `displayName` comes from that language's own
//     `server/settings/{code}/language-settings.json` (loaded below) rather
//     than being duplicated here. `status` is `"available"` if the language
//     has authored unit/lesson structure (`content/<code>/units/*.json`),
//     `"stub"` otherwise (e.g. `sranantongo`, which only has stub vocab so
//     far).
//   - UI languages: directory names under `server/settings/ui/*`.
//     `displayName` has no other on-disk source (the string tables
//     themselves don't carry one), so it's a small manifest here.
//
// `/settings` and `/ui-strings` are backed by real files on disk:
//   server/settings/{lang}/language-settings.json
//   server/settings/ui/{lang}/strings.json
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { listLearningLanguageCodes, hasRealContent } from "./content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_DIR = path.join(__dirname, "settings");

function readJsonFile(...segments) {
  const filePath = path.join(SETTINGS_DIR, ...segments);
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

const LEARNING_LANGUAGE_CODES = listLearningLanguageCodes();

export const SETTINGS_BY_LANGUAGE = Object.fromEntries(
  LEARNING_LANGUAGE_CODES.map((code) => [code, readJsonFile(code, "language-settings.json")]),
);

export const LEARNING_LANGUAGES = LEARNING_LANGUAGE_CODES.map((code) => ({
  code,
  displayName: SETTINGS_BY_LANGUAGE[code].displayName,
  status: hasRealContent(code) ? "available" : "stub",
}));

// UI language codes come from the settings directory listing; display names
// have no other on-disk source (the string tables don't self-describe), so
// a small manifest carries them, with a fallback of the bare code for any
// future UI language directory added before its display name is filled in.
const UI_LANGUAGE_DISPLAY_NAMES = {
  nl: "Nederlands",
  en: "English",
};

const UI_LANGUAGE_CODES = readdirSync(path.join(SETTINGS_DIR, "ui"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

export const UI_LANGUAGES = UI_LANGUAGE_CODES.map((code) => ({
  code,
  displayName: UI_LANGUAGE_DISPLAY_NAMES[code] ?? code,
}));

export const UI_STRINGS_BY_LANGUAGE = Object.fromEntries(
  UI_LANGUAGE_CODES.map((code) => [code, readJsonFile("ui", code, "strings.json")]),
);
