# Benchmark results — reference (platform 0.4.11)

**Harness:** `benchmarks/` · **Method:** reproducible arm-policy matrix (`run-matrix.mjs`) · [run-meta.json](run-meta.json)  
**Detail:** [ANALYSIS.md](ANALYSIS.md) · **CSV:** [summary.csv](summary.csv) · **Narrative:** [BENEFITS_AND_METRICS.md](../../meta/docs/BENEFITS_AND_METRICS.md)

Regenerate: [RUNBOOK.md](../RUNBOOK.md).

## Summary (shop-api, n=11 per arm)

| Arm | Median score | Success | Unscoped grep |
|-----|--------------|---------|---------------|
| kit_standard | 8 | 91% | 1 |
| agents_md / readme_tree | 8 | 91% | 0 |
| bare | 6 | 64% | 13 |

**Takeaway:** kit adds **discipline** (T04 refusal, T05 maintenance, trap avoidance); community docs match on simple discovery.

**Worked examples & narrative:** [meta/docs/BENEFITS_AND_METRICS.md](../../meta/docs/BENEFITS_AND_METRICS.md) · public summary in [README.en.md](../../README.en.md#measured-impact-benchmark-harness).

## Reproduce

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
```
