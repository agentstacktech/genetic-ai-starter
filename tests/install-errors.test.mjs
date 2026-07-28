#!/usr/bin/env node
import assert from 'node:assert/strict';
import { INSTALL_ERRORS, InstallError, formatInstallError } from '../scripts/lib/install-errors.mjs';

assert.ok(INSTALL_ERRORS.E_NODE_MISSING.repair.includes('nodejs.org'));
const err = new InstallError('E_TARGET_IS_KIT');
assert.match(formatInstallError(err), /E_TARGET_IS_KIT/);
assert.match(formatInstallError(err), /Repair:/);

console.log('OK: install-errors.test.mjs');
