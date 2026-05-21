#!/usr/bin/env node
/**
 * Maintainer sync: copy selected canonical files from AgentStack monorepo into kit payload.
 * Run from repo root: node genetic-ai-starter/scripts/sync-from-canonical.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';

const REPO_ROOT = path.resolve(KIT_ROOT, '..');

const SYNC_MAP = [
  {
    from: 'docs/AI_INDEXING_SYSTEM.md',
    to: 'payload/docs/ai/AI_INDEXING_SYSTEM.md',
    transform: (c) =>
      c
        .replace(/AgentStack monorepo/g, '{{PROJECT_NAME}}')
        .replace(/`docs\/AI_NAVIGATION_MAP\.md`/g, '`docs/ai/AI_NAVIGATION_MAP.md`')
        .replace(/\.\.\/philosophy\//g, '../../philosophy/')
        .replace(/agentstack-core\/|agentstack-frontend\//g, '')
        .replace(/\.cursor\/rules\/ai-navigation-indexes\.mdc/g, '.cursor/rules/genetic-navigation.mdc')
        .replace(/\.cursor\/rules\/ai-index-authoring\.mdc/g, '.cursor/rules/genetic-index-authoring.mdc')
        .replace(/\[CACHE_INVALIDATION_CONVENTION\.md\][^\n]*/g, '')
        .replace(/\[ECOSYSTEM_INTERACTION[^\n]*/g, ''),
  },
  {
    from: 'philosophy/genes/repo.engineering.controlled_code_changes.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.controlled_changes.gen1.md',
    transform: (c) =>
      c.replace(/\.\.\/\.\.\/docs\/AI_NAVIGATION_MAP\.md/g, '../../docs/ai/AI_NAVIGATION_MAP.md'),
  },
  {
    from: 'philosophy/genes/repo.engineering.founder_direct_ship.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.founder_direct_ship.gen1.md',
    transform: (c) => c,
  },
];

function main() {
  let n = 0;
  for (const { from, to, transform } of SYNC_MAP) {
    const src = path.join(REPO_ROOT, from);
    const dest = path.join(KIT_ROOT, to);
    if (!fs.existsSync(src)) {
      console.warn('Skip (missing):', from);
      continue;
    }
    let content = fs.readFileSync(src, 'utf8');
    content = transform(content);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content, 'utf8');
    console.log('Synced', to);
    n++;
  }
  console.log(`sync-from-canonical: ${n} file(s)`);
}

main();
