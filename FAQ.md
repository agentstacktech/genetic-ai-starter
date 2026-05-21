# FAQ

## What is this kit?

A copy-paste **AI operations** starter: genetic tags, navigation map, Cursor rules, optional AgentStack bridge. Version tracks AgentStack **platform patch** (e.g. `0.4.11`).

## Windows: PowerShell blocks install.ps1

Use **`SETUP.cmd`** or **`install.cmd`** — they bypass default ExecutionPolicy. See [meta/docs/INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md).

## Should kit files be in git?

- **Team shares map/genes:** commit installed files (`--gitignore-kit none`, default for `--yes` CLI).
- **Privacy / local-only AI context:** `--gitignore-kit full` or `GITIGNORE=full` with `install.cmd`. Already-tracked files need `git rm -r --cached` — see `docs/ai/OPERATIONS.md` in your project.

## npx vs cloning the repo

```bash
npx @agentstack/genetic-ai-starter init --yes --target ./my-app --profile standard --project-name "My App" --domain app
```

Requires Node 18+.

## Benchmark numbers in README — what do they mean?

Scores come from our **reproducible harness** on a reference API repo (`shop-api`, 11 tasks, 7 arms). Run the same matrix locally:

```bash
node benchmarks/scripts/prepare-all-arms.mjs --force
node benchmarks/scripts/run-matrix.mjs
node benchmarks/scripts/analyze-results.mjs
```

**What the kit improves (measured vs bare):** median **6→8**, unscoped grep **13→1**, map-first **0%→36%** ( **73%** with indexes), T04 bulk-edit refusal **2→8**, T05 maintenance **5→10**. Task-by-task table: [BENEFITS_AND_METRICS.md](meta/docs/BENEFITS_AND_METRICS.md).

**What we do not claim:** vendor certification from Cursor or model vendors — run the harness on **your** repo for your own baseline.

## Easter eggs?

Some installs include optional community genes and `doctor --beacon`. See [COMMUNITY.md](COMMUNITY.md) (no full spoilers).

## Issues: monorepo or public repo?

**Public mirror** for community bugs and PRs. Monorepo `kit` label is for AgentStack maintainers syncing SoT.

## Do I need AgentStack hosted?

No. Standard/minimal profiles work offline in Cursor. Full/founder profiles add optional MCP/8DNA documentation overlays.
