#!/usr/bin/env node
/**
 * Fail when kit version strings drift from AGENTSTACK_CORE_VERSION.
 * Gene: repo.tooling.genetic_starter.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KIT_ROOT } from './lib/paths.mjs';
import { readPlatformVersion } from './lib/platform-version.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readJson(rel) {
  const p = path.join(KIT_ROOT, rel);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const platform = readPlatformVersion();
  const errors = [];

  const manifest = readJson('KIT_MANIFEST.json');
  if (manifest.version !== platform) {
    errors.push(`KIT_MANIFEST.json version ${manifest.version} !== platform ${platform}`);
  }

  const pkg = readJson('package.json');
  if (pkg.version !== platform) {
    errors.push(`package.json version ${pkg.version} !== platform ${platform}`);
  }

  const platformFile = fs.readFileSync(path.join(KIT_ROOT, 'PLATFORM_VERSION'), 'utf8').trim();
  if (platformFile !== platform) {
    errors.push(`PLATFORM_VERSION ${platformFile} !== platform ${platform}`);
  }

  for (const rel of ['README.md', 'README.en.md', 'VERSION.md']) {
    const p = path.join(KIT_ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, 'utf8');
    const badge = text.match(/platform-(\d+\.\d+\.\d+)/i);
    if (badge && badge[1] !== platform) {
      errors.push(`${rel}: badge platform-${badge[1]} !== ${platform}`);
    }
    const stale = text.match(/currently \*\*(\d+\.\d+\.\d+)\*\*/i);
    if (stale && stale[1] !== platform && rel === 'VERSION.md') {
      errors.push(`${rel}: policy line ${stale[1]} !== ${platform}`);
    }
    const platformLine = text.match(/\*\*Platform version:\*\* `(\d+\.\d+\.\d+)`/);
    if (platformLine && platformLine[1] !== platform) {
      errors.push(`${rel}: Platform version line ${platformLine[1]} !== ${platform}`);
    }
  }

  if (errors.length) {
    console.error('check-version-parity FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`check-version-parity OK (${platform})`);
}

main();
