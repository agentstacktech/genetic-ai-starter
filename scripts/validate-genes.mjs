#!/usr/bin/env node
/**
 * Validate payload philosophy gene files: tag grammar + required sections.
 * Gene: foundation.genetic_coding.gen1 · repo.tooling.gene_lifecycle.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAYLOAD_ROOT } from './lib/paths.mjs';

const GENES_DIR = path.join(PAYLOAD_ROOT, 'philosophy/genes');

/** @typedef {'strict' | 'foundation' | 'synced' | 'pointer'} GeneTier */

/** @param {string} rel */
function geneTier(rel) {
  const base = path.basename(rel);
  if (rel.startsWith('templates/')) return 'pointer';
  if (base.startsWith('foundation.')) return 'foundation';
  if (
    base === 'repo.engineering.controlled_changes.gen1.md' ||
    base === 'repo.engineering.founder_direct_ship.gen1.md'
  ) {
    return 'synced';
  }
  if (
    base === 'frontend.spa.ui_surface_registry.gen1.md' ||
    base === 'repo.tooling.genetic_starter.benchmark.gen1.md' ||
    base === 'repo.community.starter_spirit.gen1.md'
  ) {
    return 'pointer';
  }
  return 'strict';
}

/** @param {string} tag */
function isValidTagGrammar(tag) {
  if (!tag || typeof tag !== 'string') return false;
  const parts = tag.split('.');
  if (parts.length < 3 || parts.length > 5) return false;
  if (!parts.every((p) => /^[a-z][a-z0-9_]*$/.test(p))) return false;
  const last = parts[parts.length - 1];
  return /^gen\d+$/.test(last);
}

/**
 * @param {string} text
 * @param {GeneTier} tier
 */
function checkSections(text, tier) {
  const errors = [];
  const hasTag = /\*\*Genetic tag:\*\*\s+`[a-z0-9_.]+`/m.test(text) ||
    /`[a-z][a-z0-9_.]+\.gen\d+`/.test(text);
  const hasIntent =
    /##\s+Intent/m.test(text) ||
    /##\s+Core statement/m.test(text) ||
    /##\s+Purpose/m.test(text);
  const hasCross =
    /##\s+Cross-links/m.test(text) ||
    /##\s+Links/m.test(text) ||
    /##\s+Cross-links|##\s+References/m.test(text);

  if (tier === 'strict') {
    if (!/^#\s+Gene\s+—/m.test(text)) errors.push('missing section: Gene header');
    if (!/\*\*Genetic tag:\*\*\s+`[a-z0-9_.]+`/m.test(text)) errors.push('missing section: Genetic tag');
    if (!/##\s+Intent/m.test(text)) errors.push('missing section: Intent');
    if (!/##\s+Cross-links/m.test(text)) errors.push('missing section: Cross-links');
  } else if (tier === 'foundation') {
    if (!/^#\s+Gene\s+—/m.test(text)) errors.push('missing section: Gene header');
    if (!/\*\*Genetic tag:\*\*\s+`[a-z0-9_.]+`/m.test(text)) errors.push('missing section: Genetic tag');
    if (!hasCross) errors.push('missing section: Cross-links (or Links)');
  } else if (tier === 'synced') {
    if (!hasTag) errors.push('missing Genetic tag metadata');
    if (!/##\s+Intent/m.test(text)) errors.push('missing section: Intent');
  } else if (tier === 'pointer') {
    if (!hasTag && !/^#\s+Gene/m.test(text)) errors.push('missing genetic tag or Gene title');
  }
  return errors;
}

/**
 * @param {string} filePath
 * @returns {{ errors: string[], warnings: string[] }}
 */
export function validateGeneFile(filePath) {
  const errors = [];
  const warnings = [];
  const text = fs.readFileSync(filePath, 'utf8');
  const base = path.basename(filePath);
  const relFromGenes = path.relative(GENES_DIR, filePath).replace(/\\/g, '/');

  if (relFromGenes.startsWith('templates/') || base.startsWith('GENE_')) {
    return { errors, warnings };
  }
  if (!base.endsWith('.gen1.md') && !base.endsWith('.gen2.md')) {
    return { errors, warnings };
  }

  const tier = geneTier(relFromGenes);
  errors.push(...checkSections(text, tier));

  const tagMatch = text.match(/\*\*Genetic tag:\*\*\s+`([a-z0-9_.]+)`/) ||
    text.match(/Gene:\s+`([a-z0-9_.]+)`/) ||
    text.match(/Gene —\s+`?([a-z][a-z0-9_.]+\.gen\d+)`?/);
  const tag = tagMatch?.[1];
  if (tier !== 'pointer' && !tag) {
    errors.push('missing Genetic tag metadata');
  } else if (tag && !isValidTagGrammar(tag)) {
    errors.push(`invalid tag grammar: ${tag}`);
  } else if (tag && base !== `${tag}.md` && tier === 'strict') {
    warnings.push(`filename ${base} != tag ${tag}.md`);
  }

  return { errors, warnings };
}

/**
 * @param {string} [genesDir]
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function validateAllGenes(genesDir = GENES_DIR) {
  const errors = [];
  const warnings = [];
  if (!fs.existsSync(genesDir)) {
    return { ok: false, errors: [`genes dir missing: ${genesDir}`], warnings };
  }

  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith('.gen1.md') || ent.name.endsWith('.gen2.md')) {
        const rel = path.relative(genesDir, full).replace(/\\/g, '/');
        if (rel.startsWith('templates/')) continue;
        const { errors: e, warnings: w } = validateGeneFile(full);
        for (const msg of e) errors.push(`${rel}: ${msg}`);
        for (const msg of w) warnings.push(`${rel}: ${msg}`);
      }
    }
  };
  walk(genesDir);

  return { ok: errors.length === 0, errors, warnings };
}

function main() {
  const { ok, errors, warnings } = validateAllGenes();
  for (const w of warnings) console.warn(`WARN: ${w}`);
  if (!ok) {
    console.error('validate-genes FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('validate-genes OK');
}

const isCli =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isCli) main();
