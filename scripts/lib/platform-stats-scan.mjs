import fs from 'node:fs';
import path from 'node:path';
import { walkMatchingBasename, DEFAULT_MONOREPO_SKIP_DIRS } from './walk-files.mjs';
import { resolveIndexScanRoots, EXTRA_INDEX_SCAN_ROOTS } from './navigation-map-roots.mjs';

/** @deprecated Prefer {@link resolveIndexScanRoots} — kept for tests/docs parity. */
export { EXTRA_INDEX_SCAN_ROOTS };

/**
 * Tier-0-ish package roots for AI_INDEX inventory (avoids full-repo walk).
 * Derived from `docs/AI_NAVIGATION_MAP.md` link targets + {@link EXTRA_INDEX_SCAN_ROOTS}.
 * Gene: repo.tooling.genetic_starter.gen1 · repo.engineering.ai_navigation.gen1
 */
export function getMonorepoIndexScanRoots(monorepoRoot) {
  return resolveIndexScanRoots(monorepoRoot);
}

/**
 * @param {string} monorepoRoot
 * @param {{ fullScan?: boolean, skipDirs?: string[], includeCardGame?: boolean }} [opts]
 * @returns {string[]} absolute paths to AI_INDEX.md
 */
export function collectMonorepoAiIndexes(monorepoRoot, opts = {}) {
  const skipDirs = opts.skipDirs ?? DEFAULT_MONOREPO_SKIP_DIRS;
  const match = (_, name) => name === 'AI_INDEX.md';
  const seen = new Set();

  const roots = opts.fullScan
    ? [monorepoRoot]
    : resolveIndexScanRoots(monorepoRoot)
        .map((rel) => path.join(monorepoRoot, rel))
        .filter((p) => fs.existsSync(p));

  for (const root of roots) {
    for (const full of walkMatchingBasename(root, match, skipDirs)) {
      seen.add(path.normalize(full));
    }
  }

  let paths = [...seen];
  if (!opts.includeCardGame) {
    paths = paths.filter((p) => !p.replace(/\\/g, '/').includes('/CardGame/'));
  }
  return paths;
}
