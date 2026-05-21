#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { removeCursorrulesBlock } from './lib/merge-cursorrules.mjs';
import { removeGitignoreBlock } from './lib/merge-gitignore.mjs';

function parseArgs(argv) {
  let target = null;
  let dryRun = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--dry-run') dryRun = true;
  }
  if (!target) {
    console.error('Usage: node uninstall.mjs --target <path> [--dry-run]');
    process.exit(1);
  }
  return { target: path.resolve(target), dryRun };
}

function rm(p, dryRun) {
  if (!fs.existsSync(p)) return;
  if (dryRun) {
    console.log('[dry-run] remove', p);
    return;
  }
  fs.rmSync(p, { recursive: true, force: true });
}

function main() {
  const { target, dryRun } = parseArgs(process.argv);
  const lockPath = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lockPath)) {
    console.warn('No lock file — removing known kit paths only');
  }

  const paths = [
    'AGENTS.md',
    'philosophy',
    'docs/ai',
    '.cursor/rules/genetic-navigation.mdc',
    '.cursor/rules/genetic-index-authoring.mdc',
    '.cursor/rules/engineering-controlled-changes.mdc',
    '.cursor/rules/engineering-tool-discipline.mdc',
    '.cursor/rules/engineering-planning-todos.mdc',
    '.cursor/rules/platform-vs-tenant-canary.mdc',
    'docs/ai/CONTEXT_FOR_AI.md',
    '.genetic-ai',
  ];

  for (const rel of paths) rm(path.join(target, rel), dryRun);

  const skills = [
    '.cursor/skills/genetic-navigation',
    '.cursor/skills/index-authoring',
    '.cursor/skills/bootstrap-subsystem',
    '.cursor/skills/gene-authoring',
  ];
  for (const rel of skills) rm(path.join(target, rel), dryRun);

  if (!dryRun) removeCursorrulesBlock(path.join(target, '.cursorrules'));
  else console.log('[dry-run] strip .cursorrules genetic-ai block');

  if (!dryRun) removeGitignoreBlock(target);
  else console.log('[dry-run] strip .gitignore genetic-ai block');

  console.log(dryRun ? '[dry-run] Uninstall complete' : 'Uninstall complete', target);
}

main();
