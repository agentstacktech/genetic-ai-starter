#Requires -Version 5.1
<#
.SYNOPSIS
  Interactive setup wizard (same as SETUP.cmd).
#>
$ErrorActionPreference = 'Stop'

if ((Get-ExecutionPolicy) -eq 'Restricted') {
    $ps = (Get-Command powershell.exe -ErrorAction Stop).Source
    & $ps -NoProfile -ExecutionPolicy Bypass -File $PSCommandPath @args
    exit $LASTEXITCODE
}

Set-Location $PSScriptRoot

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    $candidates = @(
        "$env:ProgramFiles\nodejs\node.exe",
        "$env:LocalAppData\Programs\nodejs\node.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path -LiteralPath $c) { $node = Get-Command $c; break }
    }
}
if (-not $node) {
    Write-Host 'Node.js 18+ required: https://nodejs.org' -ForegroundColor Red
    exit 2
}

& $node.Source (Join-Path $PSScriptRoot 'scripts\preflight.mjs') --quick --launcher setup.ps1 --kit-root $PSScriptRoot
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $node.Source (Join-Path $PSScriptRoot 'scripts\init.mjs') @args
exit $LASTEXITCODE
