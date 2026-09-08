# MCP hot-path table — pointer (kit consumers)

**Do not edit the action routing table here.**

| SoT | Location |
|-----|----------|
| **Authoritative** | AgentStack monorepo `docs/plugins/CONTEXT_FOR_AI_MCP.md` |
| **Cursor plugin** | Autogen § User request → action in `agentstack-backend/SKILL.md` via `sync-mcp-hot-path-skill.mjs` |
| **Integrator REST fallback** | Kit overlay `docs/ai/CONTEXT_FOR_AI.md` (from `extensions/agentstack/overlay/`) |

## Hot-path table

For the live **User request → action** table, MCP request shape, and anonymous bootstrap notes, read upstream:

- Monorepo: https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CONTEXT_FOR_AI_MCP.md
- In Cursor with AgentStack plugin: use installed skill `agentstack-backend` (synced from SoT).

## Why a pointer

Kit ships **navigation OS** and SDK integrator context, not a second MCP registry. Duplicating the table causes phantom actions and version drift (see `docs/ecosystem/MCP_AGENT_INSTRUCTION_GAP_REGISTER.md`).

**Gene:** `repo.tooling.genetic_starter.agentstack_dx.gen1` · **Platform:** 0.4.18
