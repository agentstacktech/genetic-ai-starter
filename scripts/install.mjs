#!/usr/bin/env node
/**
 * Install Genetic AI Starter Kit into a target repository.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { copyPayloadFiles } from './lib/copy-payload.mjs';
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
  --profile minimal|standard|full|founder  (see meta/docs/PROFILE_COMPARISON.md)
  --project-name "Name"
  --domain app
  --with-agentstack  (auto for full|founder)
  --dry-run --strict
  --merge-philosophy --force-philosophy
  --skills global|project (default: project)
  --gitignore-kit full|none  (full: kit docs/rules not committed)
  --record-kit-source  (KIP v2 kitSource in lock)
  --kit-root <path>  (kit used for install; default: script cwd kit)`);
      process.exit(0);
    }
  }
  if (!opts.target) {
    console.error('Missing --target');
    process.exit(1);
  }
  return opts;
}

function applyExtension(targetRoot, extId, vars, { dryRun }) {
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
    paths: { docsAi: 'docs/ai', philosophy: 'philosophy' },
  };
  if (opts.recordKitSource && kitRootForRecord) {
    lock = applyKitSourceToLock(lock, targetRoot, kitRootForRecord, { preferSubmodule: true });
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
  return lock;
}

function main() {
  const opts = parseArgs(process.argv);
  const targetRoot = path.resolve(opts.target);
  const vars = {
    PROJECT_NAME: opts.projectName,
    DOMAIN: opts.domain,
    SUBSYSTEM: 'feature',
    DECISION_SLUG: 'decision',
    AGENTSTACK_VERSION: readPlatformVersion(),
  };

  const profile = loadProfile(opts.profile);
  let files = resolveProfileFiles(profile);
  if (opts.profile === 'minimal') {
    files = files.filter((f) => !f.startsWith('philosophy/'));
  }

  const philOpts = resolvePhilosophyInstallOpts(targetRoot, files, opts);
  if (philOpts.autoRepaired) {
    console.warn(
      'Note: philosophy/ existed but was incomplete — reinstalling starter genes (--force-philosophy).',
    );
  } else if (philOpts.skipPhilosophy) {
    console.warn(
      'Note: existing complete philosophy/ kept. Use --merge-philosophy or --force-philosophy to change.',
    );
  }

  const written = copyPayloadFiles({
    targetRoot,
    relativeFiles: files,
    vars,
    strict: opts.strict,
    dryRun: opts.dryRun,
    skipPhilosophy: philOpts.skipPhilosophy,
    forcePhilosophy: philOpts.forcePhilosophy,
    mergePhilosophy: philOpts.mergePhilosophy,
  });

  if (opts.profile === 'minimal' && !opts.dryRun) {
    const agentsMinimal = path.join(PAYLOAD_ROOT, 'AGENTS.minimal.md');
    const agentsDest = path.join(targetRoot, 'AGENTS.md');
    if (fs.existsSync(agentsMinimal)) {
      let agents = fs.readFileSync(agentsMinimal, 'utf8');
      agents = substitute(agents, vars, { strict: opts.strict });
      fs.writeFileSync(agentsDest, agents, 'utf8');
      if (!written.includes('AGENTS.md')) written.push('AGENTS.md');
    }
    const stubSrc = path.join(PAYLOAD_ROOT, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
    const mapDest = path.join(targetRoot, 'docs/ai/AI_NAVIGATION_MAP.md');
    if (fs.existsSync(stubSrc) && !fs.existsSync(mapDest)) {
      fs.mkdirSync(path.dirname(mapDest), { recursive: true });
      let stub = fs.readFileSync(stubSrc, 'utf8');
      stub = substitute(stub, vars, { strict: opts.strict });
      fs.writeFileSync(mapDest, stub, 'utf8');
      written.push('docs/ai/AI_NAVIGATION_MAP.md');
    }
  }

  const fragmentPath = path.join(PAYLOAD_ROOT, '.cursorrules.fragment.md');
  const wantsCursorrules =
    files.some((f) => f === '.cursorrules.fragment.md') ||
    profile.id === 'minimal' ||
    profile.id === 'standard' ||
    profile.id === 'full' ||
    profile.id === 'founder';

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
    applyExtension(targetRoot, 'agentstack', vars, { dryRun: opts.dryRun });
    extensions.push('agentstack');
  }

  const kitRootForRecord = opts.kitRoot ? path.resolve(opts.kitRoot) : KIT_ROOT;
  writeLock(targetRoot, opts, extensions, { dryRun: opts.dryRun, kitRootForRecord });

  if (opts.gitignoreKit === 'full') {
    applyGitignoreKit(targetRoot, opts.profile, extensions, { dryRun: opts.dryRun });
  }

  console.log(
    opts.dryRun ? '[dry-run] Would install' : 'Installed',
    `profile=${opts.profile}`,
    `files=${written.length}`,
    `skills=${opts.skillsMode}`,
    `gitignore=${opts.gitignoreKit}`,
    `→ ${targetRoot}`,
  );

  if (!opts.dryRun) {
    const validate = spawnSync(
      process.execPath,
      [
        path.join(__dirname, 'validate-installed.mjs'),
        '--target',
        targetRoot,
        '--kit-root',
        kitRootForRecord,
      ],
      { encoding: 'utf8' },
    );
    if (validate.status !== 0) {
      console.error(validate.stderr || validate.stdout);
      console.error(
        '\nFix: node <kit>/scripts/repair.mjs --target <project>  (or install.ps1 -ForcePhilosophy -Strict)',
      );
      process.exit(1);
    }
  }
}

main();
