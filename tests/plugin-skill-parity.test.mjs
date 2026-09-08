#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  CURSOR_SKILLS_ROOT,
  CLAUDE_SKILLS_ROOT,
  expectedMirroredSkillCount,
  listMissingMirroredSkills,
  listSkillDirs,
} from '../../provided_plugins/scripts/lib/plugin-skill-parity.mjs';

const expected = expectedMirroredSkillCount();
assert.ok(expected >= 20, `expected mirrored skills ${expected}`);
assert.equal(listMissingMirroredSkills(CLAUDE_SKILLS_ROOT).length, 0, 'claude missing skills');
assert.equal(listSkillDirs(CURSOR_SKILLS_ROOT).length, expected + 2, 'cursor includes SKIP pair');

console.log(`plugin-skill-parity.test.mjs OK (${expected} mirrored skills)`);
