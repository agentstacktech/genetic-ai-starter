import path from 'node:path';
import { parseGitmodules, submodulePathExists } from '../git-submodule.mjs';
import { FALLBACK_KIT_PATHS } from '../kit-integration-constants.mjs';

/**
 * @param {string} targetRoot
 * @param {{ lock?: object }} ctx
 */
export function resolveFromSubmodule(targetRoot, ctx) {
  const warnings = [];
  const src = ctx.lock?.kitSource;
  if (src?.path && submodulePathExists(targetRoot, src.path)) {
    return {
      root: path.resolve(targetRoot, src.path),
      source: 'lock.kitSource',
      warnings,
    };
  }

  for (const entry of parseGitmodules(targetRoot)) {
    if (entry.path && submodulePathExists(targetRoot, entry.path)) {
      return {
        root: path.resolve(targetRoot, entry.path),
        source: 'gitmodules',
        warnings,
      };
    }
  }

  for (const rel of FALLBACK_KIT_PATHS) {
    if (submodulePathExists(targetRoot, rel)) {
      warnings.push(`using fallback path ${rel}`);
      return {
        root: path.resolve(targetRoot, rel),
        source: 'fallback.path',
        warnings,
      };
    }
  }

  return null;
}
