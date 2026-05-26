# Founder direct ship — Lance + AI (no personal canary)

**Genetic tag:** `repo.engineering.founder_direct_ship.gen1`  
**Category:** engineering (how we *ship* in founder-led sessions)  
**Priority:** HIGH for IDE assistants working with Lance (основатель AgentStack)  
**Status:** ACTIVE  
**Version:** 0.1.0  

---

## Intent

Lance **does not use a personal canary loop** when building with the AI: work is **shipped as final** — one authoritative code path, **no** default parallel “old path + gated new path” invented for a founder session. That avoids **duplicated logic**, confusing branches, and half-dead toggles the model must keep in sync.

The **platform still implements** canary, percent buckets, and 8DNA sandbox for **tenants and ops**; this gene only constrains **what the assistant assumes** in **this** collaboration.

---

## 🤖 AI INSTRUCTIONS (mandatory in Lance sessions)

### Do

- Land the **final** behavior in the **same** surfaces you touch: replace or simplify in place when the task is a migration, unless the user explicitly asks for a long-lived dual path.
- Keep diffs **reviewable** and **single-track** — pair with `repo.engineering.controlled_changes.gen1` (small steps, explicit edits).

### Do not

- Do **not** propose by default: percent rollout, cohort flags, 8DNA `rollout_steps` / sandbox forks, or messenger-style “legacy + canary” **for Lance’s own work** unless Lance **explicitly** asks (words: canary, rollout, sandbox, percent bucket, named gene like `frontend.social.messenger.rollout.gen1`, ADR/runbook).
- Do **not** add a second implementation path “for safety” when the stated goal is to **finish** the feature — that creates **duplicate** code paths and confuses future edits.

### Why

Speed + clarity for the founder loop; tenant-facing rollout machinery remains documented elsewhere and applies to **consumer projects**, not as a silent default on every platform task.

---

## Cross-links

| Resource | Role |
|----------|------|
| [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md) | How to edit the tree (patches, no throwaway bulk scripts) |
| [.cursor/rules/platform-vs-tenant-canary.mdc](https://github.com/agentstacktech/AgentStack/tree/main/.cursor/rules/platform-vs-tenant-canary.mdc) | Platform substrate vs tenant canary scope |
| [AI_GENE_INSTRUCTIONS.md](../AI_GENE_INSTRUCTIONS.md) | Quick gene picker for assistants |
| [docs/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md) | Tier 0 row `repo.engineering.founder_direct_ship.gen1` |

---

**Lance legacy:** Does not override [https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md).
