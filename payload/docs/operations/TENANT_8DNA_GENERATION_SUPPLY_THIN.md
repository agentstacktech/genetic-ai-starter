# Tenant 8DNA generation supply (thin playbook)

**Genetic tag:** `core.tenant.8dna_generation_supply.gen1`

Portable summary for agents on AgentStack-hosted apps. Full runbook lives in platform repo:
`docs/operations/TENANT_8DNA_GENERATION_SUPPLY.md`.

## Golden rule

Tenant DNA changes flow: **sandbox → diff → gates → promote**. Never patch production slice when `auto_generation_mode` is on.

## Enable safe mode (once)

```json
{"action": "generation.settings.patch", "params": {
  "project_id": "<PID>",
  "auto_generation_mode": true,
  "auto_checkpoint_before_promote": true
}}
```

## Routine cycle (F1)

1. MCP mutation (`projects.patch_data`, `knowledge.config.patch`, …) — auto-fork
2. `generation.diff_vs_prod`
3. `generation.gates`
4. `generation.promote` with `require_gates_passed: true`

## Discard sandbox (F3)

`generation.realign_to_prod` — `dry_run: true` then apply.

## Bulk / disaster

- Bulk: `generation.checkpoint` → scoped writes → promote
- Rollback: `generation.rollback` → gates → promote

MCP prompt: `GET /mcp/prompts/agentstack_tenant_8dna_supply?project_id=<PID>`
