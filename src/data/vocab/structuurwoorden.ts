import type { VocabItem } from "@/domain/types";

// TODO(remove once /server's /content endpoint reads from server/content/
// directly instead of bundling ../src/data): the source of truth for this
// data is now server/content/sarnami/vocab/structuurwoorden.json (issue
// #30). This file stays in place until server.mjs's content-serving logic
// is rewired (issue #33) and the frontend's LocalJsonContentRepository
// offline fallback is reconsidered.
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
    translations: { nl: "en" },
    notes: "Nevenschikkend voegwoord. Ook: auro, auru, au, a.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-maar",
    sarnami: "baki",
    translations: { nl: "maar" },
    notes: "sarnamibhasa.nl geeft ook balki, magar als varianten.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-of",
    sarnami: "yā",
    translations: { nl: "of" },
    notes: "Ook: ki, ki to.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-dat",
    sarnami: "ki",
    translations: { nl: "dat (voegwoord)" },
    notes: "Onderschikkend voegwoord; ki heeft ook de betekenis 'of'. Ook: kī.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-als",
    sarnami: "jo",
    translations: { nl: "als, indien" },
    notes: "Ook: ja. Correlaat: jo … to (indien … dan). sarnamibhasa.nl geeft ook jab, agar.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-dan",
    sarnami: "tab",
    translations: { nl: "dan (gevolg)" },
    notes: "Correlaat van jo … to.",
    tags: ["conjunction", "sarnamibhasa", "book-p49"],
  },
  {
    id: "struct-omdat",
    sarnami: "kāhe se",
    translations: { nl: "omdat, want" },
    notes: "Volledige vorm: kāhe (se) (ki). sarnamibhasa.nl: káhense, káren ki.",
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-anders",
    sarnami: "nahīm to",
    translations: { nl: "anders" },
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-sinds",
    sarnami: "jab se",
    translations: { nl: "sinds, sedert" },
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-toch",
    sarnami: "tabbo",
    translations: { nl: "toch" },
    tags: ["conjunction", "sarnamibhasa", "book-p50"],
  },
  {
    id: "struct-altijd",
    sarnami: "hardam",
    translations: { nl: "altijd" },
    notes: "Ook: roj-nit.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-nooit",
    sarnami: "kabhī nā",
    translations: { nl: "nooit" },
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-weer",
    sarnami: "phir",
    translations: { nl: "weer, opnieuw" },
    notes: "Ook: phin, phiro, phino.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-eerst",
    sarnami: "pahile",
    translations: { nl: "eerst" },
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-dichtbij",
    sarnami: "nagicce",
    translations: { nl: "dichtbij" },
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-ver",
    sarnami: "dūr",
    translations: { nl: "ver" },
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-ongeveer",
    sarnami: "lagbhag",
    translations: { nl: "ongeveer" },
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-misschien",
    sarnami: "sait",
    translations: { nl: "misschien" },
    notes: "sarnamibhasa.nl geeft ook isáit, sáit.",
    tags: ["adverb", "sarnamibhasa", "book-p79"],
  },
  {
    id: "struct-in",
    sarnami: "mem",
    translations: { nl: "in" },
    notes: "Achterzetsel: staat achter het woord waarmee het verbonden is.",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-op",
    sarnami: "par",
    translations: { nl: "op" },
    notes: "Ook: pe. Achterzetsel.",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-van-aan",
    sarnami: "ke",
    translations: { nl: "van, aan" },
    notes: "Achterzetsel; vormt ook samengestelde achterzetsels (ke uppar, ke bāhar, ...).",
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
  {
    id: "struct-zonder",
    sarnami: "ke binā",
    translations: { nl: "zonder" },
    tags: ["postposition", "sarnamibhasa", "book-p86"],
  },
];
