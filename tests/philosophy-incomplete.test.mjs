#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'genetic-ai-phil-'));
const target = path.join(temp, 'consumer');

fs.mkdirSync(path.join(target, 'philosophy', 'genes'), { recursive: true });
fs.writeFileSync(path.join(target, 'philosophy', 'README.md'), 'old stub only\n', 'utf8');

let failed = 0;
function assert(name, ok, d = '') {
  if (!ok) {
    console.error('FAIL', name, d);
    failed++;
  }
}

const install = spawnSync(
  process.execPath,
  [
    'scripts/install.mjs',
    '--target',
    target,
    '--profile',
    'standard',
    '--project-name',
    'Phil Test',
    '--domain',
    'app',
    '--strict',
  ],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);

assert('install exit 0', install.status === 0, install.stderr || install.stdout);
assert(
  'GENE_INDEX installed',
  fs.existsSync(path.join(target, 'philosophy/genes/GENE_INDEX.md')),
);
assert(
  'PHILOSOPHY_INDEX installed',
  fs.existsSync(path.join(target, 'philosophy/PHILOSOPHY_INDEX.md')),
);

const validate = spawnSync(
  process.execPath,
  ['scripts/validate-installed.mjs', '--target', target],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
assert('validate-installed', validate.status === 0, validate.stderr);

fs.rmSync(temp, { recursive: true, force: true });

if (failed) process.exit(1);
console.log('OK: philosophy-incomplete');
