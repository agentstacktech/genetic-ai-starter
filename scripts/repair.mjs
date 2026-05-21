#!/usr/bin/env node
/**
 * Repair a broken or partial kit install (re-run install from kit.lock.json).
 * Equivalent to upgrade.mjs — forces philosophy refresh and strict validation.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--help') {
      console.log('Usage: node repair.mjs --target <project-root>');
      process.exit(0);
    }
  }
  if (!target) {
    console.error('Usage: node repair.mjs --target <project-root>');
    process.exit(1);
  }
  return { target: path.resolve(target) };
}

function main() {
  const { target } = parseArgs(process.argv);
  const upgrade = path.join(__dirname, 'upgrade.mjs');
  const r = spawnSync(process.execPath, [upgrade, '--target', target], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

main();
