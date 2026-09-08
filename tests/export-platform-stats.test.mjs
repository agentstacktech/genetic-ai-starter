#!/usr/bin/env node
/**
 * Scoped AI_INDEX scan must match full-repo inventory (regression for platform-stats perf).
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectMonorepoAiIndexes } from '../scripts/lib/platform-stats-scan.mjs';
import { resolveIndexScanRoots } from '../scripts/lib/navigation-map-roots.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(KIT_ROOT, '..');

function norm(p) {
  return p.replace(/\\/g, '/');
}

function diffIndexes(scoped, full) {
  const scopedSet = new Set(scoped.map(norm));
  const missing = full.filter((p) => !scopedSet.has(norm(p)));
  const extra = scoped.filter((p) => !full.some((f) => norm(f) === norm(p)));
  const rootsFor = (abs) => {
    const rel = norm(path.relative(REPO_ROOT, abs));
    const seg = rel.split('/')[0];
    return seg || rel;
  };
  const missingRoots = [...new Set(missing.map(rootsFor))].sort();
  return { missing, extra, missingRoots };
}

const scoped = collectMonorepoAiIndexes(REPO_ROOT, { includeCardGame: true });
const full = collectMonorepoAiIndexes(REPO_ROOT, { fullScan: true, includeCardGame: true });

if (scoped.length !== full.length) {
  const { missing, missingRoots } = diffIndexes(scoped, full);
  const roots = resolveIndexScanRoots(REPO_ROOT);
  const hint =
    missingRoots.length
      ? `add to EXTRA_INDEX_SCAN_ROOTS: ${missingRoots.join(', ')}`
      : 'check walk-files skipDirs or map link patterns';
  assert.fail(
    `scoped AI_INDEX count ${scoped.length} !== full ${full.length} (${roots.length} roots) — ${hint}\n` +
      missing.slice(0, 8).map((p) => `  missing: ${norm(path.relative(REPO_ROOT, p))}`).join('\n'),
  );
}

const scopedPlatform = collectMonorepoAiIndexes(REPO_ROOT);
const fullPlatform = collectMonorepoAiIndexes(REPO_ROOT, { fullScan: true });
assert.equal(scopedPlatform.length, fullPlatform.length, 'platform AI_INDEX scoped vs full');

console.log(
  `export-platform-stats.test.mjs OK (${scoped.length} indexes, ${resolveIndexScanRoots(REPO_ROOT).length} roots)`,
);
