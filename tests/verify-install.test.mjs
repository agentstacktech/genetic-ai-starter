#!/usr/bin/env node
/**
 * A9 — verify-install.mjs smoke (delegates to script, asserts exit 0).
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const r = spawnSync(process.execPath, ['scripts/verify-install.mjs', '--profile', 'minimal'], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
}
assert.equal(r.status, 0);
assert.match(r.stdout, /VERIFY OK/);

console.log('OK: verify-install.test.mjs');
