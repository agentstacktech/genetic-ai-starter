#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(__dirname, '..');
const prepare = path.join(BENCH_ROOT, 'scripts/prepare-arm.mjs');
const workBare = path.join(BENCH_ROOT, 'work/bare');

let failed = 0;
function assert(name, ok, d = '') {
  if (!ok) {
    console.error('FAIL', name, d);
    failed++;
  }
}

if (fs.existsSync(workBare)) fs.rmSync(workBare, { recursive: true, force: true });
const r = spawnSync(process.execPath, [prepare, '--arm', 'bare'], { encoding: 'utf8' });
assert('prepare bare exit 0', r.status === 0, r.stderr);
assert('bare has server', fs.existsSync(path.join(workBare, 'src/server.ts')));
assert('bare has README', fs.existsSync(path.join(workBare, 'README.md')));
assert('bare no AGENTS', !fs.existsSync(path.join(workBare, 'AGENTS.md')));
assert('bare marker', fs.existsSync(path.join(workBare, '.benchmark-arm.json')));

if (failed) process.exit(1);
console.log('OK: prepare-arm');
