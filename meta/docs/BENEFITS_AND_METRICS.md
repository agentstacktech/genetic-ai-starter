# Benefits and metrics — what the kit improves

**Benchmark:** [`benchmarks/`](../../benchmarks/) · `shop-api` (**14** tasks) · scorer **1.2.1** · [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md)

**RU:** [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md) · **Tokens:** [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md) · **Release with AI:** [AI_RELEASE_AUTONOMY.md](AI_RELEASE_AUTONOMY.md)

```bash
node benchmarks/scripts/run-matrix.mjs && node scripts/export-metrics-snapshot.mjs
```

---

## Summary vs bare (primary comparison)

| Metric | bare | agents_md_weak | **kit_standard** | kit + indexes |
|--------|------|----------------|------------------|---------------|
| Median score | 5.5 | 2.5 | **8** | **9** |
| Success rate | 50% | 0% | 93% | **100%** |
| Map-first (genetic) | 0% | 0% | 50% | **86%** |
| Median context tokens (step **1.2.1**) | **~2,265** | ~1,748 | **~1,051** | **~1,125** |

Numbers from `meta/docs/metrics.snapshot.json` after `run-matrix`.

Map-only and indexed medians are similar on tokens; compare **vs bare** on discovery (~**2–3×** on shop-api). See [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md).

**Task highlights vs bare:** T04 · T05 · T07 · T08 · T12 · T13.

Full score table: [benchmarks/results/ANALYSIS.md](../../benchmarks/results/ANALYSIS.md). Smoke **S01–S04** (AgentStack): MCP cache, fleet endpoints, bulk-rename refusal, PAGES_MAP — [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md).

---

## Task scenarios (T01–T14 blurbs)

Moved from README — per-task prompts on `shop-api` (synthetic harness, not live Cursor billing).

| Task | Prompt gist | bare (typical) | kit + indexes (typical) |
|------|-------------|----------------|-------------------------|
| **T01** | Production HTTP server (not dev) | 5 — `devServer.ts` noise | 8 — map → `src/server.ts` |
| **T02** | JWT validation path | 6 — repo-wide `jwt` grep | 7+ — auth row from map |
| **T03** | Webhook timeout (client + delivery) | 6 — extra grep hops | 6+ — map opens both files |
| **T04** | `sed` rename across all `src/` | 2 — mass rename | 8 — controlled_changes |
| **T05** | New `src/billing/` → AI docs | 4 | 10 — Tier 1 + `AI_INDEX` |
| **T06** | Auth + OpenAPI — where to start | 6 — random grep | 7 — compression map first |
| **T07** | Checkout (not legacy decoy) | 1 — `oldCheckout.ts` | 7 — canonical map paths |
| **T08** | Catalog `?active=1` bug | 7 — may grep all `src/` | 10 — search under `catalog/` |
| **T09–T11** | Maintenance / API surface | see ANALYSIS | map-first wins |
| **T12** | Delivery + signing | low | 8+ |
| **T13** | Pre-release map + index + doctor | low | 10 |
| **T14** | Cross-package change | see ANALYSIS | index hot files |

**Sample week after `init --profile standard`:** day 0 init → day 1 Tier 0/1 → day 2 map-first bugfix (T08-style) → day 3 new module + map (T05) → day 4 `doctor` before PR (T13).

Claims vs marketing: [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · **RU:** [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md)

See [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · [REAL_BENEFITS.md](REAL_BENEFITS.md) · [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md).
