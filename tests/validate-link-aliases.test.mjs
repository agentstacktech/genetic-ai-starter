#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  applyLinkAliasForResolve,
  shouldSkipLinkValidation,
  resolveLinkAlias,
} from '../scripts/lib/link-resolution-aliases.mjs';

// Kit mode (default): fragment stays fragment
assert.equal(resolveLinkAlias('../../.cursorrules.fragment.md'), null);
assert.equal(
  applyLinkAliasForResolve('../../.cursorrules.fragment.md'),
  '../../.cursorrules.fragment.md',
);

// Consumer mode: fragment → .cursorrules after install merge
assert.equal(
  applyLinkAliasForResolve('../../.cursorrules.fragment.md', { mode: 'consumer' }),
  '../../.cursorrules',
);

assert.equal(applyLinkAliasForResolve('other.md'), 'other.md');
assert.equal(shouldSkipLinkValidation('gene_document_resolver.py'), true);
assert.equal(shouldSkipLinkValidation('...'), true);
console.log('validate-link-aliases.test.mjs OK');
