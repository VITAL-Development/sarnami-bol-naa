import type { VocabItem } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` now reads its own authored copy directly from
// `server/content/sarnami/vocab/greetings.json` (issues #30/#33) instead of
// bundling this file. Keep the two in sync by hand if this content changes.
/**
 * Verified where possible against baatsiekh.nl's "Uitspraken" soundboard
 * (site spelling uses Dutch-style double vowels for length, e.g. aa/oo,
 * which map to Marhé's macron system; "dj" for the /j/ sound maps to plain
 * j). Rām Rām and Pranām are not covered by that soundboard and are not
 * attested in Sarnami Byäkaran (Marhé, 1985) either — it is a grammar, not
 * a phrasebook — but both are confirmed as used in Sarnami by a native
 * speaker on the team (PR #42), consistent with their common use across
 * the Bhojpuri/Hindi dialect continuum Sarnami descends from.
 */
export const greetingsVocab: VocabItem[] = [
  {
    id: "greet-ram-ram",
    word: "Rām Rām",
    translations: { nl: "hallo / gegroet" },
    tags: ["greeting", "native-speaker"],
    notes:
      "Traditionele Hindostaanse groet, gebruikt onder gelijken — casual/alledaags, in tegenstelling tot het formelere Pranām. Bevestigd als gangbaar in het Sarnami door een moedertaalspreker (PR #42).",
  },
  {
    id: "greet-pranam",
    word: "Pranām",
    translations: { nl: "eerbiedige groet (tegen ouderen)" },
    tags: ["greeting", "native-speaker"],
    notes:
      "Eerbiedige/formele groet, vooral richting ouderen of gerespecteerde personen — formeler dan Rām Rām. Bevestigd als gangbaar in het Sarnami door een moedertaalspreker (PR #42).",
  },
  {
    id: "greet-kaise-hai",
    word: "Kaise hai?",
    translations: { nl: "Hoe gaat het?" },
    tags: ["greeting", "baatsiekh"],
    notes: "Bevestigd door baatsiekh.nl's Uitspraken-soundboard: 'hoe gaat het?' -> kaise.",
  },
  {
    id: "greet-moi-jahe",
    word: "Moi jā hai",
    translations: { nl: "Het gaat goed" },
    tags: ["greeting", "baatsiekh", "book"],
    notes:
      "Vervangt de eerdere ongeverifieerde gok 'Ham ṭhīk hai'. baatsiekh.nl geeft 'moi djahe' voor 'het gaat goed' (dj staat hier voor de j-klank); jā hai is de bevestigde vervoeging van jāi (gaan), zie docs/byakaran/08-the-verb.md ('tū jā hai', 'ū jā hai'). Ontkennende vorm: 'Nā moi jā hai' (het gaat niet goed).",
  },
  {
    id: "greet-dhanyavad",
    word: "Dhanbād",
    translations: { nl: "bedankt / dank u" },
    tags: ["greeting", "baatsiekh"],
    notes:
      "baatsiekh.nl geeft 'dhanbaad' voor 'bedankt' (dubbele klinker -> macron, zoals elders in het boek). Waarschijnlijk een ingekorte, informele uitspraak van het meer formele Hindi-achtige Dhanyavād (niet zelf in het boek geattesteerd, maar wel breed gebruikelijk).",
  },
  {
    id: "greet-ja",
    word: "hāṁ",
    translations: { nl: "ja" },
    tags: ["greeting", "baatsiekh", "book"],
    notes: "Bevestigd in docs/byakaran/07-interjections.md ('hāṁ! = ja!') en baatsiekh.nl's Uitspraken-soundboard.",
  },
  {
    id: "greet-nee",
    word: "nā",
    translations: { nl: "nee" },
    tags: ["greeting", "baatsiekh", "book"],
    notes: "Bevestigd in docs/byakaran/07-interjections.md ('nā! = nee!') en baatsiekh.nl's Uitspraken-soundboard.",
  },
];
