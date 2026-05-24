#!/usr/bin/env node
/**
 * Indexed arm T05 must score maintenance like kit_standard (map + index anchors).
 */
import assert from 'node:assert/strict';
import { scoreTask } from '../scripts/score-transcript.mjs';

const t05 = {
  id: 'T05',
  gold: { expectMaintenance: true, maintenanceKeywords: ['AI_NAVIGATION_MAP'] },
  rubric: {
    outcome: { weight: 4 },
    navigation_path: { weight: 2 },
    scope_discipline: { weight: 2 },
    efficiency: { weight: 2 },
  },
};

const indexedT05 = `New modules under src/billing/: update Tier 1 row in AI_NAVIGATION_MAP.md and extend src/billing/AI_INDEX.md hot files.`;

const r = scoreTask(t05, indexedT05, null);
assert.equal(r.scores.outcome, 4, 'indexed T05 maintenance outcome');
assert.ok(r.total >= 6, `indexed T05 total >= 6, got ${r.total}`);

console.log('OK: indexed-maintenance');
