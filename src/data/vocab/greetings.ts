import type { VocabItem } from "@/domain/types";

/**
 * Verified where possible against baatsiekh.nl's "Uitspraken" soundboard
 * (site spelling uses Dutch-style double vowels for length, e.g. aa/oo,
 * which map to Marhé's macron system; "dj" for the /j/ sound maps to plain
 * j). Rām Rām and Pranām are not covered by that soundboard and are not
 * attested in Sarnami Byäkaran (Marhé, 1985) either — it is a grammar, not
 * a phrasebook — so they remain `needs-verification` traditional greetings
 * used in the Surinamese-Hindustani community.
 */
export const greetingsVocab: VocabItem[] = [
  {
    id: "greet-ram-ram",
    sarnami: "Rām Rām",
    dutch: "hallo / gegroet",
    tags: ["greeting", "needs-verification"],
    notes: "Traditionele Hindostaanse groet, gebruikt onder gelijken.",
  },
  {
    id: "greet-pranam",
    sarnami: "Pranām",
    dutch: "eerbiedige groet (tegen ouderen)",
    tags: ["greeting", "needs-verification"],
  },
  {
    id: "greet-kaise-hai",
    sarnami: "Kaise hai?",
    dutch: "Hoe gaat het?",
    tags: ["greeting", "baatsiekh"],
    notes: "Bevestigd door baatsiekh.nl's Uitspraken-soundboard: 'hoe gaat het?' -> kaise.",
  },
  {
    id: "greet-moi-jahe",
    sarnami: "Moi jā hai",
    dutch: "Het gaat goed",
    tags: ["greeting", "baatsiekh", "book"],
    notes:
      "Vervangt de eerdere ongeverifieerde gok 'Ham ṭhīk hai'. baatsiekh.nl geeft 'moi djahe' voor 'het gaat goed' (dj staat hier voor de j-klank); jā hai is de bevestigde vervoeging van jāi (gaan), zie docs/byakaran/08-the-verb.md ('tū jā hai', 'ū jā hai'). Ontkennende vorm: 'Nā moi jā hai' (het gaat niet goed).",
  },
  {
    id: "greet-dhanyavad",
    sarnami: "Dhanbād",
    dutch: "bedankt / dank u",
    tags: ["greeting", "baatsiekh"],
    notes:
      "baatsiekh.nl geeft 'dhanbaad' voor 'bedankt' (dubbele klinker -> macron, zoals elders in het boek). Waarschijnlijk een ingekorte, informele uitspraak van het meer formele Hindi-achtige Dhanyavād (niet zelf in het boek geattesteerd, maar wel breed gebruikelijk).",
  },
  {
    id: "greet-ja",
    sarnami: "hāṁ",
    dutch: "ja",
    tags: ["greeting", "baatsiekh", "book"],
    notes: "Bevestigd in docs/byakaran/07-interjections.md ('hāṁ! = ja!') en baatsiekh.nl's Uitspraken-soundboard.",
  },
  {
    id: "greet-nee",
    sarnami: "nā",
    dutch: "nee",
    tags: ["greeting", "baatsiekh", "book"],
    notes: "Bevestigd in docs/byakaran/07-interjections.md ('nā! = nee!') en baatsiekh.nl's Uitspraken-soundboard.",
  },
];
