# DNA / protein data plane — uniform read & write

**Genetic tag:** `repo.engineering.dna_protein_data_plane.gen1`  
**Category:** engineering (8DNA + Neural Ops)  
**Priority:** HIGH for Core / shared agents  
**Status:** ACTIVE  
**Cursor rule:** `.cursor/rules/dna-protein-data-plane.mdc` (alwaysApply)

---

## Intent

One **uniform** way to mutate and read 8DNA JSONB so we:

- do **not** overwrite whole `data` documents for single-leaf changes;
- preserve concurrent **`__protein_ops`** (durable DiffOp cells);
- stay under **`MAX_INLINE_JSONB_BYTES`** on fat tenants (INC-FAT-01, e.g. Unity pid 1444);
- reuse PathAtom / protein flush / leaf helpers instead of new RMW loops.

Pairs with **`repo.engineering.controlled_changes.gen1`** (how to edit *code*) and **`core.protein.merging.gen1`** (PathAtom / fusion semantics).

---

## Write ladder (mandatory)

| Priority | When | Mechanism |
|----------|------|-----------|
| 1 | Many coalesced path SETs (Tier C/D/W allowlist) | DiffOps → dirty journal → `protein_dna_flush` / `ProteinCommitOrganelle` |
| 2 | 1–N durable leaves, immediate | `dna_set_*_path` · `DNARepository.patch_paths` · `update_jsonb_path` |
| 3 | Secrets column only | `update(protected=…)` without `data=` |
| 4 | Rare full replace | `DNARepository.update(..., preserve_protein_ops=True)` or `prepare_full_blob_for_write` |

**Forbidden default:** load-merge-write the entire project-slice `data` blob.

---

## Read ladder

| Prefer | Avoid |
|--------|-------|
| Domain read facades + index organelles (`ecosystem.*.index`) | Loading full fat slice to pick one field when an index exists |
| Repository get + `protein_ops_rehydrate` | Ignoring durable ops cells on multi-worker reads |

---

## Hot modules

| Module | Role |
|--------|------|
| `shared/dna/project_data_leaf.py` | Leaf SET helpers |
| `shared/dna/safe_blob_write.py` | Full-blob + preserve ops |
| `shared/dna/jsonb_inline_gate.py` | Inline size gate |
| `shared/neural/durable_ops_cell.py` | `__protein_ops` merge/clear |
| `shared/organelles/protein_dna_flush.py` | Commit plane flush + `patch_paths` |
| `shared/atoms/path_atom.py` | Path grammar |

**Index:** [shared/dna/AI_INDEX.md](https://github.com/agentstacktech/AgentStack/tree/main/shared/dna/AI_INDEX.md)  
**ADRs:** [PROTEIN_NEURAL_OPS_PLANE.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/adr/PROTEIN_NEURAL_OPS_PLANE.md) · [PROTEIN_PATH_ATOM.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/adr/PROTEIN_PATH_ATOM.md)  
**Ops example:** [UNITY_1444_SECRETS_APPLY.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/operations/UNITY_1444_SECRETS_APPLY.md)

---

## AI instructions

1. Before adding any `repo.update(..., data=…)`, ask: can this be a leaf or `patch_paths`?
2. Do not duplicate leaf helpers — extend `project_data_leaf` or call existing domain leaf writers.
3. When touching Hub/CRM/storefront indexes on project slices, always leaf-write the index path.
4. Document new leaf paths in `shared/dna/AI_INDEX.md` when introducing a pattern.
