# AI intent router — pointer (kit consumers)

**Genetic tag:** `repo.engineering.ai_navigation.retrieve.gen1`

Kit projects use **map-first navigation** (`docs/ai/AI_NAVIGATION_MAP.md`). The monorepo **intent router** disambiguates docs-nav vs MCP tools vs file paths — do not duplicate it in consumer repos.

| SoT | Location |
|-----|----------|
| **Authoritative** | AgentStack monorepo `docs/AI_AGENT_INTENT_ROUTER.md` |
| **Kit entry** | `AGENTS.md` → `docs/ai/AI_NAVIGATION_MAP.md` → local `AI_INDEX.md` |

Upstream: https://github.com/agentstacktech/AgentStack/blob/master/docs/AI_AGENT_INTENT_ROUTER.md

**Note:** Runtime MCP capability discovery uses `GET /mcp/actions` or `agentstack.execute` with `discovery.list` — not docs-nav catalog rows.
