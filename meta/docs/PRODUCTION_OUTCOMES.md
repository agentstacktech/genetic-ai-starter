# Production outcomes — Genetic AI Starter Kit

**RU:** [PRODUCTION_OUTCOMES_ru.md](PRODUCTION_OUTCOMES_ru.md)

**Genes:** `repo.tooling.genetic_starter.docs.gen1` · `repo.tooling.genetic_starter.gen1`

**Related:** [AGENT_FLOOR.md](AGENT_FLOOR.md) · [AI_RELEASE_AUTONOMY.md](AI_RELEASE_AUTONOMY.md) · [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)

---

## 1. Who this is for in production

- Teams of **2+** on a shared repository
- **Monorepos** or multi-package products
- Workflows where Cursor/agents are part of delivery
- **AgentStack** consumers (optional extension)

## 2. Release train

| Step | Artifact |
|------|----------|
| Feature code | scoped patch |
| Navigation | Tier 1 + `AI_INDEX` in the **same PR** (T05) |
| Gate | `doctor` / `validate-installed` (T13) |
| CI | `.github/workflows/genetic-ai-validate.yml.sample` |

```yaml
- run: node node_modules/@agentstack/genetic-ai-starter/scripts/doctor.mjs --target .
- run: node node_modules/@agentstack/genetic-ai-starter/scripts/validate-installed.mjs --target .
```

## 3. PR quality

- **controlled_changes** — refuse repo-wide `sed` (T04)
- Genetic tags in PR descriptions
- Map-first → fewer wrong-module diffs

## 4. Weak models on the team

Policy: **standard** profile for shared repos; **minimal** for solo spikes only.

Harness: weak-style **0%** success → kit + indexes **100%** — [AGENT_FLOOR.md](AGENT_FLOOR.md), [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

## 5. Incident / drift

| Symptom | Action |
|---------|--------|
| Map drift | `repair.mjs` + Tier 1 update |
| Partial install | `upgrade.mjs` from lock |
| Stub leak | `doctor` removes minimal stub file |

## 6. AgentStack consumers

- `extensions/agentstack/` overlay
- G10: run `sync-from-canonical.mjs` on platform bumps

## 7. Limitations

Does not replace QA, security, or product decisions. See [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).
