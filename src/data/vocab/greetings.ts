import type { VocabItem } from "@/domain/types";

/**
 * NOT directly attested in Sarnami Byäkaran (Marhé, 1985) — it is a grammar,
 * not a phrasebook. These are widely-used traditional greetings in the
 * Surinamese-Hindustani community; verify against the Hámár Sarnámi Bhásá
 * playlist or sarnamibol before treating as authoritative.
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
    tags: ["greeting", "needs-verification"],
  },
  {
    id: "greet-thik-hai",
    sarnami: "Ham ṭhīk hai",
    dutch: "Met mij gaat het goed",
    tags: ["greeting", "needs-verification"],
  },
  {
    id: "greet-dhanyavad",
    sarnami: "Dhanyavād",
    dutch: "dank u",
    tags: ["greeting", "needs-verification"],
  },
];
