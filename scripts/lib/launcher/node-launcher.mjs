import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { resolveNodeExecutable } from '../find-node.mjs';
import { InstallError } from '../install-errors.mjs';

/**
 * @param {string} scriptAbs
 * @param {string[]} args
 * @param {{ cwd?: string, stdio?: 'inherit' | 'pipe' }} [opts]
 */
export function spawnNodeScript(scriptAbs, args = [], opts = {}) {
  const node = resolveNodeExecutable({ preferExecPath: true });
  if (!node) {
    throw new InstallError('E_NODE_MISSING', { phase: 'launcher' });
  }
  return spawnSync(node, [scriptAbs, ...args], {
    cwd: opts.cwd,
    stdio: opts.stdio ?? 'inherit',
    encoding: opts.stdio === 'pipe' ? 'utf8' : undefined,
    shell: false,
  });
}

/**
 * @param {string} kitScriptsDir
 * @param {string} scriptName
 * @param {string[]} args
 * @param {{ cwd?: string }} [opts]
 */
export function spawnKitScript(kitScriptsDir, scriptName, args = [], opts = {}) {
  const script = path.join(kitScriptsDir, scriptName);
  return spawnNodeScript(script, args, { cwd: opts.cwd, stdio: 'inherit' });
}
