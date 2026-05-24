#!/usr/bin/env node
/**
 * Optional E2E: real git submodule in temp repo. Run with RUN_KIT_E2E=1 (CI nightly / local).
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.RUN_KIT_E2E) {
  console.log('bootstrap-standard.e2e.mjs SKIP (set RUN_KIT_E2E=1)');
  process.exit(0);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-e2e-'));

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: opts.cwd || tmp, ...opts });
  if ((r.status ?? 1) !== 0) {
    throw new Error(`${cmd} ${args.join(' ')}: ${r.stderr || r.stdout}`);
  }
  return r.stdout;
}

sh('git', ['init']);
sh('git', ['config', 'user.email', 'e2e@test.local']);
sh('git', ['config', 'user.name', 'Kit E2E']);
sh('git', ['submodule', 'add', KIT_ROOT, 'tools/genetic-ai-starter']);
sh('git', ['add', '.']);
sh('git', ['commit', '-m', 'init']);

const boot = spawnSync(
  process.execPath,
  [
    path.join(tmp, 'tools/genetic-ai-starter/scripts/bootstrap-standard.mjs'),
    '--target',
    tmp,
    '--yes',
    '--skip-submodule',
    '--project-name',
    'E2E',
    '--domain',
    'app',
  ],
  { encoding: 'utf8', cwd: tmp, timeout: 120000 },
);
assert.equal(boot.status, 0, boot.stderr || boot.stdout);
assert.ok(fs.existsSync(path.join(tmp, '.genetic-ai/kit.lock.json')));

fs.rmSync(tmp, { recursive: true, force: true });
console.log('bootstrap-standard.e2e.mjs OK');
