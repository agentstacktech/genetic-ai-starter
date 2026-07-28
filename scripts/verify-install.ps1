#Requires -Version 5.1
<#
.SYNOPSIS
  Install Genetic AI Starter into a fresh temp folder and validate (delegates to Node).

.EXAMPLE
  C:\Projects\AgentStack\genetic-ai-starter\scripts\verify-install.ps1
#>
$ErrorActionPreference = 'Stop'
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { throw 'Node.js 18+ required' }
& $node.Source (Join-Path $PSScriptRoot 'verify-install.mjs') @args
exit $LASTEXITCODE
