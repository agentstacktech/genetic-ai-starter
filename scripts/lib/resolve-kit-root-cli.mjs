#!/usr/bin/env node
/**
 * CLI wrapper for resolveKitRoot (PS / tooling).
 */
import path from 'node:path';
import { resolveKitRoot } from './resolve-kit-root.mjs';

function parseArgs(argv) {
  let target = '.';
  let kitRoot = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
  }
  return { target: path.resolve(target), kitRoot };
}

const { target, kitRoot } = parseArgs(process.argv);
try {
  const r = resolveKitRoot({
    target,
    explicitKitRoot: kitRoot,
    allowScriptCwd: true,
  });
  console.log(r.root);
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
