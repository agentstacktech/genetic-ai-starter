#!/usr/bin/env node
/**
 * Install Genetic AI Starter Kit into a target repository.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { mergeCursorrules, appendInsideCursorrulesBlock } from './lib/merge-cursorrules.mjs';
import { loadProfile, resolveProfileFiles } from './lib/profile-include.mjs';
import { installSkills } from './lib/install-skills.mjs';
import { KIT_ROOT, EXTENSIONS_DIR, PAYLOAD_ROOT } from './lib/paths.mjs';
import { substitute } from './lib/substitute-placeholders.mjs';
import { readPlatformVersion, describePlatformVersionSource } from './lib/platform-version.mjs';
import { readPlatformVersionForKitRoot } from './lib/read-platform-version-for-kit.mjs';
import { resolvePhilosophyInstallOpts } from './lib/philosophy-state.mjs';
import { applyGitignoreKit } from './lib/gitignore-kit.mjs';
import { applyKitSourceToLock } from './lib/record-kit-source.mjs';
import { LOCK_SCHEMA_VERSION } from './lib/kit-integration-constants.mjs';
import { applyUpgrade, finalizeUpgradeReport, runPostUpgradeValidate } from './lib/upgrade-engine.mjs';
import { printUpgradeReportHuman } from './lib/upgrade-report.mjs';
import { mergeExtensionOverlayMissingSections } from './lib/tenant-protected-files.mjs';

const NAV_EXTENSION_MARKER = '<!-- genetic-ai-extension:agentstack-nav -->';

function parseArgs(argv) {
  const opts = {
    target: null,
    profile: 'standard',
    projectName: 'My Project',
    domain: 'app',
    withAgentstack: false,
    dryRun: false,
    strict: false,
    mergePhilosophy: false,
    forcePhilosophy: false,
    skillsMode: 'project',
    gitignoreKit: 'none',
    recordKitSource: false,
    kitRoot: null,
    preserveNavigation: true,
    forceNavigation: false,
    yes: false,
    jsonReport: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') opts.target = argv[++i];
    else if (a === '--profile') opts.profile = argv[++i];
    else if (a === '--project-name') opts.projectName = argv[++i];
    else if (a === '--domain') opts.domain = argv[++i];
    else if (a === '--with-agentstack') opts.withAgentstack = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--strict') opts.strict = true;
    else if (a === '--merge-philosophy') opts.mergePhilosophy = true;
    else if (a === '--force-philosophy') opts.forcePhilosophy = true;
    else if (a === '--preserve-navigation') opts.preserveNavigation = true;
    else if (a === '--no-preserve-navigation') opts.preserveNavigation = false;
    else if (a === '--force-navigation') opts.forceNavigation = true;
    else if (a === '--yes') opts.yes = true;
    else if (a === '--json-report') opts.jsonReport = true;
    else if (a === '--skills' && argv[i + 1] === 'global') {
      opts.skillsMode = 'global';
      i++;
    } else if (a === '--gitignore-kit') {
      const mode = argv[++i];
      if (mode !== 'full' && mode !== 'none') {
        console.error('--gitignore-kit must be full or none');
        process.exit(1);
      }
      opts.gitignoreKit = mode;
    } else if (a === '--record-kit-source') opts.recordKitSource = true;
    else if (a === '--kit-root') opts.kitRoot = argv[++i];
    else if (a === '--help') {
      console.log(`Usage: node install.mjs --target <path> [options]
  --profile minimal|standard|full|founder
  --preserve-navigation (default) | --no-preserve-navigation | --force-navigation
  --dry-run --yes --json-report
  --merge-philosophy --force-philosophy
  --record-kit-source --kit-root <path>`);
      process.exit(0);
    }
  }
  if (!opts.target) {
    console.error('Missing --target');
    process.exit(1);
  }
  return opts;
}

function applyExtension(targetRoot, extId, vars, { dryRun, preserveOverlays }) {
  const extRoot = path.join(EXTENSIONS_DIR, extId);
  const manifestPath = path.join(extRoot, 'extension.manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error(`Extension not found: ${extId}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const ov of manifest.overlays || []) {
    const src = path.join(extRoot, ov.from);
    const dest = path.join(targetRoot, ov.to);
    if (!fs.existsSync(src)) continue;
    if (!dryRun) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      let c = fs.readFileSync(src, 'utf8');
      c = substitute(c, vars, {});
      if (preserveOverlays && fs.existsSync(dest) && ov.to.endsWith('CONTEXT_FOR_AI.md')) {
        c = mergeExtensionOverlayMissingSections(fs.readFileSync(dest, 'utf8'), c);
      }
      fs.writeFileSync(dest, c, 'utf8');
    }
  }

  const navAppend = path.join(extRoot, 'merge/navigation-map.append.md');
  if (fs.existsSync(navAppend)) {
    const dest = path.join(targetRoot, 'docs/ai/AI_NAVIGATION_MAP.md');
    let chunk = fs.readFileSync(navAppend, 'utf8');
    chunk = substitute(chunk, vars, {});
    if (!dryRun && fs.existsSync(dest)) {
      const current = fs.readFileSync(dest, 'utf8');
      if (!current.includes(NAV_EXTENSION_MARKER)) {
        fs.appendFileSync(dest, '\n' + chunk, 'utf8');
      }
    }
  }

  const rulesAppend = path.join(extRoot, 'merge/cursorrules.append.md');
  if (fs.existsSync(rulesAppend)) {
    const append = substitute(fs.readFileSync(rulesAppend, 'utf8'), vars, {});
    if (!dryRun) {
      appendInsideCursorrulesBlock(path.join(targetRoot, '.cursorrules'), append);
    }
  }

  return manifest;
}

function writeLock(targetRoot, opts, extensions, { dryRun, kitRootForRecord }) {
  const platformVersion =
    kitRootForRecord && opts.kitRoot
      ? readPlatformVersionForKitRoot(kitRootForRecord)
      : readPlatformVersion();
  let lock = {
    lockSchemaVersion: LOCK_SCHEMA_VERSION,
    kitId: 'genetic-ai-starter',
    kitVersion: platformVersion,
    platformVersionSource: describePlatformVersionSource(),
    profile: opts.profile,
    extensions,
    skillsMode: opts.skillsMode,
    projectName: opts.projectName,
    domain: opts.domain,
    gitignoreKit: opts.gitignoreKit,
    installedAt: new Date().toISOString(),
    navigationContractVersion: 1,
    navigationPreserveDefault: opts.preserveNavigation,
    paths: { docsAi: 'docs/ai', philosophy: 'philosophy' },
  };
  const warnings = [];
  if (opts.recordKitSource && kitRootForRecord) {
    const applied = applyKitSourceToLock(lock, targetRoot, kitRootForRecord, { preferSubmodule: true });
    lock = applied.lock;
    warnings.push(...(applied.warnings || []));
    const src = { ...lock.kitSource };
    if (!src.url) delete src.url;
    lock.kitSource = src;
  }
  const lockDir = path.join(targetRoot, '.genetic-ai');
  if (!dryRun) {
    fs.mkdirSync(lockDir, { recursive: true });
    fs.writeFileSync(path.join(lockDir, 'kit.lock.json'), JSON.stringify(lock, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(lockDir, 'paths.json'), JSON.stringify(lock.paths, null, 2) + '\n', 'utf8');
  }
  return { lock, warnings };
}

function main() {
  const opts = parseArgs(process.argv);
  const targetRoot = path.resolve(opts.target);
  const kitRootForRecord = opts.kitRoot ? path.resolve(opts.kitRoot) : KIT_ROOT;
  const vars = {
    PROJECT_NAME: opts.projectName,
    DOMAIN: opts.domain,
    SUBSYSTEM: 'feature',
    DECISION_SLUG: 'decision',
    AGENTSTACK_VERSION: readPlatformVersionForKitRoot(kitRootForRecord),
  };

  const profile = loadProfile(opts.profile);
  let files = resolveProfileFiles(profile);
  if (opts.profile === 'minimal') {
    files = files.filter((f) => !f.startsWith('philosophy/'));
  }

  const philOpts = resolvePhilosophyInstallOpts(targetRoot, files, opts);
  if (philOpts.autoRepaired) {
    console.warn('Note: philosophy/ incomplete — reinstalling starter genes.');
  }

  const kitSourceType = 'path';
  const partial = applyUpgrade({
    targetRoot,
    relativeFiles: files,
    vars,
    options: {
      dryRun: opts.dryRun,
      preserveNavigation: opts.preserveNavigation,
      forceNavigation: opts.forceNavigation,
      strict: opts.strict,
      kitSourceType,
      skipPhilosophy: philOpts.skipPhilosophy,
      forcePhilosophy: philOpts.forcePhilosophy,
      mergePhilosophy: philOpts.mergePhilosophy,
    },
  });

  if (opts.profile === 'minimal' && !opts.dryRun) {
    const agentsMinimal = path.join(PAYLOAD_ROOT, 'AGENTS.minimal.md');
    const agentsDest = path.join(targetRoot, 'AGENTS.md');
    if (fs.existsSync(agentsMinimal) && !fs.existsSync(agentsDest)) {
      let agents = fs.readFileSync(agentsMinimal, 'utf8');
      agents = substitute(agents, vars, { strict: opts.strict });
      fs.writeFileSync(agentsDest, agents, 'utf8');
    }
    const stubSrc = path.join(PAYLOAD_ROOT, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
    const mapDest = path.join(targetRoot, 'docs/ai/AI_NAVIGATION_MAP.md');
    if (fs.existsSync(stubSrc) && !fs.existsSync(mapDest)) {
      fs.mkdirSync(path.dirname(mapDest), { recursive: true });
      let stub = fs.readFileSync(stubSrc, 'utf8');
      stub = substitute(stub, vars, { strict: opts.strict });
      fs.writeFileSync(mapDest, stub, 'utf8');
    }
  }

  const fragmentPath = path.join(PAYLOAD_ROOT, '.cursorrules.fragment.md');
  const wantsCursorrules =
    files.some((f) => f === '.cursorrules.fragment.md') ||
    ['minimal', 'standard', 'full', 'founder'].includes(profile.id);

  if (wantsCursorrules && fs.existsSync(fragmentPath)) {
    const frag = substitute(fs.readFileSync(fragmentPath, 'utf8'), vars, { strict: opts.strict });
    const block = frag.includes('genetic-ai:begin') ? frag : `<!-- genetic-ai:begin -->\n${frag}\n<!-- genetic-ai:end -->`;
    if (!opts.dryRun) mergeCursorrules(path.join(targetRoot, '.cursorrules'), block);
  }

  const skillFiles = files.filter((f) => f.startsWith('.cursor/skills/'));
  if (skillFiles.length && opts.skillsMode === 'global') {
    installSkills(targetRoot, skillFiles, { mode: 'global', dryRun: opts.dryRun });
  }

  const extensions = [];
  if (opts.withAgentstack || (profile.extensions || []).includes('agentstack')) {
    applyExtension(targetRoot, 'agentstack', vars, {
      dryRun: opts.dryRun,
      preserveOverlays: opts.preserveNavigation,
    });
    extensions.push('agentstack');
  }

  const { lock, warnings } = writeLock(targetRoot, opts, extensions, { dryRun: opts.dryRun, kitRootForRecord });
  for (const w of warnings) console.warn(`WARN: ${w}`);

  if (opts.gitignoreKit === 'full') {
    applyGitignoreKit(targetRoot, opts.profile, extensions, { dryRun: opts.dryRun });
  }

  let validation = { status: 'skipped' };
  let exitCode = 0;
  if (!opts.dryRun) {
    validation = runPostUpgradeValidate(targetRoot, kitRootForRecord, __dirname);
    if (validation.status !== 'ok') exitCode = 1;
  }

  const report = finalizeUpgradeReport(
    targetRoot,
    { ...partial, warnings: [...(partial.warnings || []), ...warnings] },
    validation,
    {
      dryRun: opts.dryRun,
      preserveNavigation: opts.preserveNavigation,
      forceNavigation: opts.forceNavigation,
      kitVersion: lock.kitVersion,
    },
  );

  if (opts.jsonReport) console.log(JSON.stringify(report, null, 2));
  else printUpgradeReportHuman(report);

  if (opts.dryRun) {
    console.log('[dry-run] Would install', `profile=${opts.profile}`, `→ ${targetRoot}`);
    process.exit(0);
  }

  if (exitCode !== 0) {
    console.error('Applied with validation errors — see report above.');
    process.exit(exitCode);
  }

  console.log(
    'Installed',
    `profile=${opts.profile}`,
    `files=${(partial.written || []).length}`,
    `→ ${targetRoot}`,
  );
}

main();
