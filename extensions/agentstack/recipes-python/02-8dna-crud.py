#!/usr/bin/env python3
"""02-8dna-crud — sdk.protocol dnaList + executeCommand (Python recipe)."""
from __future__ import annotations

import os
import sys


def verify_step(name: str, ok: bool, detail: str = "") -> None:
    if not ok:
        raise SystemExit(f"verifyStep failed: {name}{(' — ' + detail) if detail else ''}")
    print(f"✓ {name}" + (f": {detail}" if detail else ""))


def gate_capability(matrix, cap_id: str) -> bool:
    for entry in list(getattr(matrix, "platform", []) or []) + list(getattr(matrix, "domain", []) or []):
        if getattr(entry, "id", None) == cap_id:
            return getattr(entry, "enabled", True) is not False
    return False


def main() -> None:
    try:
        from agentstack_sdk import AgentStackSDK  # type: ignore
        from agentstack_sdk.config import resolve_agentstack_api_base  # type: ignore
    except ImportError:
        print("Install SDK: pip install agentstack-sdk")
        raise SystemExit(1)

    sdk = AgentStackSDK(api_base=os.environ.get("AGENTSTACK_API_BASE") or resolve_agentstack_api_base())
    matrix = sdk.get_capability_matrix()
    verify_step("gate-protocol", gate_capability(matrix, "protocol"), "protocol enabled")

    email = (os.environ.get("AGENTSTACK_EMAIL") or "").strip()
    password = (os.environ.get("AGENTSTACK_PASSWORD") or "").strip()
    if not email or not password:
        print("skip DNA — set AGENTSTACK_EMAIL and AGENTSTACK_PASSWORD")
        verify_step("8dna-offline", True, "gating only")
        return

    sdk.platform.auth.login(email=email, password=password)
    project_id = int(os.environ.get("AGENTSTACK_PROJECT_ID") or 0) or None
    if project_id:
        sdk.update_project_id(project_id)

    listed = sdk.protocol.dna_list("projects", limit=5)
    entities = getattr(listed, "entities", listed if isinstance(listed, list) else [])
    verify_step("dnaList", isinstance(entities, list), f"entities={len(entities)}")

    command_name = os.environ.get("DNA_COMMAND", "list_something")
    sdk.protocol.execute_command(
        command_type="dna_crud",
        command_name=command_name,
        payload={
            "target_entity": "project",
            "operation_type": "read",
            "input_data": {"project_id": sdk.get_project_id()},
        },
    )
    verify_step("executeCommand", True, command_name)
    sdk.protocol.invalidate_snapshot_prefix("projects")
    verify_step("invalidateSnapshotPrefix", True, "projects")


if __name__ == "__main__":
    main()
