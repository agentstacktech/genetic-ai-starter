#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listProfileIds } from '../scripts/lib/read-profiles.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const manifestPath = path.join(KIT_ROOT, 'profiles', 'manifest.json');

assert.ok(fs.existsSync(manifestPath), 'run validate-kit to generate manifest');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const ids = listProfileIds();
assert.deepEqual(manifest.profiles.sort(), ids.sort());
assert.ok(ids.includes('agentstack-app'));

console.log('OK: profile-manifest.test.mjs');
