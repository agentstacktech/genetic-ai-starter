#!/usr/bin/env node
/**
 * Paired RU/EN docs: mirror exists, header cross-link, rough section count.
 * Exact H2 title match is NOT required (different languages).
 */
import fs from 'node:fs';
import path from 'node:path';
import { KIT_ROOT } from './lib/paths.mjs';
import { MAINTAINERS_DOCS } from './lib/maintainers-docs-path.mjs';

const MANIFEST = path.join(MAINTAINERS_DOCS, 'i18n-manifest.json');

const SKIP_H2 = new Set(['Genes', 'Philosophy']);
/** Max |#H2_a - #H2_b| for full pairs (not stub/summary). */
const H2_COUNT_TOLERANCE = 8;

function h2Count(text) {
  return [...text.matchAll(/^## (.+)$/gm)]
    .map((m) => m[1].trim())
    .filter((h) => !SKIP_H2.has(h)).length;
}

function hasCrossLink(text) {
  return /\*\*RU:\*\*|\*\*EN:\*\*|\*\*English|\*\*Русский/i.test(text.slice(0, 1200));
}

function main() {
  const errors = [];
  if (!fs.existsSync(MANIFEST)) {
    errors.push('Missing i18n-manifest.json — run generate-i18n-manifest.mjs');
  } else {
    const { entries } = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
    const paired = entries.filter((e) => e.mirror && e.pairRole !== 'single');

    for (const e of paired) {
      const mirrorPath = path.join(KIT_ROOT, e.mirror);
      if (!fs.existsSync(mirrorPath)) {
        errors.push(`Missing mirror: ${e.mirror} for ${e.path}`);
        continue;
      }
      const a = fs.readFileSync(path.join(KIT_ROOT, e.path), 'utf8');
      const b = fs.readFileSync(mirrorPath, 'utf8');
      if (!hasCrossLink(a) && !hasCrossLink(b)) {
        errors.push(`${e.path}: missing **RU:**/**EN:** (or English/Русский) cross-link near top`);
      }
      if (e.pairRole === 'pair-stub') {
        continue;
      }
      const ca = h2Count(a);
      const cb = h2Count(b);
      if (Math.abs(ca - cb) > H2_COUNT_TOLERANCE) {
        errors.push(
          `${e.path} vs ${e.mirror}: H2 count ${ca} vs ${cb} (tolerance ${H2_COUNT_TOLERANCE})`,
        );
      }
    }

    for (const rel of ['README.md', 'README.en.md']) {
      const p = path.join(KIT_ROOT, rel);
      if (!fs.existsSync(p)) continue;
      const text = fs.readFileSync(p, 'utf8').slice(0, 800);
      if (!/README\.en\.md|README\.md|English|Русский/i.test(text)) {
        errors.push(`${rel}: missing README language cross-link`);
      }
    }
  }

  if (errors.length) {
    console.error('check-i18n-parity FAILED:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('OK: check-i18n-parity');
}

main();
