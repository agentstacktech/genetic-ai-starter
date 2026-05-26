#!/usr/bin/env node
/**
 * Maintainer sync: copy selected canonical files from AgentStack monorepo into kit payload.
 * Run from repo root: node genetic-ai-starter/scripts/sync-from-canonical.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import {
  kitDocsTransform,
  kitFoundationGeneTransform,
  kitHeritageTransform,
  kitPrinciplesLongformTransform,
  kitAiGeneInstructionsTransform,
} from './lib/kit-sync-transforms.mjs';

const REPO_ROOT = path.resolve(KIT_ROOT, '..');

const FOUNDATION_GENES = [
  'foundation.core_pillars.gen1.md',
  'foundation.creation_over_conflict.gen1.md',
  'foundation.elegant_minimalism.gen1.md',
  'foundation.decomposition_reassembly.gen1.md',
  'foundation.absolute_optimization.gen1.md',
  'foundation.genetic_coding.gen1.md',
  'foundation.time_decomposition.gen1.md',
  'foundation.ai_gene_interface.gen1.md',
];

/** @type {{ from: string, to: string, transform: (c: string) => string }[]} */
const SYNC_MAP = [
  {
    from: 'docs/AI_INDEXING_SYSTEM.md',
    to: 'payload/docs/ai/AI_INDEXING_SYSTEM.md',
    transform: kitDocsTransform,
  },
  {
    from: 'philosophy/genes/repo.engineering.controlled_code_changes.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.controlled_changes.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.engineering.founder_direct_ship.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.founder_direct_ship.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/AI_GENE_INSTRUCTIONS.md',
    to: 'payload/philosophy/AI_GENE_INSTRUCTIONS.md',
    transform: kitAiGeneInstructionsTransform,
  },
  {
    from: 'philosophy/archive/FOUNDATION_HERITAGE_READING.md',
    to: 'payload/philosophy/archive/FOUNDATION_HERITAGE_READING.md',
    transform: kitHeritageTransform,
  },
  {
    from: 'philosophy/LANCE_PRINCIPLE_CREATION_OVER_CONFLICT.md',
    to: 'payload/philosophy/principles/LANCE_CREATION_OVER_CONFLICT.md',
    transform: kitPrinciplesLongformTransform,
  },
  {
    from: 'philosophy/ELEGANT_MINIMALISM_PRINCIPLE.md',
    to: 'payload/philosophy/principles/ELEGANT_MINIMALISM.md',
    transform: kitPrinciplesLongformTransform,
  },
  ...FOUNDATION_GENES.map((name) => ({
    from: `philosophy/genes/${name}`,
    to: `payload/philosophy/genes/${name}`,
    transform: kitFoundationGeneTransform,
  })),
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
