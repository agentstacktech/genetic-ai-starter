import fs from 'node:fs';
import path from 'node:path';

function kitInstallExists(root) {
  return fs.existsSync(path.join(root, 'scripts', 'install.mjs'));
}

/**
 * Resolve explicit path-type kitSource or sibling path installs.
 * @param {string} targetRoot
 * @param {{ lock?: object }} ctx
 */
export function resolveFromPath(targetRoot, ctx) {
  const warnings = [];
  const src = ctx.lock?.kitSource;
  if (src?.type === 'path' && src.path) {
    const root = path.resolve(targetRoot, src.path);
    if (kitInstallExists(root)) {
      return { root, source: 'lock.kitSource.path', warnings };
    }
  }
  if (src?.type === 'monorepo' && src.path) {
    const root = path.resolve(targetRoot, src.path);
    if (kitInstallExists(root)) {
      return { root, source: 'lock.kitSource.monorepo', warnings };
    }
  }
  return null;
}
