#!/usr/bin/env node
// Batch Piper synthesis for ALL content/sarnami/vocab/*.json entries --
// part 2/2 of sarnami-bol-naa#280's migration off facebook/mms-tts-hns.
// Sibling to generate-audio-piper.mjs (the smoke-test tool this reuses
// toDevanagari/KNOWN_WORKAROUNDS/synthesize from); that script stays a
// small explicit---ids tool, this one is the full-batch driver.
//
// Deterministic synthesis (--noise-scale 0 --noise-w-scale 0): part 1's
// smoke test found Piper's default per-call noise makes single-sample
// listening/ASR checks unreliable (0/5 vs 3/5 for the same text across
// stochastic samples). A fixed seed-equivalent keeps this batch
// reproducible and matches the setting that held up under both the
// deterministic ASR run and majority-stochastic in that earlier testing.
//
// Writes .wav (not .mp3 -- conversion is a separate step) to a scratch
// output directory, never content/sarnami/audio/ directly, so a bad run
// doesn't clobber committed audio before review.
//
// Usage:
//   PIPER_MODEL=/path/to/hi_IN-rohan-medium.onnx node scripts/generate-audio-piper-batch.mjs --out /some/scratch/dir

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { toDevanagari } from "./devanagari-transliterate.mjs";
import { readVocabEntries, synthesize, KNOWN_WORKAROUNDS, REPO_ROOT } from "./generate-audio-piper.mjs";

const DETERMINISTIC_ARGS = ["--noise-scale", "0", "--noise-w-scale", "0"];

function parseArgs(argv) {
  const args = { out: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") args.out = argv[++i];
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

  const outDir = args.out || path.join(REPO_ROOT, "scratch", "piper-batch");
  mkdirSync(outDir, { recursive: true });

  const entries = readVocabEntries();
  const manifest = [];
  let failed = 0;
  for (const { id, word } of entries) {
    const devanagari = KNOWN_WORKAROUNDS[id] || toDevanagari(word);
    const outFile = path.join(outDir, `${id}.wav`);
    try {
      synthesize({ piperBin, modelPath, text: devanagari, outFile, extraArgs: DETERMINISTIC_ARGS });
      manifest.push({ id, word, devanagari, outFile, workaroundApplied: Boolean(KNOWN_WORKAROUNDS[id]) });
      console.log(`${id}\t${word}\t${devanagari}`);
    } catch (err) {
      failed++;
      console.error(`FAILED ${id} ("${word}" -> "${devanagari}"): ${err.message}`);
    }
  }

  const manifestPath = path.join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\n${manifest.length}/${entries.length} generated (${failed} failed) -> ${outDir} (manifest: ${manifestPath}).`,
  );
  if (failed > 0) process.exitCode = 1;
}

main();
