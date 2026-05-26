#!/usr/bin/env node
/**
 * Repair kit install — preserve navigation by default; optional philosophy refresh.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    target: null,
    validateOnly: false,
    repairPhilosophy: false,
    preserveNavigation: true,
    yes: false,
  };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') opts.target = argv[++i];
    else if (argv[i] === '--validate-only') opts.validateOnly = true;
    else if (argv[i] === '--repair-philosophy') opts.repairPhilosophy = true;
    else if (argv[i] === '--no-preserve-navigation') opts.preserveNavigation = false;
    else if (argv[i] === '--yes') opts.yes = true;
    else if (argv[i] === '--help') {
      console.log(`Usage: node repair.mjs --target <project-root> [options]
  --validate-only     run validate-installed only
  --repair-philosophy run upgrade with --force-philosophy
  --no-preserve-navigation
  --yes`);
      process.exit(0);
    }
  }
  if (!opts.target) {
    console.error('Usage: node repair.mjs --target <project-root>');
    process.exit(1);
  }
  return { target: path.resolve(opts.target), ...opts };
}

function main() {
  const opts = parseArgs(process.argv);
  const { root: kitRoot } = resolveKitRoot({ target: opts.target });

  if (opts.validateOnly) {
    const v = spawnSync(
      process.execPath,
      [path.join(kitRoot, 'scripts/validate-installed.mjs'), '--target', opts.target, '--kit-root', kitRoot],
      { stdio: 'inherit' },
    );
    process.exit(v.status ?? 1);
  }

  const upgradeArgs = [
    path.join(__dirname, 'upgrade.mjs'),
    '--target',
    opts.target,
    '--kit-root',
    kitRoot,
  ];
  if (opts.preserveNavigation) upgradeArgs.push('--preserve-navigation');
  else upgradeArgs.push('--no-preserve-navigation');
  if (opts.repairPhilosophy) upgradeArgs.push('--force-philosophy');
  else upgradeArgs.push('--no-force-philosophy');
  if (opts.yes) upgradeArgs.push('--yes');

  const r = spawnSync(process.execPath, upgradeArgs, { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

main();
