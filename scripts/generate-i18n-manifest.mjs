#!/usr/bin/env node
/**
 * Build docs/genetic-ai-starter-maintainers/i18n-manifest.json from meta/docs/*.md inventory.
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { MAINTAINERS_DOCS } from './lib/maintainers-docs-path.mjs';

const DOCS = path.join(KIT_ROOT, 'meta/docs');
const MAINTAINERS = MAINTAINERS_DOCS;
const OUT = path.join(MAINTAINERS, 'i18n-manifest.json');

const PAIRS = [
  ['README.md', 'README.en.md', 'repo-root'],
  ['BENEFITS_AND_METRICS_ru.md', 'BENEFITS_AND_METRICS.md', 'paired'],
  ['TOKEN_ECONOMICS_ru.md', 'TOKEN_ECONOMICS.md', 'paired'],
  ['KILLER_FEATURE_LARGE_PROJECTS_ru.md', 'KILLER_FEATURE_LARGE_PROJECTS.md', 'pair-stub'],
  ['GENE_ADAPTATION_ru.md', 'GENE_ADAPTATION.md', 'paired-inverted'],
  ['AGENT_FLOOR_ru.md', 'AGENT_FLOOR.md', 'paired'],
  ['AI_RELEASE_AUTONOMY_ru.md', 'AI_RELEASE_AUTONOMY.md', 'paired'],
  ['REAL_BENEFITS_ru.md', 'REAL_BENEFITS.md', 'paired'],
  ['PRODUCTION_OUTCOMES_ru.md', 'PRODUCTION_OUTCOMES.md', 'paired'],
  ['METRICS_GLOSSARY_ru.md', 'METRICS_GLOSSARY.md', 'paired'],
  ['COMPARISON_METHODS_ru.md', 'COMPARISON_METHODS.md', 'paired'],
  ['ROI_PLAYBOOK_ru.md', 'ROI_PLAYBOOK.md', 'paired'],
  ['LARGE_PROJECT_PLAYBOOK_ru.md', 'LARGE_PROJECT_PLAYBOOK.md', 'paired'],
  ['GETTING_STARTED_ru.md', 'GETTING_STARTED.md', 'paired'],
];

function h2Set(md) {
  return [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
}

function main() {
  fs.mkdirSync(MAINTAINERS, { recursive: true });
  const files = fs
    .readdirSync(DOCS)
    .filter((f) => f.endsWith('.md'))
    .sort();

  const entries = files.map((name) => {
    const full = path.join(DOCS, name);
    const text = fs.readFileSync(full, 'utf8');
    const lang = name.endsWith('_ru.md') ? 'ru' : 'en';
    const pair = PAIRS.find(([ru, en]) => name === ru || name === en);
    return {
      path: `meta/docs/${name}`,
      lang,
      h2: h2Set(text),
      pairRole: pair ? pair[2] : 'single',
      mirror: pair ? `meta/docs/${pair[0] === name ? pair[1] : pair[0]}` : null,
    };
  });

  const generatedAt = new Date().toISOString();
  fs.writeFileSync(
    OUT,
    `${JSON.stringify({ generatedAt, entries }, null, 2)}\n`,
  );

  const registryLines = [
    '# i18n doc registry (auto-generated)',
    '',
    `Generated: ${generatedAt} · Do not edit by hand — run \`node scripts/generate-i18n-manifest.mjs\``,
    '',
    '| File | Status | Lang | Mirror |',
    '|------|--------|------|--------|',
    ...entries.map((e) => {
      const base = path.basename(e.path);
      return `| ${base} | ${e.pairRole} | ${e.lang} | ${e.mirror ? path.basename(e.mirror) : '—'} |`;
    }),
  ];
  const REGISTRY = path.join(MAINTAINERS, 'I18N_DOC_REGISTRY.md');
  fs.writeFileSync(REGISTRY, `${registryLines.join('\n')}\n`);

  console.log(`wrote ${OUT} (${entries.length} files)`);
  console.log(`wrote ${REGISTRY}`);
}

main();
