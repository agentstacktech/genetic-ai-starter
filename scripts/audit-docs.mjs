#!/usr/bin/env node
/**
 * Doc/metrics audit orchestrator (replaces long package.json chain).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOC_AUDIT_STEPS } from './lib/doc-audit-steps.mjs';
import { runKitSteps } from './lib/run-kit-steps.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

runKitSteps(DOC_AUDIT_STEPS, { kitRoot: KIT_ROOT, cwd: KIT_ROOT, timing: true });
console.log('\naudit-docs OK');
