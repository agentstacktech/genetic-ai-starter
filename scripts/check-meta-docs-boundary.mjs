#!/usr/bin/env node
/**
 * Fail if operator-only markdown lands in meta/docs/ (public mirror surface).
 * Maintainer docs belong in docs/genetic-ai-starter-maintainers/ (monorepo), not meta/docs/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(KIT_ROOT, 'meta/docs');

/** Basenames that must not appear under meta/docs/ */
const OPERATOR_ONLY = new Set([
  'PUBLISHING.md',
  'GAP_REGISTER.md',
  'RELEASE_RUNBOOK.md',
  'PREFLIGHT_CHECKLIST.md',
  'MIRROR_SYNC.md',
  'LAUNCH_CHECKLIST.md',
  'POSTLAUNCH_ROADMAP.md',
  'COMMS_TEMPLATES.md',
  'BOOTSTRAP_CHECKLIST.md',
  'AUDIT_PLAN.md',
  'DOC_WAVE_V3_RUNBOOK.md',
  'I18N_DOC_MATRIX.md',
  'I18N_DOC_REGISTRY.md',
  'I18N_GLOSSARY_TERMS.md',
  'DOC_STYLE_GUIDE.md',
  'README_STRUCTURE.md',
  'EASTER_EGGS.md',
  'ACCEPTANCE.md',
  'GOOD_FIRST_ISSUES.md',
  'DISCUSSIONS_QUICKSTART.md',
  'MANUAL_TRACK.md',
]);

function main() {
  if (!fs.existsSync(DOCS)) {
    console.error('check-meta-docs-boundary: missing meta/docs/');
    process.exit(1);
  }

  const errors = [];
  for (const name of fs.readdirSync(DOCS)) {
    if (OPERATOR_ONLY.has(name)) {
      errors.push(`operator doc in meta/docs/: ${name} → move to docs/genetic-ai-starter-maintainers/`);
    }
  }

  const hub = path.join(DOCS, 'DOC_HUB.md');
  if (fs.existsSync(hub)) {
    const text = fs.readFileSync(hub, 'utf8');
    for (const op of OPERATOR_ONLY) {
      if (text.includes(`](${op})`) || text.includes(`](meta/docs/${op})`)) {
        errors.push(`DOC_HUB.md links to operator doc: ${op}`);
      }
    }
  }

  if (errors.length) {
    console.error('check-meta-docs-boundary FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('OK: check-meta-docs-boundary');
}

main();
