#!/usr/bin/env node
/**
 * Golden snapshot: scaffold subsystem generator emits expected files.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-scaffold-'));

const r = spawnSync(
  process.execPath,
  [
    path.join(KIT_ROOT, 'scripts/scaffold.mjs'),
    '--generator',
    'subsystem',
    '--name',
    'billing',
    '--domain',
    'app',
    '--target',
    tmp,
    '--skip-verify',
  ],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);

if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(r.status ?? 1);
}

const gene = path.join(tmp, 'philosophy/genes/app.billing.feature.gen1.md');
if (!fs.existsSync(gene)) {
  console.error('missing scaffolded gene:', gene);
  process.exit(1);
}
const text = fs.readFileSync(gene, 'utf8');
if (!text.includes('app.billing.feature.gen1')) {
  console.error('gene tag not substituted');
  process.exit(1);
}

console.log('scaffold-golden.test.mjs OK');
