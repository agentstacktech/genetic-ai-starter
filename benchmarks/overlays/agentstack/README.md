# AgentStack benchmark overlay

Docs and navigation hints copied onto the shop-api fixture when preparing arm **`kit_agentstack`**.

## Purpose

Models a consumer project built **on** AgentStack (`agentstack-app` profile):

- `docs/ai/CONTEXT_FOR_AI.md` routing
- `docs/ai/agentstack-capability-snapshot.json`
- `src/lib/agentstack.ts` bootstrap
- `examples/agentstack/` recipes

## Arm preparation

```bash
node benchmarks/scripts/prepare-arm.mjs --arm kit_agentstack --force
```

Install uses `profile=agentstack-app` + shop map overlay (same as `kit_standard`).

## Tasks

AgentStack-specific eval pack: `benchmarks/tasks/agentstack-tasks.json` (A01–A05).

Smoke tasks S01–S04 remain in `tasks.json` with substrate `agentstack`.

Gene: `repo.tooling.genetic_starter.benchmark.gen1`
