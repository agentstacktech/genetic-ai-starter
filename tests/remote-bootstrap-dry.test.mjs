#!/usr/bin/env node
/**
 * remote-bootstrap --help exits 0 (no network submodule add in CI).
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync(process.execPath, ['scripts/remote-bootstrap.mjs', '--help'], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.equal(r.status, 0);
console.log('remote-bootstrap-dry.test.mjs OK');
