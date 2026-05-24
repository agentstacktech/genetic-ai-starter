#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prepare = path.join(__dirname, 'prepare-arm.mjs');

const ARMS = [
  'bare',
  'readme_tree',
  'agents_md',
  'agents_md_weak',
  'generic_cursorrules',
  'kit_minimal',
  'kit_standard',
  'kit_standard_indexed',
];

let failed = 0;
const force = process.argv.includes('--force');
for (const arm of ARMS) {
  const args = [prepare, '--arm', arm];
  if (force) args.push('--force');
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(`FAIL ${arm}`, r.stderr || r.stdout);
    failed++;
  } else {
    console.log(r.stdout.trim());
  }
}
process.exit(failed ? 1 : 0);
