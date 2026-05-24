#!/usr/bin/env node
/**
 * Zero-kit bootstrap: add submodule then run bootstrap-standard.
 * Publish at genetic-ai-starter/scripts/remote-bootstrap.mjs for raw GitHub curl.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEFAULT_KIT_SUBMODULE_PATH } from './lib/kit-integration-constants.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    target: '.',
    projectName: 'My Project',
    domain: 'app',
    yes: false,
    dryRun: false,
    gitignoreKit: 'none',
    submodulePath: DEFAULT_KIT_SUBMODULE_PATH,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--project-name') opts.projectName = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--yes' || a === '-y') opts.yes = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--gitignore-kit') opts.gitignoreKit = argv[++i];
    else if (a === '--submodule-path') opts.submodulePath = argv[++i];
    else if (a === '--help') {
      console.log('Usage: node remote-bootstrap.mjs --target . --project-name "App" --domain app [--yes]');
      process.exit(0);
    }
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function main() {
  const opts = parseArgs(process.argv);

  const add = spawnSync(
    process.execPath,
    [
      path.join(__dirname, 'submodule-add-kit.mjs'),
      '--target',
      opts.target,
      '--path',
      opts.submodulePath,
    ],
    { stdio: 'inherit' },
  );
  if (add.status !== 0) process.exit(add.status ?? 1);

  const bootstrapScript = path.join(opts.target, opts.submodulePath, 'scripts/bootstrap-standard.mjs');
  const bootArgs = [
    bootstrapScript,
    '--target',
    opts.target,
    '--project-name',
    opts.projectName,
    '--domain',
    opts.domain,
    '--skip-submodule',
  ];
  if (opts.yes) bootArgs.push('--yes');
  if (opts.dryRun) bootArgs.push('--dry-run');
  if (opts.gitignoreKit !== 'none') bootArgs.push('--gitignore-kit', opts.gitignoreKit);

  const boot = spawnSync(process.execPath, bootArgs, { stdio: 'inherit' });
  process.exit(boot.status ?? 0);
}

main();
