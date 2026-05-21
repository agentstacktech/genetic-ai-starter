# AgentStack — Capability map for AI (consumer excerpt)

**Kit extension** · Canonical: AgentStack `docs/plugins/CONTEXT_FOR_AI.md` · Gene: `repo.plugins.capability_routing.gen1`

Use when this project calls AgentStack via MCP, SDK, or 8DNA KV.

---

## Order of preference (channels)

1. **MCP** — `POST /mcp` with `agentstack.execute`; discover actions via `GET /mcp/actions`.
2. **8DNA REST KV** — `GET/POST /api/dna/data` with `project.data.*` / `user.data.*`.
3. **Command bus** — `POST /api/commands/execute`.
4. **Avoid** new REST resources when an MCP action or DNA key already fits.

---

## Domain map (intent → domain)

| Domain | Intent signals |
|--------|----------------|
| **8DNA** | store, config, variant, sandbox |
| **Auth** | login, session, profile |
| **RBAC** | role, permission, admin |
| **Logic** | when X then Y, rule, automation |
| **RAG** | embedding, knowledge base, semantic search |
| **Storage** | upload, file, attachment |
| **Sandbox / A/B** | experiment, canary, rollout *(tenant app on AgentStack)* |

Full table: upstream `CONTEXT_FOR_AI.md` and `MCP_CAPABILITY_MATRIX.md`.

---

## Agent reminders

- Discover actions — do not guess MCP action names.
- Scoped API keys with narrow `service_caps`.
- **Tenant canary** applies to apps on the platform, not by default to every local fix — see `.cursor/rules/platform-vs-tenant-canary.mdc`.
- If `repo.engineering.founder_direct_ship.gen1` is installed, founder sessions ship single-path unless rollout is explicitly requested.

---

## Robot-ready snapshot

Project `data` JSON may serve as instruction context for agents; never replace auth or leak secrets into prompts.
