/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: docs/plugins/CONTEXT_FOR_AI.md · docs/MCP_TOOLS.md#webhooks
 * action: MCP webhooks.register — register inbound webhook endpoint (documented)
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
    throw new Error('set AGENTSTACK_API_KEY for webhooks.register');
  }

  const projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);
  const callbackUrl = process.env.WEBHOOK_URL;
  if (!callbackUrl) {
    console.log('skip webhooks.register — set WEBHOOK_URL');
    verifyStep('webhook-offline', true, 'documented only');
    return;
  }

  const batchBody = {
    steps: [
      {
        id: 'register',
        action: 'webhooks.register',
        params: {
          project_id: projectId,
          url: callbackUrl,
          events: (process.env.WEBHOOK_EVENTS ?? 'integration.inbound').split(','),
          secret: process.env.WEBHOOK_SECRET ?? 'recipe-demo-secret',
        },
      },
    ],
    context: { project_id: projectId },
    options: { stopOnError: true },
  };

  const res = await withRetry(() =>
    fetch(resolveMcpUrl(resolveAgentStackApiBase()), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchBody),
    }),
  );
  verifyStep('webhooks.register-http', res.ok, `status=${res.status}`);

  const body = (await res.json()) as { results?: Array<{ ok: boolean }> };
  verifyStep('webhooks.register', body.results?.[0]?.ok === true || res.ok, callbackUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
