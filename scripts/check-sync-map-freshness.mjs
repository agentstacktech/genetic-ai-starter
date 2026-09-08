#!/usr/bin/env node
/**
 * Warn when monorepo repo.tooling.* genes are missing from kit sync map.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  KIT_SYNC_MAP,
  SYNC_MAP_OPTIONAL_TOOLING_GENES,
  syncedGeneBasenames,
} from './lib/kit-sync-map.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const genesDir = path.join(root, 'philosophy/genes');

const synced = syncedGeneBasenames();
const mapGenePaths = new Set(
  KIT_SYNC_MAP.filter((e) => e.from.startsWith('philosophy/genes/')).map((e) => e.from),
);

const toolingGenes = fs
  .readdirSync(genesDir)
  .filter((f) => f.startsWith('repo.tooling.') && f.endsWith('.gen1.md'));

const missing = toolingGenes.filter((f) => !synced.has(f) && !SYNC_MAP_OPTIONAL_TOOLING_GENES.has(f));

if (missing.length) {
  console.warn(
    'check-sync-map-freshness WARN — consider KIT_SYNC_MAP entries:\n' +
      missing.map((f) => `  - philosophy/genes/${f}`).join('\n'),
  );
} else {
  console.log(`check-sync-map-freshness OK (${mapGenePaths.size} gene paths in map)`);
}
