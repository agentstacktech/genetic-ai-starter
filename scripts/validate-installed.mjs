#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { findBrokenMarkdownLinks } from './lib/resolve-markdown-links.mjs';
import { GITIGNORE_BEGIN } from './lib/merge-gitignore.mjs';

function parseArgs(argv) {
  let target = '.';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
  }
  return path.resolve(target);
}

function collectMarkdown(root, acc = [], prefix = '') {
  if (!fs.existsSync(root)) return acc;
  for (const name of fs.readdirSync(root)) {
    const rel = prefix ? `${prefix}/${name}` : name;
    const full = path.join(root, name);
    if (name === 'node_modules' || name === '.git') continue;
    if (fs.statSync(full).isDirectory()) collectMarkdown(full, acc, rel);
    else if (name.endsWith('.md') || name.endsWith('.mdc')) acc.push(rel);
  }
  return acc;
}

function main() {
  const target = parseArgs(process.argv);
  const errors = [];
  const required = [
    'AGENTS.md',
    'docs/ai/AI_NAVIGATION_MAP.md',
    '.cursor/rules/genetic-navigation.mdc',
  ];
  for (const r of required) {
    if (!fs.existsSync(path.join(target, r))) errors.push(`Missing: ${r}`);
  }

  const lock = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lock)) errors.push('Missing .genetic-ai/kit.lock.json');

  let profile = 'standard';
  let gitignoreKit = 'none';
  try {
    const lockData = JSON.parse(fs.readFileSync(lock, 'utf8'));
    profile = lockData.profile || profile;
    gitignoreKit = lockData.gitignoreKit || gitignoreKit;
  } catch {
    /* ignore */
  }

  if (gitignoreKit === 'full') {
    const gi = path.join(target, '.gitignore');
    if (!fs.existsSync(gi) || !fs.readFileSync(gi, 'utf8').includes(GITIGNORE_BEGIN)) {
      errors.push('Missing genetic-ai-starter block in .gitignore (lock has gitignoreKit=full)');
    }
  }

  const stubLeak = path.join(target, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
  if (fs.existsSync(stubLeak)) {
    errors.push('Stale docs/ai/AI_NAVIGATION_MAP.minimal.stub.md (should not be copied to target)');
  }
  if (profile === 'minimal' && !fs.existsSync(path.join(target, 'philosophy'))) {
    const minimalRules = path.join(target, '.cursor/rules/engineering-controlled-changes.mdc');
    if (!fs.existsSync(minimalRules)) {
      errors.push('Missing .cursor/rules/engineering-controlled-changes.mdc (minimal profile)');
    }
  }

  const mdRoots = [];
  if (fs.existsSync(path.join(target, 'docs/ai'))) {
    mdRoots.push(...collectMarkdown(path.join(target, 'docs/ai'), [], 'docs/ai'));
  }
  if (fs.existsSync(path.join(target, 'philosophy'))) {
    mdRoots.push(...collectMarkdown(path.join(target, 'philosophy'), [], 'philosophy'));
  }
  if (fs.existsSync(path.join(target, 'AGENTS.md'))) mdRoots.push('AGENTS.md');

  const broken = findBrokenMarkdownLinks(target, mdRoots);
  for (const b of broken) errors.push(`Broken link in ${b.file}: ${b.target}`);

  if (errors.length) {
    console.error('validate-installed FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    const philBroken = errors.some((e) => e.includes('philosophy/'));
    if (philBroken) {
      console.error(
        '\nLikely fix: incomplete philosophy/ — run:\n' +
          '  node <path-to-kit>/scripts/repair.mjs --target <this-project>\n' +
          '  (or install.ps1 -ForcePhilosophy -Strict on Windows)',
      );
    }
    process.exit(1);
  }
  console.log('validate-installed OK', target);
}

main();
