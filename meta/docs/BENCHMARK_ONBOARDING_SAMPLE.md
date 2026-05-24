# Benchmark onboarding sample — filled map + indexes

After benchmark v1 (**14** tasks T01–T14, scorer **1.2.1**, **8** arms), use this as the **oracle consumer** pattern for new projects (see `kit_standard_indexed` arm).

## Copy from kit repo

| Artifact | Source in monorepo |
|----------|-------------------|
| Filled map | [`benchmarks/overlays/shop/docs/ai/AI_NAVIGATION_MAP.md`](../../benchmarks/overlays/shop/docs/ai/AI_NAVIGATION_MAP.md) |
| Auth index | [`benchmarks/overlays/shop/src/auth/AI_INDEX.md`](../../benchmarks/overlays/shop/src/auth/AI_INDEX.md) |
| Catalog / billing / webhooks indexes | `benchmarks/overlays/shop/src/*/AI_INDEX.md` |

Replace `shop.*` tags with your `{{DOMAIN}}.*` tags.

## When to fill

- **At install (`standard`):** Tier 0 only + empty Tier 1 table.
- **After 2–4 subsystems:** add Tier 1 rows + `AI_INDEX.md` each (~10+ integration points).
- **With indexes:** pre-filled `AI_INDEX.md` — stronger discovery scores (e.g. T08 **10** vs **7** on map-only). See [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md).

## Run benchmark on your repo

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
# manual RUNBOOK.md or:
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
```

Results: `benchmarks/results/ANALYSIS.md`.
