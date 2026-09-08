#!/usr/bin/env node
/**
 * Bump version strings in test fixtures to match platform (opt-in maintainer step).
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersion } from './lib/platform-version.mjs';
import { walkFiles } from './lib/walk-files.mjs';

const version = readPlatformVersion();
const fixturesRoot = path.join(KIT_ROOT, 'fixtures');

const replacements = [
  [/@agentstack\/sdk@\d+\.\d+\.\d+/g, `@agentstack/sdk@${version}`],
  [/"@agentstack\/sdk":\s*"\d+\.\d+\.\d+"/g, `"@agentstack/sdk": "${version}"`],
  [/\*\*Platform version:\*\* `[^`]+`/g, `**Platform version:** \`${version}\``],
  [/\*\*Platform:\*\* \d+\.\d+\.\d+/g, `**Platform:** ${version}`],
  [/platform \*\*`\d+\.\d+\.\d+`\*\*/g, `platform **\`${version}\`**`],
  [/"kitVersion":\s*"[^"]+"/g, `"kitVersion": "${version}"`],
  [/@agentstack\/genetic-ai-starter@\d+\.\d+\.\d+/g, `@agentstack/genetic-ai-starter@${version}`],
  [/--tag v\d+\.\d+\.\d+/g, `--tag v${version}`],
];

let n = 0;
for (const file of walkFiles(fixturesRoot, { extensions: ['.md', '.json'], skipDirs: ['node_modules'] })) {
  let c = fs.readFileSync(file, 'utf8');
  const before = c;
  for (const [re, rep] of replacements) c = c.replace(re, rep);
  if (c !== before) {
    fs.writeFileSync(file, c, 'utf8');
    n++;
  }
}

console.log(`sync-fixtures-version: ${version}, updated ${n} file(s)`);
