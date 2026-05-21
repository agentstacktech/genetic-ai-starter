/**
 * Patterns and block content for --gitignore-kit full (kit files stay local, not in git).
 */
import fs from 'node:fs';
import path from 'node:path';
import { GITIGNORE_BEGIN, GITIGNORE_END, mergeGitignoreBlock } from './merge-gitignore.mjs';
import { PAYLOAD_ROOT } from './paths.mjs';

const CURSOR_RULES = [
  '.cursor/rules/genetic-navigation.mdc',
  '.cursor/rules/genetic-index-authoring.mdc',
  '.cursor/rules/engineering-controlled-changes.mdc',
  '.cursor/rules/engineering-tool-discipline.mdc',
  '.cursor/rules/engineering-planning-todos.mdc',
  '.cursor/rules/platform-vs-tenant-canary.mdc',
];

const CURSOR_SKILLS = [
  '.cursor/skills/genetic-navigation/',
  '.cursor/skills/index-authoring/',
  '.cursor/skills/bootstrap-subsystem/',
  '.cursor/skills/gene-authoring/',
];

/**
 * @param {string} profileId
 * @param {string[]} extensions
 * @returns {string[]}
 */
export function patternsForGitignoreKit(profileId, extensions = []) {
  const patterns = new Set([
    'AGENTS.md',
    '.genetic-ai/',
    'docs/ai/',
    'docs/ai/**/*.local.md',
    'docs/ai/**/*.draft.md',
  ]);

  if (profileId !== 'minimal') {
    patterns.add('philosophy/');
    for (const r of CURSOR_RULES) patterns.add(r);
    for (const s of CURSOR_SKILLS) patterns.add(s);
  } else {
    patterns.add('.cursor/rules/genetic-navigation.mdc');
    patterns.add('.cursor/rules/engineering-controlled-changes.mdc');
  }

  if (profileId === 'full' || profileId === 'founder') {
    patterns.add('.github/workflows/genetic-ai-validate.yml.sample');
  }

  if (extensions.includes('agentstack')) {
    patterns.add('.cursor/rules/platform-vs-tenant-canary.mdc');
  }

  return [...patterns].sort();
}

/**
 * @param {string} profileId
 * @param {string[]} extensions
 */
export function buildGitignoreBlock(profileId, extensions = []) {
  const templatePath = path.join(PAYLOAD_ROOT, 'templates/gitignore.genetic-ai.header.txt');
  let header =
    '# AI kit — local only (genetic-ai-starter). Do not commit; reinstall from kit if needed.';
  if (fs.existsSync(templatePath)) {
    header = fs.readFileSync(templatePath, 'utf8').trim();
  }

  const body = patternsForGitignoreKit(profileId, extensions).join('\n');
  return `${GITIGNORE_BEGIN}\n${header}\n\n${body}\n${GITIGNORE_END}\n`;
}

/** @param {string} targetRoot */
export function applyGitignoreKit(targetRoot, profileId, extensions, { dryRun = false } = {}) {
  mergeGitignoreBlock(targetRoot, buildGitignoreBlock(profileId, extensions), { dryRun });
}
