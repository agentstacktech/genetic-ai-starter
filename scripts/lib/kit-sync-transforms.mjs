/**
 * Path transforms when copying monorepo philosophy → kit payload.
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

/** @param {string} c */
export function kitFoundationGeneTransform(c) {
  return (
    kitDocsTransform(c)
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
      .replace(/\]\(axiom\.version\.control\.lance_will\.gen2\.md\)/g, `](${AGENTSTACK_TREE}/philosophy/genes/axiom.version.control.lance_will.gen2.md)`)
      .replace(/\]\(\.\.\/\.\.\/\.cursorrules\)/g, '](../../.cursorrules.fragment.md)')
      .replace(/repo\.engineering\.controlled_code_changes\.gen1\.md/g, 'repo.engineering.controlled_changes.gen1.md')
      .replace(/`gene_document_resolver\.py`/g, '`gene_document_resolver` (AgentStack monorepo)')
      .replace(/`ai_gene_interface\.py`/g, '`ai_gene_interface` (AgentStack monorepo)')
      .replace(/`gene_manager\.py`/g, '`gene_manager` (AgentStack monorepo, optional)')
      .replace(/\]\(gene_manager\.py[^)]*\)/g, `](${AGENTSTACK_TREE}/philosophy/gene_manager.py)`)
      .replace(/\]\(genes_config\.json[^)]*\)/g, `](${AGENTSTACK_TREE}/philosophy/genes_config.json)`)
      .replace(/\[shared\.immune\.system\.gen1\.md\]\(shared\.immune\.system\.gen1\.md\)/g, `[immune gene](${AGENTSTACK_TREE}/philosophy/genes/shared.immune.system.gen1.md)`)
      .replace(/shared\.immune\.system\.gen1\.md/g, `${AGENTSTACK_TREE}/philosophy/genes/shared.immune.system.gen1.md`)
      .replace(/axiom\.version\.control\.lance_will\.gen2\.md/g, `${AGENTSTACK_TREE}/philosophy/genes/axiom.version.control.lance_will.gen2.md`)
      .replace(/\.\.\/archive\/genes-legacy\/AI_INDEX\.md/g, '../archive/FOUNDATION_HERITAGE_READING.md')
      .replace(/\.\.\/\.\.\/\.cursor\/rules\/platform-vs-tenant-canary\.mdc/g, `${AGENTSTACK_TREE}/.cursor/rules/platform-vs-tenant-canary.mdc`)
      .replace(/repo\.engineering\.controlled_code_changes\.gen1\.md/g, 'repo.engineering.controlled_changes.gen1.md')
      .replace(/\.\.\/\.\.\/docs\/AI_NAVIGATION_MAP\.md/g, '../../docs/ai/AI_NAVIGATION_MAP.md')
      .replace(/\.\.\/\.\.\/\.cursorrules/g, '../../.cursorrules')
      .replace(
        /\]\(\.\.\/\.\.\/docs\/ai\/journals\/JOURNAL_STORY_TEMPLATE\.md\)/g,
        `](${AGENTSTACK_TREE}/docs/journals/JOURNAL_STORY_TEMPLATE.md)`,
      )
      .replace(/\]\(\.\.\/\.\.\/docs\/ai\/journals\/README\.md\)/g, `](${AGENTSTACK_TREE}/docs/journals/README.md)`)
  );
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
