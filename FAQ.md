# FAQ

## What is this kit?

A copy-paste **AI operations** starter: genetic tags, navigation map, Cursor rules, optional AgentStack bridge. Version tracks AgentStack **platform patch** (e.g. `0.4.11`).

## Windows: PowerShell blocks install.ps1

Use **`SETUP.cmd`** or **`node scripts/install.mjs`** — no PowerShell required (0.4.15+). See [meta/docs/INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md).

## Windows: SETUP.cmd says Node not found

Node may be installed but not on Explorer PATH. Reopen terminal after install, or use full path. Kit runs preflight with `E_NODE_MISSING` repair hint.

## Windows: installed into kit folder by mistake

Re-run wizard and pick your **app project** folder. Guard `E_TARGET_IS_KIT` blocks this in 0.4.15+.

## Should kit files be in git?

- **Team shares map/genes:** commit installed files (`--gitignore-kit none`, default for `--yes` CLI).
- **Privacy / local-only AI context:** `--gitignore-kit full` or `GITIGNORE=full` with `install.cmd`. Already-tracked files need `git rm -r --cached` — see `docs/ai/OPERATIONS.md` in your project.

## npx vs cloning the repo

```bash
npx @agentstack/genetic-ai-starter init --yes --target ./my-app --profile standard --project-name "My App" --domain app
```

Requires Node 18+.

## Benchmark numbers in README — what do they mean?

**Task score (0–10):** sum of rubric dimensions per task (correct files, navigation path, scope, outcome, efficiency). **Success** = score ≥ 6. **Median** = middle value across 14 tasks — use with **success rate** and task table T04/T05/T13.

Harness: `shop-api`, 14 tasks, scorer **1.2.1**, synthetic policy transcripts. Run locally:

```bash
node benchmarks/scripts/prepare-all-arms.mjs --force
node benchmarks/scripts/run-matrix.mjs
```

**Why `agents_md` median looks high (8):** benchmark arm with **optimistic** transcripts, not your production agent. Map-first (genetic) is only **7%**; arm `agents_md_weak` (same AGENTS file, pessimistic transcripts) median **2.5**. Compare **kit + indexes**: success **100%**, map-first **86%**.

**What kit improves vs bare:** T04 refusal **2→8**, T05 maintenance **4→10**, T13 release gate, T08 **10** with indexes. Primary narrative: [AI_RELEASE_AUTONOMY_ru.md](meta/docs/AI_RELEASE_AUTONOMY_ru.md). Metrics: [METRICS_GLOSSARY.md](meta/docs/METRICS_GLOSSARY.md).

**What we do not claim:** Cursor/vendor certification — validate on **your** repo via [benchmarks/METHODOLOGY.md](benchmarks/METHODOLOGY.md) § Manual validation.

## Where do 406 genes / 186 indexes come from?

Those are **platform inventory** counts from [`meta/docs/platform-stats.snapshot.json`](meta/docs/platform-stats.snapshot.json) (`philosophyGenes`, `aiIndexFilesRepoTotal`), regenerated with `node scripts/export-platform-stats.mjs`. They are **not** harness scores. Harness weak→kit numbers live in [`metrics.snapshot.json`](meta/docs/metrics.snapshot.json). See [DOC_DATA_FLOW.md](meta/docs/DOC_DATA_FLOW.md) and [GENETIC_SYSTEM_ECONOMICS.md](meta/docs/GENETIC_SYSTEM_ECONOMICS.md).


## Can a cheap / weak agent match top models?

**On repo-bound engineering tasks — often yes for stability, not for everything.** The kit raises the **floor**: harness arm `agents_md_weak` scores median **2.5**, **0%** success; **kit + indexes** scores median **9**, **100%** success on the same 14 tasks. That is not “mini = Opus on product design”; it is **map + genes + doctor** so weak agents stop grep/sed chaos and hit T04/T05/T13 consistently. Full narrative: [AGENT_FLOOR.md](meta/docs/AGENT_FLOOR.md) · RU: [AGENT_FLOOR_ru.md](meta/docs/AGENT_FLOOR_ru.md). Evidence table: [DOC_CLAIMS_AUDIT.md](meta/docs/DOC_CLAIMS_AUDIT.md).

## Easter eggs?

Some installs include optional community genes and `doctor --beacon`. See [COMMUNITY.md](COMMUNITY.md) (no full spoilers).

## Issues: monorepo or public repo?

**Public mirror** for community bugs and PRs. Monorepo `kit` label is for AgentStack maintainers syncing SoT.

## Do I need AgentStack hosted?

No. Standard/minimal profiles work offline in Cursor. Full/founder profiles add optional MCP/8DNA documentation overlays.
