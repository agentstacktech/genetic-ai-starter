import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(__dirname, '..', '..');

/**
 * @param {string} scriptRel
 * @param {string[]} args
 */
export function spawnKitBin(scriptRel, args = []) {
  const script = path.join(kitRoot, scriptRel);
  return spawnSync(process.execPath, [script, ...args], {
    stdio: 'inherit',
    cwd: kitRoot,
  });
}
