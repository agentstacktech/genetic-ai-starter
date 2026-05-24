# Экономика токенов — map-first навигация

**EN:** [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md)

## Гены

- `foundation.ai_gene_interface.gen1`
- `repo.navigation.map.gen1` · `repo.navigation.index.gen1`

---

## Проблема

Слепой grep по всему репозиторию: много раундов контекста, дубликаты путей, legacy-ловушки.

## Модель kit

```
tokens_kit ≈ AGENTS + строка карты + AI_INDEX + 1–2 hot-файла
```

## Пример T02 (JWT)

- **bare:** несколько repo-wide grep → порядка **32k** токенов (оценка).
- **kit:** карта → `sessionMiddleware.ts` → порядка **6k**.

## Сравнение методов

| Метод | Токены | Структура |
|-------|--------|-----------|
| grep по всему дереву | Высокие | Нет |
| Только RAG | Средние | Дрейф индекса |
| Только AGENTS.md | Средние | Нет Tier 1 |
| **Genetic kit** | Низкие стабильные | Решётка map → index |
| **Гибрид kit + RAG** | Средне-низкие | Код по карте, prose по RAG |

## Гибрид

Карта — **где** код; RAG — **какой текст** в документации. Не заменяйте Tier 1 только эмбеддингами.

## Метрики

`estimatedContextTokens` в scorer · [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)

```bash
node genetic-ai-starter/benchmarks/scripts/estimate-tokens.mjs --transcript path.txt
```

## Когда kit не окупается

Скрипт в одном файле, прототип &lt;5 модулей — профиль **minimal**.
