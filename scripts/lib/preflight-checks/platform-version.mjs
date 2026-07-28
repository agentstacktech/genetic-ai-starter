import fs from 'node:fs';
import path from 'node:path';
import { readPlatformVersionForKitRoot } from '../read-platform-version-for-kit.mjs';
import { INSTALL_ERRORS } from '../install-errors.mjs';

/**
 * @param {{ kitRoot: string }} ctx
 */
export function checkPlatformVersion(ctx) {
  try {
    const v = readPlatformVersionForKitRoot(ctx.kitRoot);
    return {
      id: 'kit.platformVersion',
      pass: Boolean(v),
      severity: 'error',
      hint: `platform ${v}`,
    };
  } catch {
    return {
      id: 'kit.platformVersion',
      pass: false,
      severity: 'error',
      hint: INSTALL_ERRORS.E_PLATFORM_VERSION.repair,
    };
  }
}
