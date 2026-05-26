#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mergeRegionsFromKit, replaceRegion } from '../scripts/lib/merge-markdown-regions.mjs';

const begin = '<!-- genetic-ai-map:tier0:begin -->';
const end = '<!-- genetic-ai-map:tier0:end -->';

const existing = `# Map\n\n${begin}\n| old |\n${end}\n`;
const kit = `# Map\n\n${begin}\n| new |\n${end}\n`;
const { content, merged } = mergeRegionsFromKit(existing, kit, [
  { file: 'x', id: 'tier0', beginMarker: begin, endMarker: end, owner: 'kit' },
]);
assert.ok(content.includes('| new |'));
assert.ok(!content.includes('| old |'));
assert.ok(merged.length > 0);
console.log('merge-regions.test.mjs OK');
