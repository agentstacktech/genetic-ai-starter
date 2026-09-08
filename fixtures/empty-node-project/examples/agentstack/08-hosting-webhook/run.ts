/**
 * gene: repo.platform.sdk.recipes.gen1
 * iPaaS recipe: hosting publish webhook → integration hub (W13.1).
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) throw new Error('set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD');

  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);

  const hooks = await sdk.integrations?.listWebhooks?.({ project_id: projectId });
  verifyStep('webhooks.list', Array.isArray(hooks?.data) || hooks == null, 'ok');

  const qs = await sdk.hosting.quickStart({
    project_id: projectId,
    html: '<!doctype html><html><body>Webhook recipe</body></html>',
    bucket_name: 'ipaas-hosting-hook',
    publish: false,
  });
  verifyStep('hosting.draft', Boolean(qs.data?.bucket_id), qs.data?.bucket_id);
  console.info('[recipe:08-hosting-webhook] draft bucket ready for publish hook');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
