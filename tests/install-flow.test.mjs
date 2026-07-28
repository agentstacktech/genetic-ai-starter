#!/usr/bin/env node
/**
 * End-to-end install plane flow audit:
 * preflight → init --yes → install → validate (doctor) + failure path (attempt log).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(nodeArgs, { cwd = KIT_ROOT, env = process.env } = {}) {
  return spawnSync(process.execPath, nodeArgs, { cwd, encoding: 'utf8', env });
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gai-flow-'));

try {
  // I1 Preflight (SETUP.cmd hook)
  const pf = run(['scripts/preflight.mjs', '--quick', '--launcher', 'test-flow', '--kit-root', KIT_ROOT]);
  assert.equal(pf.status, 0, pf.stderr || pf.stdout);
  assert.match(pf.stdout, /node\.onPath/);

  // I2 Wizard → I3 Install (non-interactive)
  const init = run([
    'scripts/init.mjs',
    '--yes',
    '--target',
    temp,
    '--profile',
    'minimal',
    '--project-name',
    'Flow Test',
    '--domain',
    'app',
  ]);
  assert.equal(init.status, 0, init.stderr || init.stdout);
  assert.ok(fs.existsSync(path.join(temp, 'AGENTS.md')));
  assert.ok(fs.existsSync(path.join(temp, '.genetic-ai/kit.lock.json')));

  const lock = JSON.parse(fs.readFileSync(path.join(temp, '.genetic-ai/kit.lock.json'), 'utf8'));
  assert.equal(lock.profile, 'minimal');
  assert.ok(lock.kitVersion);

  // I5 Doctor
  const doctor = run(['scripts/doctor.mjs', '--target', temp, '--kit-root', KIT_ROOT]);
  assert.equal(doctor.status, 0, doctor.stderr || doctor.stdout);

  // C1 CMD env → install args (launcher layer)
  const { cmdEnvToInstallArgs } = await import('../scripts/lib/launcher/argv-mapper.mjs');
  const mapped = cmdEnvToInstallArgs(
    { PROFILE: 'minimal', PROJECT_NAME: 'X', DOMAIN: 'app', GITIGNORE: 'full' },
    { target: temp },
  );
  assert.ok(mapped.includes('--gitignore-kit'));
  assert.ok(mapped.includes('minimal'));

  // Failure path: attempt log + E_TARGET_IS_KIT
  const bad = run(['scripts/install.mjs', '--target', KIT_ROOT, '--profile', 'minimal']);
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr + bad.stdout, /E_TARGET_IS_KIT/);

  const attemptPath = path.join(KIT_ROOT, '.genetic-ai/last-install-attempt.json');
  if (fs.existsSync(attemptPath)) {
    const attempt = JSON.parse(fs.readFileSync(attemptPath, 'utf8'));
    assert.equal(attempt.code, 'E_TARGET_IS_KIT');
    assert.ok(attempt.at);
    fs.rmSync(attemptPath, { force: true });
  }

  // Non-interactive from kit cwd must fail without --target
  const noTarget = run(['scripts/init.mjs', '--yes'], { cwd: KIT_ROOT });
  assert.notEqual(noTarget.status, 0);
  assert.match(noTarget.stderr + noTarget.stdout, /E_TARGET_IS_KIT|Non-interactive/);

  console.log('OK: install-flow.test.mjs');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
