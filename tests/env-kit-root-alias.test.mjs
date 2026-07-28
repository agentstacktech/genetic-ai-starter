#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveKitRoot } from '../scripts/lib/resolve-kit-root.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const prev = process.env.GENETIC_AI_KIT_ROOT;
const prevLegacy = process.env.GENETIC_AI_STARTER_KIT;
delete process.env.GENETIC_AI_KIT_ROOT;
delete process.env.GENETIC_AI_STARTER_KIT;

process.env.GENETIC_AI_STARTER_KIT = KIT_ROOT;
const legacy = resolveKitRoot({ target: KIT_ROOT, allowScriptCwd: false });
assert.equal(path.resolve(legacy.root), KIT_ROOT);
assert.equal(legacy.source, 'env.GENETIC_AI_STARTER_KIT');

process.env.GENETIC_AI_KIT_ROOT = KIT_ROOT;
delete process.env.GENETIC_AI_STARTER_KIT;
const canon = resolveKitRoot({ target: KIT_ROOT, allowScriptCwd: false });
assert.equal(canon.source, 'env.GENETIC_AI_KIT_ROOT');

if (prev) process.env.GENETIC_AI_KIT_ROOT = prev;
else delete process.env.GENETIC_AI_KIT_ROOT;
if (prevLegacy) process.env.GENETIC_AI_STARTER_KIT = prevLegacy;
else delete process.env.GENETIC_AI_STARTER_KIT;

console.log('OK: env-kit-root-alias.test.mjs');
