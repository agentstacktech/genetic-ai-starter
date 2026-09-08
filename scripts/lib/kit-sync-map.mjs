import path from 'node:path';
import {
  kitAiIndexingTransform,
  kitFoundationGeneTransform,
  kitHeritageTransform,
  kitPrinciplesLongformTransform,
  kitAiGeneInstructionsTransform,
  kitContextForAiTransform,
} from './kit-sync-transforms.mjs';

export const FOUNDATION_GENES = [
  'foundation.core_pillars.gen1.md',
  'foundation.creation_over_conflict.gen1.md',
  'foundation.elegant_minimalism.gen1.md',
  'foundation.decomposition_reassembly.gen1.md',
  'foundation.absolute_optimization.gen1.md',
  'foundation.genetic_coding.gen1.md',
  'foundation.time_decomposition.gen1.md',
  'foundation.ai_gene_interface.gen1.md',
];

/** repo.tooling.* genes intentionally not copied into kit payload. */
export const SYNC_MAP_OPTIONAL_TOOLING_GENES = new Set([
  'repo.tooling.genetic_starter.gen1.md',
  'repo.tooling.genetic_starter.integration.gen1.md',
  'repo.tooling.genetic_starter.agentstack_dx.gen1.md',
  'repo.tooling.gene_lifecycle.gen1.md',
  'repo.tooling.user_cli.gen1.md',
  'repo.tooling.docs_site.gen1.md',
  'repo.tooling.kit_vendor.gen1.md',
  'repo.tooling.platform_tooling.gen1.md',
]);

/** @type {{ from: string, to: string, transform: (c: string) => string }[]} */
export const KIT_SYNC_MAP = [
  {
    from: 'docs/AI_INDEXING_SYSTEM.md',
    to: 'payload/docs/ai/AI_INDEXING_SYSTEM.md',
    transform: kitAiIndexingTransform,
  },
  {
    from: 'philosophy/genes/repo.engineering.controlled_code_changes.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.controlled_changes.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.engineering.dna_protein_data_plane.gen1.md',
    to: 'payload/philosophy/genes/repo.engineering.dna_protein_data_plane.gen1.md',
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
  {
    from: 'philosophy/genes/repo.tooling.genetic_starter.agentstack_dx.gen1.md',
    to: 'payload/philosophy/genes/repo.tooling.genetic_starter.agentstack_dx.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.platform.sdk.onboarding.gen1.md',
    to: 'payload/philosophy/genes/repo.platform.sdk.onboarding.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.platform.sdk.recipes.gen1.md',
    to: 'payload/philosophy/genes/repo.platform.sdk.recipes.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.platform.capability_contract.gen1.md',
    to: 'payload/philosophy/genes/repo.platform.capability_contract.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'philosophy/genes/repo.tooling.gene_lifecycle.gen1.md',
    to: 'payload/philosophy/genes/repo.tooling.gene_lifecycle.gen1.md',
    transform: kitFoundationGeneTransform,
  },
  {
    from: 'docs/plugins/CONTEXT_FOR_AI.md',
    to: 'extensions/agentstack/overlay/CONTEXT_FOR_AI.md',
    transform: kitContextForAiTransform,
  },
];

/** @returns {Set<string>} basenames from `philosophy/genes/` referenced in sync map */
export function syncedGeneBasenames() {
  const names = new Set();
  for (const { from } of KIT_SYNC_MAP) {
    if (from.startsWith('philosophy/genes/') && from.endsWith('.gen1.md')) {
      names.add(path.basename(from));
    }
  }
  return names;
}
