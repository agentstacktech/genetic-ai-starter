#!/usr/bin/env node
/**
 * Typecheck AgentStack recipe templates (kit source tree).
 * Requires monorepo SDK file: link or prior npm install in recipes/.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RECIPES = path.join(KIT_ROOT, 'extensions/agentstack/recipes');
const SDK_CORE = path.resolve(KIT_ROOT, '../agentstack-unified-sdk/packages/core');

function run(cmd, args, cwd) {
  const exe = process.platform === 'win32' && cmd === 'npm' ? 'npm.cmd' : cmd;
  return spawnSync(exe, args, { cwd, encoding: 'utf8' });
}

if (!fs.existsSync(path.join(RECIPES, 'package.json'))) {
  console.error('FAIL: recipes package.json missing');
  process.exit(1);
}

if (!fs.existsSync(SDK_CORE)) {
  console.error('SKIP recipe-typecheck: agentstack-unified-sdk not at', SDK_CORE);
  process.exit(0);
}

if (!fs.existsSync(path.join(RECIPES, 'node_modules', '@agentstack', 'sdk'))) {
  const install = run('npm', ['install', '--no-fund', '--no-audit'], RECIPES);
  if (install.status !== 0) {
    console.error(install.stderr || install.stdout);
    process.exit(1);
  }
}

const typecheck = run('npm', ['run', 'typecheck'], RECIPES);
if (typecheck.status !== 0) {
  console.error(typecheck.stderr || typecheck.stdout);
  process.exit(1);
}

console.log('recipe-typecheck.test.mjs OK');
