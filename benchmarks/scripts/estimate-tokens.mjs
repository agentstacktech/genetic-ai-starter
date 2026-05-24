#!/usr/bin/env node
/**
 * Rough token estimate from a transcript (heuristic, not tokenizer-accurate).
 */
import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  let transcript = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--transcript') transcript = argv[++i];
    else if (argv[i] === '--help') {
      console.log('Usage: node estimate-tokens.mjs --transcript <file>');
      process.exit(0);
    }
  }
  if (!transcript) {
    console.error('Required: --transcript');
    process.exit(1);
  }
  return { transcript };
}

function estimate(text) {
  const unscoped = (text.match(/\brg\b|\bgrep\b/gi) || []).length;
  const mapGenetic = /AI_NAVIGATION_MAP|GENE_COMPRESSION_MAP|AI_INDEX\.md/i.test(text);
  const tools = (text.match(/"tool"|tool_call|grep|read_file|Read |Grep /gi) || []).length;
  const breakdown = {
    unscopedGrepHits: unscoped,
    unscopedTokens: unscoped * 8000,
    mapTokens: mapGenetic ? 2000 : 0,
    toolRoundTokens: tools * 4000,
  };
  breakdown.total =
    breakdown.unscopedTokens + breakdown.mapTokens + breakdown.toolRoundTokens;
  return breakdown;
}

function main() {
  const { transcript } = parseArgs(process.argv);
  const text = fs.readFileSync(path.resolve(transcript), 'utf8');
  const result = { transcript: path.basename(transcript), ...estimate(text) };
  console.log(JSON.stringify(result, null, 2));
}

main();
