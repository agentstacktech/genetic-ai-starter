#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  computeContextTokens,
  compareTokenPaths,
  getFixtureStats,
  unscopedGrepPool,
  GREP_UNSCOPED_POOL_LEGACY,
} from '../scripts/lib/token-model.mjs';

const stats = getFixtureStats();
assert.ok(stats.fileCount <= 40, 'shop-api fixture should be small');
const pool = unscopedGrepPool();
assert.ok(
  pool < GREP_UNSCOPED_POOL_LEGACY / 2,
  `calibrated pool ${pool} should be much less than legacy 14k`,
);
assert.ok(pool >= 900 && pool <= 2500, `pool ${pool} in sane range for ~6KB fixture`);

const bareT02 = `rg verifyJwt src — repo-wide.
Read src/auth/jwt.ts then src/auth/sessionMiddleware.ts.`;

const kitT02 = `AI_NAVIGATION_MAP → shop.auth.gen1. Read src/auth/sessionMiddleware.ts.`;

const indexedT02 = `Read src/auth/AI_INDEX.md hot files → src/auth/sessionMiddleware.ts.`;

const bare = computeContextTokens(bareT02);
const kit = computeContextTokens(kitT02);
const indexed = computeContextTokens(indexedT02);

assert.ok(bare.breakdown.grepsUnscoped === pool, 'one rg line = one calibrated pool');
assert.ok(bare.total < 4000, `bare T02 should be <4k, got ${bare.total}`);
assert.ok(kit.total < bare.total, `kit (${kit.total}) < bare (${bare.total})`);
assert.ok(
  indexed.total <= kit.total + 400,
  `indexed (${indexed.total}) near kit (${kit.total})`,
);

const bareT08 = `rg active src — unscoped
Read src/catalog/listFilter.ts.`;
const idxT08 = `src/catalog/AI_INDEX.md → src/catalog/listFilter.ts immediately.`;
const t8 = compareTokenPaths(bareT08, idxT08);
assert.ok(t8.saved > 0, 'indexed T08 saves vs bare grep');
const ratio = bare.total / indexed.total;
assert.ok(ratio < 6, `bare/idx ratio on T02 should be modest, got ${ratio.toFixed(1)}`);

console.log('OK: token-model', { pool, bareT02: bare.total, indexedT02: indexed.total });
