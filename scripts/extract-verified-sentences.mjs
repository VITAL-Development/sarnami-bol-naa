#!/usr/bin/env node
// Promotes human-verified candidate sentences from sentence-drafts/<unit-id>.review.md into
// content/sarnami/lessons/<unit-id>.json and content/sarnami/units/<unit-id>.json.
//
// See sentence-drafts/README.md for the checklist format this parses. Only rows that are BOTH
// ticked ("- [x]") AND carry a "verify: PASS" line are promoted; everything else is skipped.
// No dependencies (Node 22 built-ins only), so this can run without a package.json in a
// content-only repo. Usage:
//   node scripts/extract-verified-sentences.mjs --unit <unit-id> [--dry-run]

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolved from the current working directory, not the script's own location — run this from
// the repo root (as the README instructs), same convention as `node
// rarelang-server-tooling/scripts/validate-content.mjs .` in validate-content.yml.
const REPO_ROOT = process.cwd();

export function parseArgs(argv) {
  let unit = null;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--unit") unit = argv[++i];
    else if (argv[i] === "--dry-run") dryRun = true;
    else throw new Error(`Unrecognized argument: ${argv[i]}`);
  }
  if (!unit) throw new Error("Usage: extract-verified-sentences.mjs --unit <unit-id> [--dry-run]");
  return { unit, dryRun };
}

// Splits the draft into candidate blocks, tracking which "## lesson: <id>" section each block
// belongs to. Each candidate starts at a "- [ ]" or "- [x]" line and runs until the next
// checkbox line, the next lesson heading, or end of file.
export function parseDraft(markdown) {
  const lines = markdown.split("\n");
  const candidates = [];
  let currentLesson = null;

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(/^##\s*lesson:\s*(\S+)/);
    if (headingMatch) {
      currentLesson = headingMatch[1];
      continue;
    }
    const checkboxMatch = lines[i].match(/^\s*-\s*\[( |x|X)\]\s*(.*)$/);
    if (!checkboxMatch) continue;

    const checked = checkboxMatch[1].toLowerCase() === "x";
    const fieldLines = [checkboxMatch[2]];
    let j = i + 1;
    while (
      j < lines.length &&
      lines[j].trim() !== "" &&
      !/^\s*-\s*\[( |x|X)\]/.test(lines[j]) &&
      !/^##\s*lesson:/.test(lines[j])
    ) {
      fieldLines.push(lines[j]);
      j++;
    }
    i = j - 1;

    candidates.push({
      lessonId: currentLesson,
      checked,
      fields: parseFields(fieldLines),
      sourceLine: i + 1,
    });
  }
  return candidates;
}

function parseFields(fieldLines) {
  const fields = {};
  let currentKey = null;
  for (const raw of fieldLines) {
    const m = raw.match(/^\s*([a-zA-Z]+):\s*(.*)$/);
    if (m) {
      currentKey = m[1].toLowerCase();
      fields[currentKey] = m[2].trim();
    } else if (currentKey && raw.trim()) {
      // continuation line (verify: reasons often wrap)
      fields[currentKey] += " " + raw.trim();
    }
  }
  return fields;
}

function isVerifiedPass(fields) {
  return typeof fields.verify === "string" && /^PASS\b/.test(fields.verify.trim());
}

async function loadVocabIds(contentDir) {
  const vocabDir = path.join(contentDir, "vocab");
  const files = await readdir(vocabDir);
  const ids = new Set();
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const items = JSON.parse(await readFile(path.join(vocabDir, file), "utf-8"));
    for (const item of items) ids.add(item.id);
  }
  return ids;
}

export function toExampleSentence(fields) {
  const translations = {};
  if (fields.nl) translations.nl = fields.nl;
  if (fields.en) translations.en = fields.en;
  const vocabRefs = fields.vocabrefs
    ? fields.vocabrefs.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  return { id: fields.id, word: fields.sarnami, translations, vocabRefs };
}

export function validateCandidate(fields, knownVocabIds, existingIds) {
  const errors = [];
  if (!fields.id || !/^ex-/.test(fields.id)) {
    errors.push(`id "${fields.id ?? ""}" must be present and start with "ex-"`);
  } else if (existingIds.has(fields.id)) {
    errors.push(`id "${fields.id}" already exists — skip or rename`);
  }
  if (!fields.sarnami) errors.push("missing required field: sarnami");
  if (!fields.nl) errors.push("missing required field: nl (at least one translation)");
  const vocabRefs = fields.vocabrefs
    ? fields.vocabrefs.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  for (const ref of vocabRefs) {
    if (!knownVocabIds.has(ref)) errors.push(`vocabRefs references unknown vocab id "${ref}"`);
  }
  return errors;
}

async function main() {
  const { unit, dryRun } = parseArgs(process.argv.slice(2));

  const contentDir = path.join(REPO_ROOT, "content", "sarnami");
  const draftPath = path.join(REPO_ROOT, "sentence-drafts", `${unit}.review.md`);
  const lessonsPath = path.join(contentDir, "lessons", `${unit}.json`);
  const unitsPath = path.join(contentDir, "units", `${unit}.json`);

  const [draftMarkdown, lessonsRaw, unitRaw, knownVocabIds] = await Promise.all([
    readFile(draftPath, "utf-8"),
    readFile(lessonsPath, "utf-8"),
    readFile(unitsPath, "utf-8"),
    loadVocabIds(contentDir),
  ]);

  const lessons = JSON.parse(lessonsRaw);
  const unitData = JSON.parse(unitRaw);

  const existingIds = new Set();
  for (const lesson of lessons) {
    for (const ex of lesson.exampleSentences ?? []) existingIds.add(ex.id);
  }

  const candidates = parseDraft(draftMarkdown);
  const promotable = candidates.filter((c) => c.checked && isVerifiedPass(c.fields));

  // Idempotency: a candidate whose id was already present *before this run* (i.e. extracted by
  // an earlier invocation, or hand-authored) is silently skipped, not re-validated — re-running
  // the same draft must be a no-op, not an "already exists" error. Only genuinely new rows are
  // validated below, against a working set that still catches two new rows colliding with each
  // other or with a pre-existing hand-authored id.
  const alreadyExtracted = promotable.filter((c) => existingIds.has(c.fields.id));
  const toValidate = promotable.filter((c) => !existingIds.has(c.fields.id));

  const seenIds = new Set(existingIds);
  const errors = [];
  for (const candidate of toValidate) {
    if (!candidate.lessonId) {
      errors.push(`line ${candidate.sourceLine}: candidate is not under a "## lesson: <id>" heading`);
      continue;
    }
    const rowErrors = validateCandidate(candidate.fields, knownVocabIds, seenIds);
    for (const e of rowErrors) errors.push(`line ${candidate.sourceLine} (${candidate.fields.id ?? "?"}): ${e}`);
    if (candidate.fields.id) seenIds.add(candidate.fields.id);
  }
  if (errors.length > 0) {
    console.error(`extract-verified-sentences: ${errors.length} problem(s) in ${draftPath}:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exitCode = 1;
    return;
  }

  if (alreadyExtracted.length > 0) {
    console.log(`extract-verified-sentences: ${alreadyExtracted.length} row(s) already extracted, skipping:`);
    for (const c of alreadyExtracted) console.log(`  ${c.fields.id}`);
  }

  const added = [];
  for (const candidate of toValidate) {
    const lesson = lessons.find((l) => l.lessonId === candidate.lessonId);
    if (!lesson) {
      console.error(`extract-verified-sentences: no lesson "${candidate.lessonId}" in ${lessonsPath}`);
      process.exitCode = 1;
      return;
    }
    const exampleSentence = toExampleSentence(candidate.fields);
    lesson.exampleSentences = lesson.exampleSentences ?? [];
    lesson.exampleSentences.push(exampleSentence);
    existingIds.add(exampleSentence.id);

    for (const unitLesson of unitData.lessons ?? []) {
      if (unitLesson.id === candidate.lessonId) {
        unitLesson.exampleSentenceRefs = unitLesson.exampleSentenceRefs ?? [];
        unitLesson.exampleSentenceRefs.push(exampleSentence.id);
      }
    }
    added.push({ lessonId: candidate.lessonId, ...exampleSentence });
  }

  if (added.length === 0) {
    console.log("extract-verified-sentences: nothing new to promote (all verified rows already extracted).");
    return;
  }

  console.log(`extract-verified-sentences: ${added.length} sentence(s) to promote from ${unit}:`);
  for (const a of added) console.log(`  ${a.lessonId} / ${a.id}: ${a.word}`);

  if (dryRun) {
    console.log("(--dry-run: not writing files)");
    return;
  }

  await writeFile(lessonsPath, JSON.stringify(lessons, null, 2) + "\n");
  await writeFile(unitsPath, JSON.stringify(unitData, null, 2) + "\n");
  console.log(`Wrote ${lessonsPath} and ${unitsPath}.`);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
}
