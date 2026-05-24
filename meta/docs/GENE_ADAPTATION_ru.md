# Адаптация генов — меньше ошибок агента

**EN:** [GENE_ADAPTATION.md](GENE_ADAPTATION.md) · **Workflow gene:** `foundation.ai_gene_interface.gen1`

## Philosophy

Гены и карта в git → ревью в PR. Chat memory этого не даёт.

## Workflow

```
ЗАДАЧА → GENE (compression map) → ПРИМЕНИТЬ → НАВИГАЦИЯ (map → index → files)
```

## Project memory vs chat memory

| | Память чата | Genes + map |
|--|-------------|-------------|
| В git | Нет | Да |
| Review в PR | Нет | Да |
| Привязка к путям | Слабая | genetic tag + hot files |

## Error catalog (benchmark-backed)

| Ошибка | Задача | Gene | Артефакт kit |
|--------|--------|------|--------------|
| Массовый sed | T04 | controlled_changes | rule + gene |
| Legacy decoy | T07 | map + index | AI_NAVIGATION_MAP |
| Забыли docs | T05 | repo.navigation.index | index skill |
| 10+ genes | T06 | compression map | GENE_COMPRESSION_MAP |
| Неверный MCP | S01 | Tier 0 | extension |

## Scaffold a domain gene

```bash
node <kit>/scripts/new-gene.mjs --type subsystem \
  --tag app.billing.invoices.gen1 \
  --title "Billing invoices"
```

Добавьте Tier 1 в `AI_NAVIGATION_MAP.md`.

## Large subsystem rule

**~10+** точек интеграции → map + `AI_INDEX.md` до repo-wide grep (`repo.navigation.index.gen1`).
