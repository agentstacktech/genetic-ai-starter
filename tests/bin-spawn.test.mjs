#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const r = spawnSync(process.execPath, ['bin/genetic-ai-preflight.js', '--quick'], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.equal(r.status, 0, r.stderr || r.stdout);
assert.match(r.stdout, /node\.onPath/);

console.log('OK: bin-spawn.test.mjs');
