#!/usr/bin/env node
/**
 * Migrate kit.lock.json v1 → KIP v2 (add kitSource / kitRootRel).
 */
import path from 'node:path';
import { readKitLock, writeKitLock } from './lib/read-kit-lock.mjs';
import { LOCK_SCHEMA_VERSION } from './lib/kit-integration-constants.mjs';
import { buildKitSourceRecord } from './lib/record-kit-source.mjs';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';
import { parseGitmodules } from './lib/git-submodule.mjs';

function parseArgs(argv) {
  let target = '.';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
  }
  return { target: path.resolve(target) };
}

function main() {
  const { target } = parseArgs(process.argv);
  const { lock, lockPath } = readKitLock(target);
  if (!lock) {
    console.error('No kit.lock.json — run install first');
    process.exit(1);
  }
  if (lock.lockSchemaVersion === LOCK_SCHEMA_VERSION && lock.kitSource) {
    console.log('kit.lock already v2');
    return;
  }

  let kitRoot;
  try {
    kitRoot = resolveKitRoot({ target }).root;
  } catch {
    const mods = parseGitmodules(target);
    if (mods[0]?.path) {
      kitRoot = path.join(target, mods[0].path);
    } else {
      console.error('Cannot resolve kit root for migration');
      process.exit(1);
    }
  }

  const rec = buildKitSourceRecord(target, kitRoot, { preferSubmodule: true });
  const next = {
    ...lock,
    lockSchemaVersion: rec.lockSchemaVersion,
    kitSource: rec.kitSource,
    kitRootRel: rec.kitRootRel,
    paths: rec.paths,
  };
  writeKitLock(target, next);
  console.log(`migrated ${lockPath} → lockSchemaVersion ${LOCK_SCHEMA_VERSION}`);
}

main();
