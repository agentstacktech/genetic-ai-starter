# Comparison — agent navigation methods

**Metrics:** [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · **Tokens:** [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md)

## Genes

`repo.tooling.genetic_starter.benchmark.gen1`

---

## Matrix (7 methods × 12 criteria)

Legend: ● strong · ○ partial · — weak

| Criterion | bare | readme_tree | agents_md | generic rules | RAG-only* | kit_standard | kit + indexes |
|-----------|------|-------------|-----------|---------------|-----------|--------------|---------------|
| Discovery simple | ○ | ● | ● | ○ | ○ | ● | ● |
| Discovery multi-file | — | ○ | ○ | ○ | ○ | ● | ● |
| Maintenance T05 | — | — | ○ | — | — | ● | ○ |
| Safety T04 refuse | — | ○ | ● | ● | — | ● | ● |
| Legacy trap T07 | — | ○ | ● | ○ | — | ○ | ○ |
| Monorepo scale | — | — | — | — | ○ | ● | ● |
| Token cost (est.) | — | ○ | ○ | ○ | ○ | ● | ● |
| Team shareable | ○ | ● | ● | ● | ○ | ● | ● |
| CI enforceable | — | — | — | — | — | ● | ● |
| Genetic tags | — | — | — | — | — | ● | ● |
| Cross-PR stability | — | — | — | — | — | ● | ● |
| Platform smoke S04 | — | — | — | — | — | ●† | ●† |

\*RAG-only: conceptual baseline (not a harness arm). †With AgentStack extension / full profile.

**Pessimistic AGENTS:** arm `agents_md_weak` — median **3**, success **0%** (scorer 1.1.1).

## Hybrid: kit + RAG (recommended at scale)

| Layer | Role |
|-------|------|
| Navigation OS | Code boundaries, hot files, legacy warnings |
| RAG / embeddings | Long prose, logs, unstructured docs |

Do not drop Tier 1 map rows when adding RAG — indexes remain SoT for **where** to edit.

## Industry patterns (roadmap)

| Pattern | Kit fit |
|---------|---------|
| Lost-in-middle mitigation | Short map/index first in context |
| Map-Reduce tasks | Tier 1 = map phase; files = reduce |
| RAPTOR summaries | `AI_INDEX` as subtree summary |
| Index drift detection | `doctor` P2 — map row ↔ folder |
| SDK agent graph export | G40 — lock + map JSON |

## Cursor memory vs genes

See [GENE_ADAPTATION.md](GENE_ADAPTATION.md).
