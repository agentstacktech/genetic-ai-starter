/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: docs/plugins/CAPABILITY_MATRIX.md · GET /mcp/actions
 * action: getModuleCatalog + getCapabilityMatrix with enabled gate; probe MCP actions URL
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import {
  gateCapability,
  resolveMcpAuthToken,
  resolveMcpUrl,
  verifyStep,
  withRetry,
} from '../_lib/recipe-common.js';

async function probeMcpActions(apiBase: string): Promise<number | null> {
  const token = resolveMcpAuthToken();
  if (!token) {
    console.log('skip GET /mcp/actions — set AGENTSTACK_API_KEY');
    return null;
  }
  const url = `${resolveMcpUrl(apiBase)}/actions`;
  const res = await withRetry(() =>
    fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }),
  );
  if (!res.ok) throw new Error(`GET /mcp/actions failed: ${res.status}`);
  const body = (await res.json()) as { actions?: unknown[]; count?: number };
  return body.count ?? (Array.isArray(body.actions) ? body.actions.length : 0);
}

async function main(): Promise<void> {
  const apiBase = resolveAgentStackApiBase();
  const sdk = new AgentStackSDK({ apiBase });

  const catalog = sdk.getModuleCatalog();
  verifyStep('getModuleCatalog', catalog.modules.length > 0, `v${catalog.productVersion}`);

  const matrix = sdk.getCapabilityMatrix();
  const enabledDomains = matrix.domain.filter((d) => gateCapability(matrix, d.id));
  verifyStep(
    'getCapabilityMatrix',
    matrix.platform.every((p) => p.enabled),
    `${enabledDomains.length}/${matrix.domain.length} domain modules enabled`,
  );

  const commerceOn = gateCapability(matrix, 'commerce.cart');
  console.log('gate commerce.cart', commerceOn);

  const actionCount = await probeMcpActions(apiBase);
  if (actionCount !== null) {
    verifyStep('mcp-actions', actionCount > 0, `${actionCount} actions`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
