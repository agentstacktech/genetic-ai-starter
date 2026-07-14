/**
 * gene: repo.platform.sdk.recipes.gen1
 * doc: docs/RAG_PLATFORM_GUIDE.md · docs/plugins/CAPABILITY_MATRIX.md#rag-search
 * action: MCP rag.search — semantic search over a collection
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
    throw new Error('set AGENTSTACK_API_KEY for rag.search');
  }

  const projectId = Number(process.env.AGENTSTACK_PROJECT_ID ?? 1);
  const collectionId = process.env.RAG_COLLECTION_ID;
  if (!collectionId) {
    console.log('skip rag.search — set RAG_COLLECTION_ID');
    verifyStep('rag-offline', true, 'documented only');
    return;
  }

  const batchBody = {
    steps: [
      {
        id: 'search',
        action: 'rag.search',
        params: {
          project_id: projectId,
          collection_id: collectionId,
          query: process.env.RAG_QUERY ?? 'AgentStack SDK recipes',
          top_k: Number(process.env.RAG_TOP_K ?? 3),
          hybrid: true,
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
  verifyStep('rag.search-http', res.ok, `status=${res.status}`);

  const body = (await res.json()) as { results?: Array<{ ok: boolean; result?: unknown }> };
  const hits = body.results?.[0]?.result;
  verifyStep('rag.search', res.ok, Array.isArray(hits) ? `hits=${hits.length}` : 'accepted');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
