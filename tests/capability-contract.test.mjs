#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const r = spawnSync(process.execPath, ['scripts/check-capability-contract.mjs', '--kit-root', KIT_ROOT], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log('capability-contract.test.mjs OK');
