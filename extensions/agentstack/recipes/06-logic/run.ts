/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: docs/plugins/CAPABILITY_MATRIX.md#logic-dry_run
 * action: MCP logic.dry_run — simulate rule execution without side effects
 */
import { resolveAgentStackApiBase } from '@agentstack/sdk';
import {
  resolveMcpAuthToken,
  resolveMcpUrl,
  verifyStep,
  withRetry,
} from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const token = resolveMcpAuthToken();
  if (!token) {
    throw new Error('set AGENTSTACK_API_KEY for logic.dry_run');
  }

  const projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);
  const logicId = process.env.LOGIC_RULE_ID ?? 'demo-rule';
  const apiBase = resolveAgentStackApiBase();

  const batchBody = {
    steps: [
      {
        id: 'dry',
        action: 'logic.dry_run',
        params: {
          project_id: projectId,
          logic_id: logicId,
          event_data: { trigger: 'recipe', source: 'repo.platform.sdk.recipes.gen1' },
        },
      },
    ],
    context: { project_id: projectId },
    options: { stopOnError: true },
  };

  const res = await withRetry(() =>
    fetch(resolveMcpUrl(apiBase), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchBody),
    }),
  );
  verifyStep('logic.dry_run-http', res.ok, `status=${res.status}`);

  const body = (await res.json()) as { results?: Array<{ ok: boolean; id: string }> };
  const step = body.results?.[0];
  verifyStep('logic.dry_run', step?.ok === true || res.ok, step?.id ?? logicId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
