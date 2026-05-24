# Real-world benefits — Genetic AI Starter Kit

**RU:** [REAL_BENEFITS_ru.md](REAL_BENEFITS_ru.md)

**Metrics:** [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md) · [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · [NAVIGATION_OS.md](NAVIGATION_OS.md)

---

## 1. Large complex projects (killer feature)

### Without kit

On large monorepos, agents and humans hit duplicate subsystems, no canonical address, and a single `AGENTS.md` that does not scale.

### Navigation OS

| Mechanism | Effect |
|-----------|--------|
| **Tier 0** | Which package tree first |
| **Tier 1** + genetic tag | Stable names in PRs |
| **AI_INDEX.md** | 1–2 hot files, not 40 candidates |
| **GENE_COMPRESSION_MAP** | Fewer genes per task |
| **doctor / validate** | Map stays aligned before merge |

Details: [KILLER_FEATURE_LARGE_PROJECTS.md](KILLER_FEATURE_LARGE_PROJECTS.md) · [LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md).

---

## 2. Token savings

Repo-wide `rg` is expensive on context. Kit path: `AGENTS.md` → map row → index → 1–2 files.

See [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md) · [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md) — ~**2.5–3×** less context vs bare on discovery (shop-api fixture).

---

## 3. Raising the floor (weak agent)

| Pattern | Without Navigation OS | kit + indexes |
|---------|----------------------|---------------|
| Harness median / success | weak **2.5** / **0%** | **9** / **100%** |
| T05 new module | **4** | **10** |
| T13 release gate | **4** (weak) | **10** |

Not “mini = Opus everywhere” — **rails in git**. [AGENT_FLOOR.md](AGENT_FLOOR.md) · [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

---

## 4. Quality of outcomes

| Dimension | bare / weak | kit standard | kit + indexes |
|-----------|-------------|--------------|---------------|
| Right file first | often miss T01/T07 | map | **index → file** |
| Dangerous command (T04) | no | **yes** | **yes** |
| Docs on new module (T05) | weak | **10** | **10** |
| Scoped search (T08) | repo-wide | map scope | **index** |

---

## 5. Fewer mistakes

| Risk | Gene / artifact | Harness |
|------|-----------------|---------|
| Bulk sed | controlled_changes | T04 |
| Legacy decoy | map + index | T07 |
| Forgot navigation | repo.navigation.index | T05 |
| Gene sprawl | GENE_COMPRESSION_MAP | T06 |

[GENE_ADAPTATION.md](GENE_ADAPTATION.md).

---

## 6. Indexes layer

Indexes complement the map (T02, T08, T12, T14). Typical kit + indexes: median **9**, success **100%**, map-first genetic **~86%**.

Compare **vs bare** on tokens — not indexes vs map as competitors.

---

## 7. After install

1. Fill Tier 0–1 in `AI_NAVIGATION_MAP.md`.
2. Add `AI_INDEX.md` per large subsystem in the same PR as code.
3. Run `doctor` before merge.
4. In chat: map-first — see project `AGENTS.md`.

## Genes

- `repo.tooling.genetic_starter.gen1` · `repo.navigation.index.gen1` · `foundation.ai_gene_interface.gen1`
