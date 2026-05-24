#!/usr/bin/env node
import assert from 'node:assert/strict';
import { assertKitRepoUrlAllowed } from '../scripts/lib/git-submodule.mjs';

assert.equal(
  assertKitRepoUrlAllowed('https://github.com/agentstacktech/genetic-ai-starter.git'),
  true,
);
assert.equal(assertKitRepoUrlAllowed('https://github.com/evil/fork.git'), false);

process.env.GENETIC_AI_KIT_URL_ALLOWLIST_EXTRA = 'github.com/myorg';
assert.equal(assertKitRepoUrlAllowed('https://github.com/myorg/genetic-ai-starter.git'), true);
delete process.env.GENETIC_AI_KIT_URL_ALLOWLIST_EXTRA;

console.log('url-allowlist.test.mjs OK');
