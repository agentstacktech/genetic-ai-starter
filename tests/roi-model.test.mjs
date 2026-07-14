#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFullRoiSnapshot } from '../scripts/lib/roi-model.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const exportSnap = spawnSync(process.execPath, [path.join(KIT_ROOT, 'scripts/calculate-roi.mjs'), '--export'], {
  encoding: 'utf8',
});
if (exportSnap.status !== 0) {
  console.error(exportSnap.stderr || exportSnap.stdout);
  process.exit(1);
}

const snap = computeFullRoiSnapshot();
if (snap.tiers.small.monthlyUsd < 1000 || snap.tiers.small.monthlyUsd > 1100) {
  console.error('FAIL: small tier monthly out of expected band', snap.tiers.small.monthlyUsd);
  process.exit(1);
}
if (snap.tiers.agentstackIncremental.monthlyUsd < 1350 || snap.tiers.agentstackIncremental.monthlyUsd > 1450) {
  console.error('FAIL: agentstack incremental out of band', snap.tiers.agentstackIncremental.monthlyUsd);
  process.exit(1);
}

const check = spawnSync(process.execPath, [path.join(KIT_ROOT, 'scripts/check-roi-model.mjs')], {
  encoding: 'utf8',
});
if (check.status !== 0) {
  console.error(check.stderr || check.stdout);
  process.exit(1);
}

console.log('roi-model.test.mjs OK');
