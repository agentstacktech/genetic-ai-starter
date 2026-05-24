#!/usr/bin/env node
/**
 * Materialize one benchmark arm under benchmarks/work/<arm-id>/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { copyTree, rmTreeIfExists } from './lib/copy-tree.mjs';
import {
  BENCH_ROOT,
  FIXTURE_ROOT,
  WORK_ROOT,
  KIT_ROOT,
  BASELINES_DIR,
  OVERLAY_SHOP,
} from './lib/paths.mjs';

const ARMS = new Set([
  'bare',
  'readme_tree',
  'agents_md',
  'agents_md_weak',
  'generic_cursorrules',
  'kit_minimal',
  'kit_standard',
  'kit_standard_indexed',
]);

function parseArgs(argv) {
  let arm = null;
  let force = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--arm') arm = argv[++i];
    else if (argv[i] === '--force') force = true;
    else if (argv[i] === '--help') {
      console.log('Usage: node prepare-arm.mjs --arm <id> [--force]');
      process.exit(0);
    }
  }
  if (!arm || !ARMS.has(arm)) {
    console.error(`--arm required: ${[...ARMS].join(', ')}`);
    process.exit(1);
  }
  return { arm, force };
}

function overlayShopMapAndIndexes(targetRoot, { indexes }) {
  const mapSrc = path.join(OVERLAY_SHOP, 'docs/ai/AI_NAVIGATION_MAP.md');
  const mapDest = path.join(targetRoot, 'docs/ai/AI_NAVIGATION_MAP.md');
  fs.mkdirSync(path.dirname(mapDest), { recursive: true });
  fs.copyFileSync(mapSrc, mapDest);
  if (!indexes) return;
  for (const rel of [
    'src/auth/AI_INDEX.md',
    'src/catalog/AI_INDEX.md',
    'src/billing/AI_INDEX.md',
    'src/webhooks/AI_INDEX.md',
  ]) {
    const src = path.join(OVERLAY_SHOP, rel);
    const dest = path.join(targetRoot, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function runInstall(targetRoot, profile) {
  const r = spawnSync(
    process.execPath,
    [
      path.join(KIT_ROOT, 'scripts/install.mjs'),
      '--target',
      targetRoot,
      '--profile',
      profile,
      '--project-name',
      'shop-api',
      '--domain',
      'shop',
      '--strict',
    ],
    { cwd: KIT_ROOT, encoding: 'utf8' },
  );
  if (r.status !== 0) {
    console.error(r.stdout, r.stderr);
    throw new Error(`install failed for profile ${profile}`);
  }
}

function applyArm(arm, targetRoot) {
  if (arm === 'bare') {
    fs.writeFileSync(
      path.join(targetRoot, 'README.md'),
      fs.readFileSync(path.join(BASELINES_DIR, 'README.bare.md'), 'utf8'),
    );
    return;
  }
  if (arm === 'readme_tree') {
    fs.writeFileSync(
      path.join(targetRoot, 'README.md'),
      fs.readFileSync(path.join(BASELINES_DIR, 'README.tree.md'), 'utf8'),
    );
    return;
  }
  if (arm === 'agents_md' || arm === 'agents_md_weak') {
    fs.copyFileSync(
      path.join(BASELINES_DIR, 'agents.md.only'),
      path.join(targetRoot, 'AGENTS.md'),
    );
    return;
  }
  if (arm === 'generic_cursorrules') {
    fs.copyFileSync(
      path.join(BASELINES_DIR, 'generic-ts.cursorrules'),
      path.join(targetRoot, '.cursorrules'),
    );
    return;
  }
  if (arm === 'kit_minimal') {
    runInstall(targetRoot, 'minimal');
    return;
  }
  if (arm === 'kit_standard') {
    runInstall(targetRoot, 'standard');
    overlayShopMapAndIndexes(targetRoot, { indexes: false });
    return;
  }
  if (arm === 'kit_standard_indexed') {
    runInstall(targetRoot, 'standard');
    overlayShopMapAndIndexes(targetRoot, { indexes: true });
  }
}

function main() {
  const { arm, force } = parseArgs(process.argv);
  const dest = path.join(WORK_ROOT, arm);
  if (force) rmTreeIfExists(dest);
  if (fs.existsSync(dest)) {
    console.log(`exists: ${dest} (use --force to rebuild)`);
    return;
  }
  copyTree(FIXTURE_ROOT, dest);
  applyArm(arm, dest);
  fs.writeFileSync(
    path.join(dest, '.benchmark-arm.json'),
    JSON.stringify({ arm, fixture: 'shop-api', preparedAt: new Date().toISOString() }, null, 2),
  );
  console.log(`prepared: ${dest}`);
}

main();
