#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'scripts/check-doc-hub-links.mjs')], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
if (r.status !== 0) {
  console.error(r.stdout + r.stderr);
  process.exit(r.status ?? 1);
}
console.log('check-doc-hub-links.test.mjs OK');
