#!/usr/bin/env node
/**
 * Kit snapshot MCP fields must match monorepo docs/publication/platform-stats.snapshot.json.
 * Gene: docs.freshness.living.gen1 · repo.tooling.genetic_starter.scale_digest.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMcpPublicationStats } from './lib/platform-stats-sources.mjs';
import { KIT_ROOT } from './lib/paths.mjs';

const REPO_ROOT = path.resolve(KIT_ROOT, '..');
const KIT_SNAP = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');

function main() {
  const errors = [];
  if (!fs.existsSync(KIT_SNAP)) {
    console.error('Missing kit platform-stats.snapshot.json');
    process.exit(1);
  }
  const kit = JSON.parse(fs.readFileSync(KIT_SNAP, 'utf8')).counts ?? {};
  const pub = readMcpPublicationStats(REPO_ROOT);
  if (!pub.available) {
    console.log('check-stats-plane-parity: skip (no monorepo publication snapshot)');
    return;
  }

  const pairs = [
    ['mcpCatalogActionsPublic', pub.mcpCatalogActionsPublic],
    ['mcpDomainsPublic', pub.mcpDomainsPublic],
    ['mcpRegistryTools', pub.mcpRegistryTools],
  ];
  for (const [key, expected] of pairs) {
    if (expected != null && kit[key] !== expected) {
      errors.push(`${key}: kit=${kit[key]} publication=${expected}`);
    }
  }

  if (errors.length) {
    console.error('check-stats-plane-parity FAILED:\n' + errors.join('\n'));
    console.error('Fix: node scripts/codegen-platform-stats.mjs && node scripts/export-platform-stats.mjs');
    process.exit(1);
  }
  console.log('check-stats-plane-parity OK');
}

main();
