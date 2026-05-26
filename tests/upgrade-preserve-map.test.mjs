#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-preserve-'));

function run(args) {
  return spawnSync(process.execPath, args, { cwd: KIT_ROOT, encoding: 'utf8' });
}

const install = run([
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
]);
assert.equal(install.status, 0, install.stderr || install.stdout);

const mapPath = path.join(tmp, 'docs/ai/AI_NAVIGATION_MAP.md');
let map = fs.readFileSync(mapPath, 'utf8');
map = map.replace(
  '<!-- tenant-map:tier1:end -->',
  '| `tenant.custom.gen1` | `src/custom/` | keep |\n<!-- tenant-map:tier1:end -->',
);
fs.writeFileSync(mapPath, map, 'utf8');

const up = run(['scripts/upgrade.mjs', '--target', tmp, '--yes', '--kit-root', KIT_ROOT]);
assert.equal(up.status, 0, up.stderr || up.stdout);

const after = fs.readFileSync(mapPath, 'utf8');
assert.ok(after.includes('tenant.custom.gen1'), 'tenant row must survive preserve upgrade');

fs.rmSync(tmp, { recursive: true, force: true });
console.log('upgrade-preserve-map.test.mjs OK');
