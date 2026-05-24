# Token report (step model)

Generated: 2026-05-24T10:19:34.223Z

**Model:** 1.2.1 — grep pools scale with fixture size.

## Fixture (shop-api)

| | Value |
|---|-------|
| Files | **20** |
| Source bytes | **6308** (~1577 tokens if read end-to-end) |
| Unscoped `rg` per transcript line | **1148** |
| Scoped grep per line | **517** |

Not API billing tokens. See [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md).

## Per-arm medians (T01–T14)

| Arm | Median all tasks | Median discovery-only |
|-----|------------------|------------------------|
| bare | 2265 | 2985 |
| kit_standard | 1051 | 1078 |
| kit_standard_indexed | 1125 | 1125 |

**Discovery median ratio (bare / kit+indexes):** ~**2.7×**.

## Per-task tokens

| Task | bare | kit_standard | kit + indexes |
|------|------|--------------|---------------|
| T01 | 4419 | 3625 | 3625 |
| T02 | 2262 | 1023 | 1300 |
| T03 | 4343 | 1078 | 1300 |
| T04 | 780 | 600 | 600 |
| T05 | 600 | 1730 | 1730 |
| T06 | 3679 | 1980 | 1980 |
| T07 | 2267 | 923 | 950 |
| T08 | 2287 | 1117 | 950 |
| T09 | 943 | 943 | 1300 |
| T10 | 916 | 600 | 950 |
| T11 | 919 | 600 | 600 |
| T12 | 3734 | 1078 | 950 |
| T13 | 600 | 1730 | 1730 |
| T14 | 2291 | 600 | 600 |

## Small project (8 agent tasks/week)

- bare: **~18116** context tokens/week (median all tasks)
- kit + indexes: **~9000** context tokens/week
- delta: **~9116**/week
