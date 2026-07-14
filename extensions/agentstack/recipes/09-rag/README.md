# 09 — RAG search

MCP action `rag.search` for semantic retrieval.

## Env

- `AGENTSTACK_API_KEY`
- `AGENTSTACK_PROJECT_ID`
- `RAG_COLLECTION_ID` — required for live call
- `RAG_QUERY` — optional query text
- `RAG_TOP_K` — default `3`

## Run

```bash
npm run recipe:09-rag
```

Without `RAG_COLLECTION_ID` the recipe documents the payload and exits cleanly.
