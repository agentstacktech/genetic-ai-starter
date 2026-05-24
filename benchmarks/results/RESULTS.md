# Benchmark results — reference (platform 0.4.11)

**Harness:** synthetic policy · **Scorer:** 1.1.1 · [run-meta.json](run-meta.json) · [metrics.snapshot.json](../../meta/docs/metrics.snapshot.json)

**Detail:** [ANALYSIS.md](ANALYSIS.md) · **Narrative:** [BENEFITS_AND_METRICS.md](../../meta/docs/BENEFITS_AND_METRICS.md)

## Summary (shop-api, T01–T11)

| Arm | Median | Success | Map-first (genetic) | Unscoped grep |
|-----|--------|---------|---------------------|---------------|
| kit_standard | 8 | 92% | 36% | 1 |
| agents_md | 8 | 91% | 9% | 0 |
| agents_md_weak | 3 | 0% | 0% | 12 |
| bare | 6 | 64% | 0% | 13 |
| kit_standard_indexed | 7 | 73% | 73% | 0 |

**Takeaway:** compare **task deltas** (T04/T05/T08), not median alone. Kit wins maintenance and safety; indexed arm wins T08 discovery.

## Reproduce

```bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/scripts/export-metrics-snapshot.mjs
node genetic-ai-starter/scripts/check-docs-metrics.mjs
```
