---
name: gene-authoring
description: Author a new .gen1 philosophy gene and register it in GENE_INDEX and the navigation map when needed.
---

# Gene authoring

## When to use

- New product contour needs stable AI instructions (axioms, do/don't).
- ADR has a long-lived decision worth a genetic handle.

## Steps

1. Copy template from `philosophy/genes/templates/`.
2. Name file `{{domain}}.{{area}}.{{role}}.gen1.md` matching the tag inside.
3. Sections: Intent, Axioms, AI instructions, Cross-links.
4. Add row to `philosophy/genes/GENE_INDEX.md`.
5. If gene implies code locations, link from `AI_INDEX.md` — do not duplicate hot file lists in the gene.

## Do not

- Create `*.gen2` files in starter projects.
- Duplicate entire ADR body in the gene — link ADR instead.

## Meta gene

`repo.evolution.compression.gen1` — add cluster row if this gene starts a new family.
