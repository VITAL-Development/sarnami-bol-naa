#!/usr/bin/env node
// Generates Piper TTS audio (hi_IN-rohan-medium voice, Devanagari input) for
// a small, explicit set of content/sarnami/vocab/*.json entries -- part 1/2
// of sarnami-bol-naa#280's migration off facebook/mms-tts-hns (see
// devanagari-transliterate.mjs's header comment for the "why").
//
// SCOPE: this script is a SMOKE-TEST tool, not the batch generator. It
// takes an explicit --ids list (or defaults to the 6 words used in this
// repo's earlier hns/Piper comparison testing) and writes .wav files to a
// scratch output directory -- never content/sarnami/audio/, which is
// reserved for audio this repo actually serves. Running this against all
// ~312 vocab entries, converting to mp3, and publishing into
// content/sarnami/audio/ is part 2's job (likely alongside an automated
// ASR-check-and-retry loop -- see the --workaround flag below for the one
// case that loop will need to generalize).
//
// Dependency-free Node, consistent with this repo's "no npm tooling"
// convention (see scripts/generate-audio.mjs) -- shells out to a Piper
// install via child_process rather than adding an npm/piper JS binding.
//
// Requires a working Piper install (see README's link, or reuse an
// existing venv): set PIPER_BIN to the `piper` executable (defaults to
// "piper" on PATH) and PIPER_MODEL to the .onnx voice model path (required,
// no sensible default -- voice models aren't checked into this repo).
//
// Usage:
//   PIPER_MODEL=/path/to/hi_IN-rohan-medium.onnx node scripts/generate-audio-piper.mjs
//   PIPER_MODEL=... node scripts/generate-audio-piper.mjs --ids adj-sojha,noun-sarnam
//   PIPER_MODEL=... node scripts/generate-audio-piper.mjs --out /some/scratch/dir

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { toDevanagari } from "./devanagari-transliterate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "..");
const VOCAB_DIR = path.join(REPO_ROOT, "content", "sarnami", "vocab");

// The 6 words used in this repo's earlier hns/Piper comparison testing
// (issue #280) -- default smoke-test set when --ids isn't given.
const DEFAULT_SMOKE_TEST_IDS = [
  "about-sarnami",
  "adj-sojha",
  "noun-sarnam",
  "struct-eerst",
  "verb-sikhe",
  "greet-nee",
];

// Known Piper mispronunciation workarounds, keyed by vocab id. This
// smoke test re-confirmed the earlier finding for adj-sojha: Piper
// pronounces झ (jha) as ध (dha) in plain "सोझा". A hyphenated syllable
// break ("सो-झा") was reported as a fix in earlier testing, but did NOT
// hold up under this session's ASR round-trip (facebook/mms-1b-all, hin
// adapter): with Piper's default stochastic noise-scale, plain "सोझा" came
// back correct (झ) 0/5 times across 5 samples vs. hyphenated "सो-झा" 3/5 --
// better, but not reliable -- and with --noise-scale 0 --noise-w-scale 0
// (deterministic), "सो-झा" still round-tripped to "सोधा" (still wrong). A
// SPACE-separated break ("सो झा") is the one that round-tripped correctly
// under both the deterministic run and the majority of the 5-sample
// stochastic run, so that's what's used below (hyphen appears to read as a
// weaker/no-op boundary here, at least on this voice/Piper version --
// worth re-checking if a future Piper/voice upgrade changes this). This
// table lets the smoke test synthesize the workaround alongside the
// mechanical toDevanagari() output for direct comparison -- it is NOT
// applied inside toDevanagari() itself (that function stays a faithful,
// general-purpose transliterator; workarounds are a TTS-input concern,
// layered on top). Part 2's automated ASR-check-and-retry loop is expected
// to discover and apply more of these across the full 312-word vocab, and
// should account for Piper's per-call noise -- a single ASR pass isn't
// enough to trust a fix; see the report for the multi-sample methodology.
export const KNOWN_WORKAROUNDS = {
  "adj-sojha": "सो झा",
};

export function readVocabEntries(vocabDir = VOCAB_DIR) {
  const files = readdirSync(vocabDir).filter((f) => f.endsWith(".json")).sort();
  const entries = [];
  for (const file of files) {
    const items = JSON.parse(readFileSync(path.join(vocabDir, file), "utf-8"));
    for (const item of items) {
      if (typeof item.id !== "string" || typeof item.word !== "string") continue;
      entries.push({ id: item.id, word: item.word });
    }
  }
  return entries;
}

export function synthesize({ piperBin, modelPath, text, outFile, extraArgs = [] }) {
  const result = spawnSync(
    piperBin,
    ["--model", modelPath, "--output_file", outFile, ...extraArgs],
    { input: text, encoding: "utf-8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `piper failed (exit ${result.status}) for "${text}" -> ${outFile}:\n${result.stderr}`,
    );
  }
  return result;
}

function parseArgs(argv) {
  const args = { ids: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--ids") args.ids = argv[++i].split(",").map((s) => s.trim());
    else if (argv[i] === "--out") args.out = argv[++i];
    else throw new Error(`Unrecognized argument: ${argv[i]}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const piperBin = process.env.PIPER_BIN || "piper";
  const modelPath = process.env.PIPER_MODEL;
  if (!modelPath) {
    console.error("PIPER_MODEL env var is required (path to a Piper .onnx voice model).");
    process.exit(2);
  }

  const ids = args.ids || DEFAULT_SMOKE_TEST_IDS;
  const outDir = args.out || path.join(REPO_ROOT, "scratch", "piper-smoke-test");
  mkdirSync(outDir, { recursive: true });

  const entries = readVocabEntries();
  const byId = new Map(entries.map((e) => [e.id, e]));

  const manifest = [];
  for (const id of ids) {
    const entry = byId.get(id);
    if (!entry) {
      console.error(`No vocab entry with id "${id}" -- skipping.`);
      continue;
    }
    const devanagari = toDevanagari(entry.word);
    const outFile = path.join(outDir, `${id}.wav`);
    synthesize({ piperBin, modelPath, text: devanagari, outFile });
    console.log(`${id}\t${entry.word}\t${devanagari}\t-> ${outFile}`);
    manifest.push({ id, word: entry.word, devanagari, outFile, variant: "default" });

    if (KNOWN_WORKAROUNDS[id]) {
      const workaroundText = KNOWN_WORKAROUNDS[id];
      const workaroundOutFile = path.join(outDir, `${id}.workaround.wav`);
      synthesize({ piperBin, modelPath, text: workaroundText, outFile: workaroundOutFile });
      console.log(
        `${id}\t(workaround)\t${workaroundText}\t-> ${workaroundOutFile}`,
      );
      manifest.push({
        id,
        word: entry.word,
        devanagari: workaroundText,
        outFile: workaroundOutFile,
        variant: "workaround",
      });
    }
  }

  const manifestPath = path.join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote ${manifest.length} file(s) to ${outDir} (manifest: ${manifestPath}).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
