#!/usr/bin/env node
/**
 * Easter eggs E1–E5 — must not break strict install or doctor.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STARTER_BEACON_ID } from '../scripts/lib/starter-beacon.mjs';
import {
  isAgentStackProjectName,
  shouldShowStarterBanner,
} from '../scripts/lib/starter-banner.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(KIT_ROOT, 'fixtures', 'empty-node-project');

function run(cmd, args, env = {}) {
  return spawnSync(cmd, args, {
    cwd: KIT_ROOT,
    encoding: 'utf8',
    env: { ...process.env, CI: 'true', ...env },
  });
}

assert.equal(isAgentStackProjectName('AgentStack'), true);
assert.equal(isAgentStackProjectName('agentstack'), true);
assert.equal(isAgentStackProjectName('My App'), false);
assert.equal(shouldShowStarterBanner(), false);

const mapTpl = fs.readFileSync(
  path.join(KIT_ROOT, 'payload/docs/ai/templates/AI_NAVIGATION_MAP.empty.md'),
  'utf8',
);
assert.ok(mapTpl.includes('repo.tooling.genetic_starter.gen1'));

const genePath = path.join(
  KIT_ROOT,
  'payload/philosophy/genes/repo.community.starter_spirit.gen1.md',
);
assert.ok(fs.existsSync(genePath));

const repair = run(process.execPath, [
  path.join(KIT_ROOT, 'scripts/repair.mjs'),
  '--target',
  FIXTURE,
]);
assert.equal(repair.status, 0, repair.stderr || repair.stdout);

const doctor = run(process.execPath, [
  path.join(KIT_ROOT, 'scripts/doctor.mjs'),
  '--target',
  FIXTURE,
  '--beacon',
]);
assert.equal(doctor.status, 0, doctor.stderr || doctor.stdout);
assert.ok(doctor.stdout.includes(`beacon:${STARTER_BEACON_ID}`));

const initDry = run(
  process.execPath,
  [
    path.join(KIT_ROOT, 'scripts/init.mjs'),
    '--yes',
    '--target',
    FIXTURE,
    '--project-name',
    'AgentStack',
    '--dry-run',
  ],
  { CI: 'true' },
);
assert.equal(initDry.status, 0, initDry.stderr || initDry.stdout);
assert.ok(
  initDry.stdout.includes('AgentStack') || initDry.stdout.includes('genetic coding'),
);

console.log('easter-eggs.test.mjs OK');
