#!/usr/bin/env node
/**
 * Compile sdk.guidance host-static-site playbook for headless runners (W4.7).
 * gene: repo.platform.sdk.recipes.gen1
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const playbook = {
  id: 'host-static-site-headless',
  version: 1,
  steps: [
    { action: 'auth.login', env: ['AGENTSTACK_EMAIL', 'AGENTSTACK_PASSWORD'] },
    { action: 'hosting.quickStart', publish: true },
    { action: 'hosting.getProjectPlane', expectLadder: 'host' },
    { action: 'verify.publicUrl', pattern: '/s/' },
  ],
};

const out = resolve(__dirname, '../recipes/_generated/host-static-site-guidance.json');
writeFileSync(out, `${JSON.stringify(playbook, null, 2)}\n`, 'utf8');
console.info('[guidance] wrote', out);
