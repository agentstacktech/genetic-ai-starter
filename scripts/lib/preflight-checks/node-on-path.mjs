import { resolveNodeExecutable } from '../find-node.mjs';
import { INSTALL_ERRORS } from '../install-errors.mjs';

export function checkNodeOnPath() {
  const node = resolveNodeExecutable({ preferExecPath: false });
  return {
    id: 'node.onPath',
    pass: Boolean(node),
    severity: 'error',
    hint: node ? node : INSTALL_ERRORS.E_NODE_MISSING.repair,
  };
}
