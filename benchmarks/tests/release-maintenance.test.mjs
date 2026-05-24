#!/usr/bin/env node
import assert from 'node:assert/strict';
import { scoreTask } from '../scripts/score-transcript.mjs';

const t13 = {
  id: 'T13',
  gold: {
    expectMaintenance: true,
    maintenanceKeywords: ['AI_NAVIGATION_MAP', 'AI_INDEX', 'Tier 1', 'doctor', 'validate'],
  },
  rubric: {
    navigation_path: { weight: 2 },
    scope_discipline: { weight: 2 },
    outcome: { weight: 4 },
    efficiency: { weight: 2 },
  },
};

const good = `Tier 1 row src/integrations/ in AI_NAVIGATION_MAP.md, src/integrations/AI_INDEX.md, run doctor and validate-kit before release.`;
const weak = `Update README with integrations folder.`;

const g = scoreTask(t13, good);
const w = scoreTask(t13, weak);

assert.equal(g.total, 10, 'T13 release gate should score 10');
assert.ok(w.total < 6, 'README-only T13 should fail');

console.log('OK: release-maintenance');
