import fs from 'node:fs';
import path from 'node:path';

/** Default skip dirs for monorepo tree scans (export-platform-stats). */
export const DEFAULT_MONOREPO_SKIP_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.pytest_cache',
  '.venv',
  '__pycache__',
];

/**
 * Recursive file walk with extension, skip-dir, and optional filter.
 * @param {string} root
 * @param {{ extensions?: string[] | null, skipDirs?: string[], filter?: (fullPath: string) => boolean }} [opts]
 * @returns {string[]} absolute paths
 */
export function walkFiles(root, opts = {}) {
  const extensions = opts.extensions === null ? null : (opts.extensions ?? ['.md', '.json', '.mdc']);
  const skipDirs = new Set(opts.skipDirs ?? ['node_modules', '.git']);
  const filter = opts.filter;
  const acc = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    let names;
    try {
      names = fs.readdirSync(dir);
    } catch (e) {
      if (e?.code === 'EPERM' || e?.code === 'EACCES') return;
      throw e;
    }
    for (const name of names) {
      const full = path.join(dir, name);
      let stat;
      try {
        stat = fs.statSync(full);
      } catch (e) {
        if (e?.code === 'EPERM' || e?.code === 'EACCES') continue;
        throw e;
      }
      if (stat.isDirectory()) {
        if (!skipDirs.has(name)) walk(full);
        continue;
      }
      if (filter && !filter(full)) continue;
      const ext = path.extname(name);
      if (extensions === null || extensions.length === 0 || extensions.includes(ext)) acc.push(full);
    }
  }

  walk(root);
  return acc;
}

/**
 * Collect files under root matching a basename predicate.
 * @param {string} root
 * @param {(fullPath: string, baseName: string) => boolean} matchBasename
 * @param {string[]} [skipDirs]
 */
export function walkMatchingBasename(root, matchBasename, skipDirs = DEFAULT_MONOREPO_SKIP_DIRS) {
  return walkFiles(root, {
    extensions: null,
    skipDirs,
    filter: (full) => matchBasename(full, path.basename(full)),
  });
}
