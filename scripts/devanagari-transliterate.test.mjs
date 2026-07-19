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
  assert.equal(toDevanagari("Sarnām"), toDevanagari("sarnām"));
});

// --- known-uncertain cases (documented, not silently "fixed") --------------

test("breve vowels ĕ/ŏ currently map to plain e/o (no nasal mark) -- see VOWELS comment", () => {
  assert.equal(toDevanagari("lŏhār"), "लोहार");
});
