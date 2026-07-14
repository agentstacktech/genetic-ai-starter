#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-upgrade-0413-'));

fs.mkdirSync(path.join(temp, '.genetic-ai'), { recursive: true });
fs.writeFileSync(
  path.join(temp, '.genetic-ai', 'kit.lock.json'),
  JSON.stringify({
    kitId: 'genetic-ai-starter',
    kitVersion: '0.4.13',
    profile: 'full',
    extensions: ['agentstack'],
    lockSchemaVersion: 1,
  }),
);

const kitDest = path.join(temp, 'tools', 'genetic-ai-starter');
fs.cpSync(KIT_ROOT, kitDest, {
  recursive: true,
  filter: (src) => !src.includes('node_modules'),
});

const migrate = spawnSync(process.execPath, ['scripts/migrate-kit-lock.mjs', '--target', temp], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.equal(migrate.status, 0, migrate.stderr || migrate.stdout);

const lock = JSON.parse(fs.readFileSync(path.join(temp, '.genetic-ai', 'kit.lock.json'), 'utf8'));
assert.ok(lock.kitSource?.path);
assert.ok(lock.capabilitySnapshotHash);

const upgrade = spawnSync(
  process.execPath,
  [
    path.join(kitDest, 'scripts/upgrade.mjs'),
    '--target',
    temp,
    '--dry-run',
    '--kit-root',
    kitDest,
  ],
  { encoding: 'utf8' },
);
assert.equal(upgrade.status, 0, upgrade.stderr || upgrade.stdout);

fs.rmSync(temp, { recursive: true, force: true });
console.log('upgrade-from-0413.test.mjs OK');
