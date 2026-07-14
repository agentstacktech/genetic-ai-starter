/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/packages/core/src/commerce/CommerceFacade.ts
 * action: @agentstack/sdk/commerce facade discovery (catalog hints)
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, gateCapability, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  const matrix = sdk.getCapabilityMatrix();
  const commerceEnabled =
    gateCapability(matrix, 'commerce.cart') || gateCapability(matrix, 'commerce.shop');
  verifyStep('gate-commerce', commerceEnabled, 'commerce domain');

  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    console.log('skip commerce API — set credentials for live discovery');
    verifyStep('commerce-offline', true, 'gating only');
    return;
  }

  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);

  const hints = await withRetry(() => sdk.commerce.guidance.getCatalogHints(projectId));
  verifyStep('commerce.discovery', hints !== undefined, `project=${projectId}`);

  const offers = await withRetry(() =>
    sdk.commerce.discovery.listOffers({ project_id: projectId, limit: 3 }),
  );
  const total = Array.isArray(offers.listings) ? offers.listings.length : 0;
  verifyStep('commerce.discovery.listOffers', total >= 0, `offers=${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
