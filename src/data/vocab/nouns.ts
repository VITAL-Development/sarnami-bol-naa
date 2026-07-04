import type { VocabItem } from "@/domain/types";

// This is the frontend's own local/offline fallback copy, used by
// `LocalJsonContentRepository` when `VITE_API_BASE_URL` isn't set (see
// `src/services/index.ts`) — not a duplicate kept for backend-bundling
// purposes. `/server` now reads its own authored copy directly from
// `server/content/sarnami/vocab/nouns.json` (issues #30/#33) instead of
// bundling this file. Keep the two in sync by hand if this content changes.
/** Verified against Sarnami Byäkaran (Marhé, 1985), p.22, p.25, p.41-42. */
export const nounsVocab: VocabItem[] = [
  {
    id: "noun-ghar",
    word: "ghar",
    translations: { nl: "huis" },
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-ghari",
    word: "ghaṛī",
    translations: { nl: "klok" },
    tags: ["noun", "book-p41"],
  },
  {
    id: "noun-maibap",
    word: "māī-bāp",
    translations: { nl: "ouders" },
    notes: "Image-verified tegen p.22 (lopende tekst) en p.31 (samenstellingen, 1.5.1): macron op beide klinkers van māī.",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-bhai",
    word: "bhāī",
    translations: { nl: "broer" },
    notes: "Image-verified tegen p.31 (samenstelling bhāī-bahin, 1.5.1); de lopende tekst op p.22 schrijft dit woord daarentegen zonder macron (bhai).",
    tags: ["noun", "book-p31"],
  },
  {
    id: "noun-bahin",
    word: "bahin",
    translations: { nl: "zus" },
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-maiya",
    word: "maiyā",
    translations: { nl: "moeder" },
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-bappa",
    word: "bappā",
    translations: { nl: "vader" },
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-beti",
    word: "beṭī",
    translations: { nl: "dochter" },
    tags: ["noun", "book-p25"],
  },
  {
    id: "noun-citthi",
    word: "ciṭṭhi",
    translations: { nl: "brief" },
    notes: "Image-verified tegen p.22: retroflexe ṭṭh (dot-below op beide t's), slot-i kort (geen macron).",
    tags: ["noun", "book-p22"],
  },
];
