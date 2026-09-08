import fs from 'node:fs';
import path from 'node:path';

/**
 * Top-level dirs with nested AI_INDEX not linked as `../pkg/` in AI_NAVIGATION_MAP.md.
 * Gene: repo.engineering.ai_navigation.gen1 · repo.tooling.genetic_starter.gen1
 */
export const EXTRA_INDEX_SCAN_ROOTS = [
  'CardGame',
  'docs',
  'superservice_frontend',
  'agentcoin-contracts',
];

const SKIP_ROOT_SEGMENTS = new Set([
  'archive',
  'database',
  'docs-site',
  'perf',
  'test',
]);

/**
 * @param {string} segment
 * @returns {boolean}
 */
export function isValidPackageRootSegment(segment) {
  if (!segment || segment.length < 2) return false;
  if (segment.startsWith('.')) return false;
  if (segment.includes('.')) return false;
  if (!/^[a-z0-9][a-z0-9_.-]*$/i.test(segment)) return false;
  if (SKIP_ROOT_SEGMENTS.has(segment)) return false;
  return true;
}

/**
 * Collect unique top-level package roots from markdown `](../pkg/...)` links.
 *
 * @param {string} mapText
 * @returns {string[]}
 */
export function extractPackageRootsFromNavigationMap(mapText) {
  const roots = new Set();
  const linkRe = /\]\(\.\.\/([^/)#]+)/g;
  let match;
  while ((match = linkRe.exec(mapText))) {
    const segment = match[1].split('/')[0];
    if (isValidPackageRootSegment(segment)) {
      roots.add(segment);
    }
  }
  return [...roots].sort();
}

/**
 * @param {string} monorepoRoot
 * @returns {string[]}
 */
export function resolveIndexScanRoots(monorepoRoot) {
  const mapPath = path.join(monorepoRoot, 'docs', 'AI_NAVIGATION_MAP.md');
  const fromMap = fs.existsSync(mapPath)
    ? extractPackageRootsFromNavigationMap(fs.readFileSync(mapPath, 'utf8'))
    : [];
  return [...new Set([...fromMap, ...EXTRA_INDEX_SCAN_ROOTS])].sort();
}
