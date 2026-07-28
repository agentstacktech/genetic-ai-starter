# Optional: PowerShell ExecutionPolicy (advanced)

**Not required** for Genetic AI Starter install. Prefer:

- **`SETUP.cmd`** (double-click)
- **`node scripts/install.mjs`**
- **`scripts/install.cmd`** (Node-only)

## When you might use this

Only if you insist on running `& install.ps1` directly without `-ExecutionPolicy Bypass`.

From kit root (one line):

```text
powershell -ExecutionPolicy Bypass -File ".\scripts\enable-windows-scripts.ps1"
```

This sets **CurrentUser** policy to `RemoteSigned`.

## Corporate GPO warning

Many enterprises block `Set-ExecutionPolicy` via Group Policy. In that case **always use Node/CMD** paths above — do not fight policy.

Script location: [`scripts/enable-windows-scripts.ps1`](../../scripts/enable-windows-scripts.ps1)
