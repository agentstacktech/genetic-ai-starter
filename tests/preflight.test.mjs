#!/usr/bin/env node
import assert from 'node:assert/strict';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { KIT_ROOT } from '../scripts/lib/paths.mjs';
import { preflightOk, runAllPreflightChecks } from '../scripts/lib/preflight-checks/index.mjs';

const checks = runAllPreflightChecks({ target: os.tmpdir(), kitRoot: KIT_ROOT, quick: true });
assert.ok(preflightOk(checks), JSON.stringify(checks, null, 2));

const r = spawnSync(process.execPath, ['scripts/preflight.mjs', '--quick', '--json'], {
  cwd: KIT_ROOT,
  encoding: 'utf8',
});
assert.equal(r.status, 0, r.stderr || r.stdout);
const report = JSON.parse(r.stdout);
assert.equal(report.ok, true);

console.log('OK: preflight.test.mjs');
