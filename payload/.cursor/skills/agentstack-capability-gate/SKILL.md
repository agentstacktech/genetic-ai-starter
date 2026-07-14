---
name: agentstack-capability-gate
description: Route user intent to the correct AgentStack skill or MCP domain using capability snapshot and cursor-plugin intent evals. Use before picking SDK module, MCP action, or feature implementation path.
---

# AgentStack capability gate (intent → action)

**Genetic tag:** `repo.platform.capability_contract.gen1`

## When to use

- Ambiguous task spanning auth, commerce, hosting, messenger, etc.
- Agent might pick wrong SDK export or invent REST
- User prompt matches platform feature keywords

## Routing table (align with cursor-plugin evals)

| User intent (keywords) | Skill / domain |
|------------------------|----------------|
| login, email/password, RBAC, admin role | `agentstack-auth-rbac` / auth |
| publish URL, hosting quick start | `agentstack-hosting` / hosting |
| support ticket, staff inbox | `agentstack-support` / support |
| upload, avatar, file quota | `agentstack-storage` / storage |
| DM, channel feed, messenger | `agentstack-messenger` / social |
| Slack webhook, integration recipe | `agentstack-integrations` / integrations |
| discover page, Cmd+K compass | `agentstack-discovery` / discovery |
| TypeScript SDK, react query invalidate | `agentstack-sdk` → **agentstack-sdk-bootstrap** |
| trial on signup, logic rule | `agentstack-logic` / logic |
| semantic search docs, RAG ingest | `agentstack-rag` / rag |
| new project, API key | `agentstack-projects` / projects |
| feature flags, 8DNA sandbox | `agentstack-data` → **agentstack-8dna-data** |
| wallet charge, marketplace | `agentstack-commerce` / commerce |
| digital goods wizard | `agentstack-commerce-assets` / assets |
| cron digest, signals | `agentstack-signals` / scheduler |
| deploy AI agent tickets | `agentstack-agents-ai` / agentsFleet |
| comfort task onboarding | `agentstack-capability-tasks` / capability-tasks |
| Solana grant MCP | `solana` (scoped actions only) |

Source of truth for eval prompts: `provided_plugins/cursor-plugin/evals/intent-routing.yaml`.

## Steps

1. Read `docs/ai/agentstack-capability-snapshot.json` — match `domainCapabilities` / `platformCapabilities`.
2. Call `sdk.getCapabilityMatrix()` — skip disabled domains.
3. Pick channel: MCP action id > `sdk.protocol` > 8DNA KV.
4. Open the matched Cursor skill (this table) before editing code.
5. Block integrator use of `sdk.admin`, `adminData`, `/api/admin/*`.

## Do not

- Do not implement NextAuth/Prisma when user asked AgentStack auth (eval: forbid `nextauth`, `prisma`).
- Do not route hosting tasks to generic REST without checking MCP hosting actions.

## Done when

Intent maps to one skill, capability is enabled, and channel is named in the plan.
