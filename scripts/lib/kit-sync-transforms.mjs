/**
 * Path transforms when copying monorepo philosophy → kit payload.
 * Goal: consumer kit validates offline; monorepo-only paths → GitHub tree or kit-relative.
 */

export const AGENTSTACK_TREE = 'https://github.com/agentstacktech/AgentStack/tree/main';

/** @param {string} c */
export function kitDocsTransform(c) {
  return c
    .replace(/AgentStack monorepo/g, '{{PROJECT_NAME}}')
    .replace(/`docs\/AI_NAVIGATION_MAP\.md`/g, '`docs/ai/AI_NAVIGATION_MAP.md`')
    .replace(/\.\.\/philosophy\//g, '../../philosophy/')
    .replace(/agentstack-core\/|agentstack-frontend\//g, '')
    .replace(/\.cursor\/rules\/ai-navigation-indexes\.mdc/g, '.cursor/rules/genetic-navigation.mdc')
    .replace(/\.cursor\/rules\/ai-index-authoring\.mdc/g, '.cursor/rules/genetic-index-authoring.mdc')
    .replace(/\[CACHE_INVALIDATION_CONVENTION\.md\][^\n]*/g, '')
    .replace(/\[ECOSYSTEM_INTERACTION[^\n]*/g, '')
    .replace(/\]\(\.\.\/shared\/[^)]*\)/g, `](${AGENTSTACK_TREE}/shared/)`)
    .replace(/SHARED_SINGLE_PACKAGE\.md/g, `${AGENTSTACK_TREE}/docs/SHARED_SINGLE_PACKAGE.md`);
}

/**
 * Monorepo AI_INDEXING_SYSTEM → kit payload/docs/ai (consumer-safe).
 * @param {string} c
 */
export function kitAiIndexingTransform(c) {
  let out = kitDocsTransform(c);
  out = out
    .replace(/\*\*Gene:\*\* `repo\.engineering\.ai_navigation\.gen1`/g,
      '**Genes (kit):** `repo.navigation.map.gen1` · `repo.navigation.index.gen1`  \n'
      + `**Monorepo plane:** [\`repo.engineering.ai_navigation.gen1\`](${AGENTSTACK_TREE}/philosophy/genes/repo.engineering.ai_navigation.gen1.md)`)
    .replace(
      /\*\*Companion:\*\*[^\n]+/g,
      '**Companion:** [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) · [templates/AI_INDEX.template.md](templates/AI_INDEX.template.md) · `.cursor/rules/genetic-navigation.mdc` · [AGENTS.md](../../AGENTS.md)',
    )
    .replace(/\]\(AI_AGENT_INTENT_ROUTER\.md\)/g, `](${AGENTSTACK_TREE}/docs/AI_AGENT_INTENT_ROUTER.md)`)
    .replace(/\]\(ecosystem\/AI_NAVIGATION_GAP_REGISTER\.md\)/g, `](${AGENTSTACK_TREE}/docs/ecosystem/AI_NAVIGATION_GAP_REGISTER.md)`)
    .replace(/\]\(operations\/AI_NAVIGATION_RUNBOOK\.md\)/g, `](${AGENTSTACK_TREE}/docs/operations/AI_NAVIGATION_RUNBOOK.md)`)
    .replace(/\]\(\.\.\/AGENTS\.md\)/g, '](../../AGENTS.md)')
    .replace(/\]\(\.\.\/\.\.\/AGENTS\.md\)/g, '](../../AGENTS.md)')
    .replace(
      /\]\(\.\.\/\.\.\/philosophy\/genes\/repo\.engineering\.ai_navigation\.gen1\.md\)/g,
      `](${AGENTSTACK_TREE}/philosophy/genes/repo.engineering.ai_navigation.gen1.md)`,
    )
    .replace(
      /Editing: `repo\.engineering\.controlled_changes\.gen1` → `repo\.engineering\.controlled_code_changes\.gen1\.md`\./g,
      'Editing: `repo.engineering.controlled_changes.gen1` → [repo.engineering.controlled_changes.gen1.md](../../philosophy/genes/repo.engineering.controlled_changes.gen1.md).',
    )
    .replace(
      /\| `_generated\/ai-nav\/TAG_CATALOG\.json` \|[^\n]+\n/g,
      `| \`_generated/ai-nav/*\` (AgentStack host only) | Optional generated catalog/graph — not required in consumer kits |\n`,
    )
    .replace(
      /\| `_generated\/ai-nav\/NAV_CORPUS\.json`[^\n]+\n/g,
      '',
    )
    .replace(
      /\| `_generated\/ai-nav\/ORPHAN_ALLOWLIST\.json`[^\n]+\n/g,
      '',
    )
    .replace(
      /\| `scripts\/build-ai-nav-catalog\.mjs`[^\n]+\n/g,
      `| Kit genes \`repo.navigation.map.gen1\` / \`index.gen1\` | Consumer L1/L2 contract |\n`,
    )
    .replace(/\| `scripts\/build-ai-nav-graph\.mjs`[^\n]+\n/g, '')
    .replace(/\| `scripts\/audit-ai-navigation\.mjs`[^\n]+\n/g, '')
    .replace(/\| `scripts\/eval-ai-navigation\.mjs`[^\n]+\n/g, '')
    .replace(/\| MCP `docs_nav\.resolve`[^\n]+\n/g, '')
    .replace(
      /## 7\. See also[\s\S]*$/m,
      `## 7. See also

- [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md)
- [templates/AI_INDEX.template.md](templates/AI_INDEX.template.md)
- [repo.navigation.map.gen1.md](../../philosophy/genes/repo.navigation.map.gen1.md)
- [repo.navigation.index.gen1.md](../../philosophy/genes/repo.navigation.index.gen1.md)
- Monorepo adapters (optional): [\`repo.engineering.ai_navigation.gen1\`](${AGENTSTACK_TREE}/philosophy/genes/repo.engineering.ai_navigation.gen1.md)
`,
    );
  return out;
}

/** @param {string} c */
export function kitFoundationGeneTransform(c) {
  let out = kitDocsTransform(c)
    .replace(/\.\.\/\.\.\/docs\//g, '../../docs/ai/')
    .replace(/\.\.\/LANCE_PRINCIPLE_CREATION_OVER_CONFLICT\.md/g, '../principles/LANCE_CREATION_OVER_CONFLICT.md')
    .replace(/\.\.\/ELEGANT_MINIMALISM_PRINCIPLE\.md/g, '../principles/ELEGANT_MINIMALISM.md')
    .replace(
      /\[GENE_FOUNDATION__ABSOLUTE_OPTIMIZATION_FORMULA_V020_V0_2_0_GEN2\.md\]\([^)]+\)/g,
      '[FOUNDATION_HERITAGE_READING.md](../archive/FOUNDATION_HERITAGE_READING.md)',
    )
    .replace(/GENE_FOUNDATION__ABSOLUTE_OPTIMIZATION_FORMULA_V020_V0_2_0_GEN2\.md/g, '../archive/FOUNDATION_HERITAGE_READING.md')
    .replace(/GENE_PHILOSOPHY__V0116_ELEGANT_MINIMALISM_PRINCIPLE_V0_1_16_GEN2\.md/g, '../principles/ELEGANT_MINIMALISM.md')
    .replace(/\.\.\/EVOLUTION_JOURNAL\.md/g, '../PHILOSOPHY_INDEX.md')
    .replace(/\]\(\.\.\/\.\.\/docs\/journals\/[^)]+\)/g, `](${AGENTSTACK_TREE}/docs/journals/)`)
    .replace(/\]\(\.\.\/docs\/journals\/[^)]*\)/g, `](${AGENTSTACK_TREE}/docs/journals/)`)
    .replace(/\]\(\.\.\/\.\.\/docs\/adr\//g, `](${AGENTSTACK_TREE}/docs/adr/`)
    .replace(/\.\.\/\.\.\/docs\/ai\/adr\//g, `${AGENTSTACK_TREE}/docs/adr/`)
    .replace(/\.\.\/\.\.\/docs\/ai\/8DNA_UNIFIED_REFERENCE\.md/g, `${AGENTSTACK_TREE}/docs/8DNA_UNIFIED_REFERENCE.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/dual-shell\/PERF_BUDGET\.md/g, `${AGENTSTACK_TREE}/docs/dual-shell/PERF_BUDGET.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/VERSIONING\.md/g, `${AGENTSTACK_TREE}/docs/VERSIONING.md`)
    .replace(/\.\.\/\.\.\/CHANGELOG\.md/g, `${AGENTSTACK_TREE}/CHANGELOG.md`)
    .replace(/\.\.\/RELEASE_NOTES_INDEX\.md/g, `${AGENTSTACK_TREE}/philosophy/RELEASE_NOTES_INDEX.md`)
    .replace(/\.\.\/\.\.\/agentstack-core\//g, `${AGENTSTACK_TREE}/agentstack-core/`)
    .replace(/\.\.\/\.\.\/shared\//g, `${AGENTSTACK_TREE}/shared/`)
    .replace(/\.\.\/PHILOSOPHY_IN_ACTION_HISTORY\.md/g, '../PHILOSOPHY_INDEX.md')
    .replace(/\.\.\/THE_CURLY_BRACES_WAR\.md/g, `${AGENTSTACK_TREE}/philosophy/THE_CURLY_BRACES_WAR.md`)
    .replace(/\.\.\/\.\.\/ai_builder\//g, `${AGENTSTACK_TREE}/agentstack-core/ai_builder/`)
    .replace(/\(foundation\.ai_gene_interface\.gen1\.md\)/g, '(foundation.ai_gene_interface.gen1.md)')
    .replace(/\]\(\.\.\/ai_gene_interface\.py\)/g, `](${AGENTSTACK_TREE}/philosophy/ai_gene_interface.py)`)
    .replace(/\]\(\.\.\/gene_document_resolver\.py\)/g, `](${AGENTSTACK_TREE}/philosophy/gene_document_resolver.py)`)
    .replace(/\]\(gene_document_resolver\.py\)/g, `](${AGENTSTACK_TREE}/philosophy/gene_document_resolver.py)`)
    .replace(/\]\(ai_gene_interface\.py\)/g, `](${AGENTSTACK_TREE}/philosophy/ai_gene_interface.py)`)
    .replace(/\.\.\/\.\.\/docs\/ai\/journals\/stories\//g, `${AGENTSTACK_TREE}/docs/journals/stories/`)
    .replace(/repo\.engineering\.controlled_code_changes\.gen1\.md/g, 'repo.engineering.controlled_changes.gen1.md')
    .replace(/`gene_document_resolver\.py`/g, '`gene_document_resolver` (AgentStack monorepo)')
    .replace(/`ai_gene_interface\.py`/g, '`ai_gene_interface` (AgentStack monorepo)')
    .replace(/`gene_manager\.py`/g, '`gene_manager` (AgentStack monorepo, optional)')
    .replace(/\]\(gene_manager\.py[^)]*\)/g, `](${AGENTSTACK_TREE}/philosophy/gene_manager.py)`)
    .replace(/\]\(genes_config\.json[^)]*\)/g, `](${AGENTSTACK_TREE}/philosophy/genes_config.json)`)
    .replace(
      /\[shared\.immune\.system\.gen1\.md\]\(shared\.immune\.system\.gen1\.md\)/g,
      `[immune gene](${AGENTSTACK_TREE}/philosophy/genes/shared.immune.system.gen1.md)`,
    )
    .replace(/\.\.\/archive\/genes-legacy\/AI_INDEX\.md/g, '../archive/FOUNDATION_HERITAGE_READING.md')
    .replace(/\.\.\/\.\.\/\.cursor\/rules\/platform-vs-tenant-canary\.mdc/g, `${AGENTSTACK_TREE}/.cursor/rules/platform-vs-tenant-canary.mdc`)
    .replace(/\.\.\/\.\.\/docs\/AI_NAVIGATION_MAP\.md/g, '../../docs/ai/AI_NAVIGATION_MAP.md')
    .replace(/\]\(repo\.tooling\.kit_vendor\.gen1\.md\)/g, '](https://github.com/agentstacktech/genetic-ai-starter/tree/main)')
    .replace(
      /\]\(\.\.\/\.\.\/docs\/ai\/journals\/JOURNAL_STORY_TEMPLATE\.md\)/g,
      `](${AGENTSTACK_TREE}/docs/journals/JOURNAL_STORY_TEMPLATE.md)`,
    )
    .replace(/\]\(\.\.\/\.\.\/docs\/ai\/journals\/README\.md\)/g, `](${AGENTSTACK_TREE}/docs/journals/README.md)`);

  // Kit-root relatives (payload/philosophy/genes → ../../../)
  // IMPORTANT: rewrite genetic-ai-starter paths BEFORE generic ../../scripts/
  // (otherwise ../../../scripts/ is corrupted by substring match on ../../scripts/).
  out = out
    .replace(/\.\.\/\.\.\/genetic-ai-starter\/scripts\//g, '../../../scripts/')
    .replace(/\.\.\/\.\.\/genetic-ai-starter\//g, '../../../')
    .replace(/\]\(\.\.\/\.\.\/\.cursorrules\)/g, '](../../.cursorrules.fragment.md)')
    .replace(/\.\.\/\.\.\/\.cursorrules(?!\.fragment)/g, '../../.cursorrules.fragment.md')
    .replace(/\.\.\/\.\.\/agentstack-unified-sdk\//g, `${AGENTSTACK_TREE}/agentstack-unified-sdk/`)
    .replace(/\.\.\/\.\.\/provided_plugins\//g, `${AGENTSTACK_TREE}/provided_plugins/`)
    .replace(/\]\(\.\.\/\.\.\/scripts\//g, `](${AGENTSTACK_TREE}/scripts/`)
    .replace(/\.\.\/\.\.\/mcp\//g, `${AGENTSTACK_TREE}/agentstack-core/mcp/`)
    // docs/ai/* that are monorepo docs/* (not under kit docs/ai)
    .replace(/\.\.\/\.\.\/docs\/ai\/SDK_AI_SURFACE\.md/g, `${AGENTSTACK_TREE}/docs/SDK_AI_SURFACE.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/AGENT_PROTOCOL_QUICKSTART\.md/g, `${AGENTSTACK_TREE}/docs/AGENT_PROTOCOL_QUICKSTART.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/MCP_BUSINESS_FLOWS\.md/g, `${AGENTSTACK_TREE}/docs/MCP_BUSINESS_FLOWS.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/MCP_CAPABILITY_MATRIX\.md/g, `${AGENTSTACK_TREE}/docs/MCP_CAPABILITY_MATRIX.md`)
    .replace(/\.\.\/\.\.\/docs\/ai\/plugins\//g, `${AGENTSTACK_TREE}/docs/plugins/`)
    // Genes not shipped in kit payload → AgentStack tree
    .replace(/\]\(repo\.platform\.sdk\.unified\.gen1\.md\)/g, `](${AGENTSTACK_TREE}/philosophy/genes/repo.platform.sdk.unified.gen1.md)`)
    .replace(/\]\(repo\.plugins\.capability_routing\.gen1\.md\)/g, `](${AGENTSTACK_TREE}/philosophy/genes/repo.plugins.capability_routing.gen1.md)`)
    // Bare axiom path (avoid double-prefix)
    .replace(
      /(?<!tree\/main\/philosophy\/genes\/)axiom\.version\.control\.lance_will\.gen2\.md/g,
      `${AGENTSTACK_TREE}/philosophy/genes/axiom.version.control.lance_will.gen2.md`,
    )
    .replace(
      /(?<!tree\/main\/philosophy\/genes\/)shared\.immune\.system\.gen1\.md/g,
      `${AGENTSTACK_TREE}/philosophy/genes/shared.immune.system.gen1.md`,
    )
    // Collapse accidental double AGENTSTACK_TREE prefixes
    .replace(
      new RegExp(
        `${AGENTSTACK_TREE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/philosophy/genes/${AGENTSTACK_TREE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/philosophy/genes/`,
        'g',
      ),
      `${AGENTSTACK_TREE}/philosophy/genes/`,
    )
    // Fix accidental ../https:// from older substring bugs
    .replace(/\.\.\/https:\/\//g, 'https://');


  return out;
}

/** @param {string} c */
export function kitHeritageTransform(c) {
  return kitFoundationGeneTransform(c)
    .replace(
      /\[8DNA_EVOLUTION_JOURNAL_v0\.2\.1_to_v0\.4\.7\.md\]\([^)]+\)/g,
      `[8DNA evolution journal](${AGENTSTACK_TREE}/philosophy/8DNA_EVOLUTION_JOURNAL_v0.2.1_to_v0.4.7.md)`,
    )
    .replace(/8DNA_EVOLUTION_JOURNAL_v0\.2\.1_to_v0\.4\.7\.md/g, `${AGENTSTACK_TREE}/philosophy/8DNA_EVOLUTION_JOURNAL_v0.2.1_to_v0.4.7.md`)
    .replace(/\[v0\.2\.1-8dna\/\]\(v0\.2\.1-8dna\/README\.md\)/g, `[8DNA archive](${AGENTSTACK_TREE}/philosophy/archive/v0.2.1-8dna/)`)
    .replace(/v0\.2\.1-8dna\/README\.md/g, `${AGENTSTACK_TREE}/philosophy/archive/v0.2.1-8dna/README.md`)
    .replace(/\[genes-legacy\/AI_INDEX\.md\]\([^)]+\)/g, '[FOUNDATION_HERITAGE_READING.md](FOUNDATION_HERITAGE_READING.md)');
}

/** @param {string} c */
export function kitPrinciplesLongformTransform(c) {
  return c
    .replace(
      /\[genes\/foundation\.elegant_minimalism\.gen1\.md\]\(genes\/foundation\.elegant_minimalism\.gen1\.md\)/g,
      '[../genes/foundation.elegant_minimalism.gen1.md](../genes/foundation.elegant_minimalism.gen1.md)',
    )
    .replace(
      /\[genes\/foundation\.core_pillars\.gen1\.md\]\(genes\/foundation\.core_pillars\.gen1\.md\)/g,
      '[../genes/foundation.core_pillars.gen1.md](../genes/foundation.core_pillars.gen1.md)',
    )
    .replace(
      /\[genes\/foundation\.creation_over_conflict\.gen1\.md\]\(genes\/foundation\.creation_over_conflict\.gen1\.md\)/g,
      '[../genes/foundation.creation_over_conflict.gen1.md](../genes/foundation.creation_over_conflict.gen1.md)',
    );
}

/** Strip monorepo-only tooling paragraphs from AI_GENE_INSTRUCTIONS for kit. */
/** @param {string} c */
export function kitAiGeneInstructionsTransform(c) {
  return kitFoundationGeneTransform(c).replace(
    /python gene_manager\.py[\s\S]*?```/g,
    'See AgentStack monorepo `philosophy/gene_manager.py` if you vendor full philosophy tooling.\n```',
  );
}
