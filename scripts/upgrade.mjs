#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';
import { readKitLock, writeKitLock } from './lib/read-kit-lock.mjs';
import { applyKitSourceToLock } from './lib/record-kit-source.mjs';
import { checkoutKitRef } from './lib/git-submodule.mjs';
import { loadProfile, resolveProfileFiles } from './lib/profile-include.mjs';
import { substitute } from './lib/substitute-placeholders.mjs';
import { readPlatformVersionForKitRoot } from './lib/read-platform-version-for-kit.mjs';
import { DEFAULT_KIT_SUBMODULE_PATH, DEFAULT_KIT_REPO_URL } from './lib/kit-integration-constants.mjs';
import {
  applyUpgrade,
  finalizeUpgradeReport,
  runPostUpgradeValidate,
} from './lib/upgrade-engine.mjs';
import { printUpgradeReportHuman } from './lib/upgrade-report.mjs';
import { appendInsideCursorrulesBlock } from './lib/merge-cursorrules.mjs';
import { EXTENSIONS_DIR } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const opts = {
    target: null,
    syncSubmodule: false,
    kitRoot: null,
    dryRun: false,
    yes: false,
    preserveNavigation: true,
    forceNavigation: false,
    jsonReport: false,
    offerSubmodule: false,
    addSubmodule: false,
    noRecordKitSource: false,
    forcePhilosophy: true,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--sync-submodule') opts.syncSubmodule = true;
    else if (a === '--kit-root') opts.kitRoot = argv[++i];
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--yes') opts.yes = true;
    else if (a === '--preserve-navigation') opts.preserveNavigation = true;
    else if (a === '--no-preserve-navigation') opts.preserveNavigation = false;
    else if (a === '--force-navigation') opts.forceNavigation = true;
    else if (a === '--json-report') opts.jsonReport = true;
    else if (a === '--offer-submodule') opts.offerSubmodule = true;
    else if (a === '--add-submodule') opts.addSubmodule = true;
    else if (a === '--no-record-kit-source') opts.noRecordKitSource = true;
    else if (a === '--force-philosophy') opts.forcePhilosophy = true;
    else if (a === '--no-force-philosophy') opts.forcePhilosophy = false;
    else if (a === '--help') {
      console.log(`Usage: node upgrade.mjs --target <path> [options]
  --dry-run --yes --json-report
  --preserve-navigation (default) | --force-navigation
  --sync-submodule --kit-root <path>
  --offer-submodule | --add-submodule
  --no-record-kit-source`);
      process.exit(0);
    }
  }
  if (!opts.target) {
    console.error('Usage: node upgrade.mjs --target <path> [...]');
    process.exit(1);
  }
  return opts;
}

function printSubmoduleOffer(lock, kitRoot) {
  const tag = lock.kitSource?.refName || `genetic-ai-starter-v${lock.kitVersion}`;
  console.log(`
To pin kit reproducibly, add submodule:
  node ${path.relative(process.cwd(), path.join(kitRoot, 'scripts/submodule-add-kit.mjs')).replace(/\\/g, '/')} --target .
  git submodule update --init ${DEFAULT_KIT_SUBMODULE_PATH}
  node ${DEFAULT_KIT_SUBMODULE_PATH}/scripts/upgrade.mjs --target . --sync-submodule --yes

Tag: ${tag}
Repo: ${DEFAULT_KIT_REPO_URL}
`);
}

function main() {
  const opts = parseArgs(process.argv);
  const target = opts.target;

  if (opts.forceNavigation && !opts.yes && !opts.dryRun && process.stdin.isTTY) {
    console.error('Refusing --force-navigation without --yes (destructive to kit regions).');
    process.exit(3);
  }

  const { lock } = readKitLock(target);
  if (!lock) {
    console.error('No kit.lock.json — run install first');
    process.exit(1);
  }

  const { root: kitRoot } = resolveKitRoot({ target, explicitKitRoot: opts.kitRoot });

  if (opts.syncSubmodule && lock.kitSource?.type === 'submodule' && lock.kitSource.ref) {
    checkoutKitRef(target, lock.kitSource);
  }

  if (opts.addSubmodule) {
    const addScript = path.join(kitRoot, 'scripts/submodule-add-kit.mjs');
    const r = spawnSync(process.execPath, [addScript, '--target', target], { stdio: 'inherit' });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }

  const profile = loadProfile(lock.profile || 'standard');
  let files = resolveProfileFiles(profile);
  if (profile.id === 'minimal') files = files.filter((f) => !f.startsWith('philosophy/'));

  const vars = {
    PROJECT_NAME: lock.projectName || 'My Project',
    DOMAIN: lock.domain || 'app',
    SUBSYSTEM: 'feature',
    DECISION_SLUG: 'decision',
    AGENTSTACK_VERSION: readPlatformVersionForKitRoot(kitRoot),
  };

  const kitSourceType = lock.kitSource?.type || 'path';
  const partial = applyUpgrade({
    targetRoot: target,
    relativeFiles: files,
    vars,
    options: {
      dryRun: opts.dryRun,
      preserveNavigation: opts.preserveNavigation,
      forceNavigation: opts.forceNavigation,
      strict: false,
      kitSourceType,
      skipPhilosophy: false,
      forcePhilosophy: opts.forcePhilosophy,
      mergePhilosophy: !opts.forcePhilosophy,
    },
  });

  if ((lock.extensions || []).includes('agentstack') && !opts.dryRun) {
    const extRoot = path.join(EXTENSIONS_DIR, 'agentstack');
    const navAppend = path.join(extRoot, 'merge/navigation-map.append.md');
    if (fs.existsSync(navAppend)) {
      const dest = path.join(target, 'docs/ai/AI_NAVIGATION_MAP.md');
      if (fs.existsSync(dest)) {
        const chunk = substitute(fs.readFileSync(navAppend, 'utf8'), vars, {});
        const current = fs.readFileSync(dest, 'utf8');
        if (!current.includes('genetic-ai-extension:agentstack-nav')) {
          fs.appendFileSync(dest, '\n' + chunk, 'utf8');
        }
      }
    }
    const rulesAppend = path.join(extRoot, 'merge/cursorrules.append.md');
    if (fs.existsSync(rulesAppend)) {
      appendInsideCursorrulesBlock(
        path.join(target, '.cursorrules'),
        substitute(fs.readFileSync(rulesAppend, 'utf8'), vars, {}),
      );
    }
  }

  const warnings = [];
  if (!opts.dryRun) {
    let nextLock = {
      ...lock,
      kitVersion: readPlatformVersionForKitRoot(kitRoot),
      lastUpgradeAt: new Date().toISOString(),
      lastUpgradeReport: '.genetic-ai/last-upgrade-report.json',
    };
    if (!opts.noRecordKitSource) {
      const applied = applyKitSourceToLock(nextLock, target, kitRoot, { preferSubmodule: true });
      nextLock = applied.lock;
      warnings.push(...(applied.warnings || []));
      if (nextLock.kitSource?.type === 'ephemeral') {
        warnings.push('EPHEMERAL_KIT_ROOT — use --offer-submodule for pin instructions');
        if (opts.offerSubmodule) printSubmoduleOffer(nextLock, kitRoot);
      }
    }
    writeKitLock(target, nextLock);
  }

  let validation = { status: 'skipped' };
  let exitCode = 0;
  if (!opts.dryRun) {
    validation = runPostUpgradeValidate(target, kitRoot, __dirname);
    if (validation.status !== 'ok') exitCode = 1;
  }
  if (partial.conflicts?.length) exitCode = exitCode || 2;

  const report = finalizeUpgradeReport(
    target,
    { ...partial, warnings: [...(partial.warnings || []), ...warnings] },
    validation,
    {
      dryRun: opts.dryRun,
      preserveNavigation: opts.preserveNavigation,
      forceNavigation: opts.forceNavigation,
      kitVersion: readPlatformVersionForKitRoot(kitRoot),
    },
  );

  if (opts.jsonReport) console.log(JSON.stringify(report, null, 2));
  else printUpgradeReportHuman(report);

  if (opts.dryRun) {
    console.log('[dry-run] upgrade plan complete');
    process.exit(0);
  }

  if (exitCode !== 0) {
    console.error('Upgrade finished with issues — see report.');
    process.exit(exitCode);
  }
  console.log('Upgrade OK', target);
}

main();
