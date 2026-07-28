#!/usr/bin/env node
/**
 * CMD wrapper entry: repair via install.mjs --force-philosophy.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cmdEnvToRepairArgs } from './lib/launcher/argv-mapper.mjs';
import { spawnNodeScript } from './lib/launcher/node-launcher.mjs';
import { assertNodeMin } from './lib/check-node.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = process.env.TARGET || '.';
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target' && argv[i + 1]) target = argv[++i];
    else if (!argv[i].startsWith('--')) target = argv[i];
  }
  return { target };
}

const { target } = parseArgs(process.argv);
assertNodeMin(18);

process.env.REPAIR = '1';
const installScript = path.join(__dirname, 'install.mjs');
const args = cmdEnvToRepairArgs(process.env, target);
const r = spawnNodeScript(installScript, args, { stdio: 'inherit' });
process.exit(r.status ?? 1);
