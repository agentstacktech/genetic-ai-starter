#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadNavigationContract } from './lib/tenant-protected-files.mjs';
import { PAYLOAD_ROOT } from './lib/paths.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function main() {
  const contract = loadNavigationContract();
  const errors = [];

  for (const region of contract.regions || []) {
    if (!region.endMarker) continue;
    const fp = path.join(PAYLOAD_ROOT, region.file);
    if (!fs.existsSync(fp)) {
      errors.push(`payload missing file for region: ${region.file}`);
      continue;
    }
    const content = fs.readFileSync(fp, 'utf8');
    if (!content.includes(region.beginMarker)) {
      errors.push(`missing begin marker ${region.beginMarker} in payload/${region.file}`);
    }
    if (!content.includes(region.endMarker)) {
      errors.push(`missing end marker ${region.endMarker} in payload/${region.file}`);
    }
  }

  const manifestPath = path.join(KIT_ROOT, 'KIT_MANIFEST.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!manifest.files.includes('contracts/NAVIGATION_CONTRACT.v1.json')) {
    errors.push('KIT_MANIFEST.json must list contracts/NAVIGATION_CONTRACT.v1.json');
  }

  if (errors.length) {
    console.error('audit-navigation-contract FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('audit-navigation-contract OK');
}

main();
