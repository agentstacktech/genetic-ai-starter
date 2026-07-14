# Post-expansion baseline — Genetic AI Starter AgentStack DX



**Recorded:** _YYYY-MM-DD_ (after AgentStack DX expansion)  

**Platform:** _0.4.13+_  

**Gene:** `repo.tooling.genetic_starter.agentstack_dx.gen1`



## Inventory (post-expansion)



| Metric | Pre ([BASELINE_PRE_DX_EXPANSION.md](BASELINE_PRE_DX_EXPANSION.md)) | Post |

|--------|------:|-----:|

| Payload Cursor skills | 5 | _9_ |

| AgentStack extension overlays | 2 | _8+_ |

| Install profile `agentstack-app` | — | _yes_ |

| AgentStack task pack (A01–A05) | — | _5_ |

| Benchmark arm `kit_agentstack` | — | _yes_ |

| TTFC (install → recipe 00) | — | _≤1 run_ |



## Acceptance (from pre-expansion targets)



| Metric | Target | Post |

|--------|--------|------|

| TTFC (agentstack-app → first SDK call) | ≤ 1 recipe run | _ |

| AgentStack task pack success rate | ≥ 90% | _ |

| Channel-correctness (MCP/sdk.protocol vs raw fetch) | ≥ 90% | _ |

| Capability contract drift | 0 | _ |



## Reproduce



```bash

node genetic-ai-starter/scripts/export-baseline-metrics.mjs

node genetic-ai-starter/benchmarks/scripts/prepare-arm.mjs --arm kit_agentstack --force

node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs

node genetic-ai-starter/benchmarks/scripts/assert-channel.mjs --file benchmarks/results/raw/kit_agentstack__S01__run1.txt --strict

```



Fill Post column after matrix run; commit with platform bump.


