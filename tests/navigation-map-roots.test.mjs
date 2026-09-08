#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractPackageRootsFromNavigationMap,
  resolveIndexScanRoots,
  EXTRA_INDEX_SCAN_ROOTS,
} from '../scripts/lib/navigation-map-roots.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(KIT_ROOT, '..');

const mapPath = path.join(REPO_ROOT, 'docs', 'AI_NAVIGATION_MAP.md');
const mapText = fs.readFileSync(mapPath, 'utf8');

const fromMap = extractPackageRootsFromNavigationMap(mapText);
assert.ok(fromMap.includes('agentstack-core'), 'map links include agentstack-core');
assert.ok(fromMap.includes('shared'), 'map links include shared');
assert.ok(!fromMap.includes('archive'), 'archive is not a scan root');

const roots = resolveIndexScanRoots(REPO_ROOT);
for (const extra of EXTRA_INDEX_SCAN_ROOTS) {
  assert.ok(roots.includes(extra), `extras include ${extra}`);
}

console.log(`navigation-map-roots.test.mjs OK (${fromMap.length} from map, ${roots.length} total)`);
