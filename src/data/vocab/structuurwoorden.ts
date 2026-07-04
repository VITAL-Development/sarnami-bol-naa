import type { VocabItem } from "@/domain/types";

/**
 * Structuurwoorden (function words) sourced from sarnamibhasa.nl's
 * "Vocabulaire" pages (see docs/sarnamibhasa-vocab.md for the full
 * extracted list, cross-checked against the site's 4 pages). Where a term
 * also appears in Sarnami Byākaran (Marhé, 1985), the book's diacritic
 * spelling is used and cited; sarnamibhasa.nl itself does not use
 * diacritics consistently, so terms only found on the site keep
 * `needs-verification`.
 */
export const structuurwoordenVocab: VocabItem[] = [
  {
    id: "struct-en",
    sarnami: "aur",
    dutch: "en",
    notes: "Nevenschikkend voegwoord. Ook: auro, auru, au, a.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-maar",
    sarnami: "baki",
    dutch: "maar",
    notes: "sarnamibhasa.nl geeft ook balki, magar als varianten.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-of",
    sarnami: "yā",
    dutch: "of",
    notes: "Ook: ki, ki to.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-dat",
    sarnami: "ki",
    dutch: "dat (voegwoord)",
    notes: "Onderschikkend voegwoord; ki heeft ook de betekenis 'of'. Ook: kī.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-als",
    sarnami: "jo",
    dutch: "als, indien",
    notes: "Ook: ja. Correlaat: jo … to (indien … dan). sarnamibhasa.nl geeft ook jab, agar.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-dan",
    sarnami: "tab",
    dutch: "dan (gevolg)",
    notes: "Correlaat van jo … to.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-omdat",
    sarnami: "kāhe se",
    dutch: "omdat, want",
    notes: "Volledige vorm: kāhe (se) (ki). sarnamibhasa.nl: káhense, káren ki.",
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-anders",
    sarnami: "nahīm to",
    dutch: "anders",
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-sinds",
    sarnami: "jab se",
    dutch: "sinds, sedert",
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-toch",
    sarnami: "tabbo",
    dutch: "toch",
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-altijd",
    sarnami: "hardam",
    dutch: "altijd",
    notes: "Ook: roj-nit.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-nooit",
    sarnami: "kabhī nā",
    dutch: "nooit",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-weer",
    sarnami: "phir",
    dutch: "weer, opnieuw",
    notes: "Ook: phin, phiro, phino.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-eerst",
    sarnami: "pahile",
    dutch: "eerst",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-dichtbij",
    sarnami: "nagicce",
    dutch: "dichtbij",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-ver",
    sarnami: "dūr",
    dutch: "ver",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-ongeveer",
    sarnami: "lagbhag",
    dutch: "ongeveer",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-misschien",
    sarnami: "sait",
    dutch: "misschien",
    notes: "sarnamibhasa.nl geeft ook isáit, sáit.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-in",
    sarnami: "mem",
    dutch: "in",
    notes: "Achterzetsel: staat achter het woord waarmee het verbonden is.",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-op",
    sarnami: "par",
    dutch: "op",
    notes: "Ook: pe. Achterzetsel.",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-van-aan",
    sarnami: "ke",
    dutch: "van, aan",
    notes: "Achterzetsel; vormt ook samengestelde achterzetsels (ke uppar, ke bāhar, ...).",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-zonder",
    sarnami: "ke binā",
    dutch: "zonder",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
];
