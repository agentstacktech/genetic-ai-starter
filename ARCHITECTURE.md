# Architecture — Genetic AI Starter Kit

## Purpose

Portable **map-first** layer for AI-assisted development: philosophy genes → navigation map → subsystem indexes → Cursor rules/skills → optional AgentStack extension.

The kit does **not** include platform runtime, databases, or hosted AgentStack.

## Components

```mermaid
flowchart LR
  subgraph kit [Kit package]
    Profiles[profiles/*.json]
    Payload[payload/]
    Scripts[scripts/]
  end
  subgraph target [Consumer repo]
    Lock[.genetic-ai/kit.lock.json]
    Agents[AGENTS.md]
    Map[docs/ai/AI_NAVIGATION_MAP.md]
    Cursor[.cursor/rules + skills]
  end
  Profiles --> Scripts
  Payload --> Scripts
  Scripts -->|install.mjs| target
```

| Path | Role |
|------|------|
| `profiles/` | File globs per install profile (minimal, standard, full, founder) |
| `payload/` | Templates copied into consumer tree |
| `scripts/install.mjs` | Copy, merge `.cursorrules`, write lock file |
| `scripts/init.mjs` | Interactive wizard → install |
| `scripts/doctor.mjs` | Health check + optional `--beacon` |
| `scripts/validate-kit.mjs` | Maintainer integrity before release |
| `benchmarks/` | Synthetic fixture + rubric for methodology comparison |

## Version resolution

Order: `AGENTSTACK_CORE_VERSION` env → `shared/constants.py` (monorepo) → `PLATFORM_VERSION` file → `KIT_MANIFEST.json`.

## Repository model

- **SoT:** `genetic-ai-starter/` in AgentStack monorepo
- **Public mirror:** `github.com/AgentStack/genetic-ai-starter` (synced by release Action)
- **Distribution:** npm `@agentstack/genetic-ai-starter`, GitHub template repo

## Extension boundary

`extensions/agentstack/` adds MCP/8DNA routing excerpts and extra rules when `--with-agentstack` or full/founder profiles are selected. Consumers without AgentStack use standard/minimal profiles only.

## Further reading

- [meta/docs/INSTALL.md](meta/docs/INSTALL.md)
- [meta/docs/PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md)
- [payload/docs/ai/AI_INDEXING_SYSTEM.md](payload/docs/ai/AI_INDEXING_SYSTEM.md) (installed copy)
