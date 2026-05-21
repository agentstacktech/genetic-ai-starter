#!/usr/bin/env node
/**
 * Sync genetic-ai-starter docs to AGENTSTACK_CORE_VERSION from shared/constants.py.
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersion, writePlatformVersionFile } from './lib/platform-version.mjs';

const version = readPlatformVersion();
writePlatformVersionFile(version);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name === 'node_modules' || name === 'fixtures') continue;
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(md|json|mdc)$/.test(name)) acc.push(full);
  }
  return acc;
}

const replacements = [
  [/\*\*Genetic AI Starter Kit\*\* \d+\.\d+\.\d+/g, `**Genetic AI Starter Kit** ${version}`],
  [/\*\*Kit:\*\* Genetic AI Starter \d+\.\d+\.\d+/g, `**Kit:** Genetic AI Starter ${version}`],
  [/\*\*Version:\*\* \d+\.\d+\.\d+ \(starter kit\)/g, `**Version:** ${version} (platform patch, \`AGENTSTACK_CORE_VERSION\`)`],
  [/"kitVersion":\s*"[^"]+"/g, `"kitVersion": "${version}"`],
  [/"requiresKit":\s*">=[^"]+"/g, `"requiresKit": ">=${version}"`],
  [/Version \*\*\d+\.\d+\.\d+\*\*/g, `Version **${version}**`],
  [/Genetic AI Starter Kit v\d+\.\d+\.\d+/g, `Genetic AI Starter Kit (${version})`],
  [/Living list after v\d+\.\d+\.\d+ audit/g, `Living list after platform ${version} audit`],
  [/## v\d+\.\d+\.\d+ — recommended next/g, `## Next platform patch — recommended`],
  [/## v\d+\.\d+\.\d+ \(current\)/g, `## Current (platform ${version})`],
];

const roots = [
  path.join(KIT_ROOT, 'payload'),
  path.join(KIT_ROOT, 'meta'),
  path.join(KIT_ROOT, 'extensions'),
  KIT_ROOT,
];

let n = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  const files = root === KIT_ROOT ? [path.join(KIT_ROOT, 'README.md'), path.join(KIT_ROOT, 'README.en.md'), path.join(KIT_ROOT, 'CHANGELOG.md'), path.join(KIT_ROOT, 'KIT_MANIFEST.json'), path.join(KIT_ROOT, 'package.json')] : walk(root);
  for (const file of files) {
    if (file.includes('sync-kit-version') || file.includes('platform-version')) continue;
    let c = fs.readFileSync(file, 'utf8');
    const before = c;
    for (const [re, rep] of replacements) c = c.replace(re, rep);
    if (c !== before) {
      fs.writeFileSync(file, c, 'utf8');
      n++;
    }
  }
}

const manifestPath = path.join(KIT_ROOT, 'KIT_MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(`sync-kit-version: AGENTSTACK_CORE_VERSION=${version}, updated ${n} file(s)`);
