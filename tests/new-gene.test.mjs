#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-newgene-'));
fs.mkdirSync(path.join(temp, 'philosophy/genes'), { recursive: true });

const r = spawnSync(
  process.execPath,
  [
    path.join(KIT_ROOT, 'scripts/new-gene.mjs'),
    '--target',
    temp,
    '--type',
    'subsystem',
    '--domain',
    'app',
    '--subsystem',
    'billing',
  ],
  { encoding: 'utf8' },
);

if (r.status !== 0) {
  console.error(r.stdout, r.stderr);
  throw new Error('new-gene failed');
}

const gene = path.join(temp, 'philosophy/genes/app.billing.feature.gen1.md');
if (!fs.existsSync(gene)) throw new Error('gene file missing');
const text = fs.readFileSync(gene, 'utf8');
if (!text.includes('app.billing.feature.gen1')) throw new Error('tag not substituted');

fs.rmSync(temp, { recursive: true, force: true });
console.log('OK: new-gene');
