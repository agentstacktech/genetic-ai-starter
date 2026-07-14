#!/usr/bin/env python3
"""00-bootstrap — AgentStack SDK catalog + optional login (Python recipe).

Gene: repo.platform.sdk.recipes.gen1
Requires: pip install agentstack-sdk (or monorepo editable install)
"""
from __future__ import annotations

import os
import sys


def verify_step(name: str, ok: bool, detail: str = "") -> None:
    if not ok:
        raise SystemExit(f"verifyStep failed: {name}{(' — ' + detail) if detail else ''}")
    suffix = f": {detail}" if detail else ""
    print(f"✓ {name}{suffix}")


def main() -> None:
    try:
        from agentstack_sdk import AgentStackSDK  # type: ignore
        from agentstack_sdk.config import resolve_agentstack_api_base  # type: ignore
    except ImportError:
        print("Install SDK: pip install agentstack-sdk (or editable from monorepo)")
        raise SystemExit(1)

    api_base = os.environ.get("AGENTSTACK_API_BASE") or resolve_agentstack_api_base()
    sdk = AgentStackSDK(api_base=api_base)
    catalog = sdk.get_module_catalog()
    verify_step("catalog", len(getattr(catalog, "modules", []) or []) > 0, f"modules={len(catalog.modules)}")

    email = (os.environ.get("AGENTSTACK_EMAIL") or "").strip()
    password = (os.environ.get("AGENTSTACK_PASSWORD") or "").strip()
    if not email or not password:
        print("skip login — set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD")
        verify_step("bootstrap-offline", True, "catalog only")
        return

    sdk.platform.auth.login(email=email, password=password)
    projects = sdk.platform.api.get_projects()
    count = len(projects) if isinstance(projects, list) else 0
    verify_step("getProjects", count >= 0, f"count={count}")

    project_id = os.environ.get("AGENTSTACK_PROJECT_ID")
    if project_id:
        sdk.update_project_id(int(project_id))
        verify_step("ensureScope", sdk.get_project_id() == int(project_id), f"projectId={project_id}")


if __name__ == "__main__":
    main()
