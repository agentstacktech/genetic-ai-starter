#!/usr/bin/env node
/**
 * Submodule-first standard install from consumer repo root.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { DEFAULT_KIT_SUBMODULE_PATH } from './lib/kit-integration-constants.mjs';
import { submodulePathExists } from './lib/git-submodule.mjs';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    target: '.',
    projectName: 'My Project',
    domain: 'app',
    profile: 'standard',
    yes: false,
    dryRun: false,
    gitignoreKit: 'none',
    withAgentstack: false,
    skipSubmodule: false,
    submodulePath: DEFAULT_KIT_SUBMODULE_PATH,
    kitRoot: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--project-name') opts.projectName = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--profile') opts.profile = argv[++i];
    else if (a === '--yes' || a === '-y') opts.yes = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--gitignore-kit') opts.gitignoreKit = argv[++i];
    else if (a === '--with-agentstack') opts.withAgentstack = true;
    else if (a === '--skip-submodule') opts.skipSubmodule = true;
    else if (a === '--submodule-path') opts.submodulePath = argv[++i];
    else if (a === '--kit-root') opts.kitRoot = argv[++i];
    else if (a === '--help') {
      console.log(`Usage: node bootstrap-standard.mjs --target <repo> --project-name "App" --domain app
  [--skip-submodule] [--gitignore-kit full|none] [--with-agentstack] [--dry-run]`);
      process.exit(0);
    }
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function runNode(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, stdio: 'inherit', encoding: 'utf8' });
}

function main() {
  const opts = parseArgs(process.argv);

  let kitRoot = opts.kitRoot ? path.resolve(opts.kitRoot) : null;

  if (!opts.skipSubmodule && !kitRoot) {
    if (!submodulePathExists(opts.target, opts.submodulePath)) {
      const addScript = path.join(__dirname, 'submodule-add-kit.mjs');
      const addArgs = ['--target', opts.target, '--path', opts.submodulePath];
      if (opts.dryRun) addArgs.push('--dry-run');
      const add = runNode(addScript, addArgs, process.cwd());
      if (add.status !== 0) process.exit(add.status ?? 1);
    }
  }

  if (!kitRoot) {
    try {
      kitRoot = resolveKitRoot({ target: opts.target, explicitKitRoot: opts.kitRoot }).root;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  const installArgs = [
    path.join(kitRoot, 'scripts/install.mjs'),
    '--target',
    opts.target,
    '--profile',
    opts.profile,
    '--project-name',
    opts.projectName,
    '--domain',
    opts.domain,
    '--strict',
    '--record-kit-source',
    '--kit-root',
    kitRoot,
  ];
  if (opts.dryRun) installArgs.push('--dry-run');
  if (opts.gitignoreKit !== 'none') installArgs.push('--gitignore-kit', opts.gitignoreKit);
  if (opts.withAgentstack) installArgs.push('--with-agentstack');

  const install = spawnSync(process.execPath, installArgs, { cwd: kitRoot, stdio: 'inherit' });
  if (install.status !== 0) process.exit(install.status ?? 1);

  if (!opts.dryRun) {
    const val = spawnSync(
      process.execPath,
      [path.join(kitRoot, 'scripts/validate-installed.mjs'), '--target', opts.target, '--kit-root', kitRoot],
      { cwd: kitRoot, stdio: 'inherit' },
    );
    if (val.status !== 0) process.exit(val.status ?? 1);
  }

  console.log('\nNext:');
  console.log(`  node ${path.relative(opts.target, path.join(kitRoot, 'scripts/doctor.mjs')).replace(/\\/g, '/')} --target .`);
  console.log('  Edit docs/ai/AI_NAVIGATION_MAP.md — Tier 0 rows for your codebase.');
}

main();
