<!-- genetic-ai-extension:agentstack-nav -->

## Tier 0 — AgentStack (extension)

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| `repo.plugins.capability_routing.gen1` | [docs/ai/CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md) | MCP / 8DNA intent routing, security, SSRF |
| `repo.platform.sdk.onboarding.gen1` | [src/lib/agentstack.ts](../../src/lib/agentstack.ts) · [.env.example](../../.env.example) | SDK bootstrap, env, project scope |
| `repo.platform.sdk.recipes.gen1` | [examples/agentstack/](../../examples/agentstack/) · kit `tools/genetic-ai-starter/extensions/agentstack/recipes/` | Runnable onboarding recipes (00–11) |
| `repo.platform.sdk.gen1` | `node_modules/@agentstack/sdk` · [docs/ai/agentstack-capability-snapshot.json](agentstack-capability-snapshot.json) | TypeScript client + static capability snapshot |

## Tier 1 — AgentStack integration surfaces

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| `repo.platform.sdk.agent_protocol.gen1` | [src/lib/agentstack.ts](../../src/lib/agentstack.ts) (`capabilities().platform.protocol`) | REST + commands + snapshots via `sdk.protocol` |
| `core.mcp.tools.gen1` | [.cursor/mcp.json.template](../../.cursor/mcp.json.template) · live `GET /mcp/actions` | MCP streamable-http, `agentstack.execute` |
| `shared.dna.unified.gen1` | [CONTEXT_FOR_AI.md](CONTEXT_FOR_AI.md) § 8DNA · recipe `02-8dna-crud` | JSON+ KV, robot-ready snapshots |
| `repo.platform.sdk.integrator_scope.gen1` | [.cursor/rules/agentstack-sdk-first.mdc](../../.cursor/rules/agentstack-sdk-first.mdc) | No `sdk.admin`; scoped `service_caps` |

_Add links to your vendored SDK path or published docs URL when not using npm._
