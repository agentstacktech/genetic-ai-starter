import { spawnSync } from 'node:child_process';
import path from 'node:path';

/**
 * Run labeled shell/node steps (monorepo dx-plane, CI wrappers).
 * @param {Array<{ label: string, cmd: string, args?: string[], cwd?: string }>} steps
 * @param {{ root: string, defaultCwd?: string }} opts
 */
export function runLabeledSteps(steps, opts) {
  const { root, defaultCwd = '.' } = opts;

  for (const { label, cmd, args = [], cwd } of steps) {
    console.log(`\n=== ${label} ===`);
    const r = spawnSync(cmd, args, {
      cwd: path.resolve(root, cwd ?? defaultCwd),
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (r.status !== 0) {
      console.error(`FAILED: ${label}`);
      process.exit(r.status ?? 1);
    }
  }
}
