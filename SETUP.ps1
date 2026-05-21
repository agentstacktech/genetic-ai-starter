#Requires -Version 5.1
<#
.SYNOPSIS
  Interactive setup wizard (same as SETUP.cmd).
#>
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host 'Node.js 18+ required: https://nodejs.org' -ForegroundColor Red
    exit 1
}

& $node.Source (Join-Path $PSScriptRoot 'scripts\init.mjs') @args
exit $LASTEXITCODE
