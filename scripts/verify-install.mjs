#!/usr/bin/env node
/**
 * Install to temp dir and validate (Windows smoke test, Node-native A9).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listProfileIds } from './lib/read-profiles.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  let profile = 'standard';
  let keepTemp = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--profile' && argv[i + 1]) profile = argv[++i];
    else if (argv[i] === '--keep-temp') keepTemp = true;
  }
  if (!listProfileIds().includes(profile)) {
    throw new Error(`Unknown profile: ${profile}`);
  }
  return { profile, keepTemp };
}

function run(nodeArgs, { cwd = KIT_ROOT } = {}) {
  return spawnSync(process.execPath, nodeArgs, { cwd, encoding: 'utf8' });
}

const { profile, keepTemp } = parseArgs(process.argv);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'genetic-ai-starter-verify-'));

try {
  console.log('Temp target:', temp);
  console.log('Profile:    ', profile);

  const install = run([
    'scripts/install.mjs',
    '--target',
    temp,
    '--profile',
    profile,
    '--project-name',
    'Verify Install',
    '--domain',
    'verify',
    '--strict',
    '--kit-root',
    KIT_ROOT,
  ]);
  if (install.status !== 0) {
    console.error(install.stderr || install.stdout);
    process.exit(install.status ?? 1);
  }

  const mustExist = [
    'AGENTS.md',
    '.cursorrules',
    'docs/ai/AI_NAVIGATION_MAP.md',
    '.genetic-ai/kit.lock.json',
    '.cursor/rules/genetic-navigation.mdc',
  ];
  if (profile !== 'minimal') mustExist.push('philosophy/genes/GENE_INDEX.md');

  const missing = mustExist.filter((rel) => !fs.existsSync(path.join(temp, rel)));
  const stubLeak = path.join(temp, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
  if (fs.existsSync(stubLeak)) {
    throw new Error(`Stub leak on profile ${profile}: ${stubLeak}`);
  }
  if (missing.length) {
    throw new Error(`Missing after install: ${missing.join(', ')}`);
  }

  const doctor = run(['scripts/doctor.mjs', '--target', temp, '--kit-root', KIT_ROOT]);
  if (doctor.status !== 0) {
    console.error(doctor.stderr || doctor.stdout);
    process.exit(doctor.status ?? 1);
  }

  console.log(`\nVERIFY OK profile=${profile} temp=${temp}`);
  if (keepTemp) console.log('Kept temp folder (--keep-temp).');
} finally {
  if (!keepTemp) {
    fs.rmSync(temp, { recursive: true, force: true });
    console.log('Removed temp folder.');
  }
}
