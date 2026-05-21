# Controlled code-change protocol (agents & humans)

**Genetic tag:** `repo.engineering.controlled_changes.gen1`  
**Category:** engineering  
**Priority:** HIGH  
**Status:** ACTIVE  

---

## Intent

Defines **how** edits are made so diffs stay **reviewable, reproducible, and safe** — especially when an AI applies them.

---

## AI instructions (mandatory)

### Do

- Apply **direct, structured edits** to known paths (visible hunks per file).
- Prefer **small steps**: one subsystem per pass; run tests after meaningful edits.
- For wide semantic changes, use a **maintained** project tool (formatter, checked-in codemod in `scripts/` with README).

### Do not

- **Bulk rewrites** via throwaway shell/Python one-liners outside review.
- Skip reading hot files when the change is non-trivial — open `docs/ai/AI_NAVIGATION_MAP.md` first.

---

## Examples

| Bad | Good |
|-----|------|
| `python -c` reindenting 600 lines | Sectioned patches or PR-sized extract |
| Regex over every `*.py` in /tmp | Checked-in `scripts/` tool + review |

---

## Cross-links

| Resource | Role |
|----------|------|
| [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md) | Elegant Minimalism, Decomposition |
| [repo.engineering.founder_direct_ship.gen1.md](repo.engineering.founder_direct_ship.gen1.md) | Optional: single-path ship |
| [docs/ai/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md) | Tier 0 navigation |
