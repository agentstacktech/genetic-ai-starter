# AgentStack Python recipes

Runnable reference scripts for consumer projects installed with `--lang python`.

| Script | Action |
|--------|--------|
| `00-bootstrap.py` | SDK catalog + optional login |
| `02-8dna-crud.py` | `dna_list` + `execute_command` + cache invalidation |
| `03-mcp-execute.py` | POST `/mcp` with `agentstack.execute` |

## Setup

```bash
pip install agentstack-sdk
cp .env.example .env.local
export $(grep -v '^#' .env.local | xargs)
python 00-bootstrap.py
```

Gene: `repo.platform.sdk.recipes.gen1`
