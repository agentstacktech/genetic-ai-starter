/**
 * AgentStack SDK bootstrap for consumer projects.
 * Genetic tag: repo.platform.sdk.onboarding.gen1
 *
 * @see extensions/agentstack/recipes/00-bootstrap/run.ts
 * @see agentstack-unified-sdk/docs/AI_INTEGRATOR_GUIDE.md (upstream)
 */
import {
  AgentStackSDK,
  assertProjectIdConfigured,
  resolveAgentStackApiBase,
  type SDKCapabilityMatrix,
  type SDKModuleCatalog,
} from '@agentstack/sdk';

let singleton: AgentStackSDK | undefined;

export interface AgentStackBootstrapOptions {
  apiBase?: string;
  projectId?: number;
  apiKey?: string;
}

/** Shared integrator-scoped SDK instance (lazy singleton). */
export function getAgentStackSDK(options: AgentStackBootstrapOptions = {}): AgentStackSDK {
  if (!singleton) {
    const projectIdFromEnv = process.env.AGENTSTACK_PROJECT_ID?.trim();
    singleton = new AgentStackSDK({
      apiBase: options.apiBase ?? resolveAgentStackApiBase(),
      apiKey: options.apiKey ?? process.env.AGENTSTACK_API_KEY?.trim(),
      sdkAudience: 'integrator',
      ...(options.projectId !== undefined
        ? { projectId: options.projectId }
        : projectIdFromEnv
          ? { projectId: Number(projectIdFromEnv) }
          : {}),
    });
  }
  return singleton;
}

/** Self-description: modules, access paths, AI hints (`getModuleCatalog`). */
export function catalog(sdk?: AgentStackSDK): SDKModuleCatalog {
  return (sdk ?? getAgentStackSDK()).getModuleCatalog();
}

/** Enabled platform + domain surfaces (`getCapabilityMatrix`). */
export function capabilities(sdk?: AgentStackSDK): SDKCapabilityMatrix {
  return (sdk ?? getAgentStackSDK()).getCapabilityMatrix();
}

/**
 * Ensure an active project scope (env AGENTSTACK_PROJECT_ID, config, or first project).
 * Prefer `assertProjectIdConfigured` when scope must already be set.
 */
export async function ensureScope(sdk?: AgentStackSDK): Promise<number> {
  const client = sdk ?? getAgentStackSDK();
  const current = client.getProjectId();
  if (current !== undefined) return current;

  const fromEnv = process.env.AGENTSTACK_PROJECT_ID?.trim();
  if (fromEnv) {
    const id = Number(fromEnv);
    if (!Number.isFinite(id)) {
      throw new Error('ensureScope: invalid AGENTSTACK_PROJECT_ID');
    }
    client.updateProjectId(id);
    return id;
  }

  const projects = await client.platform.api.getProjects();
  const list = Array.isArray(projects) ? projects : [];
  const first = list[0] as { id?: number } | undefined;
  if (first?.id !== undefined) {
    client.updateProjectId(first.id);
    return first.id;
  }

  throw new Error(
    'ensureScope: no project — set AGENTSTACK_PROJECT_ID or create a project first',
  );
}

export { assertProjectIdConfigured };
