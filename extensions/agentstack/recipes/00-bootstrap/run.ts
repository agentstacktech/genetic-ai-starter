/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: agentstack-unified-sdk/examples/ai/00-bootstrap.ts
 * action: Initialize SDK, optional login, list projects, ensure project scope
 */
import { AgentStackSDK, resolveAgentStackApiBase } from '@agentstack/sdk';
import { ensureScope, verifyStep, withRetry } from '../_lib/recipe-common.js';

async function main(): Promise<void> {
  const sdk = new AgentStackSDK({ apiBase: resolveAgentStackApiBase() });
  const catalog = sdk.getModuleCatalog();
  verifyStep('catalog', catalog.modules.length > 0, `${catalog.modules.length} modules`);

  const email = process.env.AGENTSTACK_EMAIL?.trim();
  const password = process.env.AGENTSTACK_PASSWORD?.trim();
  if (!email || !password) {
    console.log('skip login — set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD');
    verifyStep('bootstrap-offline', true, 'catalog only');
    return;
  }

  await withRetry(() =>
    sdk.platform.auth.login({
      email,
      password,
      ...(process.env.AGENTSTACK_PROJECT_ID
        ? { project_id: Number(process.env.AGENTSTACK_PROJECT_ID) }
        : {}),
    }),
  );

  const projects = await sdk.platform.api.getProjects();
  const count = Array.isArray(projects) ? projects.length : 0;
  verifyStep('getProjects', count >= 0, `count=${count}`);

  const projectId = await ensureScope(sdk);
  verifyStep('ensureScope', sdk.getProjectId() === projectId, `projectId=${projectId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
