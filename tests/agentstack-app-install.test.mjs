#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = path.join(KIT_ROOT, 'fixtures/empty-node-project');

function rmFixtureKit() {
  for (const p of ['AGENTS.md', 'philosophy', 'docs', '.cursor', '.genetic-ai', '.cursorrules', 'examples', 'src']) {
    const full = path.join(FIXTURE, p);
    if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
  }
}

function run(args) {
  return spawnSync(process.execPath, args, { cwd: KIT_ROOT, encoding: 'utf8' });
}

rmFixtureKit();
const install = run([
  'scripts/install.mjs',
  '--target',
  FIXTURE,
  '--profile',
  'agentstack-app',
  '--project-name',
  'AgentStack App',
  '--domain',
  'app',
  '--strict',
]);
if (install.status !== 0) {
  console.error(install.stderr || install.stdout);
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(path.join(FIXTURE, '.genetic-ai/kit.lock.json'), 'utf8'));
if (lock.profile !== 'agentstack-app') {
  console.error('FAIL: lock.profile !== agentstack-app');
  process.exit(1);
}
if (!lock.capabilitySnapshotHash) {
  console.error('FAIL: missing capabilitySnapshotHash');
  process.exit(1);
}
if (!fs.existsSync(path.join(FIXTURE, 'examples/agentstack/00-bootstrap/run.ts'))) {
  console.error('FAIL: recipes not copied to examples/agentstack/');
  process.exit(1);
}
if (!fs.existsSync(path.join(FIXTURE, 'src/lib/agentstack.ts'))) {
  console.error('FAIL: missing bootstrap');
  process.exit(1);
}

const pkgPath = path.join(FIXTURE, 'examples/agentstack/package.json');
const sdkSpec = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).dependencies?.['@agentstack/sdk'];
if (!sdkSpec || sdkSpec.startsWith('file:')) {
  console.error(`FAIL: examples/agentstack should npm-pin @agentstack/sdk, got ${sdkSpec}`);
  process.exit(1);
}

const doctor = run(['scripts/doctor.mjs', '--target', FIXTURE, '--kit-root', KIT_ROOT]);
if (doctor.status !== 0) {
  console.error(doctor.stderr || doctor.stdout);
  process.exit(1);
}

console.log('agentstack-app-install.test.mjs OK');
