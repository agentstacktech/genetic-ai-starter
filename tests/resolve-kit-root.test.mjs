#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolveKitRoot } from '../scripts/lib/resolve-kit-root.mjs';
import { LOCK_SCHEMA_VERSION } from '../scripts/lib/kit-integration-constants.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-resolve-'));
const kitPath = path.join(temp, 'tools', 'genetic-ai-starter');
fs.mkdirSync(kitPath, { recursive: true });
fs.cpSync(KIT_ROOT, kitPath, {
  recursive: true,
  filter: (src) => !src.includes('node_modules') && !src.includes('benchmarks\\work'),
});

fs.mkdirSync(path.join(temp, '.genetic-ai'), { recursive: true });
fs.writeFileSync(
  path.join(temp, '.genetic-ai', 'kit.lock.json'),
  JSON.stringify({
    lockSchemaVersion: LOCK_SCHEMA_VERSION,
    kitId: 'genetic-ai-starter',
    kitVersion: '0.4.11',
    profile: 'standard',
    kitRootRel: 'tools/genetic-ai-starter',
    kitSource: {
      type: 'submodule',
      path: 'tools/genetic-ai-starter',
      ref: 'abc',
      refType: 'commit',
    },
  }),
);

const r = resolveKitRoot({ target: temp, allowScriptCwd: false });
assert.equal(r.root, kitPath);
assert.match(r.source, /lock|gitmodules|fallback/);

process.env.GENETIC_AI_KIT_ROOT = KIT_ROOT;
const r2 = resolveKitRoot({ target: temp, allowScriptCwd: false });
assert.equal(r2.root, KIT_ROOT);
delete process.env.GENETIC_AI_KIT_ROOT;

fs.rmSync(temp, { recursive: true, force: true });
console.log('resolve-kit-root.test.mjs OK');
