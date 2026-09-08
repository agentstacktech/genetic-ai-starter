import fs from 'node:fs';
import path from 'node:path';
import { walkFiles } from './walk-files.mjs';

/**
 * Scan philosophy gene markdown files under genesDir.
 * @param {string} genesDir
 * @param {{ skipTemplates?: boolean, skipCatalog?: boolean }} [opts]
 */
export function scanPhilosophyGenes(genesDir, opts = {}) {
  const { skipTemplates = true, skipCatalog = true } = opts;
  if (!fs.existsSync(genesDir)) return [];

  const files = walkFiles(genesDir, {
    extensions: ['.md'],
    filter: (full) => {
      if (!/\.gen[12]\.md$/.test(full)) return false;
      const rel = full.replace(/\\/g, '/');
      if (skipTemplates && rel.includes('/templates/')) return false;
      const base = path.basename(full);
      if (skipCatalog && base.startsWith('GENE_')) return false;
      return true;
    },
  });

  return files.map((full) => {
    const text = fs.readFileSync(full, 'utf8');
    const tag = text.match(/\*\*Genetic tag:\*\*\s+`([a-z0-9_.]+)`/)?.[1];
    const rel = path.relative(genesDir, full).replace(/\\/g, '/');
    const intent = text.match(/##\s+Intent\s*\n+([\s\S]*?)\n+---/)?.[1]?.trim() || '';
    return {
      tag: tag || path.basename(full).replace(/\.md$/, ''),
      rel,
      intent,
      full,
    };
  });
}

/**
 * Collect AI_INDEX.md paths relative to projectRoot.
 * @param {string} projectRoot
 * @param {string} [relPrefix]
 */
export function scanAiIndexFiles(projectRoot, relPrefix = '') {
  if (!fs.existsSync(projectRoot)) return [];
  return walkFiles(projectRoot, {
    extensions: null,
    filter: (full) => path.basename(full) === 'AI_INDEX.md',
  }).map((full) => {
    const rel = path.relative(projectRoot, full).replace(/\\/g, '/');
    return relPrefix ? `${relPrefix}/${rel}`.replace(/\/+/g, '/') : rel;
  });
}
