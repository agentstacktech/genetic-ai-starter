# AgentStack — масштаб платформы и выигрыши Navigation OS

**Genetic tag:** `repo.tooling.genetic_starter.scale_digest.gen1`  
**EN:** [PLATFORM_SCALE_DIGEST.md](PLATFORM_SCALE_DIGEST.md)  
**SoT:** [platform-stats.snapshot.json](platform-stats.snapshot.json) · regenerate: `node scripts/export-platform-stats.mjs`

> **Creation over Conflict:** один snapshot объединяет инвентарь навигации, MCP publication, gene bench и harness KPI — без четвёртого ручного SoT.  
> **Observability first:** README и economics читают только snapshot; `check-readme-inventory` ловит drift.

---

## 1. Три плоскости метрик (не смешивать)

| Плоскость | Файл | Вопрос |
|-----------|------|--------|
| **Инвентарь платформы** | `platform-stats.snapshot.json` | Сколько genes, indexes, MCP actions, clusters? |
| **Harness (shop-api)** | `metrics.snapshot.json` | Насколько стабильно агент выполняет 14 задач? |
| **ROI-модель** | `roi-model.snapshot.json` | Сколько часов/$ в год по tier? |

Harness ≠ live Cursor. Инвентарь ≠ «в 12 раз быстрее релиз». См. [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

---

## 2. Navigation OS — адреса вместо слепого grep

Генетическая система даёт **семантические адреса** (`domain.subsystem.role.gen1`) → строка в `AI_NAVIGATION_MAP.md` → `AI_INDEX.md` → 1–2 hot files.

| Метрика | Значение | Выигрыш |
|---------|----------|---------|
| Philosophy genes | **498** | Единый словарь решений и ADR |
| `AI_INDEX.md` | **244** / **219** platform | Локальные карты подсистем без full-repo walk |
| Tier-1 tags | **546** | Стабильные имена в PR, genes, MCP routing |
| Scan roots (scoped) | **21** | Инвентарь за ~3–5s вместо full-repo ~15s |
| Compression clusters | **38** | Сжатие long-tail genes в umbrella-кластеры |
| Philosophy token compression | **12.36×** | `pillar_resolved` 8.3k tok vs naive 103k — [bench_gene_access.json](../../../philosophy/bench_gene_access.json) |

**Паттерн:** map → index → file (KISS). Один смысл — один canonical контур (SOLID: single responsibility на подсистему).

---

## 3. AgentStack runtime — что платформа уже собрала

Потребитель kit с `--with-agentstack` получает overlay на **готовый субстрат**, а не пересборку с нуля.

| Метрика | Значение | Эквивалент «с нуля» (ориентир) |
|---------|----------|--------------------------------|
| Public MCP actions | **568** | Месяцы интеграций auth/payments/RAG/rules |
| MCP domains | **48** | Десятки bounded contexts |
| Registry tools | **593** | Runtime `MCP_TOOLS_REGISTRY` |
| IDE entry | **1** | `agentstack.execute` — batch + discovery |
| Plugin surfaces | **4** | Cursor / Claude / GPT / VS Code |

Подробнее: monorepo [PLATFORM_SCALE.md](../../../docs/publication/PLATFORM_SCALE.md).

---

## 4. Kit harness — измеренный подъём пола агента

Синтетический стенд `shop-api`, scorer **1.2.1**, **14** задач, **9** arms.

| Arm | Медиана | Успех ≥6 | Map-first |
|-----|--------:|---------:|----------:|
| `agents_md_weak` | 2.5 | 0% | 0% |
| `bare` | 5.5 | 50% | 0% |
| `kit_standard` | 8 | 93% | 50% |
| `kit_standard_indexed` | **9** | **100%** | **86%** |

**Ключевые дельты задач:** T04 (bulk sed) **2→8**, T05 (map+index) **4→10**, T13 (release gate) **4→10**.

**Токены (step-модель, не API billing):** медиана bare ~2.3k → kit+idx ~1.1k; unscoped grep **18 → 0** на indexed arm.

---

## 5. CI observability — genetic plane under test

| Метрика | Значение | Выигрыш |
|---------|----------|---------|
| Dev Test Atlas slices | **207** (202 active) | Scoped `test:scope --gene` вместо full pytest |
| Test planes | **11** | dev.unit / integration / composite |
| `audit:*` scripts | **119** | Автоматические гейты docs/MCP/shell/DNA |
| OpenAPI operations | **834** · **50** tags | Один bundle SoT для REST + MCP parity |
| Mirrored plugin skills | **25** / 4 surfaces | Cursor gen3 → Claude/VS Code без drift |

**Паттерн:** Observability first — метрики из codegen/catalog, не из prose.

---

## 6. Экономика (синтез)

| Рычаг | Эффект |
|-------|--------|
| **Календарь инженеров** | Меньше wrong-tree PR, онбординг по tags |
| **Токены** | Короче discovery path; стабильный prefix → prompt caching |
| **SDK платформы** | Auth 2–4 нед, payments 2–5 нед, dual-shell 3–6 нед — не пересобираем |
| **ROI tiers** | solo ~$4.1k/год → 15+ monorepo ~$49k/год — [roi-model.snapshot.json](roi-model.snapshot.json) |

Полный синтез: [GENETIC_SYSTEM_ECONOMICS_ru.md](GENETIC_SYSTEM_ECONOMICS_ru.md).

---

## 6. Цепочка codegen (maintainers)

```text
philosophy/bench_gene_access.json ──┐
docs/publication/platform-stats.json ─┼─► export-platform-stats.mjs ─► kit snapshot
meta/docs/metrics.snapshot.json ────┘
         │
         ▼
check-readme-inventory · audit:docs · sync-smoke
```

Monorepo MCP refresh: `node scripts/codegen-platform-stats.mjs` (корень AgentStack).

---

## 7. Декомпозиция дальнейших улучшений

См. [GENETIC_SCALE_METRICS_DECOMPOSITION.md](GENETIC_SCALE_METRICS_DECOMPOSITION.md) — волны M0–M8 с подзадачами.

---

## См. также

| Документ | Тема |
|----------|------|
| [METRICS_GLOSSARY_ru.md](METRICS_GLOSSARY_ru.md) | Определения harness |
| [DOC_DATA_FLOW.md](DOC_DATA_FLOW.md) | Потоки данных docs |
| [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md) | Запуск harness |
| [philosophy/PHILOSOPHY_INDEX.md](../../../philosophy/PHILOSOPHY_INDEX.md) | Живые genes платформы |
