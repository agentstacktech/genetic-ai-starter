#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
  }
  if (!target) {
    console.error('Usage: node upgrade.mjs --target <path>');
    process.exit(1);
  }
  return { target: path.resolve(target) };
}

function main() {
  const { target } = parseArgs(process.argv);
  const lockPath = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lockPath)) {
    console.error('No kit.lock.json — run install first');
    process.exit(1);
  }
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  const installScript = path.join(__dirname, 'install.mjs');
  const args = [
    installScript,
    '--target',
    target,
    '--profile',
    lock.profile || 'standard',
    '--project-name',
    lock.projectName || 'My Project',
    '--domain',
    lock.domain || 'app',
    '--force-philosophy',
  ];
  if (lock.skillsMode === 'global') args.push('--skills', 'global');
  if ((lock.extensions || []).includes('agentstack')) args.push('--with-agentstack');
  if (lock.gitignoreKit === 'full') args.push('--gitignore-kit', 'full');

  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

main();
