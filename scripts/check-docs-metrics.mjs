#!/usr/bin/env node
/**
 * Fail if README/FAQ/BENEFITS cite metrics that drift from metrics.snapshot.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const SNAP_PATH = path.join(KIT_ROOT, 'meta/docs/metrics.snapshot.json');

const FILES = [
  'README.md',
  'README.en.md',
  'FAQ.md',
  'meta/docs/BENEFITS_AND_METRICS.md',
  'meta/docs/BENEFITS_AND_METRICS_ru.md',
  'meta/docs/ROI_PLAYBOOK.md',
];

const FORBIDDEN = [
  /AGENTS\.md only.*\b8\b/i,
  /только AGENTS\.md.*\b8\b/i,
  /median.*6→8.*AGENTS/i,
];

function main() {
  const errors = [];
  if (!fs.existsSync(SNAP_PATH)) {
    errors.push('Missing metrics.snapshot.json — run export-metrics-snapshot.mjs');
  } else {
    const snap = JSON.parse(fs.readFileSync(SNAP_PATH, 'utf8'));
    const bareMedian = snap.arms?.bare?.medianScore;
    const kitMedian = snap.arms?.kit_standard?.medianScore;
    for (const rel of FILES) {
      const p = path.join(KIT_ROOT, rel);
      if (!fs.existsSync(p)) continue;
      const text = fs.readFileSync(p, 'utf8');
      for (const re of FORBIDDEN) {
        if (re.test(text)) {
          errors.push(`${rel}: forbidden misleading pattern ${re}`);
        }
      }
      if (bareMedian != null && kitMedian != null) {
        const wrongDelta = text.match(/median[^0-9]*(\d+)\s*→\s*(\d+)/i);
        if (
          wrongDelta &&
          Number(wrongDelta[1]) === bareMedian &&
          Number(wrongDelta[2]) === kitMedian &&
          !text.includes('agents_md_weak') &&
          !text.includes('task') &&
          !text.includes('T04')
        ) {
          /* allow if task table or footnote present nearby */
          if (!/METRICS_GLOSSARY|agents_md arm|task-level/i.test(text)) {
            errors.push(`${rel}: bare→kit median without glossary/footnote context`);
          }
        }
      }
    }
  }

  if (errors.length) {
    console.error('check-docs-metrics FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('OK: check-docs-metrics');
}

main();
