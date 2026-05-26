#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { buildKitSourceRecord } from '../scripts/lib/record-kit-source.mjs';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(KIT_ROOT, '..');
const externalKit = path.resolve(target, '..', '_external-kit-test');

const rec = buildKitSourceRecord(target, externalKit);
assert.equal(rec.kitSource.type, 'ephemeral');
assert.equal(rec.kitRootRel, undefined);

console.log('ephemeral-lock.test.mjs OK');
