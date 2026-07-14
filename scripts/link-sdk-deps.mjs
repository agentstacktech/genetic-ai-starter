#!/usr/bin/env node
/**
 * Wire examples/agentstack/package.json to SDK submodule (Flow B).
 * Gene: repo.platform.sdk.recipes.gen1
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { linkRecipesToSdkSubmodule } from './lib/pin-recipe-package.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    target: '.',
    recipesDir: 'examples/agentstack',
    sdkPath: 'vendor/agentstack-sdk',
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--recipes-dir') opts.recipesDir = argv[++i];
    else if (a === '--sdk-path') opts.sdkPath = argv[++i];
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--help') {
      console.log(`Usage: node link-sdk-deps.mjs --target <repo> [--recipes-dir examples/agentstack] [--sdk-path vendor/agentstack-sdk]`);
      process.exit(0);
    }
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function main() {
  const opts = parseArgs(process.argv);
  if (opts.dryRun) {
    const { link } = linkRecipesToSdkSubmodule(opts.target, opts.recipesDir, opts.sdkPath, {
      dryRun: true,
    });
    console.log(`[dry-run] would set @agentstack/sdk -> ${link}`);
    return;
  }
  const { packageJsonPath, link } = linkRecipesToSdkSubmodule(
    opts.target,
    opts.recipesDir,
    opts.sdkPath,
  );
  console.log(`link-sdk-deps OK ${path.relative(opts.target, packageJsonPath)} -> ${link}`);
}

main();
