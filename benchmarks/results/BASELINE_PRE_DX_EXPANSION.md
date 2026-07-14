# Pre-expansion baseline — Genetic AI Starter Kit DX

**Recorded:** 2026-06-26 (before AgentStack DX expansion)  
**Platform:** 0.4.13  
**Gene:** `repo.tooling.genetic_starter.benchmark.gen1`

## Inventory (pre-expansion)

| Metric | Value |
|--------|------:|
| Payload philosophy genes (`.gen1.md`) | 20 |
| Payload Cursor skills | 5 |
| Extension overlays (agentstack) | 2 |
| Benchmark shop-api tasks | 14 |
| Shop harness success (kit+indexes) | 100% |
| Shop harness success (weak baseline) | 0% |
| Map-first rate (genetic arm) | 82% |

## Acceptance targets (post-expansion)

| Metric | Target |
|--------|--------|
| TTFC (agentstack-app install → first SDK call) | ≤ 1 recipe run |
| AgentStack task pack success rate | ≥ 90% |
| Channel-correctness (sdk.protocol/MCP vs raw fetch) | ≥ 90% |
| Capability contract drift | 0 |

## Notes

Re-run `node genetic-ai-starter/scripts/export-platform-stats.mjs` and benchmark matrix after Phase 14 to update post-expansion numbers.
