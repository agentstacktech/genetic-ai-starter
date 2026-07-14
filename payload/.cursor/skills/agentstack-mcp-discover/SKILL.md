---
name: agentstack-mcp-discover
description: Discover AgentStack MCP actions and execute batches via agentstack.execute. Use when listing MCP tools, routing to POST /mcp, or batching platform actions.
---

# AgentStack MCP discover + execute

**Genetic tag:** `repo.platform.capability_contract.gen1`

## When to use

- User asks which MCP action to call, or needs `agentstack.execute`
- Task mentions MCP batch, `/mcp`, or Cursor plugin routing
- Before inventing REST paths for platform operations

## Steps

1. Read offline snapshot: `docs/ai/agentstack-capability-snapshot.json` (`mcpActionDomains`, `discovery`).
2. When online: `GET {origin}/mcp/actions` (Bearer from `AGENTSTACK_API_KEY` or `AGENTSTACK_ACCESS_TOKEN`).
3. Prefer batch via JSON-RPC `tools/call` → `agentstack.execute` with `steps[]` and `context.project_id`.
4. Run recipe `examples/agentstack/03-mcp-execute/` to verify token + batch.
5. Name the channel in summaries: **MCP** (not raw undocumented REST).

## Auth

- `.cursor/mcp.json.template` — copy and fill OAuth/API key per plugin `/agentstack-init`.
- Scripts: `AGENTSTACK_API_KEY` or `AGENTSTACK_ACCESS_TOKEN`.

## Do not

- Do not guess action names — discover first.
- Do not call `/api/admin/*` from integrator apps.

## Done when

Action id is verified against snapshot or live discovery, and batch uses `context.project_id`.
