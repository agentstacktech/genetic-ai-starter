#!/usr/bin/env node
/**
 * CMD wrapper entry: maps env vars → install.mjs (C1).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cmdEnvToInstallArgs } from './lib/launcher/argv-mapper.mjs';
import { spawnNodeScript } from './lib/launcher/node-launcher.mjs';
import { assertNodeMin } from './lib/check-node.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  let target = process.env.TARGET || '.';
  const extra = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--target' && argv[i + 1]) target = argv[++i];
    else extra.push(argv[i]);
  }
  return { target, extra };
}

const { target, extra } = parseArgs(process.argv);
assertNodeMin(18);

const installScript = path.join(__dirname, 'install.mjs');
const args = cmdEnvToInstallArgs(process.env, { target, extraArgs: extra });
const r = spawnNodeScript(installScript, args, { stdio: 'inherit' });
process.exit(r.status ?? 1);
