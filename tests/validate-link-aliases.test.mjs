#!/usr/bin/env node
import assert from 'node:assert/strict';
import { applyLinkAliasForResolve, shouldSkipLinkValidation } from '../scripts/lib/link-resolution-aliases.mjs';

assert.equal(applyLinkAliasForResolve('../../.cursorrules.fragment.md'), '../../.cursorrules');
assert.equal(applyLinkAliasForResolve('other.md'), 'other.md');
assert.equal(shouldSkipLinkValidation('gene_document_resolver.py'), true);
console.log('validate-link-aliases.test.mjs OK');
