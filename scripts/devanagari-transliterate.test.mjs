import { test } from "node:test";
import assert from "node:assert/strict";

import { toDevanagari } from "./devanagari-transliterate.mjs";

// --- basic vowels/consonants ------------------------------------------------

test("word-initial vowel uses the independent letterform", () => {
  assert.equal(toDevanagari("ām"), "आम");
  assert.equal(toDevanagari("ek"), "एक");
});

test("consonant + vowel uses a matra, not a fresh consonant+vowel pair", () => {
  assert.equal(toDevanagari("roṭī"), "रोटी");
});

test("vowel-after-vowel hiatus uses an independent letterform (gāī)", () => {
  assert.equal(toDevanagari("gāī"), "गाई");
});

test("word-final bare consonant gets no virama (schwa-deletion left unmarked)", () => {
  assert.equal(toDevanagari("ghar"), "घर");
});

// --- consonant clusters / geminates -----------------------------------------

test("geminate consonant cluster gets an explicit virama (kuttā)", () => {
  assert.equal(toDevanagari("kuttā"), "कुत्ता");
});

test("aspirate/retroflex digraphs win over their component single letters", () => {
  assert.equal(toDevanagari("choṭā"), "छोटा");
  assert.equal(toDevanagari("bhāī"), "भाई");
});

test("velar nasal ṅ before a stop forms a conjunct via virama (Laṅkā)", () => {
  assert.equal(toDevanagari("Laṅkā"), "लङ्का");
});

// --- diphthongs --------------------------------------------------------------

test("ai/au diphthongs use their own matra, not vowel-hiatus", () => {
  assert.equal(toDevanagari("hai"), "है");
  assert.equal(toDevanagari("aurat"), "औरत");
  assert.equal(toDevanagari("nau"), "नौ");
});

// --- retroflex flap ----------------------------------------------------------

test("ṛ (retroflex flap) maps to ड़, not the vocalic-ṛ vowel ऋ", () => {
  assert.equal(toDevanagari("laṛkā"), "लड़्का");
});

// --- anusvara ------------------------------------------------------------

test("ṁ and ṃ both map to anusvara ं", () => {
  assert.equal(toDevanagari("kahāṁ"), "कहां");
  assert.equal(toDevanagari("pāṃc"), "पांच");
});

// --- nukta (f) ----------------------------------------------------------

test("f maps to the nukta form फ़, not plain फ", () => {
  assert.equal(toDevanagari("safāī"), "सफ़ाई");
});

// --- multi-word / punctuation passthrough ------------------------------

test("non-letter characters (space, hyphen, ?) pass through untouched", () => {
  assert.equal(toDevanagari("Rām Rām"), "राम राम");
  assert.equal(toDevanagari("dhīre-dhīre"), "धीरे-धीरे");
  assert.equal(toDevanagari("Kaise hai?"), "कैसे है?");
});

test("case is ignored -- capitalized proper nouns transliterate the same as lowercase", () => {
  assert.equal(toDevanagari("Ghar"), toDevanagari("ghar"));
});

// --- known-uncertain cases (documented, not silently "fixed") --------------

test("breve vowels ĕ/ŏ currently map to plain e/o (no nasal mark) -- see VOWELS comment", () => {
  assert.equal(toDevanagari("lŏhār"), "लोहार");
  assert.equal(toDevanagari("sŏnār"), "सोनार");
});

// --- heterorganic nasal + stop -> anusvara (round 2 empirical finding) -----

test("plain n before a velar stop uses anusvara, not an explicit non-homorganic nasal+virama", () => {
  assert.equal(toDevanagari("jangal"), "जंगल");
});

test("already-homorganic ṅ before a velar stop is untouched by the n-before-velar rule", () => {
  assert.equal(toDevanagari("Laṅkā"), "लङ्का");
});

// --- round-2 RAW_WORD_OVERRIDES: owner's direct PR fixes --------------------

test("owner's direct fix: Sarnāmī doubles र to survive the unstressed-syllable cluster", () => {
  assert.equal(toDevanagari("Sarnāmī"), "सर्रनामी");
});

test("owner's direct fix: Sarnām relocates the virama onto the final म", () => {
  assert.equal(toDevanagari("Sarnām"), "सरनाम्");
});

test("owner's direct fix: Lalla Rookh gets an overt ा matra and long-ū रूख", () => {
  assert.equal(toDevanagari("Lalla Rookh"), "लल्ला रूख");
});

test("owner's direct fix: mooi kare's Dutch oo+i renders as ो + independent ई", () => {
  assert.equal(toDevanagari("mooi kare"), "मोई करे");
});

// --- round-3 Dutch-loanword overrides (owner-provided ground truth) --------

test("owner's direct fix: uitleg kare (Dutch g -> ख़)", () => {
  assert.equal(toDevanagari("uitleg kare"), "आोतलेख करे");
});

test("owner's round-4 fix: wachti kare (round-3 had a doubled-व typo)", () => {
  assert.equal(toDevanagari("wachti kare"), "वक्ती करे");
});

test("owner's direct fix: bekeur kare", () => {
  assert.equal(toDevanagari("bekeur kare"), "बकर करे");
});

test("owner's direct fix: beledig kare (Dutch g -> ख़)", () => {
  assert.equal(toDevanagari("beledig kare"), "बलएडेख करे");
});

// --- round-4 ĕ/ŏ loanwords (owner reverted round-3's nasal marking) --------

test("loan-riwors: owner's round-4 fix uses the up-to-date Hindi spelling", () => {
  assert.equal(toDevanagari("riwŏrs kare"), "रिवर्स करे");
});

test("loan-lesiyai: owner's round-4 fix reverts nasal marking", () => {
  assert.equal(toDevanagari("lĕsiyāī"), "लेसियाई");
});

test("loan-setiyave: owner's round-4 fix restructures to सेती-आवे", () => {
  assert.equal(toDevanagari("sĕtiyāve"), "सेती-आवे");
});
