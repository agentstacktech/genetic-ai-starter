/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/examples/ai/03-hosting-quickstart.ts
 * action: sdk.hosting.quickStart — static bucket publish pattern
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    throw new Error('set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD for hosting.quickStart');
  }

  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);

  const dryRun = process.env.HOSTING_DRY_RUN === '1';
  if (dryRun) {
    verifyStep('hosting-skipped', true, 'HOSTING_DRY_RUN=1');
    return;
  }

  const response = await withRetry(() =>
    sdk.hosting.quickStart({
      project_id: projectId,
      html: '<!doctype html><html><body><h1>AgentStack recipe</h1></body></html>',
      bucket_name: process.env.HOSTING_BUCKET ?? 'sdk-recipe-demo',
      publish: process.env.HOSTING_PUBLISH !== '0',
    }),
  );
  const result = response.data;
  verifyStep('hosting.quickStart', Boolean(result?.url), result?.url ?? result?.site_id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
