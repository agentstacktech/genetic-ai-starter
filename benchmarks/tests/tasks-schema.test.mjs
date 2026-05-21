#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(__dirname, '..');
const doc = JSON.parse(fs.readFileSync(path.join(BENCH_ROOT, 'tasks/tasks.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(BENCH_ROOT, 'config.json'), 'utf8'));

let failed = 0;
function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL: ${name}`, detail);
    failed++;
  }
}

assert('version', doc.version === '1');
const ids = new Set();
for (const t of doc.tasks) {
  assert(`task ${t.id} shape`, t.prompt_ru && t.prompt_en && t.gold && t.rubric);
  assert(`unique ${t.id}`, !ids.has(t.id));
  ids.add(t.id);
  assert(`id pattern ${t.id}`, /^[TS]\d{2}$/.test(t.id));
}

const synthetic = doc.tasks.filter((t) => t.substrate === 'synthetic').map((t) => t.id);
const smoke = doc.tasks.filter((t) => t.substrate === 'agentstack').map((t) => t.id);
assert('synthetic count', synthetic.length === config.syntheticTasks.length);
assert('smoke count', smoke.length === config.smokeTasks.length);
for (const id of config.syntheticTasks) assert(`config synthetic ${id}`, synthetic.includes(id));
for (const id of config.smokeTasks) assert(`config smoke ${id}`, smoke.includes(id));

if (failed) process.exit(1);
console.log('OK: tasks-schema');
