#!/usr/bin/env node
/**
 * Kit wrapper: add @agentstack/sdk git submodule (Flow B).
 * Delegates to agentstack-unified-sdk/scripts/submodule-add-sdk.mjs when present.
 * Gene: repo.platform.sdk.recipes.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readPlatformVersionForKitRoot } from './lib/read-platform-version-for-kit.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

const DEFAULT_SDK_PATH = 'vendor/agentstack-sdk';

function parseArgs(argv) {
  const opts = {
    target: '.',
    path: DEFAULT_SDK_PATH,
    tag: null,
    ref: null,
    kitRoot: KIT_ROOT,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--path') opts.path = argv[++i];
    else if (a === '--tag') opts.tag = argv[++i];
    else if (a === '--ref') opts.ref = argv[++i];
    else if (a === '--kit-root') opts.kitRoot = path.resolve(argv[++i]);
    else if (a === '--help') {
      console.log(`Usage: node submodule-add-sdk.mjs --target <repo> [--tag vX.Y.Z] [--path vendor/agentstack-sdk]

Flow B — pin SDK commit in git, then wire recipes:
  node scripts/link-sdk-deps.mjs --target <repo>
  cd vendor/agentstack-sdk && npm install && npm run build
  cd examples/agentstack && npm install`);
      process.exit(0);
    }
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function resolveSdkScript(kitRoot, targetRoot) {
  const candidates = [
    path.join(kitRoot, '..', 'agentstack-unified-sdk', 'scripts', 'submodule-add-sdk.mjs'),
    path.join(targetRoot, DEFAULT_SDK_PATH, 'scripts', 'submodule-add-sdk.mjs'),
    path.join(targetRoot, 'vendor', 'agentstack-sdk', 'scripts', 'submodule-add-sdk.mjs'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function main() {
  const opts = parseArgs(process.argv);
  let tag = opts.tag;
  if (!tag && !opts.ref) {
    try {
      const ver = readPlatformVersionForKitRoot(opts.kitRoot);
      tag = `v${ver}`;
    } catch {
      const pv = path.join(opts.kitRoot, 'PLATFORM_VERSION');
      tag = fs.existsSync(pv)
        ? `v${fs.readFileSync(pv, 'utf8').trim()}`
        : 'v0.4.14';
    }
  }

  const sdkScript = resolveSdkScript(opts.kitRoot, opts.target);
  if (sdkScript) {
    const args = [sdkScript, '--target', opts.target, '--path', opts.path];
    if (opts.ref) args.push('--ref', opts.ref);
    else if (tag) args.push('--tag', tag);
    const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
    if (r.status !== 0) process.exit(r.status ?? 1);
  } else {
    console.error(
      'SDK submodule script not found. Add submodule manually:\n' +
        `  git submodule add https://github.com/agentstacktech/agentstack-sdk.git ${opts.path}\n` +
        `  cd ${opts.path} && git checkout ${tag || 'v0.4.14'}`,
    );
    process.exit(1);
  }

  console.log('');
  console.log('Next: node scripts/link-sdk-deps.mjs --target', opts.target);
  console.log(`Then build SDK: cd ${opts.path} && npm install && npm run build`);
}

main();
