#!/usr/bin/env node
/**
 * Regression: kit-sync-transforms must not corrupt ../../../scripts via ../../scripts substring.
 * Genetic tag: repo.tooling.genetic_starter.gen1 · KIT-T12
 */
import assert from 'node:assert/strict';
import {
  AGENTSTACK_TREE,
  kitFoundationGeneTransform,
  kitAiIndexingTransform,
} from '../scripts/lib/kit-sync-transforms.mjs';

const geneSample = `
Script: [genetic-ai-starter/scripts/validate-genes.mjs](../../genetic-ai-starter/scripts/validate-genes.mjs)
Also: [new-gene](../../genetic-ai-starter/scripts/new-gene.mjs)
Monorepo scripts: [gen](../../scripts/gen_capability_matrix.py)
Cursorrules: [.cursorrules](../../.cursorrules)
`;

const out = kitFoundationGeneTransform(geneSample);
assert.ok(
  out.includes('](../../../scripts/validate-genes.mjs)'),
  `expected kit-relative scripts link, got:\n${out}`,
);
assert.ok(
  out.includes('](../../../scripts/new-gene.mjs)'),
  'new-gene should stay under kit scripts/',
);
assert.ok(
  !out.includes('../https://'),
  'must not produce ../https:// corruption',
);
assert.ok(
  out.includes(`](${AGENTSTACK_TREE}/scripts/gen_capability_matrix.py)`),
  'monorepo ../../scripts/ should become GitHub tree',
);
assert.ok(
  out.includes('.cursorrules.fragment.md'),
  'cursorrules should map to fragment in kit payload',
);

const indexing = kitAiIndexingTransform(`
**Gene:** \`repo.engineering.ai_navigation.gen1\`
**Companion:** [AI_AGENT_INTENT_ROUTER.md](AI_AGENT_INTENT_ROUTER.md) · [../AGENTS.md](../AGENTS.md)

## 7. See also

- broken
`);
assert.ok(indexing.includes('repo.navigation.map.gen1'), 'kit genes called out');
assert.ok(indexing.includes('../../AGENTS.md'), 'AGENTS path from docs/ai');
assert.ok(!indexing.includes('](../AGENTS.md)'), 'no one-level AGENTS link from docs/ai');

console.log('kit-sync-transforms.test.mjs OK');
