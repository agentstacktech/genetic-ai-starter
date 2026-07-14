/**
 * Shared helpers for AgentStack recipe runners.
 * Genetic tag: repo.platform.sdk.recipes.gen1
 */
import type { AgentStackSDK, SDKCapabilityMatrix } from '@agentstack/sdk';

/** Return true when capability id is enabled in the matrix. */
export function gateCapability(matrix: SDKCapabilityMatrix, id: string): boolean {
  const entry = [...matrix.platform, ...matrix.domain].find((e) => e.id === id);
  if (!entry) return false;
  return entry.enabled !== false;
}

/**
 * Ensure an active project scope on the SDK (env AGENTSTACK_PROJECT_ID or first project).
 */
export async function ensureScope(sdk: AgentStackSDK): Promise<number> {
  const current = sdk.getProjectId();
  if (current !== undefined) return current;

  const fromEnv = process.env.AGENTSTACK_PROJECT_ID?.trim();
  if (fromEnv) {
    const id = Number(fromEnv);
    if (!Number.isFinite(id)) throw new Error('ensureScope: invalid AGENTSTACK_PROJECT_ID');
    sdk.updateProjectId(id);
    return id;
  }

  const projects = await sdk.platform.api.getProjects();
  const list = Array.isArray(projects) ? projects : [];
  const first = list[0] as { id?: number } | undefined;
  if (first?.id !== undefined) {
    sdk.updateProjectId(first.id);
    return first.id;
  }

  throw new Error(
    'ensureScope: no project — set AGENTSTACK_PROJECT_ID or create a project first',
  );
}

/** Retry async work with linear backoff (network flakes). */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 400,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
      }
    }
  }
  throw last;
}

/** Fail fast when a recipe verification step does not pass. */
export function verifyStep(name: string, ok: boolean, detail?: string): void {
  if (!ok) {
    throw new Error(`verifyStep failed: ${name}${detail ? ` — ${detail}` : ''}`);
  }
  const suffix = detail ? `: ${detail}` : '';
  console.log(`✓ ${name}${suffix}`);
}

/** Derive MCP origin URL from REST apiBase (…/api → …/mcp). */
export function resolveMcpUrl(apiBase: string): string {
  const trimmed = apiBase.replace(/\/$/, '');
  const origin = trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
  return `${origin}/mcp`;
}

/** Bearer token for MCP fetch recipes (API key or access token). */
export function resolveMcpAuthToken(): string | undefined {
  return (
    process.env.AGENTSTACK_API_KEY?.trim() ||
    process.env.AGENTSTACK_ACCESS_TOKEN?.trim() ||
    process.env.AGENTSTACK_TOKEN?.trim()
  );
}
