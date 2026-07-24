import fs from 'node:fs';
import path from 'node:path';
import {
  applyLinkAliasForResolve,
  shouldSkipLinkValidation,
} from './link-resolution-aliases.mjs';

const LINK_RE = /\[[^\]]*\]\(([^)#\s]+)(?:#[^)]*)?\)/g;

/**
 * Resolve relative markdown link target on disk.
 * @param {string} rootDir
 * @param {string} fromRel
 * @param {string} target
 * @param {{ mode?: 'kit' | 'consumer' }} [opts]
 */
export function resolveLinkTarget(rootDir, fromRel, target, opts = {}) {
  if (shouldSkipLinkValidation(target)) {
    return { skip: true };
  }
  const aliased = applyLinkAliasForResolve(target, opts);
  const filePath = path.join(rootDir, fromRel);
  const dir = path.dirname(filePath);
  const resolved = path.normalize(path.join(dir, aliased));
  return { skip: false, resolved, aliased };
}

/**
 * Resolve relative markdown links from a file; return list of broken targets.
 * @param {string} rootDir
 * @param {string[]} relativeFiles
 * @param {{ mode?: 'kit' | 'consumer' }} [opts]
 */
export function findBrokenMarkdownLinks(rootDir, relativeFiles, opts = {}) {
  const broken = [];
  for (const rel of relativeFiles) {
    if (!rel.endsWith('.md') && !rel.endsWith('.mdc')) continue;
    const filePath = path.join(rootDir, rel);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(content)) !== null) {
      const target = m[1];
      if (target.startsWith('http://') || target.startsWith('https://')) continue;
      const { skip, resolved } = resolveLinkTarget(rootDir, rel, target, opts);
      if (skip) continue;
      if (!resolved) continue;
      if (!fs.existsSync(resolved)) {
        broken.push({
          file: rel,
          target,
          resolved: path.relative(rootDir, resolved),
          code: 'LINK',
        });
      }
    }
  }
  return broken;
}
