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
    sarnami: "mai-bāp",
    dutch: "ouders",
    tags: ["noun", "book-p22"],
  },
  {
    id: "noun-bhai",
    sarnami: "bhāi",
    dutch: "broer",
    tags: ["noun", "book-p22"],
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
    sarnami: "citthī",
    dutch: "brief",
    tags: ["noun", "book-p22"],
  },
];
