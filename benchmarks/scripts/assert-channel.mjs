#!/usr/bin/env node
/**
 * Assert channel correctness in scored transcripts or source snippets.
 * Gene: repo.tooling.genetic_starter.benchmark.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(__dirname, '..');

const GOOD_CHANNEL = [
  /\bMCP\b/i,
  /agentstack\.execute/i,
  /POST\s+\/mcp/i,
  /sdk\.protocol/i,
  /sdk\.platform/i,
  /8DNA/i,
];
const BAD_CHANNEL = [
  /fetch\s*\(\s*['"]https?:\/\/[^'"]+\/api\/(?!mcp)/i,
  /sdk\.admin\b/i,
  /adminData/i,
  /\/api\/admin\//i,
  /undocumented REST/i,
];

function parseArgs(argv) {
  let file = null;
  let strict = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--file') file = argv[++i];
    else if (argv[i] === '--strict') strict = true;
    else if (argv[i] === '--help') {
      console.log('Usage: node assert-channel.mjs --file <transcript.txt> [--strict]');
      process.exit(0);
    }
  }
  if (!file) {
    console.error('--file required');
    process.exit(1);
  }
  return { file: path.resolve(file), strict };
}

function analyze(text) {
  const good = GOOD_CHANNEL.some((re) => re.test(text));
  const bad = BAD_CHANNEL.filter((re) => re.test(text));
  return { good, bad: bad.map(String) };
}

function main() {
  const { file, strict } = parseArgs(process.argv);
  const text = fs.readFileSync(file, 'utf8');
  const { good, bad } = analyze(text);
  const errors = [];
  if (bad.length) errors.push(`forbidden channel patterns: ${bad.join(', ')}`);
  if (strict && !good) errors.push('no recognized AgentStack channel (MCP/sdk.protocol/sdk.platform/8DNA)');
  if (errors.length) {
    console.error('assert-channel FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('assert-channel OK');
}

main();
