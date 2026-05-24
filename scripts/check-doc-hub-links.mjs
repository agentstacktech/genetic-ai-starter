#!/usr/bin/env node
/**
 * Verify relative markdown links in DOC_HUB and narrative docs resolve on disk.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const SEED_FILES = [
  'meta/docs/DOC_HUB.md',
  'meta/docs/DOC_CLAIMS_AUDIT.md',
  'meta/docs/PRODUCTION_OUTCOMES.md',
  'meta/docs/AGENT_FLOOR.md',
  'README.en.md',
];

const LINK_RE = /\]\(([^)]+)\)/g;

function existsTarget(fromAbs, href) {
  const raw = href.trim();
  if (!raw || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:')) {
    return true;
  }
  if (raw.startsWith('#')) return true;
  const [filePart] = raw.split('#');
  if (!filePart) return true;
  const resolved = path.normalize(path.join(path.dirname(fromAbs), filePart));
  return fs.existsSync(resolved);
}

function checkFile(rel) {
  const abs = path.join(KIT_ROOT, rel);
  if (!fs.existsSync(abs)) return [`missing seed file: ${rel}`];
  const text = fs.readFileSync(abs, 'utf8');
  const errors = [];
  for (const m of text.matchAll(LINK_RE)) {
    const href = m[1];
    if (!existsTarget(abs, href)) {
      errors.push(`${rel}: broken link (${href})`);
    }
  }
  return errors;
}

function main() {
  const errors = SEED_FILES.flatMap(checkFile);
  if (errors.length) {
    console.error('check-doc-hub-links FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log(`OK: check-doc-hub-links (${SEED_FILES.length} files)`);
}

main();
