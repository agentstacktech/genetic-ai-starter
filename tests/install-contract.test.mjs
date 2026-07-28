#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = path.join(KIT_ROOT, 'contracts/INSTALL_CONTRACT.v1.json');

assert.ok(fs.existsSync(contractPath), 'INSTALL_CONTRACT.v1.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

for (const [name, spec] of Object.entries(contract.scripts)) {
  assert.ok(fs.existsSync(path.join(KIT_ROOT, spec.path)), `${name} → ${spec.path}`);
}

const win = contract.launchers?.windows;
assert.equal(win?.primary, 'SETUP.cmd');
assert.ok(fs.existsSync(path.join(KIT_ROOT, win.install)));

console.log('OK: install-contract.test.mjs');
