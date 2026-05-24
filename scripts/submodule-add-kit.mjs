#!/usr/bin/env node
/**
 * Idempotent git submodule add/update for genetic-ai-starter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  DEFAULT_KIT_SUBMODULE_PATH,
  DEFAULT_KIT_REPO_URL,
  kitReleaseTag,
} from './lib/kit-integration-constants.mjs';
import { ensureSubmoduleAtRef, resolveRemoteTagToSha } from './lib/git-submodule.mjs';
import { readPlatformVersionForKitRoot } from './lib/read-platform-version-for-kit.mjs';

function parseArgs(argv) {
  const opts = {
    target: '.',
    path: DEFAULT_KIT_SUBMODULE_PATH,
    url: DEFAULT_KIT_REPO_URL,
    ref: null,
    shallow: false,
    platformVersion: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--path') opts.path = argv[++i];
    else if (a === '--url') opts.url = argv[++i];
    else if (a === '--ref') opts.ref = argv[++i];
    else if (a === '--platform-version') opts.platformVersion = argv[++i];
    else if (a === '--shallow') opts.shallow = true;
    else if (a === '--help') {
      console.log(
        'Usage: node submodule-add-kit.mjs --target <repo> [--path tools/genetic-ai-starter] [--ref SHA] [--shallow]',
      );
      process.exit(0);
    }
  }
  return { ...opts, target: path.resolve(opts.target) };
}

function resolveDefaultRef(opts) {
  if (opts.ref) return opts.ref;
  const envRef = process.env.GENETIC_AI_KIT_REF?.trim();
  if (envRef && /^[0-9a-f]{40}$/i.test(envRef)) return envRef;

  let platformVersion = opts.platformVersion;
  const kitPath = path.join(opts.target, opts.path);
  if (!platformVersion && fs.existsSync(path.join(kitPath, 'scripts', 'install.mjs'))) {
    try {
      platformVersion = readPlatformVersionForKitRoot(kitPath);
    } catch {
      /* fall through */
    }
  }
  if (!platformVersion && fs.existsSync(path.join(process.cwd(), 'PLATFORM_VERSION'))) {
    try {
      platformVersion = readPlatformVersionForKitRoot(process.cwd());
    } catch {
      /* fall through */
    }
  }
  platformVersion = platformVersion || '0.4.11';

  const tag = envRef?.startsWith('genetic-ai-starter-v')
    ? envRef
    : kitReleaseTag(platformVersion);
  return resolveRemoteTagToSha(tag, opts.url);
}

function main() {
  const opts = parseArgs(process.argv);
  const gitCheck = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: opts.target,
    encoding: 'utf8',
  });
  if (gitCheck.status !== 0) {
    console.error('Target is not a git repository — initialize git first.');
    process.exit(1);
  }

  const ref = resolveDefaultRef(opts);
  const sha = ensureSubmoduleAtRef(opts.target, {
    url: opts.url,
    path: opts.path,
    ref: ref || undefined,
    shallow: opts.shallow,
  });

  console.log(`submodule-add-kit OK path=${opts.path} ref=${sha || ref || 'HEAD'}`);
}

main();
