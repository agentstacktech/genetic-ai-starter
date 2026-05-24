#!/usr/bin/env node
/** Regenerate RUN_MATRIX.md checkmarks from results/raw/*.txt */
import fs from 'node:fs';
import path from 'node:path';
import { BENCH_ROOT, RESULTS_ROOT } from './lib/paths.mjs';

const rawDir = path.join(RESULTS_ROOT, 'raw');
const out = path.join(RESULTS_ROOT, 'RUN_MATRIX.md');

const ARMS = [
  'bare',
  'readme_tree',
  'agents_md',
  'agents_md_weak',
  'generic_cursorrules',
  'kit_minimal',
  'kit_standard',
  'kit_standard_indexed',
];
const SYNTHETIC = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11'];
const SMOKE_ARMS = ['bare', 'kit_standard'];
const SMOKE = ['S01', 'S02', 'S03', 'S04'];

function hasRun(arm, task) {
  const p = path.join(rawDir, `${arm}__${task}__run1.txt`);
  return fs.existsSync(p);
}

function cell(arm, task) {
  return hasRun(arm, task) ? '[x]' : '[ ]';
}

const lines = [
  '# Run matrix checklist',
  '',
  `Updated: ${new Date().toISOString()}`,
  '',
  'Mark `[x]` when `results/raw/<arm>__<task>__run1.txt` exists and scored.',
  '',
  '## Synthetic (11 tasks × 7 arms)',
  '',
  '| Task | ' + ARMS.join(' | ') + ' |',
  '|------|' + ARMS.map(() => '------').join('|') + '|',
];

for (const t of SYNTHETIC) {
  lines.push(`| ${t} | ${ARMS.map((a) => cell(a, t)).join(' | ')} |`);
}

lines.push('', '## Smoke (4 tasks × 2 arms)', '', '| Task | bare | kit_standard |', '|------|------|--------------|');
for (const s of SMOKE) {
  lines.push(`| ${s} | ${cell('bare', s)} | ${cell('kit_standard', s)} |`);
}

fs.writeFileSync(out, `${lines.join('\n')}\n`);
console.log(`wrote ${out}`);
