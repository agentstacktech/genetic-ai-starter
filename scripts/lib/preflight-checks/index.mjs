import { checkNodeVersion } from './node-version.mjs';
import { checkNodeOnPath } from './node-on-path.mjs';
import { checkKitRoot } from './kit-root.mjs';
import { checkPlatformVersion } from './platform-version.mjs';
import { checkTargetWritable, checkTargetPathWin, checkTargetSpaces, checkLockExisting } from './target-writable.mjs';
import { checkGuardNotKit } from './guard-not-kit.mjs';

/** @typedef {{ id: string, pass: boolean, severity: 'error'|'warn'|'info', hint: string, error?: string }} PreflightCheck */

/**
 * @param {{ quick?: boolean, target?: string, kitRoot: string }} ctx
 * @returns {PreflightCheck[]}
 */
export function runAllPreflightChecks(ctx) {
  const checks = [
    checkNodeOnPath(),
    checkNodeVersion(),
    checkKitRoot(ctx),
    checkPlatformVersion(ctx),
  ];

  if (!ctx.quick) {
    checks.push(
      checkTargetWritable(ctx),
      checkGuardNotKit(ctx),
      checkTargetPathWin(ctx),
      checkTargetSpaces(ctx),
      checkLockExisting(ctx),
    );
  }

  return checks;
}

/**
 * @param {PreflightCheck[]} checks
 */
export function preflightOk(checks) {
  return checks.every((c) => c.severity !== 'error' || c.pass);
}
