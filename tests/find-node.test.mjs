#!/usr/bin/env node
import assert from 'node:assert/strict';
import { resolveNodeExecutable } from '../scripts/lib/find-node.mjs';
import { readNodeVersion } from '../scripts/lib/check-node.mjs';

const node = resolveNodeExecutable({ preferExecPath: true });
assert.ok(node, 'node executable');
const { major } = readNodeVersion();
assert.ok(major >= 18, `node major ${major}`);

console.log('OK: find-node.test.mjs');
