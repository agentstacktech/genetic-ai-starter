#!/usr/bin/env node
/**
 * npm bin entry — forwards to scripts/init.mjs (install wizard).
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kitRoot = path.resolve(__dirname, '..');
const initScript = path.join(kitRoot, 'scripts', 'init.mjs');

const argv = process.argv.slice(2);
let layout = 'npm';
let target = process.cwd();
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--layout' && argv[i + 1]) {
    layout = argv[++i];
  } else if (argv[i] === '--target' && argv[i + 1]) {
    target = path.resolve(argv[++i]);
  }
}

const cwd = layout === 'submodule' ? target : kitRoot;

const result = spawnSync(process.execPath, [initScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd,
});
process.exit(result.status ?? 1);
