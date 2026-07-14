# Doc maintenance task register — Genetic System docs

**Genetic tag:** `repo.tooling.genetic_starter.docs_tasks.gen1`  
**Status legend:** `done` · `open` · `watch`

Living checklist for keeping kit + public mirror + site consistent. Prefer closing items in the same PR that changes inventory or economics narrative.

---

## A. Data integrity (SoT)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| A1 | Regenerate `platform-stats.snapshot.json` when monorepo genes/indexes/map change | **done** (2026-07-10) | `node scripts/export-platform-stats.mjs` → 406 / 186 / 162 / 421 / 27 |
| A2 | Align README EN/RU inventory tables to snapshot | **done** | Was stale ~222 / ~98 / ~267 |
| A3 | Align `GENETIC_SYSTEM_ECONOMICS*.md` inventory to snapshot; remove contradictory old footnote | **done** | |
| A4 | Align `KILLER_FEATURE_LARGE_PROJECTS*.md` lattice line | **done** | |
| A5 | Update `DOC_CLAIMS_AUDIT.md` gene/index/tag claims | **done** | |
| A6 | Keep site HTML hardcodes (406 / 186 / 16 / 12.4×) in sync after next inventory jump | **watch** | `docs/genetic-system-site/index.html` + locales labels |
| A7 | Re-run harness + `export-metrics-snapshot.mjs` when scorer/tasks change | **watch** | Do not invent new harness % without matrix |

---

## B. Public mirror (`agentstack_repo`)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| B1 | Author `docs/genetic-system/` hub + overview + economics | **done** | |
| B2 | Wire README / docs/README / AI_INDEX / BUILD_YOUR_PRODUCT | **done** | |
| B3 | Strip forbidden paths (`philosophy/genes/`, …) per PUBLIC_DOCS_POLICY | **done** | |
| B4 | Add WHATS_NEW bullet for Genetic System docs | **done** | |
| B5 | Link from plugins CONTEXT_FOR_AI (map-first / kit) | **done** | |
| B6 | Add PUBLIC_DOCS_MANIFEST rows for genetic-system | **done** | |
| B7 | Optional: sync narrative into monorepo `docs/` if mirror sync script expects sources there | **open** | Today genetic-system is mirror-authored; decide SoT vs copy |
| B8 | Pre-publish grep for forbidden patterns on `agentstack_repo/docs/genetic-system` | **watch** | Before PR |

---

## C. Kit docs (`genetic-ai-starter`)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| C1 | `GENETIC_SYSTEM_ECONOMICS.md` + `_ru.md` from canvases | **done** | |
| C2 | DOC_HUB + AI_INDEX + README links | **done** | |
| C3 | `DOC_DATA_FLOW.md` — call/data flow map | **done** | |
| C4 | Add economics + data-flow to `check-doc-hub-links.mjs` seeds | **done** | |
| C5 | Cross-link from NAVIGATION_OS | **done** | |
| C6 | REPOSITORY_LINKS: agentstack_repo + genetic-system-site | **done** | |
| C7 | METRICS_GLOSSARY: add fields for platform-stats keys if missing | **done** | |
| C8 | TOKEN_ECONOMICS: one-line pointer to GENETIC_SYSTEM_ECONOMICS | **done** | |
| C9 | FAQ: “Where do 406 / 186 come from?” | **done** | |

---

## D. Flow of calls (agent / human workflow)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| D1 | Document invariant: Intent → tag → map → index → hot files | **done** | overview + NAVIGATION_OS |
| D2 | Separate gene navigation vs neural runtime in economics | **done** | |
| D3 | Document two cost lines (labor primary, tokens secondary) | **done** | |
| D4 | Document regenerate → publish sequence in DOC_DATA_FLOW | **done** | |
| D5 | Ensure doctor/validate docs still point at map maintenance | **watch** | INSTALL / OPERATIONS |

---

## E. Best-practice gates

| ID | Practice | Status |
|----|----------|--------|
| E1 | Never mix harness success % with platform inventory | **done** (labeled) |
| E2 | Never claim 12.36× as “faster shipping” | **done** (caveats) |
| E3 | Monte Carlo / EST labeled as model, not prod A/B | **done** |
| E4 | Public docs: no internal monorepo paths | **done** for genetic-system |
| E5 | Link checker covers new economics docs | **done** |
| E6 | Commit separately per git root when publishing | **open** (user request) |

---

## F. Follow-ups (not blocking)

| ID | Task | Priority |
|----|------|----------|
| F1 | Drive site stats from JSON instead of HTML hardcodes | medium |
| F2 | Add `npm run docs:check-inventory` that diffs README numbers vs snapshot | medium |
| F3 | Mirror genetic-system into monorepo `docs/` for `docs:sync-mirror` | low |
| F4 | PT locale parity check for any new economics paragraphs on site | low |
| F5 | Commit + push agentstack_repo + genetic-ai-starter when Lance asks | — |

---

## Reproduce (inventory refresh)

```bash
cd genetic-ai-starter
node scripts/export-platform-stats.mjs
# then update README*, GENETIC_SYSTEM_ECONOMICS*, KILLER_FEATURE*, DOC_CLAIMS_AUDIT, DOC_DATA_FLOW "current" table
node scripts/check-doc-hub-links.mjs
```

## See also

- [DOC_DATA_FLOW.md](DOC_DATA_FLOW.md)
- [DOC_HUB.md](DOC_HUB.md)
- [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md)
