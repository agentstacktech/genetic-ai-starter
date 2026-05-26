#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT, PAYLOAD_ROOT, EXTENSIONS_DIR } from './lib/paths.mjs';
import { findBrokenMarkdownLinks } from './lib/resolve-markdown-links.mjs';
import { findUnresolved } from './lib/substitute-placeholders.mjs';
import { resolveProfileFiles, loadProfile } from './lib/profile-include.mjs';
import { SKIP_COPY_TO_TARGET } from './lib/copy-payload.mjs';
import { assertKitManifestMatchesPlatform } from './lib/platform-version.mjs';

const ALLOWED_PLACEHOLDERS = new Set([
  'PROJECT_NAME',
  'DOMAIN',
  'SUBSYSTEM',
  'DECISION_SLUG',
  'AGENTSTACK_VERSION',
]);

function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'KIT_MANIFEST.json'), 'utf8'));
  const errors = [];

  try {
    assertKitManifestMatchesPlatform();
  } catch (e) {
    errors.push(e.message);
  }

  for (const f of manifest.files) {
    const p = path.join(KIT_ROOT, f);
    if (!fs.existsSync(p)) errors.push(`Missing manifest file: ${f}`);
  }

  for (const skip of SKIP_COPY_TO_TARGET) {
    if (!manifest.files.includes(`payload/${skip}`)) {
      errors.push(`Manifest should list payload/${skip} (merge-only, not copied to target)`);
    }
  }

  const extManifest = path.join(EXTENSIONS_DIR, 'agentstack/extension.manifest.json');
  if (!fs.existsSync(extManifest)) errors.push('Missing extensions/agentstack/extension.manifest.json');
  else {
    const em = JSON.parse(fs.readFileSync(extManifest, 'utf8'));
    for (const ov of em.overlays || []) {
      const src = path.join(EXTENSIONS_DIR, 'agentstack', ov.from);
      if (!fs.existsSync(src)) errors.push(`Missing extension overlay: ${ov.from}`);
    }
    const nav = path.join(EXTENSIONS_DIR, 'agentstack/merge/navigation-map.append.md');
    if (!fs.readFileSync(nav, 'utf8').includes('genetic-ai-extension:agentstack-nav')) {
      errors.push('navigation-map.append.md missing idempotency marker');
    }
  }

  const textFiles = manifest.files.filter(
    (f) => f.startsWith('payload/') && (f.endsWith('.md') || f.endsWith('.mdc')),
  );
  const relPayload = textFiles.map((f) => f.replace(/^payload\//, ''));
  const broken = findBrokenMarkdownLinks(PAYLOAD_ROOT, relPayload);
  for (const b of broken) {
    errors.push(`Broken link in ${b.file}: ${b.target}`);
  }

  for (const f of relPayload) {
    const content = fs.readFileSync(path.join(PAYLOAD_ROOT, f), 'utf8');
    const bad = findUnresolved(content).filter((k) => !ALLOWED_PLACEHOLDERS.has(k));
    if (bad.length) errors.push(`Unexpected placeholders in payload/${f}: ${bad.join(', ')}`);
  }

  for (const id of manifest.profiles) {
    try {
      resolveProfileFiles(loadProfile(id));
    } catch (e) {
      errors.push(`Profile ${id}: ${e.message}`);
    }
  }

  if (errors.length) {
    console.error('validate-kit FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`validate-kit OK (${manifest.files.length} files, ${manifest.profiles.length} profiles)`);
}

main();
