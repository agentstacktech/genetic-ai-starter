#!/usr/bin/env node
/**
 * Maintainer smoke: version sync → canonical sync → validate → transform regression.
 * Genetic tag: repo.tooling.genetic_starter.gen1
 *
 * Usage (from monorepo root or kit root):
 *   node genetic-ai-starter/scripts/sync-smoke.mjs
 */
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { runKitSteps } from './lib/run-kit-steps.mjs';

const STEPS = [
  'scripts/sync-kit-version.mjs',
  'scripts/sync-from-canonical.mjs',
  'scripts/validate-kit.mjs',
  'scripts/validate-genes.mjs',
  'scripts/check-capability-contract.mjs',
  'tests/kit-sync-transforms.test.mjs',
  'tests/validate-link-aliases.test.mjs',
  'scripts/check-site-inventory.mjs',
  'scripts/audit-navigation-contract.mjs',
  'scripts/check-sync-map-freshness.mjs',
  'tests/navigation-map-roots.test.mjs',
  'tests/plugin-skill-parity.test.mjs',
  'tests/export-platform-stats.test.mjs',
  'tests/platform-stats-sources.test.mjs',
];

runKitSteps(STEPS, { kitRoot: KIT_ROOT, cwd: path.resolve(KIT_ROOT, '..') });
console.log('\nsync-smoke OK');
