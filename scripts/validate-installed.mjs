#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { auditMarkdownTree } from './lib/audit-markdown-links.mjs';
import { listProjectMarkdownRoots } from './lib/list-markdown-rel.mjs';
import { GITIGNORE_BEGIN } from './lib/merge-gitignore.mjs';
import { resolveKitRoot } from './lib/resolve-kit-root.mjs';
import { loadNavigationContract } from './lib/tenant-protected-files.mjs';

function parseArgs(argv) {
  let target = '.';
  let kitRoot = null;
  let checkGeneLinks = true;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--kit-root') kitRoot = argv[++i];
    else if (argv[i] === '--no-check-gene-links') checkGeneLinks = false;
  }
  return { target: path.resolve(target), kitRoot, checkGeneLinks };
}

function classifyError(msg) {
  if (msg.startsWith('Broken link') || msg.startsWith('[LINK]')) return 'LINK';
  if (msg.includes('philosophy/') || msg.includes('Missing .cursor/rules')) return 'PHILOSOPHY';
  if (msg.includes('kit.lock') || msg.startsWith('[LOCK]')) return 'LOCK';
  if (msg.includes('stub') || msg.startsWith('[STUB]')) return 'STUB';
  return 'OTHER';
}

function printHints(errors, kitRootRel) {
  const codes = new Set(errors.map(classifyError));
  if (codes.has('PHILOSOPHY')) {
    console.error(
      '\n[PHILOSOPHY] Incomplete philosophy/ — run:\n' +
        `  node ${kitRootRel}/scripts/repair.mjs --target <this-project> --repair-philosophy\n`,
    );
  }
  if (codes.has('LINK') && !codes.has('PHILOSOPHY')) {
    console.error(
      '\n[LINK] Broken markdown links — if only .cursorrules.fragment.md aliases, upgrade kit 0.4.13+.\n' +
        '  Otherwise: node <kit>/scripts/repair.mjs --target <project> --validate-only\n',
    );
  }
  if (codes.has('LOCK')) {
    console.error('\n[LOCK] Run install.mjs or migrate-kit-lock.mjs\n');
  }
}

function checkGeneFileLinks(target, errors) {
  const mapPath = path.join(target, 'philosophy/genes/GENE_COMPRESSION_MAP.md');
  if (!fs.existsSync(mapPath)) return;
  const content = fs.readFileSync(mapPath, 'utf8');
  const re = /\]\(([^)]+\.gen1\.md)\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const href = m[1];
    if (href.startsWith('http')) continue;
    const resolved = path.normalize(path.join(path.dirname(mapPath), href));
    if (!fs.existsSync(resolved)) {
      errors.push(`[LINK] Broken gene link in GENE_COMPRESSION_MAP: ${href}`);
    }
  }
}

function main() {
  const { target, kitRoot: explicitKitRoot, checkGeneLinks } = parseArgs(process.argv);
  let kitRootRel = 'tools/genetic-ai-starter';
  let kitRootAbs = explicitKitRoot ? path.resolve(explicitKitRoot) : null;
  try {
    const resolved = resolveKitRoot({ target, explicitKitRoot: explicitKitRoot });
    kitRootRel = path.relative(target, resolved.root).replace(/\\/g, '/') || kitRootRel;
    kitRootAbs = resolved.root;
  } catch {
    /* consumer may validate without kit on path */
  }
  const errors = [];
  const required = [
    'AGENTS.md',
    'docs/ai/AI_NAVIGATION_MAP.md',
    '.cursor/rules/genetic-navigation.mdc',
  ];
  for (const r of required) {
    if (!fs.existsSync(path.join(target, r))) errors.push(`[OTHER] Missing: ${r}`);
  }

  const lock = path.join(target, '.genetic-ai/kit.lock.json');
  if (!fs.existsSync(lock)) errors.push('[LOCK] Missing .genetic-ai/kit.lock.json');

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
      errors.push('[OTHER] Missing genetic-ai-starter block in .gitignore (lock has gitignoreKit=full)');
    }
  }

  const stubLeak = path.join(target, 'docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
  if (fs.existsSync(stubLeak)) {
    errors.push('[STUB] Stale docs/ai/AI_NAVIGATION_MAP.minimal.stub.md');
  }
  if (profile === 'minimal' && !fs.existsSync(path.join(target, 'philosophy'))) {
    const minimalRules = path.join(target, '.cursor/rules/engineering-controlled-changes.mdc');
    if (!fs.existsSync(minimalRules)) {
      errors.push('[PHILOSOPHY] Missing .cursor/rules/engineering-controlled-changes.mdc (minimal profile)');
    }
  }

  if (profile !== 'minimal') {
    const contract = loadNavigationContract();
    for (const rel of contract.protectedFiles || []) {
      const fp = path.join(target, rel);
      if (!fs.existsSync(fp)) continue;
      if (fs.statSync(fp).isDirectory()) continue;
      const content = fs.readFileSync(fp, 'utf8');
      for (const region of contract.regions || []) {
        if (region.file !== rel || !region.endMarker) continue;
        if (!content.includes(region.beginMarker)) {
          errors.push(`[OTHER] Missing region marker ${region.beginMarker} in ${rel}`);
        }
      }
    }
  }

  const mdRoots = listProjectMarkdownRoots(target, ['docs/ai', 'philosophy'].filter((r) =>
    fs.existsSync(path.join(target, r)),
  ));

  const broken = auditMarkdownTree(target, mdRoots, { mode: 'consumer', kitRoot: kitRootAbs });
  for (const b of broken) errors.push(`[LINK] Broken link in ${b.file}: ${b.target}`);

  if (checkGeneLinks) checkGeneFileLinks(target, errors);

  if (errors.length) {
    console.error('validate-installed FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    printHints(errors, kitRootRel);
    process.exit(1);
  }
  console.log('validate-installed OK', target);
}

main();
