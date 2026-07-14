/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: docs/AGENT_PROTOCOL_QUICKSTART.md
 * action: sdk.protocol.dnaList + executeCommand + invalidateSnapshotPrefix
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, gateCapability, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  const matrix = sdk.getCapabilityMatrix();
  verifyStep('gate-protocol', gateCapability(matrix, 'protocol'), 'protocol enabled');

  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    console.log('skip DNA — set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD');
    verifyStep('8dna-offline', true, 'gating only');
    return;
  }

  await withRetry(() => sdk.platform.auth.login({ email, password }));
  const projectId = await ensureScope(sdk);

  const list = await withRetry(() =>
    sdk.protocol.dnaList<Record<string, unknown>>('projects', { limit: 5 }),
  );
  verifyStep('dnaList', Array.isArray(list.entities), `entities=${list.entities.length}`);

  const commandName = process.env.DNA_COMMAND ?? 'list_something';
  const result = await withRetry(() =>
    sdk.protocol.executeCommand({
      command_type: 'dna_crud',
      command_name: commandName,
      payload: {
        target_entity: 'project',
        operation_type: 'read',
        input_data: { project_id: projectId },
      },
    }),
  );
  verifyStep('executeCommand', result !== undefined, commandName);

  await sdk.protocol.invalidateSnapshotPrefix('projects');
  verifyStep('invalidateSnapshotPrefix', true, 'projects');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
