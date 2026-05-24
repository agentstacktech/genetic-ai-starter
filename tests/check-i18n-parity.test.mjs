#!/usr/bin/env node
/**
 * Smoke: i18n manifest exists and parity script exits 0.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

function run(cmd, args) {
  const r = spawnSync(process.execPath, [cmd, ...args], {
    cwd: KIT_ROOT,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    console.error(r.stdout + r.stderr);
    process.exit(r.status ?? 1);
  }
}

const manifest = path.join(KIT_ROOT, '..', 'docs', 'genetic-ai-starter-maintainers', 'i18n-manifest.json');
run(path.join(KIT_ROOT, 'scripts/generate-i18n-manifest.mjs'), []);
if (!fs.existsSync(manifest)) {
  console.error('missing i18n-manifest.json after generate');
  process.exit(1);
}
run(path.join(KIT_ROOT, 'scripts/check-i18n-parity.mjs'), []);
console.log('check-i18n-parity.test.mjs OK');
