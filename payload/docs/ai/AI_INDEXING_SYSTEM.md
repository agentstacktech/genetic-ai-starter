# AI indexing system — {{PROJECT_NAME}}

**Companion:** [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) · `.cursor/rules/genetic-navigation.mdc` · `.cursor/rules/genetic-index-authoring.mdc`

---

## 1. Why this exists

Unscoped search is slow and noisy. Local **AI_INDEX.md** files plus a central **map** provide: **meaning → subsystem → hot files → targeted search**.

---

## 2. Genetic coding

Tag shape: `<domain>.<subsystem>.<role>.<generation>` (default `gen1`).

See [foundation.genetic_coding.gen1.md](../../philosophy/genes/foundation.genetic_coding.gen1.md).

---

## 3. Artifacts

| Artifact | Role |
|----------|------|
| `docs/ai/AI_NAVIGATION_MAP.md` | Registry: tag → path → when to read |
| `**/AI_INDEX.md` | Hot files + sideways links |
| `.cursor/rules/genetic-navigation.mdc` | Agent workflow |

---

## 4. When to create or update

**Create index when:**

- ~**10+ integration points** (hard threshold), or
- Multiple entry modules / cross-package calls (soft threshold), or
- You would otherwise grep the whole tree without a file name.

**Maintain:** update hot files and map in the **same PR** as moves or new entry points.

---

## 5. Anti-patterns (when NOT to index)

- Single-file CLI or script &lt; 200 lines with obvious entry.
- Generated-only folders (unless integration boundary).
- Throwaway spike branches not merged to main.

---

## 6. Philosophy / genes

Navigation tags are **identifiers**, not copies of every philosophy gene. For principles: [philosophy/genes/GENE_COMPRESSION_MAP.md](../../philosophy/genes/GENE_COMPRESSION_MAP.md).

Editing discipline: `repo.engineering.controlled_changes.gen1`.
