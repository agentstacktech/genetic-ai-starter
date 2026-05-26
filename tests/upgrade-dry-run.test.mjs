#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-dry-'));

const install = spawnSync(
  process.execPath,
  ['scripts/install.mjs', '--target', tmp, '--profile', 'minimal', '--project-name', 'T'],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
assert.equal(install.status, 0);

const before = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
const dry = spawnSync(
  process.execPath,
  ['scripts/upgrade.mjs', '--target', tmp, '--dry-run', '--kit-root', KIT_ROOT],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
assert.equal(dry.status, 0);
const after = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
assert.equal(before, after);

fs.rmSync(tmp, { recursive: true, force: true });
console.log('upgrade-dry-run.test.mjs OK');
