import fs from 'node:fs';
import path from 'node:path';
import { walkFiles } from './walk-files.mjs';

/**
 * List `.md` / `.mdc` paths relative to a scan root (consumer validate-installed, doctor).
 * @param {string} root absolute directory
 * @param {string} [relPrefix] prefix for returned paths (e.g. `docs/ai`)
 */
export function listMarkdownRelative(root, relPrefix = '') {
  if (!fs.existsSync(root)) return [];
  return walkFiles(root, { extensions: ['.md', '.mdc'] }).map((full) => {
    const rel = path.relative(root, full).replace(/\\/g, '/');
    return relPrefix ? `${relPrefix}/${rel}`.replace(/\/+/g, '/') : rel;
  });
}

/**
 * @param {string} target project root
 * @param {string[]} roots relative dirs under target (e.g. `docs/ai`, `philosophy`)
 */
export function listProjectMarkdownRoots(target, roots) {
  const files = [];
  for (const rel of roots) {
    files.push(...listMarkdownRelative(path.join(target, rel), rel));
  }
  if (fs.existsSync(path.join(target, 'AGENTS.md'))) files.push('AGENTS.md');
  return files;
}
