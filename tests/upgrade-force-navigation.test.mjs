#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-force-nav-'));

function run(args) {
  return spawnSync(process.execPath, args, { cwd: KIT_ROOT, encoding: 'utf8' });
}

assert.equal(
  run([
    'scripts/install.mjs',
    '--target',
    tmp,
    '--profile',
    'standard',
    '--project-name',
    'T',
    '--domain',
    'app',
    '--record-kit-source',
  ]).status,
  0,
);

const mapPath = path.join(tmp, 'docs/ai/AI_NAVIGATION_MAP.md');
const before = fs.readFileSync(mapPath, 'utf8');
const customRow = '| `tenant.only.gen1` | `src/only/` | custom |';
fs.writeFileSync(
  mapPath,
  before.replace('<!-- tenant-map:tier1:end -->', `${customRow}\n<!-- tenant-map:tier1:end -->`),
);

// Corrupt kit tier0 so we can see force-navigation reset it
fs.writeFileSync(
  mapPath,
  fs
    .readFileSync(mapPath, 'utf8')
    .replace('<!-- genetic-ai-map:tier0:begin -->', '<!-- genetic-ai-map:tier0:begin -->\n| STALE | x | y |'),
);

assert.equal(
  run([
    'scripts/upgrade.mjs',
    '--target',
    tmp,
    '--yes',
    '--force-navigation',
    '--kit-root',
    KIT_ROOT,
  ]).status,
  0,
);

const after = fs.readFileSync(mapPath, 'utf8');
assert.ok(after.includes('tenant.only.gen1'), 'tenant tier1 must survive force-navigation');
assert.ok(!after.includes('| STALE |'), 'kit tier0 must be refreshed on force-navigation');

fs.rmSync(tmp, { recursive: true, force: true });
console.log('upgrade-force-navigation.test.mjs OK');
