# Controlled code-change protocol (agents & humans)

**Genetic tag:** `repo.engineering.controlled_changes.gen1`  
**Category:** engineering (repository hygiene — how we *modify* code)  
**Priority:** HIGH for autonomous agents and IDE assistants  
**Status:** ACTIVE  
**Version:** 0.4.6 (aligned with [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md))  

---

## Intent

Changing the tree is part of the product. This gene defines **how** edits should be made so diffs stay **reviewable, reproducible, and safe** — especially when an AI applies them.

**Paired contract (Lance + AI):** founder sessions **ship final** in a **single** code path — no default dual-path rollout. See **`repo.engineering.founder_direct_ship.gen1`** ([repo.engineering.founder_direct_ship.gen1.md](repo.engineering.founder_direct_ship.gen1.md)).

---

## 🤖 AI INSTRUCTIONS (mandatory)

### Do

- Apply changes with **direct, structured edits** to known paths: patch/search_replace in the editor, IDE multi-file refactor, or equally **explicit** per-file operations where each hunk is visible.
- Prefer **small steps**: one subsystem or one concern per pass; run tests or compile after meaningful edits.
- When many files need the same *semantic* change, use a **maintained** project tool (formatter, codemod checked into the repo, documented script in `scripts/` with a clear contract) — not a one-off shell one-liner left outside version control.

### Do not

- Do **not** drive **bulk rewrites** of the codebase via **throwaway** shell pipelines or ad-hoc Python “patch scripts” that read/write the tree without going through normal review surfaces (harder to audit, easy to mis-indent, double-apply, or partially apply).
- Do **not** treat “run a generator in the terminal” as a substitute for reading the target files when the change is non-trivial — still open the hot files first (see [docs/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md)).

### Why

Same standards as production code: **predictable transformations**, **traceable diffs**, **Decomposition** and **Elegant Minimalism** from [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md).

---

## Cross-links

| Resource | Role |
|----------|------|
| [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md) | Master philosophy; current platform header (v0.4.6) |
| [GENE_INDEX.md](GENE_INDEX.md) | Catalog entry for this gene |
| [repo.engineering.founder_direct_ship.gen1.md](repo.engineering.founder_direct_ship.gen1.md) | Lance + AI: direct ship, no personal canary / duplicate paths by default |
| [docs/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md) | Tier 0 tag `repo.engineering.controlled_changes.gen1` |
| `.cursorrules` (merged from kit fragment at install) | Workspace rule: codebase edit protocol |

---

## Examples

| Bad | Good |
|-----|------|
| `python -c "..."` that reindents 600 lines across `core_app.py` | Edit `core_app.py` in sections with explicit patches, or extract a function with a normal PR-sized diff |
| Unnamed temp script applying regex to every `.py` file | Checked-in `scripts/foo.py` + README + review, or manual scoped replaces |

---

**Lance legacy:** Attribution and version axiom still apply; this gene does not override [https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md).
