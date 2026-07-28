import fs from 'node:fs';
import path from 'node:path';
import { InstallError } from './install-errors.mjs';

/**
 * Test fixtures under kit/fixtures/ are allowed (dev test atlas).
 * @param {string} target
 * @param {string} kit
 */
function isKitFixtureTarget(target, kit) {
  const rel = path.relative(kit, target).replace(/\\/g, '/');
  return rel === 'fixtures' || rel.startsWith('fixtures/');
}

/**
 * @param {string} targetRoot
 * @param {string} kitRoot
 */
export function assertSafeInstallTarget(targetRoot, kitRoot) {
  const target = path.resolve(targetRoot);
  const kit = path.resolve(kitRoot);

  if (target === kit) {
    throw new InstallError('E_TARGET_IS_KIT', { phase: 'guard' });
  }

  const rel = path.relative(kit, target);
  if (rel && !rel.startsWith('..') && !path.isAbsolute(rel) && !isKitFixtureTarget(target, kit)) {
    throw new InstallError('E_TARGET_INSIDE_KIT', { phase: 'guard' });
  }

  if (fs.existsSync(path.join(target, 'KIT_MANIFEST.json'))) {
    const kitManifest = path.join(kit, 'KIT_MANIFEST.json');
    if (!fs.existsSync(kitManifest) || path.resolve(target) !== kit) {
      throw new InstallError('E_TARGET_LOOKS_LIKE_KIT', { phase: 'guard' });
    }
  }
}

/**
 * True when cwd is the kit vendor folder (wizard should not default to "here").
 * @param {string} [cwd]
 * @param {string} kitRoot
 */
export function isRunningFromKitRoot(cwd, kitRoot) {
  return path.resolve(cwd || process.cwd()) === path.resolve(kitRoot);
}
