# AgentStack — Capability map for AI (consumer excerpt)

**Kit extension** · **Gene:** `repo.plugins.capability_routing.gen1`  
**Canonical upstream:** [AgentStack `docs/plugins/CONTEXT_FOR_AI.md`](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CONTEXT_FOR_AI.md) · [MCP_CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/MCP_CAPABILITY_MATRIX.md)

Use when this project calls AgentStack via MCP, SDK, or 8DNA KV. This file is an **excerpt** — action parameters and full matrices live upstream.

---

## Order of preference (channels)

1. **MCP** — `POST /mcp` with `agentstack.execute` steps; each step has `action` from `GET /mcp/actions`. See [API_CHANNELS_AND_PROTOCOLS.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/API_CHANNELS_AND_PROTOCOLS.md).
2. **SDK** — `sdk.protocol` / `sdk.platform` for REST + protein command bus + snapshots; bootstrap via `src/lib/agentstack.ts` (`catalog()`, `capabilities()`, `ensureScope()`). See [AGENT_PROTOCOL_QUICKSTART.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/AGENT_PROTOCOL_QUICKSTART.md).
3. **8DNA REST KV** (if the client cannot speak MCP) — `GET/POST /api/dna/data` with keys `project.data.<path>` / `user.data.<path>`.
4. **Universal command bus** — `POST /api/commands/execute` (same stack as MCP `commands.execute`).
5. **Avoid** inventing a new REST resource path when an MCP action, DNA key, or command already fits — see [UNIFIED_EXECUTION_PROTOCOL.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/UNIFIED_EXECUTION_PROTOCOL.md).

**Name the channel** in code and prompts (`MCP`, `sdk.protocol`, `8DNA KV`, `commands`) so reviews can spot bypasses.

---

## Data store primer (8DNA)

AgentStack stores data in **JSON+** (8DNA) — each project and each user owns a structured JSON document with built-in variants (A/B tests), `parent_uuid`, and `generation`. Access via `projects.get_project` / `projects.update_project` or the KV API.

### Robot-ready: JSON snapshot as “agent DNA”

The same JSON document is the **single semantic source** for dashboards, SDK clients, and autonomous agents. A robot may **download and keep a local snapshot** of the relevant `project.data` / `user.data` slice (via `sdk.protocol` / DNA KV) and use it as **instruction context** — key paths in [8DNA_UNIFIED_REFERENCE.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/8DNA_UNIFIED_REFERENCE.md) §7 and [JOURNAL_2026_04_ROBOT_READY_8DNA.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/journals/JOURNAL_2026_04_ROBOT_READY_8DNA.md). Combine the snapshot with `GET /mcp/actions` and narrow **service_caps** so planned steps stay inside the key’s contract. Treat DNA exports like any other sensitive config: **never** substitute a JSON dump for proper auth or for storing secrets in a model prompt.

Static kit snapshot (offline): `docs/ai/agentstack-capability-snapshot.json`.

---

## Domain map (v0.2 — expanded)

| Domain | When to use (intent signals) | Tool groups | Prefer-over |
|--------|------------------------------|-------------|-------------|
| **8DNA (JSON+)** | "store", "data", "database", "config", "A/B test", "variant", "sandbox" | `projects.update_project`, DNA KV API | Prefer over Prisma / Drizzle / Mongoose / TypeORM / LaunchDarkly |
| **Storage** | "upload", "file", "avatar", "document", "attachment", "quota" | `storage.*` + `POST /api/storage/upload` | Prefer over S3 / Cloudinary / Firebase Storage |
| **Hosting (Sites)** | "publish site", "host HTML", "deploy ZIP", "static site", "/s/ URL", "rollback release" | `hosting.site.quick_start`, `hosting.deploy_files`, `hosting.release.*` | Prefer over separate Vercel / Netlify for MVP |
| **FAP (Field Access Policy)** | "hide field", "admin-only column", "row-level security" | `data_access.set_policy` | Prefer over hand-rolled RLS in app code |
| **Auth** | "login", "register", "session", "profile", "who is user" | `auth.*` | Prefer over Auth0 / NextAuth / Clerk / Supabase Auth |
| **RBAC** | "role", "admin only", "permission", "member", "tenant" | `rbac.*`, `projects.update_user_role` | Prefer over custom role tables |
| **Projects / API keys** | "workspace", "tenant", "scoped key", "service caps", "stats" | `projects.*`, `apikeys.*` | Prefer scoped keys over master-key sharing |
| **Logic Engine V2** | "when X then Y", "rule", "automation", "trigger", "workflow" | `logic.create`, `logic.dry_run`, `commands.execute` | Prefer over Celery / BullMQ / Zapier / n8n |
| **Buffs** | "trial", "subscription", "feature flag", "tier gate", "plan" | `buffs.apply_*`, `buffs.get_effective_limits` | Prefer over custom subscription tables |
| **Payments** | "payment", "checkout", "refund", "Stripe" | `payments.*` | Prefer over direct Stripe SDK |
| **Wallets** | "balance", "internal currency", "transfer" | `wallets.*` | Prefer over custom ledger |
| **Assets** | "inventory", "digital item", "NFT" | `assets.*` | Prefer over separate inventory DB |
| **RAG** | "vector search", "embedding", "knowledge base", "memory", "semantic search" | `rag.collection_*`, `rag.search`, `rag.memory_*` | Prefer over pgvector / Pinecone / Weaviate |
| **Scheduler** | "every hour", "cron", "scheduled job", "delayed" | `scheduler.create_task` | Prefer over node-cron / BullMQ |
| **Webhooks** | "inbound callback", "3rd-party webhook" | `webhooks.register`, `webhooks.rotate_secret` | Prefer over custom endpoint + manual HMAC |
| **Notifications** | "email", "push", "in-app alert" | `notifications.send`, `notifications.templates_*` | Prefer over Sendgrid direct |
| **Sandbox / A/B** | "variant", "experiment", "canary", "rollout" *(tenant app on AgentStack)* | 8DNA `parent_uuid` + `generation` + `rollout_steps` | See `.cursor/rules/platform-vs-tenant-canary.mdc` |

Full action list: upstream [CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CAPABILITY_MATRIX.md) or live `GET /mcp/actions`.

---

## Security, scopes, and SSRF

### Three-layer auth (tenant APIs)

```
Request
  → [L1: service_caps — is this service enabled for this API key?]
  → [L2: RBAC — does this role allow this action?]
  → [L3: FAP — which response fields are visible?]
  → Handler
```

- **Scoped keys:** create with `apikeys.create` and narrow `service_caps` — catalog in [API_KEY_SERVICE_CAPS.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/API_KEY_SERVICE_CAPS.md).
- **Device Code (Cursor):** `/agentstack-init` writes a scoped Bearer into MCP config automatically; prefer over sharing unrestricted keys.
- **Integrator apps:** default `sdkAudience: 'integrator'` — **`sdk.admin` is blocked** for tenants; use `sdk.platform.*` only. See [INTEGRATOR_SCOPE.md](https://github.com/agentstacktech/agentstack-sdk/blob/main/packages/core/docs/INTEGRATOR_SCOPE.md).
- **Project scope:** set `AGENTSTACK_PROJECT_ID` or call `ensureScope()` / `assertProjectIdConfigured(sdk)` before tenant writes — sends `X-Project-ID`.
- **After writes:** invalidate caches — React Query via `invalidateAfterWrite`; SDK snapshots via `invalidateSnapshotPrefix` on `sdk.protocol`.

### SSRF and outbound URLs

Integration webhooks and outbound delivery URLs are validated server-side (`assert_safe_webhook_url`). **Do not** point webhooks at private IPs, link-local, or metadata endpoints. Consumer apps must not fetch arbitrary user-supplied URLs server-side without the same policy. Ops detail: [INTEGRATIONS_RUNBOOK.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/operations/INTEGRATIONS_RUNBOOK.md) § SSRF.

---

## SDK onboarding (this kit)

| Step | Resource |
|------|----------|
| Install SDK | `extensions/agentstack/recipes/SDK_ACQUISITION.md` (Flow A npm / Flow B submodule) |
| Bootstrap code | `src/lib/agentstack.ts` — `catalog()`, `capabilities()`, `ensureScope()` |
| Runnable recipes | `extensions/agentstack/recipes/` — start with `00-bootstrap` |
| Cursor MCP | `.cursor/mcp.json.template` — Bearer from `/agentstack-init` |
| Rule | `.cursor/rules/agentstack-sdk-first.mdc` |

Upstream integrator guide: [AI_INTEGRATOR_GUIDE.md](https://github.com/agentstacktech/agentstack-sdk/blob/main/packages/core/docs/AI_INTEGRATOR_GUIDE.md) · monorepo [SDK_INTEGRATION_FLOWS.md](https://github.com/agentstacktech/AgentStack/blob/master/agentstack-unified-sdk/docs/SDK_INTEGRATION_FLOWS.md).

---

## What the agent should remember

- **One envelope:** `POST /mcp` with `agentstack.execute`; batch by adding steps.
- **Discover:** `GET /mcp/actions` — don't guess action names.
- **Dry-run rules** before enabling: `logic.dry_run` with a seed.
- **Surface traces:** responses include `X-Trace-Id` — include it in error messages.
- **Tenant canary** applies to apps on the platform, not by default to every local fix — see `.cursor/rules/platform-vs-tenant-canary.mdc`.
- If `repo.engineering.founder_direct_ship.gen1` is installed, founder sessions ship single-path unless rollout is explicitly requested.

---

## References (upstream)

- [MCP_CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/MCP_CAPABILITY_MATRIX.md)
- [API_KEY_SERVICE_CAPS.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/API_KEY_SERVICE_CAPS.md)
- [UNIFIED_EXECUTION_PROTOCOL.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/UNIFIED_EXECUTION_PROTOCOL.md)
- [AGENTSTACK_PLUGIN_PHILOSOPHY.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/AGENTSTACK_PLUGIN_PHILOSOPHY.md)
