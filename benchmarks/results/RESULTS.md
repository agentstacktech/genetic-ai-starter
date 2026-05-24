# Benchmark results

**Harness:** synthetic policy · **Scorer:** 1.2.1 · [run-meta.json](run-meta.json) · [metrics.snapshot.json](../../meta/docs/metrics.snapshot.json)

## Summary (shop-api, 14 synthetic tasks)


| Arm                  | Median | Success | Map-first (genetic) | Unscoped grep |
| -------------------- | ------ | ------- | ------------------- | ------------- |
| bare                 | 5.5    | 50%     | 0%                  | 18            |
| readme_tree          | 6      | 64%     | 0%                  | 0             |
| agents_md            | 7      | 86%     | 7%                  | 0             |
| agents_md_weak       | 2.5    | 0%      | 0%                  | 16            |
| generic_cursorrules  | 7      | 71%     | 0%                  | 0             |
| kit_minimal          | 7.5    | 64%     | 29%                 | 1             |
| kit_standard         | 8      | 93%     | 50%                 | 1             |
| kit_standard_indexed | 9      | 100%    | 86%                 | 0             |


Regenerate: `node benchmarks/scripts/run-matrix.mjs && node benchmarks/scripts/analyze-results.mjs`

Detail: [ANALYSIS.md](ANALYSIS.md) · [METRICS_GLOSSARY.md](../../meta/docs/METRICS_GLOSSARY.md).