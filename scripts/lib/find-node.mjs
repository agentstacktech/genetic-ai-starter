import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/**
 * Windows candidate paths when `node` is not on PATH (Explorer double-click).
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string[]}
 */
export function windowsNodeCandidates(env = process.env) {
  const list = [];
  if (env.NODE_PATH?.trim()) list.push(env.NODE_PATH.trim());
  const pf = env.ProgramFiles || 'C:\\Program Files';
  const local = env.LocalAppData || '';
  list.push(path.join(pf, 'nodejs', 'node.exe'));
  if (local) list.push(path.join(local, 'Programs', 'nodejs', 'node.exe'));
  const nvmHome = env.NVM_HOME || path.join(env.APPDATA || '', 'nvm');
  if (nvmHome) {
    list.push(path.join(nvmHome, 'nodejs.exe'));
    const current = path.join(nvmHome, 'current', 'node.exe');
    list.push(current);
  }
  return [...new Set(list)];
}

/**
 * @returns {string | null}
 */
function findOnPath() {
  if (process.platform === 'win32') {
    const r = spawnSync('where.exe', ['node'], { encoding: 'utf8' });
    if (r.status !== 0 || !r.stdout?.trim()) return null;
    const first = r.stdout.trim().split(/\r?\n/)[0]?.trim();
    return first && fs.existsSync(first) ? first : null;
  }
  const r = spawnSync('which', ['node'], { encoding: 'utf8' });
  if (r.status !== 0 || !r.stdout?.trim()) return null;
  const first = r.stdout.trim().split(/\r?\n/)[0]?.trim();
  return first && fs.existsSync(first) ? first : null;
}

/**
 * Resolve node.exe for launchers (SETUP.cmd, .cmd shims).
 * @param {{ preferExecPath?: boolean }} [opts]
 * @returns {string | null}
 */
export function resolveNodeExecutable(opts = {}) {
  if (opts.preferExecPath !== false && process.execPath) {
    const base = path.basename(process.execPath).toLowerCase();
    if (base === 'node.exe' || base === 'node') {
      return process.execPath;
    }
  }

  const onPath = findOnPath();
  if (onPath) return onPath;

  if (process.platform === 'win32') {
    for (const candidate of windowsNodeCandidates()) {
      if (candidate && fs.existsSync(candidate)) return candidate;
    }
  }

  return null;
}
