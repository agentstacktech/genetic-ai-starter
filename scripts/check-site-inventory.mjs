#!/usr/bin/env node
/**
 * Guard: genetic-system-site HTML inventory hardcodes match platform-stats.snapshot.json.
 * Genetic tag: repo.tooling.genetic_starter.docs_flow.gen1 · KIT-T16
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(KIT_ROOT, '..');
const SNAPSHOT = path.join(KIT_ROOT, 'meta', 'docs', 'platform-stats.snapshot.json');
const SITE_HTML = path.join(REPO_ROOT, 'docs', 'genetic-system-site', 'index.html');

function main() {
  if (!fs.existsSync(SNAPSHOT)) {
    console.error('Missing platform-stats.snapshot.json — run export-platform-stats.mjs');
    process.exit(1);
  }
  if (!fs.existsSync(SITE_HTML)) {
    console.log('check-site-inventory: skip (no genetic-system-site)');
    return;
  }
  const counts = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8')).counts || {};
  const genes = String(counts.philosophyGenes);
  const indexes = String(counts.aiIndexFilesRepoTotal);
  const html = fs.readFileSync(SITE_HTML, 'utf8');

  const errors = [];
  // Expect each inventory number to appear at least twice (hero + grid / pills)
  const geneHits = (html.match(new RegExp(`<strong>${genes}</strong>`, 'g')) || []).length;
  const indexHits = (html.match(new RegExp(`<strong>${indexes}</strong>`, 'g')) || []).length;
  if (geneHits < 2) {
    errors.push(`genes ${genes} appears ${geneHits}× in index.html (want ≥2 <strong> tags)`);
  }
  if (indexHits < 2) {
    errors.push(`indexes ${indexes} appears ${indexHits}× in index.html (want ≥2 <strong> tags)`);
  }
  // Stale legacy pair commonly left behind
  if (html.includes('<strong>406</strong>') && genes !== '406') {
    errors.push('stale <strong>406</strong> still in index.html');
  }
  if (html.includes('<strong>186</strong>') && indexes !== '186') {
    errors.push('stale <strong>186</strong> still in index.html');
  }

  if (errors.length) {
    for (const e of errors) console.error(`FAIL: ${e}`);
    process.exit(1);
  }
  console.log(`check-site-inventory OK (genes=${genes}, indexes=${indexes})`);
}

main();
