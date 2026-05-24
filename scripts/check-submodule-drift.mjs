#!/usr/bin/env node
import path from 'node:path';
import { readKitLock } from './lib/read-kit-lock.mjs';
import { detectSubmoduleDrift } from './lib/git-submodule.mjs';

function parseArgs(argv) {
  let target = '.';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
  }
  return { target: path.resolve(target) };
}

function main() {
  const { target } = parseArgs(process.argv);
  const { lock } = readKitLock(target);
  if (!lock?.kitSource || lock.kitSource.type !== 'submodule') {
    console.log('check-submodule-drift: skip (not submodule kitSource)');
    return;
  }
  const drift = detectSubmoduleDrift(target, lock.kitSource);
  if (drift.drift) {
    console.error(`check-submodule-drift FAILED: ${drift.reason}`);
    if (drift.head) console.error(`  HEAD=${drift.head} expected=${drift.expected}`);
    process.exit(1);
  }
  console.log('OK: check-submodule-drift');
}

main();
