# Gene — `repo.engineering.testing.gen1`

**Genetic tag:** `repo.engineering.testing.gen1`  
**Category:** engineering  
**Status:** ACTIVE  

---

## Intent

Tests should prove **real behavior**, not mirror implementation details.

---

## AI instructions

### Do

- Add tests when requested or when covering regression-prone boundaries (auth, payments, public API).
- Run the project's test command after meaningful edits when available.

### Do not

- Add tests that only assert mocks return mocks.
- Add trivial tests for getters/setters unless they encode business rules.

---

## Cross-links

- [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md)
