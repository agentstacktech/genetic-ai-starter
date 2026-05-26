# AI indexing system — AgentStack

**Audience:** Humans and agents maintaining or navigating the monorepo.  
**Companion:** `[AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md)` (registry) · `.cursor/rules/genetic-navigation.mdc` (workflow) · `.cursor/rules/genetic-index-authoring.mdc` (checklist).

---

## 1. Why this exists

Unscoped search across large packages is slow, noisy, and error-prone (wrong duplicate path, legacy vs canonical code, integration boundaries). Local `**AI_INDEX.md`** files plus a central **map** give a cheap, repeatable route: **meaning → subsystem → hot files → targeted search**.

The **return on investment** of indexes is high enough that we treat almost any **noticeably non-trivial** area as a candidate for an index: if the subsystem has multiple entry points, cross-package calls, or would waste more than a few minutes guessing where to edit, the index usually pays for itself immediately.

---

## 2. Genetic coding (semantic addressing)

Each indexed subsystem carries a **genetic tag**: a dotted path such as `core.mcp.tools.gen1`.

### 2.1 What it is for

- **Fast mental and mechanical routing:** From task wording (“MCP discovery”, “FAP processors”) → row in `**AI_NAVIGATION_MAP.md`** → local index → **hot files**. The tag is the stable handle for that hop.
- **Theoretical module trees:** Tags group **function and responsibility**, not only directory names. Segments suggest **which family** of code you are in (`core`, `shared`, `frontend`, `repo`, `docs`, …) and **which role** (tools, registry, endpoints, neural runtime, …). That supports reasoning about **related modules** (sideways links in indexes, ecosystem docs) as a **tree or lattice** around a capability, not a flat file search.
- **Stable references:** Use the same tag in commit messages, PR descriptions, or agent summaries when pointing at a subsystem boundary.

### 2.2 Forming a genetic path (naming)

Use **lowercase** segments separated by `.`. Typical shape:

```text
<domain>.<subsystem-or-area>.<role>.<generation>
```


| Segment               | Meaning                     | Examples                                                           |
| --------------------- | --------------------------- | ------------------------------------------------------------------ |
| **domain**            | Top scope or package family | `repo`, `core`, `shared`, `frontend`, `docs`                       |
| **subsystem-or-area** | Product or technical area   | `mcp`, `rag`, `processors`, `neural`, `ai_builder`                 |
| **role**              | Primary responsibility      | `tools`, `registry`, `endpoints`, `monitoring`, `platform`         |
| **generation**        | Optional version / lineage  | `gen1` (default); bump if a subsystem is replaced but both coexist |


**Rules of thumb:**

- Prefer **one tag per index**; split folders get separate tags (e.g. `core.ai_builder.http.gen1` vs `core.ai_builder.nav.gen1`).
- Align new tags with existing rows in `**AI_NAVIGATION_MAP.md`** before inventing a new pattern.
- Canonical Python package **`shared`** lives only at **repository root** [`shared/`](https://github.com/agentstacktech/AgentStack/tree/main/shared/). See [`docs/https://github.com/agentstacktech/AgentStack/tree/main/docs/SHARED_SINGLE_PACKAGE.md`](https://github.com/agentstacktech/AgentStack/tree/main/docs/SHARED_SINGLE_PACKAGE.md).

### 2.3 Where tags live

- **Registry:** `docs/ai/AI_NAVIGATION_MAP.md` (Tier 0 / Tier 1 tables).
- **Local index:** First prominent block of each `**AI_INDEX.md`** (or canonical `**INDEX.md**`): line **Genetic code:** ``tag``.

---

## 3. Artifacts


| Artifact                                      | Role                                                                                                                        |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `**docs/AI_NAVIGATION_MAP.md**`               | Single screen: genetic tag → path → when to read. Tier 0 = package roots; Tier 1 = large subsystems.                        |
| `**AI_INDEX.md**` (per folder)                | Short “read first” + **hot files** + sideways links (MCP, FAP, signals, cache, etc.).                                       |
| **Canonical `INDEX.md`**                      | Some areas (e.g. `ai_builder/`, `mcp/`) use a large human catalog; `**AI_INDEX.md**` may be a short alias pointing into it. |
| `**.cursor/rules/genetic-navigation.mdc**` | Mandatory agent workflow: map → index → files → scoped search.                                                              |
| `**.cursor/rules/genetic-index-authoring.mdc**`    | Checklist when creating or editing indexes.                                                                                 |


---

## 4. When to create, update, or add to the map

### 4.1 Default bias (high effectiveness)

**Create or extend an index** when any of the following is true:

- The area has **multiple integration surfaces** (HTTP + MCP + internal services, signals, cache invalidation, admin UI + API, etc.).
- There are **several entry modules** or “obvious” files that are not obvious to a newcomer.
- **Duplicate or split locations** exist (legacy vs canonical, two `shared/` trees).
- You would otherwise start with **repo-wide or package-wide grep** without a file name.

**Threshold (hard):** about **10+ integration points** or many entry modules → new `**AI_INDEX.md`** + **Tier 1** row in `**AI_NAVIGATION_MAP.md`** (and `**.cursorrules**` list if new path).

**Threshold (soft):** if the subsystem is **noticeably larger than “one file + README”** and will be touched again, prefer adding a minimal index now over paying repeated discovery cost.

### 4.2 Always maintain

Indexes are **living docs**, not one-off scaffolding:

- **When you add** entry points, tools, routes, or cross-boundary calls → update **hot files** and **sideways links**.
- **When you move or deprecate** canonical paths → update the index and `**AI_NAVIGATION_MAP.md`** the same PR whenever possible.
- **When behavior affects caches or discovery** → follow `**docs/CACHE_INVALIDATION_CONVENTION.md`** in code; mention the convention in the index if editors must invalidate.

### 4.3 Agent/human workflow summary

1. Open `**AI_NAVIGATION_MAP.md**` → pick tier and tag.
2. Open linked `**AI_INDEX.md**`.
3. Open **1–2 hot files**; then **scoped** search only.
4. After substantive structural changes, **update the index** in the same change set.

---

## 5. Relationship to philosophy / genes

Repository **philosophy** and **genes** docs describe product principles. **Genetic tags** in this document are **navigation identifiers** for code areas; they are aligned in naming spirit with “genetic” language used elsewhere but do not need to mirror every philosophy gene file. For product axiom navigation, see `**philosophy/genes/AI_INDEX.md**` and **[philosophy/genes/GENE_COMPRESSION_MAP.md](../../philosophy/genes/GENE_COMPRESSION_MAP.md)** (by-system clusters + legacy→umbrella shortcuts — read before opening many parallel `GENE_*` files for one contour). Related indexes are linked from the map. **Agent editing discipline:** `**repo.engineering.controlled_changes.gen1**` → `**philosophy/genes/repo.engineering.controlled_code_changes.gen1.md**` (how autonomous assistants should apply code changes — reviewable diffs, no ad-hoc tree rewriters).

---

## 6. See also

- `
- `
- `[philosophy/genes/GENE_COMPRESSION_MAP.md](../../philosophy/genes/GENE_COMPRESSION_MAP.md)` — gene **compression router** (semantic clusters, synergies).

