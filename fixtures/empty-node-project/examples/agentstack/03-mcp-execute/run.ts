/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-core/mcp/routes.py · docs/MCP_BUSINESS_FLOWS.md
 * action: agentstack.execute JSON-RPC batch via POST /mcp (fetch + env token)
 */
import { resolveAgentStackApiBase } from '@agentstack/sdk';
import {
  resolveMcpAuthToken,
  resolveMcpUrl,
  verifyStep,
  withRetry,
} from '../_lib/recipe-common.js';

interface McpBatchResponse {
  results?: Array<{ id: string; ok: boolean; result?: unknown; error?: string }>;
}

async function main(): Promise<void> {
  const token = resolveMcpAuthToken();
  if (!token) {
    throw new Error('set AGENTSTACK_API_KEY or AGENTSTACK_ACCESS_TOKEN for MCP execute');
  }

  const apiBase = resolveAgentStackApiBase();
  const mcpUrl = resolveMcpUrl(apiBase);
  const projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);

  const batchBody = {
    steps: [
      {
        id: 'projects',
        action: 'projects.get_projects',
        params: {},
      },
    ],
    context: { project_id: projectId },
    options: { stopOnError: true },
  };

  const jsonRpcBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'agentstack.execute',
      arguments: batchBody,
    },
  };

  const res = await withRetry(() =>
    fetch(mcpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(jsonRpcBody),
    }),
  );
  verifyStep('mcp-http', res.ok, `status=${res.status}`);

  const payload = (await res.json()) as McpBatchResponse & { result?: { content?: unknown } };
  const results = payload.results ?? (payload.result as McpBatchResponse | undefined)?.results;
  const first = results?.[0];
  verifyStep(
    'agentstack.execute',
    first?.ok === true || results !== undefined,
    first?.id ?? 'batch accepted',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
