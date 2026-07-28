import { checkNodeMin } from '../check-node.mjs';
import { INSTALL_ERRORS } from '../install-errors.mjs';

/**
 * @param {{ minMajor?: number }} [ctx]
 */
export function checkNodeVersion(ctx = {}) {
  const minMajor = ctx.minMajor ?? 18;
  try {
    const { version } = checkNodeMin(minMajor);
    return {
      id: 'node.version',
      pass: true,
      severity: 'error',
      hint: `Node ${version}`,
    };
  } catch (e) {
    return {
      id: 'node.version',
      pass: false,
      severity: 'error',
      hint: INSTALL_ERRORS.E_NODE_VERSION.repair,
      error: e.message,
    };
  }
}
