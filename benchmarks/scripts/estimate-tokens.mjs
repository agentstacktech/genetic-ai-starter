#!/usr/bin/env node
/**
 * Step-based token estimate from a transcript (fixture-sized reads + grep pools).
 */
import fs from 'node:fs';
import path from 'node:path';
import { computeContextTokens } from './lib/token-model.mjs';

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

function main() {
  const { transcript } = parseArgs(process.argv);
  const text = fs.readFileSync(path.resolve(transcript), 'utf8');
  const { breakdown, total, steps } = computeContextTokens(text);
  const result = {
    transcript: path.basename(transcript),
    breakdown,
    total,
    stepCount: steps.length,
  };
  console.log(JSON.stringify(result, null, 2));
}

main();
