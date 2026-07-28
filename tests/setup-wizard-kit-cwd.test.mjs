#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from '../scripts/lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INIT = path.join(KIT_ROOT, 'scripts', 'init.mjs');

const r = spawnSync(
  process.execPath,
  [INIT, '--yes', '--dry-run'],
  { cwd: KIT_ROOT, encoding: 'utf8' },
);
assert.notEqual(r.status, 0, 'should fail without --target from kit cwd');
assert.match(r.stderr + r.stdout, /E_TARGET_IS_KIT|kit folder/i);

console.log('OK: setup-wizard-kit-cwd.test.mjs');
