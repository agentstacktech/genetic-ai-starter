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
import { shouldShowBeacon, printStarterBeacon } from './lib/starter-beacon.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  let target = '.';
  let beacon = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--beacon') beacon = true;
  }
  if (!beacon && shouldShowBeacon(argv)) beacon = true;
  return { target: path.resolve(target), beacon };
}

function main() {
  const { target, beacon } = parseArgs(process.argv);
  const issues = [];

  const lockPath = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lockPath)) {
    issues.push('Missing .genetic-ai/kit.lock.json — run install');
  } else {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    console.log(
      `Kit ${lock.kitId}@${lock.kitVersion} profile=${lock.profile} gitignore=${lock.gitignoreKit || 'none'}`,
    );
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
          'philosophy/ incomplete for installed profile — run: node <kit>/scripts/repair.mjs --target <project>',
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
    [path.join(KIT_ROOT, 'scripts/validate-installed.mjs'), '--target', target],
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
