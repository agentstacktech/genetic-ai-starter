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

## Benchmark numbers in README — are they real?

Until [G38](meta/docs/GAP_REGISTER.md) manual matrix completes, aggregate scores in `benchmarks/results/` are **policy-simulated**. Do not cite them as vendor benchmarks without running [benchmarks/RUNBOOK.md](benchmarks/RUNBOOK.md).

## Easter eggs?

Some installs include optional community genes and `doctor --beacon`. See [COMMUNITY.md](COMMUNITY.md) (no full spoilers).

## Issues: monorepo or public repo?

**Public mirror** for community bugs and PRs. Monorepo `kit` label is for AgentStack maintainers syncing SoT.

## Do I need AgentStack hosted?

No. Standard/minimal profiles work offline in Cursor. Full/founder profiles add optional MCP/8DNA documentation overlays.
