/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/examples/typescript/economy/01-balance.ts
 * action: @agentstack/sdk/economy balance read via sdk.platform.economy
 */
import { AgentStackSDK, buildUserAgntKey, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, gateCapability, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  const matrix = sdk.getCapabilityMatrix();
  verifyStep('gate-economy', gateCapability(matrix, 'economy'), 'economy enabled');

  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    console.log('skip balance — set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD');
    verifyStep('economy-offline', true, 'gating only');
    return;
  }

  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);
  const userId = Number(process.env.AGENTSTACK_USER_ID ?? process.env.USER_ID ?? 1);
  const accountKey = buildUserAgntKey(projectId, userId);

  const balance = await withRetry(() =>
    sdk.platform.economy.ledger.getBalance(projectId, { accountKey }),
  );
  verifyStep('economy.balance', balance !== undefined, accountKey);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
