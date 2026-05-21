# Gene — `foundation.genetic_coding.gen1`

**Genetic tag:** `foundation.genetic_coding.gen1`  
**Category:** foundation (navigation language)  
**Status:** ACTIVE  

---

## Intent

**Genetic tags** are semantic addresses: `domain.subsystem.role.gen1`. They link **task meaning** → **row in `docs/ai/AI_NAVIGATION_MAP.md`** → **local `AI_INDEX.md`** → **hot files**.

---

## Forming a path

```text
<domain>.<subsystem-or-area>.<role>.<generation>
```

| Segment | Examples |
|---------|----------|
| domain | `repo`, `app`, `api`, `frontend`, `docs` |
| subsystem | `auth`, `billing`, `mcp`, `storage` |
| role | `tools`, `endpoints`, `ui`, `registry` |
| generation | `gen1` (default); bump when two lineages coexist |

**Rules:**

- Lowercase segments, dot-separated.
- **One tag per index**; split folders get separate tags.
- Register new tags in `docs/ai/AI_NAVIGATION_MAP.md` before wide use.

---

## Where tags live

- **Registry:** `docs/ai/AI_NAVIGATION_MAP.md` (Tier 0 / Tier 1).
- **Local index:** first block of `AI_INDEX.md` — line `**Genetic code:**` ``tag``.

---

## AI instructions

1. Infer task domain from user request.
2. Open map → pick tag → open index → open 1–2 hot files.
3. Use tag in PR titles/commits when pointing at subsystem boundaries.

---

## Cross-links

- [docs/ai/AI_INDEXING_SYSTEM.md](../../docs/ai/AI_INDEXING_SYSTEM.md)
- [repo.navigation.map.gen1.md](repo.navigation.map.gen1.md)
