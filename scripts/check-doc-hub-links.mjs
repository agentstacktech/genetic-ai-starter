#!/usr/bin/env node
/**
 * Verify relative markdown links in DOC_HUB and narrative docs resolve on disk.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditMarkdownTree } from './lib/audit-markdown-links.mjs';
import { DOC_HUB_SEED_FILES } from './lib/doc-hub-seeds.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function main() {
  const errors = [];
  for (const rel of DOC_HUB_SEED_FILES) {
    if (!fs.existsSync(path.join(KIT_ROOT, rel))) {
      errors.push(`missing seed file: ${rel}`);
    }
  }
  for (const b of auditMarkdownTree(KIT_ROOT, DOC_HUB_SEED_FILES)) {
    errors.push(`${b.file}: broken link (${b.target})`);
  }
  if (errors.length) {
    console.error('check-doc-hub-links FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log(`OK: check-doc-hub-links (${DOC_HUB_SEED_FILES.length} files)`);
}

main();
