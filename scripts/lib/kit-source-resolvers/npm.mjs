import fs from 'node:fs';
import path from 'node:path';
import { NPM_KIT_REL } from '../kit-integration-constants.mjs';

/**
 * @param {string} targetRoot
 */
export function resolveFromNpm(targetRoot) {
  const candidate = path.join(targetRoot, NPM_KIT_REL);
  if (fs.existsSync(path.join(candidate, 'scripts', 'install.mjs'))) {
    return {
      root: candidate,
      source: 'npm',
      warnings: [],
    };
  }
  return null;
}
