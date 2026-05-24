#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  scoreTask,
  matchesPositive,
  countMaintenancePositive,
} from '../scripts/score-transcript.mjs';

const maintenanceTask = {
  id: 'T05',
  gold: {
    expectMaintenance: true,
    maintenanceKeywords: ['AI_INDEX', 'AI_NAVIGATION_MAP', 'Tier 1'],
  },
  rubric: {
    outcome: { weight: 4 },
    navigation_path: { weight: 2 },
    scope_discipline: { weight: 2 },
    efficiency: { weight: 2 },
  },
};

const negated = scoreTask(
  maintenanceTask,
  'Recommend documenting billing in AGENTS.md; no AI_INDEX.md suggestion.',
  null,
);
assert.equal(negated.scores.outcome, 0, 'negated AI_INDEX must not pass maintenance');

const positive = scoreTask(
  maintenanceTask,
  'Add src/billing/AI_INDEX.md and Tier 1 row in AI_NAVIGATION_MAP.md.',
  null,
);
assert.equal(positive.scores.outcome, 4, 'two anchors must pass maintenance');

assert.equal(matchesPositive('no AI_INDEX', 'AI_INDEX'), false);
assert.equal(matchesPositive('AI_INDEX.md for billing', 'AI_INDEX'), true);

console.log('OK: score-negation');
