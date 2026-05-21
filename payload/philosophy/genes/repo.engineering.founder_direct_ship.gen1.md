# Founder direct ship — optional single-path delivery

**Genetic tag:** `repo.engineering.founder_direct_ship.gen1`  
**Category:** engineering  
**Priority:** HIGH only when profile `founder` is installed  
**Status:** ACTIVE  

---

## Intent

For **founder-led** sessions: ship **final** behavior in **one** code path — no default parallel “legacy + flagged new” invented for the session.

**Disable this gene** in team repos that use feature flags and staged rollout as a normal product process.

---

## AI instructions

### Do

- Land **final** behavior in surfaces you touch; simplify in place on migrations unless dual path is explicitly requested.
- Keep diffs single-track; pair with `repo.engineering.controlled_changes.gen1`.

### Do not (unless user explicitly asks)

- Propose percent rollout, cohort flags, or duplicate implementations “for safety”.
- Add a second path when the goal is to **finish** the feature.

---

## Cross-links

- [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md)
- Extension: `extensions/agentstack` canary rules apply to **tenant apps**, not this gene by default
