#!/usr/bin/env node
import assert from 'node:assert/strict';
import { detectSubmoduleDrift } from '../scripts/lib/git-submodule.mjs';

assert.equal(detectSubmoduleDrift('.', { path: '', ref: '' }).drift, false);
const missing = detectSubmoduleDrift('.', { path: 'tools/no-such-submodule', ref: 'abc' });
assert.equal(missing.drift, true);
assert.ok(missing.reason);

console.log('submodule-drift.test.mjs OK');
