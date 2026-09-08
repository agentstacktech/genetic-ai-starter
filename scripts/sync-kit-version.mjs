#!/usr/bin/env node
/**
 * Sync genetic-ai-starter docs to AGENTSTACK_CORE_VERSION from shared/constants.py.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersion, writePlatformVersionFile } from './lib/platform-version.mjs';
import { walkFiles } from './lib/walk-files.mjs';

const version = readPlatformVersion();
const includeFixtures = process.argv.includes('--include-fixtures');
writePlatformVersionFile(version);

const replacements = [
  [/\*\*Genetic AI Starter Kit\*\* \d+\.\d+\.\d+/g, `**Genetic AI Starter Kit** ${version}`],
  [/\*\*Kit:\*\* Genetic AI Starter \d+\.\d+\.\d+/g, `**Kit:** Genetic AI Starter ${version}`],
  [/\*\*Version:\*\* \d+\.\d+\.\d+ \(starter kit\)/g, `**Version:** ${version} (platform patch, \`AGENTSTACK_CORE_VERSION\`)`],
  [/"kitVersion":\s*"[^"]+"/g, `"kitVersion": "${version}"`],
  [/"requiresKit":\s*">=[^"]+"/g, `"requiresKit": ">=${version}"`],
  [/"platformVersion":\s*"\d+\.\d+\.\d+"/g, `"platformVersion": "${version}"`],
  [/"requiresPlatformVersion":\s*"[^"]+"/g, `"requiresPlatformVersion": "AGENTSTACK_CORE_VERSION"`],
  [/Version \*\*\d+\.\d+\.\d+\*\*/g, `Version **${version}**`],
  [/Genetic AI Starter Kit v\d+\.\d+\.\d+/g, `Genetic AI Starter Kit (${version})`],
  [/Living list after v\d+\.\d+\.\d+ audit/g, `Living list after platform ${version} audit`],
  [/## v\d+\.\d+\.\d+ — recommended next/g, `## Next platform patch — recommended`],
  [/## v\d+\.\d+\.\d+ \(current\)/g, `## Current (platform ${version})`],
  [/@agentstack\/sdk@\d+\.\d+\.\d+/g, `@agentstack/sdk@${version}`],
  [/--tag v\d+\.\d+\.\d+/g, `--tag v${version}`],
  [/\*\*Платформа:\*\* `\d+\.\d+\.\d+`/g, `**Платформа:** \`${version}\``],
  [/\*\*Platform:\*\* `\d+\.\d+\.\d+`/g, `**Platform:** \`${version}\``],
  [/\*\*Platform:\*\* \d+\.\d+\.\d+/g, `**Platform:** ${version}`],
  [/platform \*\*`\d+\.\d+\.\d+`\*\*/g, `platform **\`${version}\`**`],
  [/tracks platform `\d+\.\d+\.\d+`/g, `tracks platform \`${version}\``],
  [/`@agentstack\/sdk@\d+\.\d+\.\d+`/g, `\`@agentstack/sdk@${version}\``],
  [/"@agentstack\/sdk":\s*"\d+\.\d+\.\d+"/g, `"@agentstack/sdk": "${version}"`],
  [/\(platform \d+\.\d+\.\d+\)/g, `(platform ${version})`],
  [/\*\*Platform version:\*\* `\d+\.\d+\.\d+`/g, `**Platform version:** \`${version}\``],
  [/\(currently \*\*\d+\.\d+\.\d+\*\*\)/g, `(currently **${version}**)`],
  [/badge\/platform-\d+\.\d+\.\d+/g, `badge/platform-${version}`],
  [/genetic-ai-starter-v\d+\.\d+\.\d+/g, `genetic-ai-starter-v${version}`],
  [/@agentstack\/genetic-ai-starter@\d+\.\d+\.\d+/g, `@agentstack/genetic-ai-starter@${version}`],
  [/\(v0\.\d+\.\d+\)/g, `(v${version})`],
];

const SKIP_SUBSTR = [
  'sync-kit-version',
  'platform-version',
  `${path.sep}benchmarks${path.sep}results${path.sep}`,
  'baseline-metrics.snapshot.json',
  'CHANGELOG.md',
];

if (!includeFixtures) {
  SKIP_SUBSTR.push(`${path.sep}fixtures${path.sep}`);
}

const roots = [
  path.join(KIT_ROOT, 'payload'),
  path.join(KIT_ROOT, 'meta'),
  path.join(KIT_ROOT, 'extensions'),
  KIT_ROOT,
];

let n = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  const files =
    root === KIT_ROOT
      ? [
          path.join(KIT_ROOT, 'README.md'),
          path.join(KIT_ROOT, 'README.en.md'),
          path.join(KIT_ROOT, 'VERSION.md'),
          path.join(KIT_ROOT, 'KIT_MANIFEST.json'),
          path.join(KIT_ROOT, 'package.json'),
          path.join(KIT_ROOT, 'template-repo/README.md'),
          path.join(KIT_ROOT, 'actions/README.md'),
        ]
      : walkFiles(root, { skipDirs: includeFixtures ? ['node_modules'] : ['node_modules', 'fixtures'] });
  for (const file of files) {
    if (SKIP_SUBSTR.some((s) => file.includes(s))) continue;
    let c = fs.readFileSync(file, 'utf8');
    const before = c;
    for (const [re, rep] of replacements) c = c.replace(re, rep);
    if (c !== before) {
      fs.writeFileSync(file, c, 'utf8');
      n++;
    }
  }
}

const pkgPath = path.join(KIT_ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
pkg.description = pkg.description?.replace(/\(platform [^)]+\)/, `(platform ${version})`) ??
  `Navigation OS for AI agents (platform ${version})`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

const manifestPath = path.join(KIT_ROOT, 'KIT_MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

if (includeFixtures) {
  const r = spawnSync(process.execPath, [path.join(KIT_ROOT, 'scripts/sync-fixtures-version.mjs')], {
    cwd: KIT_ROOT,
    stdio: 'inherit',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log(`sync-kit-version: AGENTSTACK_CORE_VERSION=${version}, updated ${n} file(s)`);
