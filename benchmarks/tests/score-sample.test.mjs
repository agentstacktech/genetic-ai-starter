#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(__dirname, '..');
const sample = path.join(BENCH_ROOT, 'results/raw/_sample_kit_standard__T01.txt');
const scorer = path.join(BENCH_ROOT, 'scripts/score-transcript.mjs');
const out = path.join(BENCH_ROOT, 'results/scored/_sample_kit_standard__T01.json');

const sampleText = `User: Где production HTTP entry?

Assistant: Сначала открою docs/ai/AI_NAVIGATION_MAP.md — Tier 0 указывает shop.app.root.gen1.
Затем прочитаю src/server.ts — это production entry. src/tools/devServer.ts только для dev.
`;

fs.mkdirSync(path.dirname(sample), { recursive: true });
fs.writeFileSync(sample, sampleText);

if (fs.existsSync(out)) fs.unlinkSync(out);

const r = spawnSync(
  process.execPath,
  [scorer, '--transcript', sample, '--task', 'T01', '--arm', 'kit_standard', '--out', out],
  { encoding: 'utf8' },
);

let failed = 0;
if (r.status !== 0) {
  console.error(r.stderr);
  failed++;
}
const scored = JSON.parse(fs.readFileSync(out, 'utf8'));
if (!scored.success || scored.total < 6) {
  console.error('FAIL: expected success score', scored);
  failed++;
}

if (failed) process.exit(1);
console.log('OK: score-sample');
