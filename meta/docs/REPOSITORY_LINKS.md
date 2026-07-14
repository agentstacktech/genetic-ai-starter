# Repository links (canonical)

Use these URLs in kit docs, genes, and consumer-facing copy. **Do not** use the `AgentStack/` org slug on GitHub — the org is **`agentstacktech`**.

| Role | GitHub | Default branch | Local path (monorepo clone) |
|------|--------|----------------|-----------------------------|
| **Genetic AI Starter Kit** (this package) | [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) | `main` | `genetic-ai-starter/` inside platform clone |
| **AgentStack platform** (runtime, MCP, frontend, grants docs) | [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) | `master` | Clone repo root; kit is a subdirectory |
| **Public docs mirror** (articles, SDK index) | [agentstacktech/agentstack_repo](https://github.com/agentstacktech/agentstack_repo) | `main` | `agentstack_repo/` workspace copy |
| **Genetic System site** (RU/EN/PT explainer) | [AgentStack/docs/genetic-system-site](https://github.com/agentstacktech/AgentStack/tree/master/docs/genetic-system-site) | `master` | `docs/genetic-system-site/` in platform clone |

## URL templates

| Use | URL |
|-----|-----|
| Kit repo home | `https://github.com/agentstacktech/genetic-ai-starter` |
| Kit file on `main` | `https://github.com/agentstacktech/genetic-ai-starter/blob/main/<path>` |
| Kit issues / PRs | `https://github.com/agentstacktech/genetic-ai-starter/issues` |
| Kit Discussions | `https://github.com/agentstacktech/genetic-ai-starter/discussions` |
| Kit CI badge | `https://github.com/agentstacktech/genetic-ai-starter/actions/workflows/ci.yml` |
| Platform repo home | `https://github.com/agentstacktech/AgentStack` |
| Platform file on `master` | `https://github.com/agentstacktech/AgentStack/blob/master/<path>` |
| Platform README | `https://github.com/agentstacktech/AgentStack/blob/master/README.md` |
| Grants evidence (monorepo) | `https://github.com/agentstacktech/AgentStack/blob/master/docs/grants/GENETIC_AI_STARTER_OSS_EVIDENCE.md` |
| Public Genetic System docs | `https://github.com/agentstacktech/agentstack_repo/tree/main/docs/genetic-system` |
| Kit economics (canvases) | `https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/GENETIC_SYSTEM_ECONOMICS.md` |
| Template repo (when published) | `https://github.com/agentstacktech/genetic-ai-starter-template` |

## npm

- Package: `@agentstack/genetic-ai-starter`
- Install: `npx @agentstack/genetic-ai-starter init`

## Maintainer sync secret

`KIT_MIRROR_REPO` = `agentstacktech/genetic-ai-starter` (not `AgentStack/...`).
