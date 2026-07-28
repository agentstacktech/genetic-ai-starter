import { assertSafeInstallTarget } from '../guard-target.mjs';
import { INSTALL_ERRORS } from '../install-errors.mjs';

/**
 * @param {{ target?: string, kitRoot: string }} ctx
 */
export function checkGuardNotKit(ctx) {
  const target = ctx.target || process.cwd();
  try {
    assertSafeInstallTarget(target, ctx.kitRoot);
    return {
      id: 'guard.notKit',
      pass: true,
      severity: 'error',
      hint: 'target is outside kit tree',
    };
  } catch (e) {
    const code = e.code || 'E_TARGET_IS_KIT';
    return {
      id: 'guard.notKit',
      pass: false,
      severity: 'error',
      hint: INSTALL_ERRORS[code]?.repair || e.repair || e.message,
      error: code,
    };
  }
}
