#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(__dirname, '..');
const FIXTURE = path.join(BENCH_ROOT, 'fixture-shop-api');
const MONOREPO_ROOT = path.resolve(BENCH_ROOT, '../..');
const TASKS = JSON.parse(fs.readFileSync(path.join(BENCH_ROOT, 'tasks/tasks.json'), 'utf8'));

let failed = 0;
function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL: ${name}`, detail);
    failed++;
  }
}

function exists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

console.log('fixture-integrity: shop-api files');
assert('server.ts', exists(FIXTURE, 'src/server.ts'));
assert('sessionMiddleware', exists(FIXTURE, 'src/auth/sessionMiddleware.ts'));
assert('decoy legacy', exists(FIXTURE, 'src/billing/legacy/oldCheckout.ts'));
assert('ARCHITECTURE trap', exists(FIXTURE, 'ARCHITECTURE.md'));

for (const task of TASKS.tasks) {
  if (task.substrate !== 'synthetic') continue;
  for (const f of task.gold?.files || []) {
    assert(`T ${task.id} gold ${f}`, exists(FIXTURE, f));
  }
}

console.log('fixture-integrity: agentstack smoke gold paths');
for (const task of TASKS.tasks) {
  if (task.substrate !== 'agentstack') continue;
  const files = [...(task.gold?.files || []), ...(task.gold?.alsoAccept || [])];
  if (files.length === 0) continue;
  let any = false;
  for (const f of files) {
    if (exists(MONOREPO_ROOT, f)) any = true;
  }
  assert(`S ${task.id} at least one gold path in monorepo`, any, files.join(', '));
}
assert('S04 pages map exists', exists(MONOREPO_ROOT, 'docs/dual-shell/PAGES_MAP.md'));

console.log('fixture-integrity: overlays');
const overlay = path.join(BENCH_ROOT, 'overlays/shop');
assert('shop map overlay', exists(overlay, 'docs/ai/AI_NAVIGATION_MAP.md'));

if (failed) process.exit(1);
console.log('OK: fixture-integrity');
