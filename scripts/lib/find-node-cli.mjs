#!/usr/bin/env node
/**
 * Print resolved node.exe path for CMD wrappers (stdout only, exit 0/2).
 */
import { resolveNodeExecutable } from './find-node.mjs';

const node = resolveNodeExecutable({ preferExecPath: false });
if (!node) {
  process.stderr.write('E_NODE_MISSING\n');
  process.exit(2);
}
process.stdout.write(node);
