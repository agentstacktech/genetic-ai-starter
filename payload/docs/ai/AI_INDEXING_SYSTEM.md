# AI indexing system — AgentStack

**Audience:** Humans and agents maintaining or navigating the monorepo.  
**Companion:** [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) · [templates/AI_INDEX.template.md](templates/AI_INDEX.template.md) · `.cursor/rules/genetic-navigation.mdc` · [AGENTS.md](../../AGENTS.md)

**Genes (kit):** `repo.navigation.map.gen1` · `repo.navigation.index.gen1`  
**Monorepo plane:** [`repo.engineering.ai_navigation.gen1`](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/repo.engineering.ai_navigation.gen1.md)

---

## 1. Why this exists

Unscoped search across large packages is slow, noisy, and error-prone. Local **`AI_INDEX.md`** files plus a central **map** give: **meaning → subsystem → hot files → targeted search**.

ROI is high enough that almost any **noticeably non-trivial** area should have an index.

---

## 2. Genetic coding (semantic addressing)

Each indexed subsystem carries a **genetic tag** such as `core.mcp.tools.gen1`.

### 2.1 What it is for

- Fast routing: task wording → map row → index → hot files  
- Module trees by **responsibility**, not only folder names  
- Stable references in commits / agent summaries  

### 2.2 Forming a genetic path

```text
<domain>.<subsystem-or-area>.<role>.<generation>
```

Prefer **one tag per index**. Align new tags with [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md). Canonical Python package **`shared`** lives only at repo root ([https://github.com/agentstacktech/AgentStack/tree/main/docs/SHARED_SINGLE_PACKAGE.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/SHARED_SINGLE_PACKAGE.md)).

### 2.3 Where tags live (prose contract)

- **Registry:** `docs/ai/AI_NAVIGATION_MAP.md`  
- **Local index:** first block of each `AI_INDEX.md` — line:

```markdown
**Genetic code:** `shared.atoms.gen1`
```

(also accepted: `**Genetic tag:**`). Parsers use:

```text
/\*\*Genetic (?:code|tag):\*\*\s*`([a-z0-9_.]+)`/i
```

YAML frontmatter is **optional/additive** — not required. Do not treat markdown `---` horizontal rules as frontmatter.

### 2.4 L1 triggers (Skill-style)

Map scope / when-to-use cells should include short noun phrases (5–12 words) that match agent task language. These feed `TAG_CATALOG.json` triggers.

---

## 3. Artifacts

| Artifact | Role |
|----------|------|
| [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) | Human L1 registry |
| `**/AI_INDEX.md` | L2 local nav + hot files + **Remarks** |
| Canonical `INDEX.md` | Large catalogs (mcp, ai_builder); AI_INDEX may alias |
| [AI_AGENT_INTENT_ROUTER.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/AI_AGENT_INTENT_ROUTER.md) | Intent → strategy (docs-nav vs MCP) |
| [ecosystem/AI_NAVIGATION_GAP_REGISTER.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/ecosystem/AI_NAVIGATION_GAP_REGISTER.md) | NAV-G# gaps |
| `_generated/ai-nav/*` (AgentStack host only) | Optional generated catalog/graph — not required in consumer kits |
| Kit genes `repo.navigation.map.gen1` / `index.gen1` | Consumer L1/L2 contract |
| Root [AGENTS.md](../../AGENTS.md) | Thin pointer only |
| `.cursor/rules/genetic-navigation.mdc` | Always-on workflow |
| `.cursor/rules/genetic-index-authoring.mdc` | Authoring checklist |

---

## 4. Four tag universes (do not merge)

| Universe | SoT | Purpose |
|----------|-----|---------|
| **Nav tags** | Map + AI_INDEX prose | Route agents to files |
| **Philosophy genes** | `philosophy/genes/*.md` | Why / boundaries |
| **genes_config / resolver** | `genes_config.json` + `gene_document_resolver.py` | Loader, redirects |
| **Runtime capabilities** | MCP discovery / capability matrix | Which tool to call |

`TAG_CATALOG` is a **generated view of nav tags** only. Optional `gene` field if a matching `.md` exists — null is fine. Navigation tags **need not** have a philosophy gene ([§5](#5-relationship-to-philosophy--genes)).

---

## 5. Relationship to philosophy / genes

Philosophy describes product principles. Nav tags are navigation identifiers. Compression: [GENE_COMPRESSION_MAP.md](../../philosophy/genes/GENE_COMPRESSION_MAP.md). Editing: `repo.engineering.controlled_changes.gen1` → [repo.engineering.controlled_changes.gen1.md](../../philosophy/genes/repo.engineering.controlled_changes.gen1.md).

---

## 6. When to create / update

**Hard threshold:** ~10+ integration points → new `AI_INDEX.md` + Tier 1 map row + `.cursorrules` highlight if major.  
**Always:** refresh hot files / sideways when boundaries move; same PR when possible.  
**Remarks:** new and high-traffic indexes should include pillars / approach / anti-patterns / cluster / git root.

### Agent workflow

0. Ambiguous intent → [AI_AGENT_INTENT_ROUTER.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/AI_AGENT_INTENT_ROUTER.md)  
1. Map → tag  
2. AI_INDEX → hot files  
3. Scoped search  
4. Update index if boundary moved; regen catalog after map/index genetic-line changes  

### Audit scopes

Default CI: `--scope=platform` (excludes CardGame, archive, kit benchmarks/fixtures). See gap register.

---

## 7. See also

- [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md)
- [templates/AI_INDEX.template.md](templates/AI_INDEX.template.md)
- [repo.navigation.map.gen1.md](../../philosophy/genes/repo.navigation.map.gen1.md)
- [repo.navigation.index.gen1.md](../../philosophy/genes/repo.navigation.index.gen1.md)
- Monorepo adapters (optional): [`repo.engineering.ai_navigation.gen1`](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/repo.engineering.ai_navigation.gen1.md)
