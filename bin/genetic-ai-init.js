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

const result = spawnSync(process.execPath, [initScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: kitRoot,
});
process.exit(result.status ?? 1);
