#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GITIGNORE_BEGIN } from '../scripts/lib/merge-gitignore.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-gitignore-'));

const install = spawnSync(
  process.execPath,
  [
    path.join(KIT_ROOT, 'scripts/install.mjs'),
    '--target',
    temp,
    '--profile',
    'standard',
    '--project-name',
    'Gitignore Test',
    '--domain',
    'app',
    '--gitignore-kit',
    'full',
    '--strict',
  ],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);

if (install.status !== 0) {
  console.error(install.stdout, install.stderr);
  throw new Error('install failed');
}

const gi = path.join(temp, '.gitignore');
if (!fs.existsSync(gi)) throw new Error('missing .gitignore');
const text = fs.readFileSync(gi, 'utf8');
if (!text.includes(GITIGNORE_BEGIN)) throw new Error('missing gitignore block');
if (!text.includes('philosophy/')) throw new Error('philosophy/ not in gitignore');
if (!text.includes('docs/ai/')) throw new Error('docs/ai/ not in gitignore');

const lock = JSON.parse(fs.readFileSync(path.join(temp, '.genetic-ai/kit.lock.json'), 'utf8'));
if (lock.gitignoreKit !== 'full') throw new Error('lock missing gitignoreKit');

const uninstall = spawnSync(
  process.execPath,
  [path.join(KIT_ROOT, 'scripts/uninstall.mjs'), '--target', temp],
  { cwd: KIT_ROOT },
);
if (uninstall.status !== 0) throw new Error('uninstall failed');
if (fs.existsSync(gi) && fs.readFileSync(gi, 'utf8').includes(GITIGNORE_BEGIN)) {
  throw new Error('gitignore block not removed on uninstall');
}

fs.rmSync(temp, { recursive: true, force: true });
console.log('OK: gitignore-kit');
