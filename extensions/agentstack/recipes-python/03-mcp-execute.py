#!/usr/bin/env python3
"""03-mcp-execute — POST /mcp agentstack.execute batch (Python recipe)."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request


def verify_step(name: str, ok: bool, detail: str = "") -> None:
    if not ok:
        raise SystemExit(f"verifyStep failed: {name}{(' — ' + detail) if detail else ''}")
    print(f"✓ {name}" + (f": {detail}" if detail else ""))


def resolve_mcp_auth_token() -> str | None:
    for key in ("AGENTSTACK_API_KEY", "AGENTSTACK_ACCESS_TOKEN", "AGENTSTACK_TOKEN"):
        val = (os.environ.get(key) or "").strip()
        if val:
            return val
    return None


def resolve_mcp_url(api_base: str) -> str:
    trimmed = api_base.rstrip("/")
    origin = trimmed[:-4] if trimmed.endswith("/api") else trimmed
    return f"{origin}/mcp"


def main() -> None:
    token = resolve_mcp_auth_token()
    if not token:
        raise SystemExit("set AGENTSTACK_API_KEY or AGENTSTACK_ACCESS_TOKEN for MCP execute")

    api_base = (os.environ.get("AGENTSTACK_API_BASE") or "https://agentstack.tech/api").strip()
    mcp_url = resolve_mcp_url(api_base)
    project_id = int(os.environ.get("AGENTSTACK_PROJECT_ID", "1"))

    body = json.dumps(
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "agentstack.execute",
                "arguments": {
                    "steps": [{"id": "projects", "action": "projects.get_projects", "params": {}}],
                    "context": {"project_id": project_id},
                    "options": {"stopOnError": True},
                },
            },
        }
    ).encode("utf-8")

    req = urllib.request.Request(
        mcp_url,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            verify_step("mcp-http", 200 <= res.status < 300, f"status={res.status}")
            payload = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as err:
        verify_step("mcp-http", False, f"status={err.code}")
        raise

    results = payload.get("results")
    if results is None and isinstance(payload.get("result"), dict):
        results = payload["result"].get("results")
    first = results[0] if isinstance(results, list) and results else None
    verify_step(
        "agentstack.execute",
        (first or {}).get("ok") is True or results is not None,
        (first or {}).get("id", "batch accepted"),
    )


if __name__ == "__main__":
    main()
