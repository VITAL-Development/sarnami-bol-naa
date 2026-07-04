import type { VocabItem } from "@/domain/types";

/** Verified against Sarnami Byäkaran (Marhé, 1985), p.22, p.25, p.41-42. */
export const nounsVocab: VocabItem[] = [
  {
    id: "noun-ghar",
    sarnami: "ghar",
    dutch: "huis",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-ghari",
    sarnami: "ghaṛī",
    dutch: "klok",
    tags: ["noun", "book-p41"],
  },
  {
    id: "noun-maibap",
    sarnami: "māī-bāp",
    dutch: "ouders",
    notes: "Image-verified tegen p.22 (lopende tekst) en p.31 (samenstellingen, 1.5.1): macron op beide klinkers van māī.",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-bhai",
    sarnami: "bhāī",
    dutch: "broer",
    notes: "Image-verified tegen p.31 (samenstelling bhāī-bahin, 1.5.1); de lopende tekst op p.22 schrijft dit woord daarentegen zonder macron (bhai).",
    tags: ["noun", "book-p31"],
  },
  {
    id: "noun-bahin",
    sarnami: "bahin",
    dutch: "zus",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-maiya",
    sarnami: "maiyā",
    dutch: "moeder",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-bappa",
    sarnami: "bappā",
    dutch: "vader",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-beti",
    sarnami: "beṭī",
    dutch: "dochter",
    tags: ["noun", "book-p25"],
  },
  {
    id: "noun-citthi",
    sarnami: "ciṭṭhi",
    dutch: "brief",
    notes: "Image-verified tegen p.22: retroflexe ṭṭh (dot-below op beide t's), slot-i kort (geen macron).",
    tags: ["noun", "book-p22"],
  },
];
