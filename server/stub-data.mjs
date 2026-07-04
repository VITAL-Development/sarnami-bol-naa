// Language/UI-language registry plus loaders for the per-language settings
// and per-UI-language string tables authored under ./settings (issue #32).
//
// `/languages` still returns the small code/displayName/status list inline
// here — that's just the discovery list, not the settings payload itself.
// `/settings` and `/ui-strings` are now backed by real files on disk:
//   server/settings/{lang}/language-settings.json
//   server/settings/ui/{lang}/strings.json
// instead of the placeholder objects that used to live in this module (see
// git history prior to issue #32 for the old inline placeholder data).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETTINGS_DIR = path.join(__dirname, "settings");

export const LEARNING_LANGUAGES = [
  { code: "sarnami", displayName: "Sarnami Hindoestani", status: "available" },
  { code: "sranantongo", displayName: "Sranan Tongo", status: "stub" },
];

export const UI_LANGUAGES = [
  { code: "nl", displayName: "Nederlands" },
  { code: "en", displayName: "English" },
];

function readJsonFile(...segments) {
  const filePath = path.join(SETTINGS_DIR, ...segments);
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

export const SETTINGS_BY_LANGUAGE = Object.fromEntries(
  LEARNING_LANGUAGES.map(({ code }) => [code, readJsonFile(code, "language-settings.json")]),
);

export const UI_STRINGS_BY_LANGUAGE = Object.fromEntries(
  UI_LANGUAGES.map(({ code }) => [code, readJsonFile("ui", code, "strings.json")]),
);
