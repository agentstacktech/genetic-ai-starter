#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertSafeInstallTarget, isRunningFromKitRoot } from '../scripts/lib/guard-target.mjs';
import { InstallError } from '../scripts/lib/install-errors.mjs';
import { KIT_ROOT } from '../scripts/lib/paths.mjs';

const tempOutside = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-guard-'));

assert.throws(
  () => assertSafeInstallTarget(KIT_ROOT, KIT_ROOT),
  (e) => e instanceof InstallError && e.code === 'E_TARGET_IS_KIT',
);

assert.doesNotThrow(() => assertSafeInstallTarget(tempOutside, KIT_ROOT));
assert.equal(isRunningFromKitRoot(KIT_ROOT, KIT_ROOT), true);
assert.equal(isRunningFromKitRoot(tempOutside, KIT_ROOT), false);

fs.rmSync(tempOutside, { recursive: true, force: true });
console.log('OK: guard-target.test.mjs');
