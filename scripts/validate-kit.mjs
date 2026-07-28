#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT, PAYLOAD_ROOT, EXTENSIONS_DIR } from './lib/paths.mjs';
import { findBrokenMarkdownLinks } from './lib/resolve-markdown-links.mjs';
import { findUnresolved } from './lib/substitute-placeholders.mjs';
import { resolveProfileFiles, loadProfile } from './lib/profile-include.mjs';
import { SKIP_COPY_TO_TARGET } from './lib/copy-payload.mjs';
import { assertKitManifestMatchesPlatform } from './lib/platform-version.mjs';
import { validateAllGenes } from './validate-genes.mjs';
import { listProfileIds } from './lib/read-profiles.mjs';
import { PROFILES_DIR } from './lib/paths.mjs';

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

  const geneResult = validateAllGenes();
  for (const e of geneResult.errors) errors.push(`Gene: ${e}`);
  for (const w of geneResult.warnings) console.warn(`validate-genes WARN: ${w}`);

  const profileIds = listProfileIds();
  const manifestPath = path.join(PROFILES_DIR, 'manifest.json');
  const generated = { profiles: profileIds, generatedAt: new Date().toISOString() };
  fs.writeFileSync(manifestPath, JSON.stringify(generated, null, 2) + '\n', 'utf8');
  if (manifest.profiles.length !== profileIds.length) {
    errors.push('KIT_MANIFEST profiles mismatch profiles/*.json');
  }
  for (const id of profileIds) {
    if (!manifest.profiles.includes(id)) {
      errors.push(`Profile ${id} missing from KIT_MANIFEST.json`);
    }
  }

  const contractPath = path.join(KIT_ROOT, 'contracts/INSTALL_CONTRACT.v1.json');
  if (!fs.existsSync(contractPath)) {
    errors.push('Missing contracts/INSTALL_CONTRACT.v1.json');
  } else {
    const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    for (const [name, spec] of Object.entries(contract.scripts || {})) {
      const rel = spec.path;
      if (!rel || !fs.existsSync(path.join(KIT_ROOT, rel))) {
        errors.push(`INSTALL_CONTRACT script missing on disk: ${name} → ${rel}`);
      }
    }
    const winPrimary = contract.launchers?.windows?.primary;
    if (winPrimary && !fs.existsSync(path.join(KIT_ROOT, winPrimary))) {
      errors.push(`INSTALL_CONTRACT windows.primary missing: ${winPrimary}`);
    }
  }

  if (errors.length) {
    console.error('validate-kit FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log(`validate-kit OK (${manifest.files.length} files, ${manifest.profiles.length} profiles)`);
}

main();
