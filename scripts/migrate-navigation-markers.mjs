#!/usr/bin/env node
/**
 * One-shot: wrap legacy consumer navigation files with tenant/kit region markers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadNavigationContract } from './lib/tenant-protected-files.mjs';
import { insertRegionAtEnd } from './lib/merge-markdown-regions.mjs';

function parseArgs(argv) {
  let target = '.';
  let write = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target') target = argv[++i];
    else if (argv[i] === '--write') write = true;
    else if (argv[i] === '--dry-run') write = false;
  }
  return { target: path.resolve(target), write };
}

function wrapMapTier1(content) {
  if (content.includes('tenant-map:tier1:begin')) return { content, changed: false };
  const tier1Match = content.match(/^## Tier 1[\s\S]*?(?=^## |\Z)/m);
  if (!tier1Match) {
    const block = `
<!-- tenant-map:tier1:begin -->
## Tier 1 — project

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| | | |
<!-- tenant-map:tier1:end -->

<!-- genetic-ai-map:tier1-seed:begin -->
<!-- genetic-ai-map:tier1-seed:end -->
`;
    return { content: content.trimEnd() + block, changed: true };
  }
  const section = tier1Match[0];
  const rest = content.replace(section, '').trimEnd();
  const inner = section.replace(/^## Tier 1[^\n]*\n/, '').trim();
  const wrapped = `<!-- tenant-map:tier1:begin -->
## Tier 1 — project

${inner}
<!-- tenant-map:tier1:end -->

<!-- genetic-ai-map:tier1-seed:begin -->
<!-- genetic-ai-map:tier1-seed:end -->
`;
  return { content: rest + '\n\n' + wrapped, changed: true };
}

function wrapAgents(content) {
  if (content.includes('tenant-agents:begin')) return { content, changed: false };
  const insert = `
<!-- tenant-agents:begin -->
<!-- Project-specific agent steps (e.g. debug-first rules) -->
<!-- tenant-agents:end -->
`;
  if (content.includes('genetic-ai-agents:read-order:begin')) {
    return {
      content: content.replace(
        '<!-- genetic-ai-agents:read-order:end -->',
        `<!-- genetic-ai-agents:read-order:end -->${insert}`,
      ),
      changed: true,
    };
  }
  return { content: insertRegionAtEnd(content, '<!-- tenant-agents:begin -->', '<!-- tenant-agents:end -->', ''), changed: true };
}

function main() {
  const { target, write } = parseArgs(process.argv);
  const contract = loadNavigationContract();
  const changes = [];

  const mapPath = path.join(target, 'docs/ai/AI_NAVIGATION_MAP.md');
  if (fs.existsSync(mapPath)) {
    const raw = fs.readFileSync(mapPath, 'utf8');
    const { content, changed } = wrapMapTier1(raw);
    if (changed) {
      changes.push('AI_NAVIGATION_MAP.md');
      if (write) fs.writeFileSync(mapPath, content, 'utf8');
      else console.log('[dry-run] would update', mapPath);
    }
  }

  const agentsPath = path.join(target, 'AGENTS.md');
  if (fs.existsSync(agentsPath)) {
    const raw = fs.readFileSync(agentsPath, 'utf8');
    const { content, changed } = wrapAgents(raw);
    if (changed) {
      changes.push('AGENTS.md');
      if (write) fs.writeFileSync(agentsPath, content, 'utf8');
      else console.log('[dry-run] would update', agentsPath);
    }
  }

  if (!changes.length) {
    console.log('migrate-navigation-markers: nothing to do');
    process.exit(0);
  }
  console.log(write ? 'Updated:' : 'Would update:', changes.join(', '));
  if (!write) console.log('Re-run with --write to apply');
}

main();
