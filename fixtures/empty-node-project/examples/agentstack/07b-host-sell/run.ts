/**
 * gene: repo.platform.sdk.recipes.gen1
 * Chains hosting quickStart + hosting plane read (host-and-sell prep).
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    throw new Error('set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD');
  }

  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);

  if (process.env.HOSTING_DRY_RUN === '1') {
    verifyStep('07b-skipped', true, 'dry run');
    return;
  }

  const qs = await sdk.hosting.quickStart({
    project_id: projectId,
    html: '<!doctype html><html><body><h1>Host+Sell recipe</h1></body></html>',
    bucket_name: process.env.HOSTING_BUCKET ?? 'host-sell-recipe',
    publish: process.env.HOSTING_PUBLISH !== '0',
  });
  verifyStep('host', Boolean(qs.data?.url), qs.data?.url);

  const plane = await sdk.hosting.getProjectPlane(projectId);
  const top = plane.data?.next_actions?.[0]?.id;
  verifyStep('plane.next_action', Boolean(top), top ?? 'none');
  console.info('[recipe:07b-host-sell] next_action=', top);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
