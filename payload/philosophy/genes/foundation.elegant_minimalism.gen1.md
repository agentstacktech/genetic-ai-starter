# Gene — `foundation.elegant_minimalism.gen1`

**Genetic tag:** `foundation.elegant_minimalism.gen1`  
**Heritage:** `philosophy._v0116_elegant_minimalism_principle.v0_1_16.gen2` → [../principles/ELEGANT_MINIMALISM.md](../principles/ELEGANT_MINIMALISM.md) (stub)  
**Long-form:** [ELEGANT_MINIMALISM_PRINCIPLE.md](../principles/ELEGANT_MINIMALISM.md) (v0.1.16, four dimensions + scoring)

---

## Core statement (Lance, v0.1.16)

> Идеальное решение: **не требует** специальной обработки, **не занимает** лишнего места, **очевидно** с первого взгляда, **работает везде одинаково**.

For implementers: **zero-cost abstraction in design** — the best solution is the one that needs *nothing extra* to exist.

**Synergy with Absolute Optimization:** minimalism is not “small for small’s sake”; it is the design face of **100% function at minimum cost** for the *information consumer* (human, agent, integrator). See [foundation.absolute_optimization.gen1.md](foundation.absolute_optimization.gen1.md).

---

## Four dimensions (use as a review checklist)

| Dimension | Ideal (10/10) | Anti-pattern |
|-----------|---------------|--------------|
| **Complexity** | Native operators only (`in`, `typeof`, empty string semantics) | Special markers, parallel code paths |
| **Space** | Meaning in **presence/absence** of fields; 0-byte semantics where possible | Magic strings, redundant enums |
| **Clarity** | Obvious at first glance (`""` = request, `field in obj` = include) | Clever encodings needing a legend |
| **Universality** | JSON-safe, works in TS/Python/SQL alike | `undefined`, non-serializable tricks |

**Scoring:** 4×0–10 (max 40). Ship designs ≥30; refactor if <20. Examples in [ELEGANT_MINIMALISM_PRINCIPLE.md](../principles/ELEGANT_MINIMALISM.md) (query markers, dot paths, `typeof`).

---

## Platform examples (0.4.x — meaning preserved after compression)

| Contour | Minimal primitive | What we refused |
|---------|-------------------|-----------------|
| **8DNA unified** | One table `data_projects_8dna`, `user_id=0` project slice | Two-table id heuristics |
| **Messenger** | One op-log, one `GET /api/social/delta` | Per-feature outboxes + triple poll |
| **SDK media** | `sdk.media.thumbnail` / `photo.compress` / `audio.createCapture` | Server transcode when client has bytes |
| **Agents API** | Scoped listings by owner parent | Flat `/api/agents` |
| **Support** | Four states, four actors, in-row attribution | Second chat product |
| **Shell** | One audience resolver + declarative nav | Duplicate dashboards per role |
| **RAG** | One engine, rows on 8DNA | New vector tables per app |

---

## When minimalism is *not* “less code”

- **Fewer lines** that hide implicit magic violate **Clarity** and **Observability**.  
- **Deleting tests/docs** to look minimal violates **TDC** ([foundation.time_decomposition.gen1.md](foundation.time_decomposition.gen1.md)).  
- **One flag per tenant rollout** on platform substrate is a *product* concern — platform work with Lance defaults to **one code path** ([repo.engineering.founder_direct_ship.gen1.md](repo.engineering.founder_direct_ship.gen1.md)).

---

## AI instructions

- Before adding a type, endpoint, or cache: ask **“can native 8DNA / existing contour express this?”**  
- Prefer **one facade** (`sdk.protocol`, `sdk.support`, `sdk.messenger`) over parallel fetch wrappers.  
- In PHILOSOPHY_INDEX bullets, if you only see “Elegant Minimalism: one X” — read **this gene** for the four-dimension test.

---

## Cross-links

- Umbrella: [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md)  
- Creation pairing: [foundation.creation_over_conflict.gen1.md](foundation.creation_over_conflict.gen1.md)  
- [PHILOSOPHY_IN_ACTION_HISTORY.md](../PHILOSOPHY_INDEX.md) — applied examples
