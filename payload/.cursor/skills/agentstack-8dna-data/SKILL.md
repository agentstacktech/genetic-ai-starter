---
name: agentstack-8dna-data
description: Read and write AgentStack 8DNA project data via sdk.protocol — dnaList, executeCommand, snapshot invalidation. Use for KV/config, sandbox variants, or when MCP is unavailable.
---

# AgentStack 8DNA data

**Genetic tag:** `repo.platform.sdk.recipes.gen1`

## When to use

- User mentions 8DNA, project config KV, sandbox variant, or `data_projects_8dna`
- MCP/SDK unavailable for a read-only list
- Feature flags or tenant config stored in DNA tables

## Steps

1. Bootstrap SDK and `ensureScope()` first (see `agentstack-sdk-bootstrap` skill).
2. Gate `protocol` capability: `sdk.getCapabilityMatrix()`.
3. List entities: `sdk.protocol.dnaList(entity, { limit })`.
4. Mutate via `sdk.protocol.executeCommand({ command_type: 'dna_crud', ... })`.
5. After writes: `sdk.protocol.invalidateSnapshotPrefix(entity)`.
6. Run recipe `examples/agentstack/02-8dna-crud/` for reference flow.

## Channel label

Always label responses: **sdk.protocol** or **8DNA KV** — never ambiguous "API call".

## Do not

- Do not bulk-export full DNA dumps into prompts.
- Do not skip cache invalidation after mutations shown elsewhere in UI.

## Done when

Entity read/write uses protocol commands, project scope is set, and snapshot prefix invalidated on write.
