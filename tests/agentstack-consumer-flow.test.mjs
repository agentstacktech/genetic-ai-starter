#!/usr/bin/env node
/**
 * End-to-end consumer flow: install agentstack-app → pin check → capability contract on target.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isNpmPinnedSdkDependency } from '../scripts/lib/pin-recipe-package.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURE = path.join(KIT_ROOT, 'fixtures/empty-node-project');

function rmFixtureKit() {
  for (const p of ['AGENTS.md', 'philosophy', 'docs', '.cursor', '.genetic-ai', '.cursorrules', 'examples', 'src']) {
    const full = path.join(FIXTURE, p);
    if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
  }
}

function run(args, cwd = KIT_ROOT) {
  return spawnSync(process.execPath, args, { cwd, encoding: 'utf8' });
}

rmFixtureKit();

const install = run([
  'scripts/install.mjs',
  '--target',
  FIXTURE,
  '--profile',
  'agentstack-app',
  '--project-name',
  'Flow Test',
  '--domain',
  'app',
  '--strict',
]);
if (install.status !== 0) {
  console.error(install.stderr || install.stdout);
  process.exit(1);
}

const pkgPath = path.join(FIXTURE, 'examples/agentstack/package.json');
if (!isNpmPinnedSdkDependency(pkgPath)) {
  const spec = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).dependencies?.['@agentstack/sdk'];
  console.error(`FAIL: consumer package.json should npm-pin SDK, got: ${spec}`);
  process.exit(1);
}

const platform = fs.readFileSync(path.join(KIT_ROOT, 'PLATFORM_VERSION'), 'utf8').trim();
const pinned = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).dependencies['@agentstack/sdk'];
if (pinned !== platform) {
  console.error(`FAIL: pinned ${pinned} !== PLATFORM_VERSION ${platform}`);
  process.exit(1);
}

const contract = run(['scripts/check-capability-contract.mjs', '--target', FIXTURE, '--kit-root', KIT_ROOT]);
if (contract.status !== 0) {
  console.error(contract.stderr || contract.stdout);
  process.exit(1);
}

const linkDry = run(['scripts/link-sdk-deps.mjs', '--target', FIXTURE, '--dry-run']);
if (linkDry.status !== 0 || !linkDry.stdout.includes('file:')) {
  console.error('FAIL: link-sdk-deps dry-run');
  process.exit(1);
}

console.log('agentstack-consumer-flow.test.mjs OK');
