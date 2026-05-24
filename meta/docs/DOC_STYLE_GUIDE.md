# Doc style guide — genetic-ai-starter

## Footer template (required on new meta docs)

```markdown
## Genes
- `repo.tooling.genetic_starter.docs.gen1` — …

## Philosophy
- PHILOSOPHY_INDEX → …
```

## Mermaid budget

- README: max **3** diagrams (read order, Navigation OS, install)
- Other meta docs: 1–2 per file

## Metrics

- Numbers from [metrics.snapshot.json](metrics.snapshot.json) only
- Run `node scripts/check-docs-metrics.mjs` before PR
- Never write «AGENTS.md only = kit» without arm footnote

## Tables

- Prefer task-level deltas (T04, T05, T08) over median alone
- Link arm IDs to [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md)

## RU/EN pairs

See [I18N_DOC_MATRIX.md](I18N_DOC_MATRIX.md) — EN canonical for GitHub primary README.en.
