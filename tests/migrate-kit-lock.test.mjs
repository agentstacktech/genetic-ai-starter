#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LOCK_SCHEMA_VERSION } from '../scripts/lib/kit-integration-constants.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-migrate-'));

fs.mkdirSync(path.join(temp, '.genetic-ai'), { recursive: true });
fs.writeFileSync(
  path.join(temp, '.genetic-ai', 'kit.lock.json'),
  JSON.stringify({ kitId: 'genetic-ai-starter', kitVersion: '0.4.11', profile: 'standard' }),
);

const kitDest = path.join(temp, 'tools', 'genetic-ai-starter');
fs.cpSync(KIT_ROOT, kitDest, {
  recursive: true,
  filter: (src) => !src.includes('node_modules'),
});

const r = spawnSync(process.execPath, ['scripts/migrate-kit-lock.mjs', '--target', temp], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.equal(r.status, 0, r.stderr || r.stdout);

const lock = JSON.parse(fs.readFileSync(path.join(temp, '.genetic-ai', 'kit.lock.json'), 'utf8'));
assert.equal(lock.lockSchemaVersion, LOCK_SCHEMA_VERSION);
assert.ok(lock.kitSource?.path);

fs.rmSync(temp, { recursive: true, force: true });
console.log('migrate-kit-lock.test.mjs OK');
