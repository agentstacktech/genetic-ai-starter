#!/usr/bin/env node
/**
 * Quick health check for an installed kit (consumer repo).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadProfile, resolveProfileFiles } from './lib/profile-include.mjs';
import { isPhilosophyIncomplete } from './lib/philosophy-state.mjs';
import { GITIGNORE_BEGIN } from './lib/merge-gitignore.mjs';
import { shouldShowBeacon, printStarterBeacon, printKitResolveBeacon } from './lib/starter-beacon.mjs';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';
import {
  assertKitRepoUrlAllowed,
  detectSubmoduleDrift,
  submodulePathExists,
} from './lib/git-submodule.mjs';
import { verifyKitVersionPin } from './lib/verify-kit-version.mjs';
import { validateKitLockKipV2 } from './lib/validate-kit-lock-schema.mjs';
import { DEFAULT_KIT_SUBMODULE_PATH } from './lib/kit-integration-constants.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  let target = '.';
  let beacon = false;
  let docs = false;
  let kitRoot = null;
  let strictLock = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--beacon') beacon = true;
    else if (argv[i] === '--docs') docs = true;
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
    else if (argv[i] === '--strict-lock') strictLock = true;
  }
  if (!beacon && shouldShowBeacon(argv)) beacon = true;
  return { target: path.resolve(target), beacon, docs, kitRoot, strictLock };
}

function runKitDocChecks() {
  const scripts = [
    'check-docs-metrics.mjs',
    'check-platform-stats.mjs',
    'check-i18n-parity.mjs',
  ];
  for (const name of scripts) {
    const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'scripts', name)], {
      cwd: KIT_ROOT,
      encoding: 'utf8',
    });
    if (r.status !== 0) {
      console.error(r.stderr || r.stdout);
      process.exit(r.status ?? 1);
    }
  }
  console.log('doctor --docs OK (kit meta doc guards)');
}

function main() {
  const { target, beacon, docs, kitRoot: explicitKitRoot, strictLock } = parseArgs(process.argv);
  if (docs) {
    runKitDocChecks();
    return;
  }
  const issues = [];

  let kitRoot = KIT_ROOT;
  let kitSourceLabel = 'script.cwd';
  try {
    const resolved = resolveKitRoot({ target, explicitKitRoot: explicitKitRoot });
    kitRoot = resolved.root;
    kitSourceLabel = resolved.source;
    for (const w of resolved.warnings) issues.push(`resolver warning: ${w}`);
    if (beacon) printKitResolveBeacon(kitRoot, kitSourceLabel);
  } catch (e) {
    issues.push(`Kit root: ${e.message}`);
  }

  const lockPath = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lockPath)) {
    issues.push('Missing .genetic-ai/kit.lock.json — run install');
  } else {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    console.log(
      `Kit ${lock.kitId}@${lock.kitVersion} profile=${lock.profile} gitignore=${lock.gitignoreKit || 'none'}`,
    );
    console.log(`kitRoot=${kitRoot} (${kitSourceLabel})`);
    if (lock.kitSource?.url && !assertKitRepoUrlAllowed(lock.kitSource.url)) {
      console.warn(
        `WARN: kitSource.url not on allowlist (fork?): ${lock.kitSource.url} — prefer official mirror or GENETIC_AI_KIT_URL_ALLOWLIST_EXTRA`,
      );
    }
    if (lock.kitSource?.type === 'submodule') {
      const drift = detectSubmoduleDrift(target, lock.kitSource);
      if (drift.drift) {
        process.env.GENETIC_AI_KIT_DRIFT = '1';
        issues.push(
          `submodule drift: ${drift.reason} — run: node ${lock.kitSource.path}/scripts/upgrade.mjs --target . --sync-submodule`,
        );
      } else if (drift.head) {
        console.log(`submoduleRef=${drift.head} lockRef=${lock.kitSource.ref} OK`);
      }
      const subPath = lock.kitSource.path || DEFAULT_KIT_SUBMODULE_PATH;
      if (!submodulePathExists(target, subPath)) {
        issues.push(`submodule path empty or missing install.mjs: ${subPath} — git submodule update --init`);
      }
    }
    const ver = verifyKitVersionPin(lock, kitRoot);
    if (!ver.ok) issues.push(ver.message);
    if (strictLock) {
      for (const msg of validateKitLockKipV2(lock)) {
        issues.push(`strict-lock: ${msg}`);
      }
    }
    if (lock.gitignoreKit === 'full') {
      const gi = path.join(target, '.gitignore');
      if (!fs.existsSync(gi) || !fs.readFileSync(gi, 'utf8').includes(GITIGNORE_BEGIN)) {
        issues.push('gitignoreKit=full but .gitignore missing genetic-ai block — re-run install --gitignore-kit full');
      }
    }
    if ((lock.extensions || []).includes('agentstack')) {
      const ctx = path.join(target, 'docs/ai/CONTEXT_FOR_AI.md');
      if (!fs.existsSync(ctx)) issues.push('AgentStack extension enabled but CONTEXT_FOR_AI.md missing');
    }
  }

  if (fs.existsSync(path.join(target, '.cursorrules.fragment.md'))) {
    issues.push('Stale .cursorrules.fragment.md in target — safe to delete (content merged into .cursorrules)');
  }

  const stubLeak = path.join(target, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
  if (fs.existsSync(stubLeak)) {
    issues.push('Stale docs/ai/AI_NAVIGATION_MAP.minimal.stub.md — delete (use AI_NAVIGATION_MAP.md only)');
  }

  if (fs.existsSync(lockPath)) {
    try {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      const profile = loadProfile(lock.profile || 'standard');
      let files = resolveProfileFiles(profile);
      if (profile.id === 'minimal') files = files.filter((f) => !f.startsWith('philosophy/'));
      if (isPhilosophyIncomplete(target, files)) {
        issues.push(
          `philosophy/ incomplete — run: node ${path.relative(target, path.join(kitRoot, 'scripts/repair.mjs')).replace(/\\/g, '/') || 'tools/genetic-ai-starter/scripts/repair.mjs'} --target .`,
        );
      }
    } catch {
      /* profile resolution failed */
    }
  }

  const rulesPath = path.join(target, '.cursorrules');
  if (fs.existsSync(rulesPath)) {
    const n = (fs.readFileSync(rulesPath, 'utf8').match(/<!-- genetic-ai:begin -->/g) || []).length;
    if (n !== 1) issues.push(`.cursorrules has ${n} genetic-ai blocks (expected 1) — re-run upgrade`);
  }

  const validate = spawnSync(
    process.execPath,
    [
      path.join(kitRoot, 'scripts/validate-installed.mjs'),
      '--target',
      target,
      '--kit-root',
      kitRoot,
    ],
    { encoding: 'utf8' },
  );
  if (validate.status !== 0) {
    issues.push('validate-installed failed');
    console.error(validate.stderr || validate.stdout);
  }

  if (issues.length) {
    console.error('doctor found issues:\n' + issues.map((i) => `  - ${i}`).join('\n'));
    process.exit(1);
  }
  console.log('doctor OK');
  if (beacon) printStarterBeacon();
}

main();
