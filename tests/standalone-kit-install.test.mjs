#!/usr/bin/env node
/**
 * Kit copied outside AgentStack monorepo must install using PLATFORM_VERSION.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'genetic-ai-standalone-'));
const kitCopy = path.join(tempRoot, 'genetic-ai-starter');
const target = path.join(tempRoot, 'consumer');

fs.cpSync(KIT_ROOT, kitCopy, {
  recursive: true,
  filter: (src) => !src.includes('node_modules') && !src.includes('benchmarks\\work'),
});

let failed = 0;
function assert(name, ok, d = '') {
  if (!ok) {
    console.error('FAIL', name, d);
    failed++;
  }
}

const versionCheck = spawnSync(
  process.execPath,
  ['-e', "import { readPlatformVersion, describePlatformVersionSource } from './scripts/lib/platform-version.mjs'; console.log(readPlatformVersion()); console.log(describePlatformVersionSource());"],
  { cwd: kitCopy, encoding: 'utf8', env: { ...process.env, AGENTSTACK_CONSTANTS_PY: 'Z:\\__no_constants__.py' } },
);
assert('standalone readPlatformVersion', versionCheck.status === 0, versionCheck.stderr);
assert(
  'uses PLATFORM_VERSION or manifest',
  /PLATFORM_VERSION|KIT_MANIFEST/.test(versionCheck.stdout || ''),
  versionCheck.stdout,
);

const install = spawnSync(
  process.execPath,
  [
    'scripts/install.mjs',
    '--target',
    target,
    '--profile',
    'minimal',
    '--project-name',
    'Standalone',
    '--domain',
    'app',
    '--strict',
  ],
  { cwd: kitCopy, encoding: 'utf8', env: { ...process.env, AGENTSTACK_CONSTANTS_PY: 'Z:\\__no_constants__.py' } },
);
assert('standalone install', install.status === 0, install.stderr || install.stdout);

try {
  fs.rmSync(tempRoot, { recursive: true, force: true });
} catch {
  /* ignore */
}

if (failed) process.exit(1);
console.log('OK: standalone-kit-install');
