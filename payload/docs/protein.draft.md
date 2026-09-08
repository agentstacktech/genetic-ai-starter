# Protein draft kit (tenant apps)

**Genetic:** `core.protein.merging.gen1` · AgentStack dual-plane (NeuroCache editor + leaf services)

Copy these patterns into consumer apps — do **not** invent Redis SoT or a second mutator bus.

## When to use which plane

| Burst | Plane | Pattern |
|-------|-------|---------|
| Many path SETs (editor typing) | NeuroCache dirty → flush | Protein DELTA `commit_mode=dirty` then ACK `flushed` + `epoch` |
| 1–N durable keys | Leaf | MCP/REST leaf or `patch_paths` via platform |
| Auth / money | Immediate | Never dirty |
| Append / rings | Split | Ring / storage refs |

## Minimal client journal (Fill Comfort style)

1. Stage PathAtom sets locally while typing.
2. On Save: one DELTA (or REST `path_updates`) with idempotency / `op_id`.
3. Assert `flushed !== false` for dirty mode; remember `epoch` for next GET `If-Epoch-Match`.
4. On DNA 503: fail-closed — do not stampede REST.

Platform references (monorepo):

- `agentstack-frontend/src/lib/protein/proteinDraftSession.ts`
- `agentstack-frontend/src/lib/protein/proteinDraftFlush.ts`
- `agentstack-frontend/src/lib/protein/proteinEpochStore.ts`
- `shared/organelles/protein_mutator_registry.py`
- `docs/operations/DNA_PROTEIN_WRITE_PLANE_MATRIX.md`

## Undo / offline (N5)

- Prefer journal `prev` values on DiffOp for single-step undo before flush.
- Offline: queue drafts in IndexedDB / Fill Comfort drafts; replay on reconnect with same `op_id`.
- Do not CRDT-merge project DNA.

## Install note

This file ships with Genetic AI Starter for integrators. Keep in sync with platform runbook when dual-plane rules change.
