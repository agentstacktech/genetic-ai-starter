#Requires -Version 5.1
<#
.SYNOPSIS
  Install Genetic AI Starter into a fresh temp folder and validate (Windows smoke test).

.EXAMPLE
  C:\Projects\AgentStack\genetic-ai-starter\scripts\verify-install.ps1
  C:\Projects\AgentStack\genetic-ai-starter\scripts\verify-install.ps1 -Profile minimal
#>
[CmdletBinding()]
param(
    [ValidateSet('minimal', 'standard', 'full', 'founder')]
    [string] $Profile = 'standard',
    [switch] $KeepTemp
)

$ErrorActionPreference = 'Stop'
$temp = Join-Path $env:TEMP "genetic-ai-starter-verify-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $temp -Force | Out-Null

try {
    Write-Host "Temp target: $temp"
    Write-Host "Profile:     $Profile"
    Write-Host ""

    . (Join-Path $PSScriptRoot 'lib\Invoke-KitPs1.ps1')
    Invoke-KitPs1 -RelativeScript 'install.ps1' -ChildArgs @(
        '-Target', $temp,
        '-ProjectName', 'Verify Install',
        '-Domain', 'verify',
        '-Profile', $Profile,
        '-Strict'
    )
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    $mustExist = @(
        'AGENTS.md',
        '.cursorrules',
        'docs\ai\AI_NAVIGATION_MAP.md',
        '.genetic-ai\kit.lock.json',
        '.cursor\rules\genetic-navigation.mdc'
    )
    if ($Profile -ne 'minimal') {
        $mustExist += 'philosophy\genes\GENE_INDEX.md'
    }

    $missing = @()
    foreach ($rel in $mustExist) {
        $p = Join-Path $temp $rel
        if (-not (Test-Path -LiteralPath $p)) { $missing += $rel }
    }

    $stubLeak = Join-Path $temp 'docs\ai\AI_NAVIGATION_MAP.minimal.stub.md'
    if (Test-Path -LiteralPath $stubLeak) {
        throw "Stub file should not be copied on profile ${Profile}: ${stubLeak}"
    }

    if ($missing.Count -gt 0) {
        throw "Missing after install: $($missing -join ', ')"
    }

    $doctor = Join-Path $PSScriptRoot 'doctor.mjs'
    & node $doctor '--target' $temp
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host ''
    Write-Host "VERIFY OK profile=$Profile temp=$temp"
    if ($KeepTemp) {
        Write-Host 'Kept temp folder (-KeepTemp).'
    }
}
finally {
    if (-not $KeepTemp -and (Test-Path -LiteralPath $temp)) {
        Remove-Item -LiteralPath $temp -Recurse -Force
        Write-Host 'Removed temp folder.'
    }
}
