#!/usr/bin/env node
/**
 * Install to OS temp dir, validate, cleanup.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'genetic-ai-kit-verify-'));

function run(nodeArgs, { cwd = KIT_ROOT } = {}) {
  return spawnSync(process.execPath, nodeArgs, { cwd, encoding: 'utf8' });
}

let failed = 0;
function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL: ${name}`, detail);
    failed++;
  }
}

try {
  console.log('verify-temp-install: target', temp);

  const install = run([
    'scripts/install.mjs',
    '--target',
    temp,
    '--profile',
    'standard',
    '--project-name',
    'Temp Verify',
    '--domain',
    'verify',
    '--strict',
  ]);
  assert('install exit 0', install.status === 0, install.stderr || install.stdout);

  const validate = run(['scripts/validate-installed.mjs', '--target', temp]);
  assert('validate-installed', validate.status === 0, validate.stderr);

  const doctor = run(['scripts/doctor.mjs', '--target', temp]);
  assert('doctor', doctor.status === 0, doctor.stderr);

  assert('AGENTS.md', fs.existsSync(path.join(temp, 'AGENTS.md')));
  assert('kit.lock', fs.existsSync(path.join(temp, '.genetic-ai/kit.lock.json')));
  assert(
    'no stub leak',
    !fs.existsSync(path.join(temp, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md')),
  );

  const lock = JSON.parse(fs.readFileSync(path.join(temp, '.genetic-ai/kit.lock.json'), 'utf8'));
  assert('lock profile', lock.profile === 'standard');
  assert('lock kitVersion', typeof lock.kitVersion === 'string' && lock.kitVersion.length > 0);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
  console.log('cleaned up', temp);
}

if (failed) process.exit(1);
console.log('OK: verify-temp-install');
