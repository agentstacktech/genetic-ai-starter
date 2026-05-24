#!/usr/bin/env node
/**
 * Fail if README cites platform stats that drift from platform-stats.snapshot.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const SNAP_PATH = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');

const FILES = ['README.md', 'README.en.md'];

function main() {
  const errors = [];
  if (!fs.existsSync(SNAP_PATH)) {
    errors.push('Missing platform-stats.snapshot.json — run export-platform-stats.mjs');
  } else {
    const snap = JSON.parse(fs.readFileSync(SNAP_PATH, 'utf8'));
    const genes = snap.counts?.philosophyGenes;
    if (genes != null) {
      for (const rel of FILES) {
        const p = path.join(KIT_ROOT, rel);
        if (!fs.existsSync(p)) continue;
        const text = fs.readFileSync(p, 'utf8');
        const cited = [...text.matchAll(/~?\s*(\d{2,3})\+?\s*(?:active\s+)?genes/gi)];
        for (const m of cited) {
          const n = Number(m[1]);
          if (n < genes - 30 || n > genes + 30) {
            errors.push(`${rel}: cited ~${n} genes but snapshot has ${genes}`);
          }
        }
      }
    }
  }
  if (errors.length) {
    console.error('check-platform-stats FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('OK: check-platform-stats');
}

main();
