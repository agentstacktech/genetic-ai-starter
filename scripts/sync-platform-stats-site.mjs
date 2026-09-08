#!/usr/bin/env node
/**
 * Copy kit platform-stats subset to docs/genetic-system-site/data/ for canvases.
 * Gene: repo.tooling.genetic_starter.scale_digest.gen1 · docs.freshness.living.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildSiteStatsSubset } from './lib/platform-stats-sources.mjs';
import { KIT_ROOT } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');
const SITE_DATA = path.resolve(KIT_ROOT, '..', 'docs/genetic-system-site/data/platform-stats.json');

function main() {
  const check = process.argv.includes('--check');
  if (!fs.existsSync(SNAPSHOT)) {
    console.error('Missing platform-stats.snapshot.json — run export-platform-stats.mjs');
    process.exit(1);
  }
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const subset = buildSiteStatsSubset(snap);
  const next = `${JSON.stringify(subset, null, 2)}\n`;

  if (check) {
    if (!fs.existsSync(SITE_DATA)) {
      console.error(`MISSING ${SITE_DATA} — run export-platform-stats.mjs`);
      process.exit(1);
    }
    const onDisk = fs.readFileSync(SITE_DATA, 'utf8');
    if (onDisk !== next) {
      console.error('STALE genetic-system-site/data/platform-stats.json — run export-platform-stats.mjs');
      process.exit(1);
    }
    console.log('OK: site platform-stats fresh');
    return;
  }

  fs.mkdirSync(path.dirname(SITE_DATA), { recursive: true });
  fs.writeFileSync(SITE_DATA, next);
  console.log(`wrote ${SITE_DATA}`);
}

if (import.meta.url === pathToFileURL(path.resolve(process.argv[1] || '')).href) {
  main();
}
