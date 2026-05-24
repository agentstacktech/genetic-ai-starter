#!/usr/bin/env node
/**
 * Consumer CI entry: doctor + validate-installed with kit resolver.
 */
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';

function parseArgs(argv) {
  let target = '.';
  let kitRoot = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
  }
  return { target: path.resolve(target), kitRoot };
}

function main() {
  const { target, kitRoot: explicit } = parseArgs(process.argv);
  const { root: kitRoot } = resolveKitRoot({ target, explicitKitRoot: explicit });

  for (const script of ['doctor.mjs', 'validate-installed.mjs']) {
    const r = spawnSync(
      process.execPath,
      [path.join(kitRoot, 'scripts', script), '--target', target, '--kit-root', kitRoot],
      { stdio: 'inherit' },
    );
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
  console.log('ci-kit OK');
}

main();
