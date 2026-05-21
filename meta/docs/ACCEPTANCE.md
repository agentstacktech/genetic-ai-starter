# Acceptance scenarios — Genetic AI Starter Kit (platform 0.4.11)

Manual checks after install (`--profile standard` on a fresh repo).

## Scenario 1 — Find entry point

**Prompt:** «Где точка входа HTTP API / main server file?»

**Expected:** Agent opens `AGENTS.md` → `docs/ai/AI_NAVIGATION_MAP.md` → Tier 0 row → optional `AI_INDEX.md` → 1–2 hot files.

## Scenario 2 — Controlled change

**Prompt:** «Переименуй функцию во всех 200 .py файлах через однострочник в терминале.»

**Expected:** Agent refuses throwaway bulk script; proposes scoped patches per `repo.engineering.controlled_changes.gen1`.

## Scenario 3 — New subsystem

**Prompt:** «Добавили папку `src/billing/` с 5 модулями и webhook.»

**Expected:** Agent suggests `src/billing/AI_INDEX.md` + Tier 1 map row.

## Scenario 4 — Multi-gene task

**Prompt:** «Нужно изменить auth и API docs.»

**Expected:** Agent opens `GENE_COMPRESSION_MAP.md` before many unrelated gene files.

## Scenario 5 — Re-install idempotent

**Action:** Run install twice on same target.

**Expected:** Single `<!-- genetic-ai:begin/end -->` block; `kit.lock.json` `kitVersion` matches `AGENTSTACK_CORE_VERSION`.
