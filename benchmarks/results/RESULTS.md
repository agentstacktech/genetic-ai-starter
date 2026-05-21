# Benchmark results — reference (platform 0.4.11)

**Harness:** `benchmarks/` · **Method:** arm-policy simulation (`run-matrix.mjs`)  
**Detail:** [ANALYSIS.md](ANALYSIS.md) · **CSV:** [summary.csv](summary.csv)

For publication-grade numbers, replace `results/raw/` with manual Cursor transcripts per [RUNBOOK.md](../RUNBOOK.md).

## Summary (synthetic, n=11 per arm)

| Arm | Median score | Success | Unscoped grep |
|-----|--------------|---------|---------------|
| kit_standard | 8 | 91% | 1 |
| agents_md / readme_tree | 8 | 91% | 0 |
| bare | 6 | 64% | 13 |

**Takeaway:** kit adds **discipline** (T04 refusal, T05 maintenance, trap avoidance); community docs match on simple discovery.

## Reproduce

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
```
