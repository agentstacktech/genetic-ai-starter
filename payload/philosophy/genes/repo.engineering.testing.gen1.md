# Gene — `repo.engineering.testing.gen1` (kit pointer)

**Genetic tag:** `repo.engineering.testing.gen1`

**Canonical SoT:** AgentStack main tree  
`philosophy/genes/repo.engineering.testing.gen1.md` + Dev Test Atlas  
`repo.engineering.dev_test_atlas.gen1`.

This kit copy is a thin mirror for portable installs. Prefer the monorepo genes when working inside AgentStack.

---

## Intent

Tests should prove **real behavior**, not mirror implementation details.

## AI instructions

- Add tests at regression-prone boundaries.
- Run the project's test command after meaningful edits.
- Do not add tests that only assert mocks return mocks.

## Cross-links

- `repo.engineering.controlled_changes.gen1`
- AgentStack: `docs/testing/TEST_ATLAS.md`
