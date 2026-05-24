# Gene adaptation — fewer agent mistakes

**RU:** [GENE_ADAPTATION_ru.md](GENE_ADAPTATION_ru.md) · **Workflow gene:** `foundation.ai_gene_interface.gen1`

## Philosophy

PHILOSOPHY_INDEX → Controlled change · Decomposition

---

## Workflow

```
WHAT AM I DOING → GENE (via compression map) → APPLY → NAVIGATE (map → index → files)
```

## Project memory vs chat memory

| | Cursor memory | Kit genes + map |
|--|---------------|-----------------|
| Git versioned | No | Yes |
| Team PR review | No | Yes |
| Path binding | Weak | genetic tag + hot files |

## Error catalog (benchmark-backed)

| Failure | Task | Gene | Kit artifact |
|---------|------|------|--------------|
| Bulk sed / mass rewrite | T04 | `repo.engineering.controlled_changes.gen1` | rule + gene |
| Legacy decoy folder | T07 | map + index warning | `AI_NAVIGATION_MAP` |
| Forgot docs on new module | T05 | `repo.navigation.index.gen1` | index-authoring skill |
| Open 10+ genes | T06 | compression map | `GENE_COMPRESSION_MAP.md` |
| Wrong MCP path | S01 | map Tier 0 | AgentStack extension |

## Scaffold a domain gene

```bash
node <kit>/scripts/new-gene.mjs --type subsystem \
  --tag app.billing.invoices.gen1 \
  --title "Billing invoices"
```

Then add Tier 1 row in `AI_NAVIGATION_MAP.md`.

## Large subsystem rule

If **~10+ integration points** — mandatory map + `AI_INDEX.md` before repo-wide grep (`repo.navigation.index.gen1`).
