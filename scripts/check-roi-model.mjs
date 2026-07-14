#!/usr/bin/env node
/**
 * Verify README/VALUE ROI figures match roi-model.snapshot.json (within rounding).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNAP = path.join(KIT_ROOT, 'meta/docs/roi-model.snapshot.json');

/** @type {Record<string, { monthly: number, annual: number }>} */
const DOC_ROUNDED = {
  solo: { monthly: 340, annual: 4100 },
  small: { monthly: 1050, annual: 12600 },
  medium: { monthly: 2170, annual: 26000 },
  large: { monthly: 4080, annual: 49000 },
  agentstackIncremental: { monthly: 1400, annual: 17000 },
};

const FILES = [
  'meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md',
  'meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md',
  'README.md',
  'README.en.md',
];

function main() {
  if (!fs.existsSync(SNAP)) {
    console.error('Missing roi-model.snapshot.json — run: node scripts/calculate-roi.mjs --export');
    process.exit(1);
  }
  const snap = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  const errors = [];

  for (const [id, rounded] of Object.entries(DOC_ROUNDED)) {
    const tier = snap.tiers[id];
    if (!tier) {
      errors.push(`snapshot missing tier ${id}`);
      continue;
    }
    const monthlyDelta = Math.abs(tier.monthlyUsd - rounded.monthly);
    const annualDelta = Math.abs(tier.annualUsd - rounded.annual);
    if (monthlyDelta > 120) {
      errors.push(
        `${id}: snapshot monthly $${tier.monthlyUsd} vs doc rounded $${rounded.monthly} (delta ${monthlyDelta})`,
      );
    }
    if (annualDelta > 1500) {
      errors.push(
        `${id}: snapshot annual $${tier.annualUsd} vs doc rounded $${rounded.annual} (delta ${annualDelta})`,
      );
    }
  }

  for (const rel of FILES) {
    const text = fs.readFileSync(path.join(KIT_ROOT, rel), 'utf8');
    if (!text.includes('calculate-roi.mjs')) {
      errors.push(`${rel}: missing link to calculate-roi.mjs (ROI source of truth)`);
    }
  }

  if (errors.length) {
    console.error('check-roi-model FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('check-roi-model OK');
}

main();
