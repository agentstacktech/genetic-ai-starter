#!/usr/bin/env node
/**
 * Maintainer sync: copy selected canonical files from AgentStack monorepo into kit payload.
 * Run from repo root: node genetic-ai-starter/scripts/sync-from-canonical.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { KIT_SYNC_MAP } from './lib/kit-sync-map.mjs';

const REPO_ROOT = path.resolve(KIT_ROOT, '..');

function main() {
  let n = 0;
  for (const { from, to, transform } of KIT_SYNC_MAP) {
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
