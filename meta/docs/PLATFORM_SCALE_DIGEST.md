# AgentStack — platform scale and Navigation OS wins

**Genetic tag:** `repo.tooling.genetic_starter.scale_digest.gen1`  
**RU:** [PLATFORM_SCALE_DIGEST_ru.md](PLATFORM_SCALE_DIGEST_ru.md)  
**SoT:** [platform-stats.snapshot.json](platform-stats.snapshot.json) · regenerate: `node scripts/export-platform-stats.mjs`

> **Creation over Conflict:** one snapshot merges navigation inventory, MCP publication, gene bench, and harness KPIs — no fourth hand-edited SoT.  
> **Observability first:** README and economics read only the snapshot; `check-readme-inventory` catches drift.

---

## 1. Three metric planes (do not mix)

| Plane | File | Question |
|-------|------|----------|
| **Platform inventory** | `platform-stats.snapshot.json` | How many genes, indexes, MCP actions, clusters? |
| **Harness (shop-api)** | `metrics.snapshot.json` | How reliably does an agent score on 14 tasks? |
| **ROI model** | `roi-model.snapshot.json` | Hours/$ per year by team tier? |

Harness ≠ live Cursor. Inventory ≠ “12× faster release”. See [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

---

## 2. Navigation OS — addresses instead of blind grep

The genetic system provides **semantic addresses** (`domain.subsystem.role.gen1`) → row in `AI_NAVIGATION_MAP.md` → `AI_INDEX.md` → 1–2 hot files.

| Metric | Value | Win |
|--------|-------|-----|
| Philosophy genes | **498** | Shared vocabulary for decisions and ADRs |
| `AI_INDEX.md` | **244** / **219** platform | Per-subsystem maps without full-repo walks |
| Tier-1 tags | **546** | Stable names in PRs, genes, MCP routing |
| Scoped scan roots | **21** | Inventory in ~3–5s vs full-repo ~15s |
| Compression clusters | **38** | Long-tail genes folded into umbrella clusters |
| Philosophy token compression | **12.36×** | `pillar_resolved` 8.3k tok vs naive 103k |

**Pattern:** map → index → file (KISS). One meaning — one canonical contour (SOLID: single responsibility per subsystem).

---

## 3. AgentStack runtime — what the platform already ships

Kit consumers with `--with-agentstack` get an overlay on a **ready substrate**, not a from-scratch rebuild.

| Metric | Value | “Build from scratch” equivalent (order of magnitude) |
|--------|-------|------------------------------------------------------|
| Public MCP actions | **568** | Months of auth/payments/RAG/rules integrations |
| MCP domains | **48** | Dozens of bounded contexts |
| Registry tools | **593** | Runtime `MCP_TOOLS_REGISTRY` |
| IDE entry | **1** | `agentstack.execute` — batch + discovery |
| Plugin surfaces | **4** | Cursor / Claude / GPT / VS Code |

Details: monorepo [PLATFORM_SCALE.md](../../../docs/publication/PLATFORM_SCALE.md).

---

## 4. Kit harness — measured agent floor lift

Synthetic `shop-api` fixture, scorer **1.2.1**, **14** tasks, **9** arms.

| Arm | Median | Success ≥6 | Map-first |
|-----|-------:|-----------:|----------:|
| `agents_md_weak` | 2.5 | 0% | 0% |
| `bare` | 5.5 | 50% | 0% |
| `kit_standard` | 8 | 93% | 50% |
| `kit_standard_indexed` | **9** | **100%** | **86%** |

**Key task deltas:** T04 (bulk sed) **2→8**, T05 (map+index) **4→10**, T13 (release gate) **4→10**.

**Tokens (step model, not API billing):** bare median ~2.3k → kit+idx ~1.1k; unscoped grep **18 → 0** on indexed arm.

---

## 5. Economics (synthesis)

| Lever | Effect |
|-------|--------|
| **Engineer calendar** | Fewer wrong-tree PRs, onboarding via tags |
| **Tokens** | Shorter discovery path; stable prefix → prompt caching |
| **Platform SDK** | Auth 2–4 wk, payments 2–5 wk, dual-shell 3–6 wk — not rebuilt |
| **ROI tiers** | solo ~$4.1k/yr → 15+ monorepo ~$49k/yr — [roi-model.snapshot.json](roi-model.snapshot.json) |

Full synthesis: [GENETIC_SYSTEM_ECONOMICS.md](GENETIC_SYSTEM_ECONOMICS.md).

---

## 6. Codegen chain (maintainers)

```text
philosophy/bench_gene_access.json ──┐
docs/publication/platform-stats.json ─┼─► export-platform-stats.mjs ─► kit snapshot
meta/docs/metrics.snapshot.json ────┘
         │
         ▼
check-readme-inventory · audit:docs · sync-smoke
```

Monorepo MCP refresh: `node scripts/codegen-platform-stats.mjs` (AgentStack root).

---

## 7. Further work

See [GENETIC_SCALE_METRICS_DECOMPOSITION.md](GENETIC_SCALE_METRICS_DECOMPOSITION.md) — waves M0–M8 with detailed tasks.

---

## See also

| Doc | Topic |
|-----|-------|
| [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) | Harness definitions |
| [DOC_DATA_FLOW.md](DOC_DATA_FLOW.md) | Doc data flows |
| [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md) | Running the harness |
