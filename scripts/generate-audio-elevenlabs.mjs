#!/usr/bin/env node
// Batch ElevenLabs synthesis for ALL content/sarnami/vocab/*.json entries --
// PR-B of #300 (PR-A, #301, declared audio.elevenLabsVoiceId and shipped as
// v0.9.0). Replaces the Piper batch (generate-audio-piper-batch.mjs) as the
// source of content/sarnami/audio/*.mp3: rarelang-server#130 confirmed
// ElevenLabs/Sudhir fixes the word-final-consonant defect (rarelang-server#125)
// that motivated this migration.
//
// Calls the PUBLIC GET /audio/tts route (not POST /audio/generate, which has
// no ElevenLabs tier, and not GET /dev/audio/tts, which needs a dev token and
// isn't in the PWA relay's allowlist), sending the ROMANIZED word -- never
// Devanagari. That satisfies rarelang-server's findMatchingVocabItem vetting
// gate by construction and hands Devanagari conversion to the server's own
// hand-ported copy of this repo's devanagari-transliterate.mjs, so the
// committed static bytes are identical-by-construction to what the realtime
// route would serve for the same word. See #300 design decision D2.
//
// Deliberately does NOT apply KNOWN_WORKAROUNDS (D3): those are Piper-only
// mispronunciation hacks: Sudhir handles the mechanical spelling correctly,
// and the server never sees them anyway since we send the romanized word.
//
// Response bytes are written verbatim -- no ffmpeg re-encode (D4): the
// server hardcodes output_format=mp3_44100_128, and re-encoding would both
// add a second lossy generation and break the D2 byte-parity guarantee.
//
// ElevenLabs output is non-deterministic (D5) and this route's cache is
// permanent/unbounded, so re-running does not reproduce identical bytes --
// the first reviewed run is authoritative. Do not "regenerate to verify".
//
// The X-Tts-Cache response header is the ONLY signal that ElevenLabs (vs.
// PR 131's silent Piper fallback, which still returns 200 + valid audio) is
// what actually answered (D7) -- a misconfigured deployment could otherwise
// silently commit 312 Piper files mislabelled as ElevenLabs. This script
// hard-fails the whole run on the first response whose header doesn't
// contain "ELEVENLABS".
//
// Dependency-free Node (built-in fetch), consistent with this repo's
// "no npm tooling" convention -- modelled on generate-audio.mjs (arg
// parsing, --server) and generate-audio-piper-batch.mjs (manifest +
// per-entry logging + non-zero exit on any failure).
//
// Usage (run from a process/container attached to the deployment's docker
// network, e.g. `docker run --rm --network gateway -v $PWD:/work -w /work
// node:22 node scripts/generate-audio-elevenlabs.mjs ...` -- rarelang-server
// has no host-published port):
//   node scripts/generate-audio-elevenlabs.mjs \
//     --server http://rarelang-server:8787 \
//     [--out scratch/elevenlabs-batch] [--ids id1,id2] [--delay-ms 300]

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { readVocabEntries, REPO_ROOT } from "./generate-audio-piper.mjs";

const DEFAULT_DELAY_MS = 300;

export function parseArgs(argv) {
  const args = { server: null, out: null, ids: null, delayMs: DEFAULT_DELAY_MS };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--server") args.server = argv[++i];
    else if (argv[i] === "--out") args.out = argv[++i];
    else if (argv[i] === "--ids") args.ids = argv[++i].split(",").map((s) => s.trim());
    else if (argv[i] === "--delay-ms") args.delayMs = Number(argv[++i]);
    else throw new Error(`Unrecognized argument: ${argv[i]}`);
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchOne(server, word) {
  const url = `${server}/audio/tts?lang=sarnami&text=${encodeURIComponent(word)}`;
  const res = await fetch(url);
  const cacheHeader = res.headers.get("x-tts-cache") || "";
  const contentType = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());

  if (res.status !== 200) {
    throw new Error(`HTTP ${res.status} for "${word}" (${url})`);
  }
  if (!contentType.includes("audio/mpeg")) {
    throw new Error(`Unexpected Content-Type "${contentType}" for "${word}" (${url})`);
  }
  if (buf.length === 0) {
    throw new Error(`Zero-length body for "${word}" (${url})`);
  }
  if (!cacheHeader.includes("ELEVENLABS")) {
    throw new Error(
      `X-Tts-Cache "${cacheHeader}" does not contain ELEVENLABS for "${word}" -- ` +
        `Piper fallback answered instead (D7). Aborting rather than committing a ` +
        `mislabelled file. Check settings.audio.elevenLabsVoiceId, ELEVENLABS_API_KEY, ` +
        `and the ElevenLabs key's text_to_speech permission scope on the deployment.`,
    );
  }
  return { cacheHeader, bytes: buf };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.server) {
    console.error("--server <url> is required, e.g. --server http://rarelang-server:8787");
    process.exit(2);
  }

  const outDir = args.out || path.join(REPO_ROOT, "scratch", "elevenlabs-batch");
  mkdirSync(outDir, { recursive: true });

  const allEntries = readVocabEntries();
  const entries = args.ids
    ? args.ids.map((id) => {
        const entry = allEntries.find((e) => e.id === id);
        if (!entry) throw new Error(`No vocab entry with id "${id}"`);
        return entry;
      })
    : allEntries;

  const manifest = [];
  for (const [i, { id, word }] of entries.entries()) {
    const { cacheHeader, bytes } = await fetchOne(args.server, word);
    const outFile = path.join(outDir, `${id}.mp3`);
    writeFileSync(outFile, bytes);
    manifest.push({ id, word, cacheHeader, bytes: bytes.length });
    console.log(`${id}\t${word}\t${cacheHeader}\t${bytes.length} bytes`);

    if (i < entries.length - 1) await sleep(args.delayMs);
  }

  const manifestPath = path.join(outDir, "manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  const totalBytes = manifest.reduce((sum, m) => sum + m.bytes, 0);
  console.log(
    `\n${manifest.length}/${entries.length} generated -> ${outDir} ` +
      `(manifest: ${manifestPath}, ${totalBytes} bytes total).`,
  );
}

// Extracted so a test can assert the console.error/process.exitCode contract
// without re-running main() itself (D7: the whole point is that a failed
// run must be loud -- a logged message plus a non-zero exit code, never a
// silent success -- since this only runs headless in CI/CLI, not the PWA's
// UI, there's no modal to surface this in).
export function reportFatalError(err) {
  console.error(`\nABORTED: ${err.message}`);
  process.exitCode = 1;
}

// Guard CLI execution behind this check (matches generate-audio-piper.mjs and
// generate-scs-word-list.mjs) so this module can be `import`-ed by its test
// file -- and, by extension, by scratch/audit tooling -- without triggering a
// real (paid) batch run as a side effect.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(reportFatalError);
}
