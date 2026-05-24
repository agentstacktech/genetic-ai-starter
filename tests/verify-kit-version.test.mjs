#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyKitVersionPin } from '../scripts/lib/verify-kit-version.mjs';
import { readPlatformVersionForKitRoot } from '../scripts/lib/read-platform-version-for-kit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const platformVersion = readPlatformVersionForKitRoot(KIT_ROOT);
const lock = {
  kitVersion: platformVersion,
  kitSource: { type: 'path', path: '.', ref: 'abc', refType: 'commit' },
};

const ok = verifyKitVersionPin(lock, KIT_ROOT);
assert.equal(ok.ok, true, ok.message);

const bad = verifyKitVersionPin({ ...lock, kitVersion: '0.0.0' }, KIT_ROOT);
assert.equal(bad.ok, false);

console.log('verify-kit-version.test.mjs OK');
