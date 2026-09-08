# AgentStack Cursor plugin + Genetic AI Starter (combo)

**Platform:** 0.4.18  
**Genes:** `repo.tooling.genetic_starter.gen1`, `repo.tooling.genetic_starter.agentstack_dx.gen1`  
**ADR:** [GENETIC_STARTER_PLUGIN_KIT_TRIANGLE.md](../../../docs/adr/GENETIC_STARTER_PLUGIN_KIT_TRIANGLE.md)

For AgentStack consumer projects, install **both** surfaces:

| Surface | Delivers |
|---------|----------|
| **Genetic AI Starter** (`agentstack-app`) | Navigation map, genes, SDK bootstrap, recipes, slim `.cursor` rules |
| **Cursor AgentStack plugin** | MCP `agentstack.execute`, OAuth/Device Code, domain skills, hot-path routing |

## Quick path (recommended)

### 1. Kit — tooling + navigation

```bash
# Submodule (recommended)
git submodule add https://github.com/agentstacktech/genetic-ai-starter.git tools/genetic-ai-starter
git submodule update --init tools/genetic-ai-starter
node tools/genetic-ai-starter/scripts/bootstrap-standard.mjs --target . --project-name "My App" --domain app
node tools/genetic-ai-starter/scripts/install.mjs --target . --profile agentstack-app --strict
```

Or npm:

```bash
npm install -D @agentstack/genetic-ai-starter@0.4.18
npx genetic-ai-init init --yes --target . --profile agentstack-app --project-name "My App" --domain app
```

### 2. Recipes + SDK

```bash
cd examples/agentstack
npm install @agentstack/sdk@0.4.18
cp ../../.env.example ../../.env.local   # or project root .env.local
npm run recipe:00-bootstrap
```

Python (partial set — 00, 02, 03 only):

```bash
node tools/genetic-ai-starter/scripts/install.mjs --target . --profile agentstack-app --lang python
cd examples/agentstack-python
pip install agentstack-sdk
python 00-bootstrap.py
```

### 3. Cursor plugin

1. Install **AgentStack** from [Cursor Marketplace](https://cursor.com/marketplace) (or local copy under `~/.cursor/plugins/local/agentstack/`).
2. In chat: **Connect** on the AgentStack MCP server, or run `/agentstack-authorize`.
3. Run `/agentstack-init` for project scaffolding hints.

Plugin source (maintainers): `provided_plugins/cursor-plugin/README.md` in the AgentStack monorepo.

### 4. Verify combo

```bash
node tools/genetic-ai-starter/scripts/doctor.mjs --target .
node tools/genetic-ai-starter/scripts/check-capability-contract.mjs --target .
```

In Cursor: ask the agent to run `discovery.list` or a recipe step — plugin supplies MCP; kit supplies `docs/ai/CONTEXT_FOR_AI.md` and `src/lib/agentstack.ts`.

## What each surface owns

| Need | Use |
|------|-----|
| Map-first navigation, philosophy genes | Kit `docs/ai/`, `philosophy/` |
| MCP action routing table | Plugin skill `agentstack-backend` (SoT: monorepo `CONTEXT_FOR_AI_MCP.md`) |
| Typed SDK client | Kit overlay `src/lib/agentstack.ts` |
| 8DNA / payments / RAG without custom backend | Plugin rules + MCP |
| Upgrade kit payload | `upgrade.mjs --sync-submodule` |
| Plugin version | Marketplace / separate publish repo — tracks platform `0.4.18` |

## Rules overlap

See [RULES_PLUGIN_KIT_MATRIX.md](RULES_PLUGIN_KIT_MATRIX.md). Kit installs `agentstack-sdk-first`; plugin installs `agentstack-prefer` and domain skills — **complement, not duplicate**.

## Monorepo developers

When editing AgentStack platform itself, use the plugin `agentstack-platform-monorepo` rule; kit `MAINTAINERS.md` points to `docs/genetic-ai-starter-maintainers/`. Do not run consumer `install.mjs` against `genetic-ai-starter/` kit root (`E_TARGET_IS_KIT`).

## Optional: kit without plugin

Valid for Navigation OS-only repos (no live MCP). Install `standard` profile instead of `agentstack-app`.

## Optional: plugin without kit

Valid for quick MCP experiments. You lose map/genes/recipes until you add the kit later.
