#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const r = spawnSync(process.execPath, ['scripts/install.mjs', '--target', KIT_ROOT, '--profile', 'minimal'], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.notEqual(r.status, 0);
assert.match(r.stderr + r.stdout, /E_TARGET_IS_KIT/);

console.log('OK: guard-kit-self-install.test.mjs');
