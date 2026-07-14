/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/examples/ai/04-run-task-capability.ts
 * action: @agentstack/sdk/capability-tasks runTaskCapability
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import {
  listRegisteredTaskPorts,
  registerTaskCapabilityPort,
  runTaskCapability,
} from '@agentstack/sdk/capability-tasks';
import { ensureScope, verifyStep, withRetry } from '../_lib/recipe-common.js';

const DEMO_TASK = 'recipe.demo.echo';

async function main(): Promise<void> {
  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });

  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  let projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);

  if (email && password) {
    await withRetry(() => sdk.platform.auth.login({ email, password }));
    projectId = await ensureScope(sdk);
  }

  registerTaskCapabilityPort({
    taskId: DEMO_TASK,
    async run(ctx) {
      return {
        artifact: { echoed: ctx.projectId, audience: ctx.audience },
        verified: true,
      };
    },
  });

  const ports = listRegisteredTaskPorts();
  verifyStep('task-ports', ports.includes(DEMO_TASK), DEMO_TASK);

  const result = await runTaskCapability(DEMO_TASK, {
    projectId,
    audience: 'developer',
  });
  verifyStep(
    'runTaskCapability',
    result.verified !== false,
    String(result.artifact?.echoed ?? projectId),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
