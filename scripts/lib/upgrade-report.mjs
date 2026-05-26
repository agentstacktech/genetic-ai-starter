import fs from 'node:fs';
import path from 'node:path';

export const UPGRADE_REPORT_REL = '.genetic-ai/last-upgrade-report.json';

/**
 * @param {object} data
 */
export function buildUpgradeReport(data) {
  return {
    reportSchemaVersion: 1,
    generatedAt: new Date().toISOString(),
    kitVersion: data.kitVersion,
    targetRoot: data.targetRoot,
    dryRun: !!data.dryRun,
    preserveNavigation: data.preserveNavigation !== false,
    forceNavigation: !!data.forceNavigation,
    written: data.written || [],
    merged: data.merged || [],
    skipped: data.skipped || [],
    warnings: data.warnings || [],
    conflicts: data.conflicts || [],
    validation: data.validation || { status: 'pending' },
    exitRecommendation: data.exitRecommendation ?? 0,
  };
}

export function writeUpgradeReport(targetRoot, report, { dryRun = false } = {}) {
  if (dryRun) return report;
  const dir = path.join(targetRoot, '.genetic-ai');
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(targetRoot, UPGRADE_REPORT_REL);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  return report;
}

export function readUpgradeReport(targetRoot) {
  const p = path.join(targetRoot, UPGRADE_REPORT_REL);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

export function printUpgradeReportHuman(report) {
  console.log('\n--- upgrade report ---');
  console.log(`dryRun=${report.dryRun} preserveNavigation=${report.preserveNavigation}`);
  if (report.written?.length) console.log('written:', report.written.join(', '));
  if (report.merged?.length) console.log('merged:', report.merged.join(', '));
  if (report.skipped?.length) console.log('skipped:', report.skipped.join(', '));
  if (report.warnings?.length) {
    console.log('warnings:');
    for (const w of report.warnings) console.log(`  - ${w}`);
  }
  if (report.conflicts?.length) {
    console.log('conflicts:');
    for (const c of report.conflicts) console.log(`  - ${c}`);
  }
  console.log(`validation=${report.validation?.status || 'unknown'}`);
  console.log('----------------------\n');
}
