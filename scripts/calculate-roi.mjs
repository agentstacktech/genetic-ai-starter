#!/usr/bin/env node
/**
 * Print ROI model breakdown (source of truth for VALUE_AND_ROI docs).
 * Gene: repo.tooling.genetic_starter.docs.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ROI_TIERS,
  computeFullRoiSnapshot,
  computeTierRoi,
} from './lib/roi-model.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const opts = { json: false, export: false, tier: null, rate: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--export') opts.export = true;
    else if (a === '--tier') opts.tier = argv[++i];
    else if (a === '--rate') opts.rate = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node calculate-roi.mjs [--json] [--export] [--tier solo|small|medium|large|agentstackIncremental] [--rate 85]

Exports meta/docs/roi-model.snapshot.json with --export.
Human worksheet printed by default.`);
      process.exit(0);
    }
  }
  return opts;
}

function formatWorksheet(tier, computed) {
  const lines = [
    `${tier.labelEn} (${tier.recommendedProfile})`,
    `  Incidents: ${tier.incidentsPerMonth}/mo × ${tier.hoursSavedPerIncident}h = ${computed.incidentHours.toFixed(2)}h`,
  ];
  if (tier.releaseGateHoursPerMonth) {
    lines.push(`  Release gate: ${tier.releaseGateHoursPerMonth}h/mo`);
  }
  if (tier.onboardingHoursPerQuarter) {
    lines.push(
      `  Onboarding: ${tier.onboardingHoursPerQuarter}h/quarter → ${computed.onboardingHoursMonthly.toFixed(2)}h/mo`,
    );
  }
  lines.push(
    `  Gross: ${computed.grossHours.toFixed(2)}h − maintenance ${computed.maintenanceHours}h = ${computed.netHours.toFixed(2)}h net`,
  );
  lines.push(
    `  → $${computed.monthlyUsd}/mo · $${computed.annualUsd}/yr @ $${computed.rateUsdPerHour}/h`,
  );
  if (tier.incremental) {
    lines.push(`  (incremental — add to base tier "${tier.stacksOn}")`);
  }
  return lines.join('\n');
}

function main() {
  const opts = parseArgs(process.argv);
  const modelOpts = opts.rate ? { rateUsdPerHour: opts.rate } : {};
  const snapshot = computeFullRoiSnapshot(modelOpts);

  if (opts.export) {
    const out = path.join(KIT_ROOT, 'meta/docs/roi-model.snapshot.json');
    fs.writeFileSync(out, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`wrote ${out}`);
    if (!opts.json) return;
  }

  if (opts.tier) {
    const tier = ROI_TIERS[opts.tier];
    if (!tier) {
      console.error(`Unknown tier: ${opts.tier}`);
      process.exit(1);
    }
    const computed = computeTierRoi(tier, modelOpts);
    if (opts.json) {
      console.log(JSON.stringify({ tier, computed }, null, 2));
      return;
    }
    console.log(formatWorksheet(tier, computed));
    return;
  }

  if (opts.json) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log('ROI model (modeled — see DOC_CLAIMS_AUDIT.md)\n');
  for (const tier of Object.values(ROI_TIERS)) {
    const c = snapshot.tiers[tier.id];
    console.log(formatWorksheet(tier, c));
    console.log('');
  }
  const tot = snapshot.tiers.agentstackTotalSmall;
  console.log(
    `AgentStack total (small + incremental): $${tot.monthlyUsd}/mo · $${tot.annualUsd}/yr`,
  );
}

main();
