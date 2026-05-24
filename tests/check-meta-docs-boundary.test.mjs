#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync(
  process.execPath,
  [path.join(KIT_ROOT, 'scripts/check-meta-docs-boundary.mjs')],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
assert.equal(r.status, 0, r.stderr || r.stdout);
console.log('check-meta-docs-boundary.test.mjs OK');
