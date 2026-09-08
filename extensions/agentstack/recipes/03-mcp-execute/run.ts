/**
 * gene: repo.platform.sdk.recipes.gen1 · repo.tooling.user_cli.gen1
 * Prefer @agentstack/sdk mcpExecute (SoT) over raw fetch.
 */
import {
  mcpExecute,
  resolveAgentStackApiBase,
  resolveMcpAuthToken,
  resolveMcpUrl,
} from '@agentstack/sdk';
import { verifyStep } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const token = resolveMcpAuthToken();
  if (!token) {
    throw new Error('set AGENTSTACK_API_KEY or AGENTSTACK_ACCESS_TOKEN for MCP execute');
  }

  const apiBase = resolveAgentStackApiBase();
  const mcpUrl = resolveMcpUrl(apiBase);
  const projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);

  const out = await mcpExecute(
    [{ action: 'projects.get_projects', params: {} }],
    { token, projectId, mcpUrl },
  );
  verifyStep('agentstack.execute', out.ok, out.error ?? 'batch ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
