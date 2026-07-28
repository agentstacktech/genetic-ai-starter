#!/usr/bin/env node
import { spawnKitBin } from './lib/spawn-kit-bin.mjs';

const result = spawnKitBin('scripts/preflight.mjs', process.argv.slice(2));
process.exit(result.status ?? 1);
