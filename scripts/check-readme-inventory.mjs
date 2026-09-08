#!/usr/bin/env node
/**
 * Diff README inventory table numbers vs platform-stats.snapshot.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');

const EXPECTED = [
  ['philosophyGenes', /\*\*(\d+)\*\* active genes/i],
  ['aiIndexFilesRepoTotal', /\*\*(\d+)\*\* `AI_INDEX\.md` (?:repo-wide|по репо)/i],
  ['aiIndexFilesPlatform', /\/\s*\*\*(\d+)\*\* (?:на платформенных пакетах|on platform packages)/i],
  ['navigationMapTier1Tags', /\*\*(\d+)\*\* Tier-1 genetic tags/i],
  ['kitPayloadGenes', /\*\*(\d+)\*\* payload genes/i],
  ['mcpCatalogActionsPublic', /\*\*(\d+)\*\* (?:public )?MCP catalog actions/i],
  ['mcpDomainsPublic', /\*\*(\d+)\*\* MCP (?:action )?domains/i],
  ['geneCompressionClusters', /\*\*(\d+)\*\* gene compression clusters/i],
  ['devTestAtlasSlices', /\*\*(\d+)\*\* Dev Test Atlas slices/i],
  ['monorepoAuditScripts', /\*\*(\d+)\*\* `audit:\*` scripts/i],
  ['openApiOperations', /\*\*(\d+)\*\* OpenAPI operations/i],
  ['mirroredPluginSkills', /\*\*(\d+)\*\* mirrored plugin skills/i],
];

function main() {
  if (!fs.existsSync(SNAP)) {
    console.error('Missing platform-stats.snapshot.json');
    process.exit(1);
  }
  const snap = JSON.parse(fs.readFileSync(SNAP, 'utf8')).counts ?? {};
  const errors = [];
  for (const rel of ['README.md', 'README.en.md']) {
    const text = fs.readFileSync(path.join(KIT_ROOT, rel), 'utf8');
    for (const [key, re] of EXPECTED) {
      const expected = snap[key];
      if (expected == null) continue;
      const m = text.match(re);
      if (!m) continue;
      const cited = Number(m[1]);
      if (cited !== expected) {
        errors.push(`${rel}: ${key} cited ${cited} !== snapshot ${expected}`);
      }
    }
  }
  if (errors.length) {
    console.error('check-readme-inventory FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('check-readme-inventory OK');
}

main();
