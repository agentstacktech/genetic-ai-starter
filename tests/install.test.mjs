#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(KIT_ROOT, 'fixtures/empty-node-project');

function run(cmd, args) {
  return spawnSync(cmd, args, { cwd: KIT_ROOT, encoding: 'utf8' });
}

function rmFixtureKit() {
  const paths = [
    'AGENTS.md',
    'philosophy',
    'docs',
    '.cursor',
    '.genetic-ai',
    '.cursorrules',
    '.cursorrules.fragment.md',
  ];
  for (const p of paths) {
    const full = path.join(FIXTURE, p);
    if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
  }
}

function countCursorBlocks() {
  const rules = fs.readFileSync(path.join(FIXTURE, '.cursorrules'), 'utf8');
  return (rules.match(/<!-- genetic-ai:begin -->/g) || []).length;
}

let failed = 0;

function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL: ${name}`, detail);
    failed++;
  }
}

console.log('test: validate-kit');
assert('validate-kit', run(process.execPath, ['scripts/validate-kit.mjs']).status === 0);

console.log('test: install standard');
rmFixtureKit();
assert(
  'install standard',
  run(process.execPath, [
    'scripts/install.mjs',
    '--target',
    FIXTURE,
    '--profile',
    'standard',
    '--project-name',
    'Fixture App',
    '--domain',
    'app',
    '--strict',
  ]).status === 0,
);

console.log('test: no fragment file copied');
assert(
  'no .cursorrules.fragment.md in target',
  !fs.existsSync(path.join(FIXTURE, '.cursorrules.fragment.md')),
);

console.log('test: validate-installed');
assert(
  'validate-installed',
  run(process.execPath, ['scripts/validate-installed.mjs', '--target', FIXTURE]).status === 0,
);

console.log('test: idempotent install standard');
assert(
  'idempotent standard',
  run(process.execPath, [
    'scripts/install.mjs',
    '--target',
    FIXTURE,
    '--profile',
    'standard',
    '--project-name',
    'Fixture App',
    '--domain',
    'app',
  ]).status === 0,
);
assert('single cursor block', countCursorBlocks() === 1, `got ${countCursorBlocks()}`);

console.log('test: install full + agentstack idempotent');
rmFixtureKit();
assert(
  'install full',
  run(process.execPath, [
    'scripts/install.mjs',
    '--target',
    FIXTURE,
    '--profile',
    'full',
    '--project-name',
    'Fixture App',
    '--domain',
    'app',
    '--strict',
  ]).status === 0,
);
const map1 = fs.readFileSync(path.join(FIXTURE, 'docs/ai/AI_NAVIGATION_MAP.md'), 'utf8');
const navMarkers = (map1.match(/genetic-ai-extension:agentstack-nav/g) || []).length;
assert('agentstack nav marker once', navMarkers === 1, `markers=${navMarkers}`);

assert(
  'idempotent full',
  run(process.execPath, [
    'scripts/install.mjs',
    '--target',
    FIXTURE,
    '--profile',
    'full',
    '--project-name',
    'Fixture App',
    '--domain',
    'app',
  ]).status === 0,
);
assert('single cursor block after full x2', countCursorBlocks() === 1, `got ${countCursorBlocks()}`);
const map2 = fs.readFileSync(path.join(FIXTURE, 'docs/ai/AI_NAVIGATION_MAP.md'), 'utf8');
assert(
  'agentstack nav still once',
  (map2.match(/genetic-ai-extension:agentstack-nav/g) || []).length === 1,
);

console.log('test: gitignore-kit full');
const giDir = path.join(KIT_ROOT, 'fixtures/gitignore-install-test');
if (fs.existsSync(giDir)) fs.rmSync(giDir, { recursive: true, force: true });
fs.mkdirSync(giDir, { recursive: true });
assert(
  'install with gitignore',
  run(process.execPath, [
    'scripts/install.mjs',
    '--target',
    giDir,
    '--profile',
    'minimal',
    '--project-name',
    'Gi Test',
    '--domain',
    'app',
    '--gitignore-kit',
    'full',
    '--strict',
  ]).status === 0,
);
const giText = fs.readFileSync(path.join(giDir, '.gitignore'), 'utf8');
assert('gitignore block', giText.includes('genetic-ai-starter:begin'));
assert('no stub leak', !fs.existsSync(path.join(giDir, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md')));
fs.rmSync(giDir, { recursive: true, force: true });

console.log('test: lock has project metadata');
const lock = JSON.parse(fs.readFileSync(path.join(FIXTURE, '.genetic-ai/kit.lock.json'), 'utf8'));
assert('lock.projectName', lock.projectName === 'Fixture App');
assert('lock.domain', lock.domain === 'app');
assert('lock.kitVersion is platform', /^\d+\.\d+\.\d+$/.test(lock.kitVersion));
assert(
  'lock.platformVersionSource',
  typeof lock.platformVersionSource === 'string' &&
    (lock.platformVersionSource.includes('shared/constants.py') ||
      lock.platformVersionSource.includes('PLATFORM_VERSION') ||
      lock.platformVersionSource.startsWith('env:')),
);

if (failed) {
  console.error(`${failed} test(s) failed`);
  process.exit(1);
}
console.log('All install tests passed');
