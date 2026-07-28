import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from '../paths.mjs';
import { INSTALL_ERRORS } from '../install-errors.mjs';

/**
 * @param {{ kitRoot?: string }} ctx
 */
export function checkKitRoot(ctx = {}) {
  const kitRoot = path.resolve(ctx.kitRoot || KIT_ROOT);
  const installMjs = path.join(kitRoot, 'scripts', 'install.mjs');
  const pass = fs.existsSync(installMjs);
  return {
    id: 'kit.root',
    pass,
    severity: 'error',
    hint: pass ? kitRoot : INSTALL_ERRORS.E_KIT_NOT_FOUND.repair,
  };
}
