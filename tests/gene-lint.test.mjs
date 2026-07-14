#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGeneFile, validateAllGenes } from '../scripts/validate-genes.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const templateGene = path.join(
  KIT_ROOT,
  'payload/philosophy/genes/templates/subsystem.feature.gen1.md',
);

const one = validateGeneFile(templateGene);
assert.equal(one.errors.length, 0, `template gene should skip validation: ${one.errors.join(', ')}`);

const all = validateAllGenes();
const templateErrors = all.errors.filter((e) => e.startsWith('templates/'));
assert.equal(templateErrors.length, 0, `walk must skip templates/: ${templateErrors.join(', ')}`);

console.log('gene-lint.test.mjs OK');
