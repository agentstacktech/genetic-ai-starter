#!/usr/bin/env node
/**
 * Validate kit docs/recipes against capability-snapshot.json (offline contract).
 * Gene: repo.platform.capability_contract.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT, EXTENSIONS_DIR } from './lib/paths.mjs';
import { readPlatformVersion } from './lib/platform-version.mjs';
import { listRecipeScanFiles, scanRecipeFile } from './lib/recipe-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SNAPSHOT_CANDIDATES = [
  path.join(EXTENSIONS_DIR, 'agentstack/capability-snapshot.json'),
  path.join(EXTENSIONS_DIR, 'agentstack/overlay/capability-snapshot.json'),
];

function parseArgs(argv) {
  let target = null;
  let kitRoot = KIT_ROOT;
  let refresh = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
    else if (argv[i] === '--refresh') refresh = true;
    else if (argv[i] === '--help' || argv[i] === '-h') {
      printRefreshHelp();
      process.exit(0);
    }
  }
  return { target: target ? path.resolve(target) : null, kitRoot: path.resolve(kitRoot), refresh };
}

function printRefreshHelp() {
  console.log(`Usage: node check-capability-contract.mjs [--target <project>] [--kit-root <kit>] [--refresh]

Validates recipe SDK subpath imports and referenced MCP action ids against
extensions/agentstack/capability-snapshot.json (committed offline SoT).

Maintainer --refresh (network stub):
  1. Bump platform: node scripts/sync-kit-version.mjs
  2. From a machine with AGENTSTACK_API_KEY + network:
     - sdk.getCapabilityMatrix() -> platformCapabilities + domainCapabilities
     - GET /mcp/actions -> flatten action ids into mcpActionDomains
     - Read agentstack-unified-sdk/packages/core/package.json exports -> sdkExports
  3. Write extensions/agentstack/capability-snapshot.json (+ overlay copy)
  4. Commit with platform bump; run this script without --refresh in CI`);
}

function resolveSnapshotPath() {
  for (const p of SNAPSHOT_CANDIDATES) {
    if (fs.existsSync(p)) return p;
  }
  return SNAPSHOT_CANDIDATES[0];
}

function flattenMcpActions(snapshot) {
  const ids = new Set(['agentstack.execute']);
  for (const action of snapshot.recipePinnedActions || []) ids.add(action);
  for (const domain of snapshot.mcpActionDomains || []) {
    for (const action of domain.sampleActions || []) ids.add(action);
  }
  return ids;
}

function flattenCapabilities(snapshot) {
  const ids = new Set();
  for (const p of snapshot.platformCapabilities || []) ids.add(p.id);
  for (const d of snapshot.domainCapabilities || []) ids.add(d.id);
  return ids;
}

function listSdkExportKeys(snapshot) {
  return new Set(Object.keys(snapshot.sdkExports || {}));
}

function listScanFiles(root) {
  return listRecipeScanFiles([root]);
}

function runRefreshStub(kitRoot) {
  printRefreshHelp();
  const dest = path.join(kitRoot, 'extensions/agentstack/capability-snapshot.json');
  let platform = 'unknown';
  try {
    platform = readPlatformVersion();
  } catch {
    /* */
  }
  console.log('');
  console.log(`--refresh stub: no network fetch in this build.`);
  console.log(`Update ${dest} manually after platform ${platform} bump.`);
  console.log('See MAINTAINERS.md § Capability snapshot refresh.');
  process.exit(0);
}

function main() {
  const { target, kitRoot, refresh } = parseArgs(process.argv);
  if (refresh) runRefreshStub(kitRoot);

  const snapshotPath = resolveSnapshotPath();
  if (!fs.existsSync(snapshotPath)) {
    console.error('Missing capability snapshot:', snapshotPath);
    process.exit(1);
  }
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const exportKeys = listSdkExportKeys(snapshot);
  const mcpActions = flattenMcpActions(snapshot);
  const capabilities = flattenCapabilities(snapshot);

  const scanRoots = [
    path.join(kitRoot, 'extensions/agentstack/recipes'),
    path.join(kitRoot, 'extensions/agentstack'),
  ];
  if (target) {
    scanRoots.push(path.join(target, 'examples/agentstack'));
    scanRoots.push(path.join(target, 'docs/ai'));
  }

  const errors = [];
  const files = new Set();
  for (const root of scanRoots) {
    for (const f of listScanFiles(root)) {
      files.add(f);
    }
  }

  for (const file of files) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    const { imports, actions } = scanRecipeFile(file);
    const rel = path.relative(kitRoot, file).replace(/\\/g, '/');
    for (const imp of imports) {
      const key = imp === '.' ? '.' : imp.replace(/^\.\//, '');
      if (!exportKeys.has(key)) {
        errors.push(`${rel}: SDK import @agentstack/sdk${imp === '.' ? '' : imp.slice(1)} not in snapshot exports`);
      }
    }
    for (const action of actions) {
      if (action.includes('.')) {
        if (!mcpActions.has(action) && !capabilities.has(action)) {
          errors.push(`${rel}: action/capability '${action}' not in capability-snapshot.json`);
        }
      }
    }
  }

  if (errors.length) {
    console.error('check-capability-contract FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`check-capability-contract OK (${files.size} files, snapshot ${path.basename(snapshotPath)})`);
}

main();
