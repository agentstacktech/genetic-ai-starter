# AgentStack extension

Enable with `--with-agentstack` on install.

## Contents

- `CONTEXT_FOR_AI.md` — MCP / 8DNA domain routing (excerpt)
- `platform-vs-tenant-canary.mdc` — tenant rollout vs platform substrate
- Map append rows for SDK/MCP quickstart

## When to use

- Project consumes AgentStack MCP, SDK, or hosts on AgentStack platform
- You need capability routing (`GET /mcp/actions`) in agent context

## When not to use

- Generic open-source apps with no AgentStack dependency — use **standard** profile only

## Version pin

Check `extensions/agentstack/extension.manifest.json` `requiresKit` (platform patch, e.g. `>=0.4.11`) and `requiresPlatformVersion: AGENTSTACK_CORE_VERSION`.

Canonical docs live in the AgentStack monorepo; extension links are pointers, not forks.
