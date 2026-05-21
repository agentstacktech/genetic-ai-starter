# Genetic AI Starter Kit

[![license](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![platform](https://img.shields.io/badge/platform-0.4.11-informational)](PLATFORM_VERSION)

**Turn any repository into an agent-friendly project in minutes** — with a navigation map, shared vocabulary (genetic tags), Cursor rules, and optional hooks into the [AgentStack](https://agentstack.tech/?utm_source=genetic-ai-starter) platform.

You get **structure before scale**: agents (and humans) open the map and indexes first, then 1–2 hot files — instead of blind repo-wide search.

---

## What problem it solves

| Without the kit | With the kit |
|-----------------|--------------|
| Agents `grep` the whole tree and miss the right module | **Map-first:** `AI_NAVIGATION_MAP.md` points to the right subtree |
| Every repo invents its own `AGENTS.md` / rules from scratch | **Reusable philosophy + genes** — controlled changes, ADRs, testing discipline |
| Cursor rules drift or duplicate on upgrade | **Idempotent install** — one merged `.cursorrules` block, repair/upgrade scripts |
| No way to compare “rules only” vs “map + rules” | **Benchmark harness** — comparable arms (`bare`, `agents_md`, `kit_standard`, …) |
| Platform docs mixed into app repos | **Optional AgentStack extension** — MCP/8DNA routing excerpt, not required for local Cursor work |

---

## What you get (after `init` / `install`)

Concrete artifacts in **your** project (profile-dependent):

| Layer | Files / tools | Benefit |
|-------|----------------|--------|
| **Entry contract** | `AGENTS.md` | One place: order of reading, profile, kit version |
| **Navigation** | `docs/ai/AI_NAVIGATION_MAP.md`, templates, `AI_INDEXING_SYSTEM.md` | Semantic addresses (`app.api.handlers.gen1`) → paths |
| **Philosophy** | `philosophy/genes/`, `GENE_INDEX`, compression map | Compress “how we work” into genes agents can cite |
| **Cursor** | `.cursor/rules/*.mdc`, `.cursor/skills/`, merged `.cursorrules` | Map-first, controlled edits, index authoring — out of the box |
| **Operations** | `docs/ai/OPERATIONS.md`, `doctor`, `repair`, `upgrade` | Health checks and fix partial installs |
| **Scaffolding** | `new-gene.mjs` | New genetic tags without inventing file shape |
| **Privacy** | `--gitignore-kit full` | Keep AI context local — not committed to git |
| **Platform bridge** | `extensions/agentstack` (full/founder) | MCP → 8DNA → command bus routing for AgentStack consumers |
| **CI sample** | `.github/workflows/genetic-ai-validate.yml.sample` | Validate install in consumer pipelines |

Lock file `.genetic-ai/kit.lock.json` records profile, version, and extensions — reproducible upgrades.

---

## Measured impact (benchmark harness)

Reference repo **`shop-api`**, **11 discovery/edit tasks**, profile **`standard`** vs bare / README / AGENTS.md. Full task table and real-world scenarios: [BENEFITS_AND_METRICS.md](meta/docs/BENEFITS_AND_METRICS.md). Reproduce: [benchmarks/RUNBOOK.md](benchmarks/RUNBOOK.md).

| Metric | Bare repo | AGENTS.md only | **kit standard** | kit + indexes |
|--------|-----------|----------------|------------------|---------------|
| Median task score (0–10) | 6 | 8 | **8** | 7 |
| Success rate | 64% | 91% | **91%** | 82% |
| Unscoped repo-wide search (11 tasks) | **13** | 0 | **1** | **0** |
| Map-first navigation | 0% | 64% | **36%** | **73%** |

**Versus bare:** **−12** blind greps · **+2** median score · T04 bulk `sed` **2→8** · T05 new module docs **5→10** · T07 decoy checkout **1→5–7**.

### Example scenarios (what changes in Cursor)

<details>
<summary><strong>T01 — production entrypoint, not the dev trap</strong></summary>

Prompt: *“Where is the production HTTP server (not dev)?”*

- **Without kit:** **5/10** — opens `devServer.ts` or README noise.
- **With kit:** **8/10** — map row → `src/server.ts`.

</details>

<details>
<summary><strong>T02 — JWT validation without repo-wide grep</strong></summary>

Prompt: *“Where is JWT validated for incoming requests?”*

- **Without kit:** **6/10** — greps `jwt` across the tree.
- **With kit:** **7/10** — `auth` subsystem from map; with filled indexes, map-first and scoped search.

</details>

<details>
<summary><strong>T03 — webhook delivery touches two files</strong></summary>

Prompt: *“Webhook timeout — which HTTP client and delivery code?”*

- **Both arms** can pass (**6/10**), but bare uses **4×** unscoped grep; kit opens `delivery.ts` + `httpClient.ts` from map rows.

</details>

<details>
<summary><strong>T04 — refuse destructive one-liner</strong></summary>

Prompt: *“Rename <code>verifyJwt</code> with <code>sed</code> across all of <code>src/</code>.”*

- **Without kit:** **2/10** — mass rename suggested or run.
- **With kit:** **8/10** — controlled-changes gene + rule; scoped, reviewed edits.

</details>

<details>
<summary><strong>T05 — new folder → update navigation</strong></summary>

Prompt: *“We added <code>src/billing/</code> — what AI docs to update?”*

- **Without kit:** **5/10**.
- **With kit:** **10/10** — `AI_NAVIGATION_MAP` Tier 1 + `AI_INDEX.md` + compression map.

</details>

<details>
<summary><strong>T06 — multi-area change: where to start</strong></summary>

Prompt: *“Change auth and public OpenAPI — where to start?”*

- **Without kit:** **6/10** — random grep.
- **With kit:** **7/10** — reads `GENE_COMPRESSION_MAP` + map before opening genes.

</details>

<details>
<summary><strong>T07 — avoid legacy decoy checkout</strong></summary>

Prompt: *“Where is checkout implemented?”*

- **Without kit:** **1/10** — `billing/legacy/oldCheckout.ts`.
- **With kit:** **5–7/10** — canonical paths from map (`invoices`, catalog routes).

</details>

<details>
<summary><strong>T08 — catalog bug with scoped search</strong></summary>

Prompt: *“Product filter <code>?active=1</code> broken — find and fix.”*

- **Without kit:** **7/10** — may grep all of `src/`.
- **With kit + indexes:** up to **10/10** — searches under `catalog/` only.

</details>

<details>
<summary><strong>Real team week (after <code>init --profile standard</code>)</strong></summary>

| Day | What you do | Kit effect |
|-----|-------------|------------|
| 0 | `npx @agentstack/genetic-ai-starter init` | AGENTS.md + map template + rules merged |
| 1 | Fill Tier 0–1 (auth, catalog, webhooks) | T01/T03-style prompts land in right folders |
| 2 | New engineer + Cursor | Reads map first — same paths as senior |
| 3 | Add `src/billing/` | Agent reminds: map + index (T05) |
| 4 | `doctor` before PR | Broken map links caught in CI |

</details>

Track your own ROI: [ROI_PLAYBOOK.md](meta/docs/ROI_PLAYBOOK.md).

---

## Outcomes you can expect

- **Faster onboarding** — map → index → 1–2 files (documented in `AGENTS.md`).
- **Fewer wrong-module edits** — genetic tags + decoy resistance (T07).
- **Cheaper sessions** — **1** unscoped grep vs **13** on bare (same 11-task matrix).
- **Safer edits** — engineering genes block throwaway bulk patches (T04).
- **Navigation stays current** — maintenance genes when subsystems grow (T05).
- **Reproducible upgrades** — `kit.lock.json` + `upgrade.mjs` + `doctor.mjs`.

---

## Who it is for

- **New products** — greenfield repo, standard or full profile.
- **Existing codebases** — install into `--target`; use `repair` if philosophy was partial.
- **Small repos** — `minimal` profile: AGENTS + stub map + 2 rules.
- **AgentStack integrators** — `full` / `founder` + extension overlay.
- **Teams that want local-only AI context** — `gitignore-kit full`.

**Not for:** single-file scripts, throwaway spikes with no structure — use minimal or skip.

---

## Quick start (30s)

**npm (recommended):**

```bash
npx @agentstack/genetic-ai-starter init --yes --target ./my-app --profile standard --project-name "My App" --domain app
```

**Windows:** double-click [`SETUP.cmd`](SETUP.cmd) in the kit folder.

**From clone:**

```bash
node scripts/init.mjs
```

Manual flags: [meta/docs/INSTALL.md](meta/docs/INSTALL.md) · Windows: [meta/docs/INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md)

[![Use this template](https://img.shields.io/badge/GitHub-Use%20this%20template-238636)](https://github.com/agentstacktech/genetic-ai-starter-template/generate)

---

## Profiles

| Profile | Best for | AgentStack |
|---------|----------|------------|
| minimal | Tiny repos, experiments | optional |
| **standard** | Most new projects (**default**) | optional |
| full | Platform consumer + CI sample | included |
| founder | Same as full; direct-ship gene emphasis | included |

[PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md) · [ROI_PLAYBOOK.md](meta/docs/ROI_PLAYBOOK.md)

---

## Privacy mode

`--gitignore-kit full` keeps philosophy, map, and Cursor kit files on disk for agents but out of git — see [FAQ.md](FAQ.md).

---

## Repositories

| Repo | Branch |
|------|--------|
| [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) (this kit) | `main` |
| [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) (platform SoT) | `master` |

Developed in AgentStack monorepo `genetic-ai-starter/`; releases here and on npm. [REPOSITORY_LINKS.md](meta/docs/REPOSITORY_LINKS.md)

---

## Docs

| Doc | Topic |
|-----|--------|
| [BENEFITS_AND_METRICS.md](meta/docs/BENEFITS_AND_METRICS.md) | **Metrics, all tasks T01–T11, real-world scenarios** |
| [GETTING_STARTED.md](meta/docs/GETTING_STARTED.md) | First steps |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Install flow and components |
| [FAQ.md](FAQ.md) | Common questions |
| [COMMUNITY.md](COMMUNITY.md) | Contributing, showcase |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Issues on **this repo** |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |

## AgentStack platform (optional)

SDK, MCP, hosted services: https://agentstack.tech/?utm_source=genetic-ai-starter

## Russian README

[README.md](README.md) · [COMMUNITY_ru.md](COMMUNITY_ru.md)

## License

Apache-2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).
