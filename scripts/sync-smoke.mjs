#!/usr/bin/env node
/**
 * Maintainer smoke: version sync → canonical sync → validate → transform regression.
 * Genetic tag: repo.tooling.genetic_starter.gen1
 *
 * Usage (from monorepo root or kit root):
 *   node genetic-ai-starter/scripts/sync-smoke.mjs
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function run(rel, args = []) {
  const script = path.join(KIT_ROOT, rel);
  console.log(`\n→ node ${rel}${args.length ? ' ' + args.join(' ') : ''}`);
  const r = spawnSync(process.execPath, [script, ...args], {
    cwd: path.resolve(KIT_ROOT, '..'),
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function main() {
  run('scripts/sync-kit-version.mjs');
  run('scripts/sync-from-canonical.mjs');
  run('scripts/validate-kit.mjs');
  run('scripts/validate-genes.mjs');
  run('scripts/check-capability-contract.mjs');
  run('tests/kit-sync-transforms.test.mjs');
  run('tests/validate-link-aliases.test.mjs');
  run('scripts/check-site-inventory.mjs');
  console.log('\nsync-smoke OK');
}

main();
