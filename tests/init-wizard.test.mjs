#!/usr/bin/env node
/**
 * Non-interactive init.mjs smoke test.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const INIT = path.join(KIT_ROOT, 'scripts', 'init.mjs');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-init-'));

const r = spawnSync(
  process.execPath,
  [
    INIT,
    '--yes',
    '--target',
    temp,
    '--profile',
    'minimal',
    '--project-name',
    'Init Test',
    '--domain',
    'app',
  ],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);

if (r.status !== 0) {
  console.error('stdout:', r.stdout);
  console.error('stderr:', r.stderr);
  throw new Error(`init.mjs failed: ${r.status}`);
}
if (r.stdout) console.log(r.stdout);

const agents = path.join(temp, 'AGENTS.md');
const lock = path.join(temp, '.genetic-ai', 'kit.lock.json');
if (!fs.existsSync(agents)) throw new Error('missing AGENTS.md');
if (!fs.existsSync(lock)) throw new Error('missing kit.lock.json');

const lockData = JSON.parse(fs.readFileSync(lock, 'utf8'));
if (lockData.profile !== 'minimal') throw new Error(`expected minimal profile, got ${lockData.profile}`);

fs.rmSync(temp, { recursive: true, force: true });

const tempGi = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-init-gi-'));
const rGi = spawnSync(
  process.execPath,
  [
    INIT,
    '--yes',
    '--target',
    tempGi,
    '--profile',
    'standard',
    '--project-name',
    'Init GI Test',
    '--domain',
    'app',
    '--gitignore-kit',
    'full',
  ],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
if (rGi.status !== 0) {
  console.error('gitignore init stdout:', rGi.stdout);
  console.error('gitignore init stderr:', rGi.stderr);
  throw new Error(`init.mjs --gitignore-kit full failed: ${rGi.status}`);
}
const gi = path.join(tempGi, '.gitignore');
const giText = fs.readFileSync(gi, 'utf8');
if (!/genetic-ai/i.test(giText)) {
  throw new Error('.gitignore missing genetic-ai block after --gitignore-kit full');
}
const lockGi = JSON.parse(fs.readFileSync(path.join(tempGi, '.genetic-ai', 'kit.lock.json'), 'utf8'));
if (lockGi.gitignoreKit !== 'full') {
  throw new Error(`expected gitignoreKit=full, got ${lockGi.gitignoreKit}`);
}
fs.rmSync(tempGi, { recursive: true, force: true });

console.log('OK: init-wizard non-interactive + gitignore-kit full');
