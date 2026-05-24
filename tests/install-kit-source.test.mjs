#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const FIXTURE = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-source-'));

function run(args) {
  return spawnSync(process.execPath, args, { cwd: KIT_ROOT, encoding: 'utf8' });
}

const r = run([
  path.join(KIT_ROOT, 'scripts/install.mjs'),
  '--target',
  FIXTURE,
  '--profile',
  'minimal',
  '--project-name',
  'KitSource Test',
  '--domain',
  'app',
  '--record-kit-source',
  '--kit-root',
  KIT_ROOT,
  '--strict',
]);
assert.equal(r.status, 0, r.stderr || r.stdout);

const lock = JSON.parse(fs.readFileSync(path.join(FIXTURE, '.genetic-ai/kit.lock.json'), 'utf8'));
assert.equal(lock.lockSchemaVersion, 2);
assert.ok(lock.kitSource?.type);
assert.ok(lock.kitRootRel);
assert.ok(lock.paths?.kitRootRel);

fs.rmSync(FIXTURE, { recursive: true, force: true });
console.log('install-kit-source.test.mjs OK');
