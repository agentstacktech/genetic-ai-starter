# Адаптация генов — меньше ошибок агента

**EN:** [GENE_ADAPTATION.md](GENE_ADAPTATION.md)

## Память проекта

Гены и карта в git → ревью в PR. Chat memory этого не даёт.

## Типичные ошибки

| Ошибка | Ген |
|--------|-----|
| Массовый sed | `repo.engineering.controlled_changes.gen1` |
| Legacy-папка | карта + index |
| Забыли docs | `repo.navigation.index.gen1` |
| 10+ генов сразу | `GENE_COMPRESSION_MAP` |

## new-gene

```bash
node <kit>/scripts/new-gene.mjs --type subsystem --tag app.billing.invoices.gen1 --title "Billing"
```
