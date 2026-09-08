/**
 * gene: repo.platform.sdk.recipes.gen1
 * iPaaS recipe: order webhook after host+sell (W13.1 companion).
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

  const plane = await sdk.hosting.getProjectPlane(projectId);
  const planeData = plane.data as { ladder?: unknown } | undefined;
  verifyStep('plane.sell_stage', Boolean(planeData?.ladder), JSON.stringify(planeData?.ladder));
  console.info('[recipe:08b-commerce-order-webhook] plane ladder ready for order hooks');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
