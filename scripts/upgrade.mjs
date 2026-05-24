#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';
import { readKitLock, writeKitLock } from './lib/read-kit-lock.mjs';
import { applyKitSourceToLock } from './lib/record-kit-source.mjs';
import { checkoutKitRef } from './lib/git-submodule.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = null;
  let syncSubmodule = false;
  let kitRoot = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--sync-submodule') syncSubmodule = true;
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
  }
  if (!target) {
    console.error('Usage: node upgrade.mjs --target <path> [--sync-submodule] [--kit-root <path>]');
    process.exit(1);
  }
  return { target: path.resolve(target), syncSubmodule, kitRoot };
}

function main() {
  const { target, syncSubmodule, kitRoot: explicitKitRoot } = parseArgs(process.argv);
  const { lock } = readKitLock(target);
  if (!lock) {
    console.error('No kit.lock.json — run install first');
    process.exit(1);
  }

  const { root: kitRoot } = resolveKitRoot({ target, explicitKitRoot: explicitKitRoot });

  if (syncSubmodule && lock.kitSource?.type === 'submodule' && lock.kitSource.ref) {
    checkoutKitRef(target, lock.kitSource);
  }

  const installScript = path.join(kitRoot, 'scripts/install.mjs');
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
    '--record-kit-source',
    '--kit-root',
    kitRoot,
  ];
  if (lock.skillsMode === 'global') args.push('--skills', 'global');
  if ((lock.extensions || []).includes('agentstack')) args.push('--with-agentstack');
  if (lock.gitignoreKit === 'full') args.push('--gitignore-kit', 'full');

  const r = spawnSync(process.execPath, args, { stdio: 'inherit', cwd: kitRoot });
  if (r.status !== 0) process.exit(r.status ?? 1);

  const refreshed = applyKitSourceToLock(lock, target, kitRoot, { preferSubmodule: true });
  writeKitLock(target, refreshed);
}

main();
