#Requires -Version 5.1
<#
.SYNOPSIS
  Install Genetic AI Starter Kit into a project (Windows thin wrapper → Node).

.NOTES
  Prefer SETUP.cmd or: node scripts/install.mjs --target <path>
  Profile list: profiles/*.json (includes agentstack-app).
#>
[CmdletBinding()]
param(
    [Parameter()]
    [string] $Target = '.',

    [Parameter()]
    [string] $KitRoot = '',

    [Parameter()]
    [string] $Profile = 'standard',

    [Parameter()]
    [string] $ProjectName = 'My Project',

    [Parameter()]
    [string] $Domain = 'app',

    [switch] $WithAgentstack,
    [switch] $Strict,
    [switch] $DryRun,
    [switch] $MergePhilosophy,
    [switch] $ForcePhilosophy,
    [switch] $Repair,
    [ValidateSet('project', 'global')]
    [string] $Skills = 'project',

    [ValidateSet('none', 'full')]
    [string] $GitignoreKit = 'none'
)

$ErrorActionPreference = 'Stop'

function Resolve-KitRootPath {
    param([string] $Explicit)
    $candidates = @()
    if ($Explicit) { $candidates += $Explicit }
    if ($env:GENETIC_AI_KIT_ROOT) { $candidates += $env:GENETIC_AI_KIT_ROOT }
    if ($env:GENETIC_AI_STARTER_KIT) { $candidates += $env:GENETIC_AI_STARTER_KIT }
    $fromScript = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
    $candidates += $fromScript

    foreach ($c in $candidates) {
        if (-not $c) { continue }
        try { $full = [System.IO.Path]::GetFullPath($c) } catch { continue }
        $installMjs = Join-Path $full 'scripts\install.mjs'
        if (Test-Path -LiteralPath $installMjs) { return $full }
    }

    $cli = Join-Path $PSScriptRoot 'lib\resolve-kit-root-cli.mjs'
    if (Test-Path -LiteralPath $cli) {
        $node = Get-Command node -ErrorAction SilentlyContinue
        if ($node) {
            $resolved = & $node.Source $cli --target $Target 2>$null
            if ($resolved -and (Test-Path (Join-Path $resolved 'scripts\install.mjs'))) {
                return $resolved.Trim()
            }
        }
    }

    throw @"
Cannot find genetic-ai-starter (install.mjs missing).

Set GENETIC_AI_KIT_ROOT or run from kit folder:
  node "<kit>\scripts\install.mjs" --target "<project>" --profile standard
"@
}

function Find-NodeExe {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($node) { return $node.Source }
    foreach ($c in @(
        "$env:ProgramFiles\nodejs\node.exe",
        "$env:LocalAppData\Programs\nodejs\node.exe"
    )) {
        if (Test-Path -LiteralPath $c) { return $c }
    }
    throw 'Node.js not found. Install Node 18+ from https://nodejs.org'
}

$kit = Resolve-KitRootPath -Explicit $KitRoot
if ([System.IO.Path]::IsPathRooted($Target)) {
    $targetPath = [System.IO.Path]::GetFullPath($Target)
} else {
    $targetPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location).Path $Target))
}

$profilesDir = Join-Path $kit 'profiles'
$validProfiles = Get-ChildItem -LiteralPath $profilesDir -Filter '*.json' |
    Where-Object { $_.Name -ne 'manifest.json' } |
    ForEach-Object { $_.BaseName }
if ($Profile -notin $validProfiles) {
    throw "Unknown profile '$Profile'. Valid: $($validProfiles -join ', ')"
}

if (-not (Test-Path -LiteralPath $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    Write-Host "Created target directory: $targetPath"
}

$nodeExe = Find-NodeExe
$installMjs = Join-Path $kit 'scripts\install.mjs'
$args = @(
    $installMjs,
    '--target', $targetPath,
    '--profile', $Profile,
    '--project-name', $ProjectName,
    '--domain', $Domain,
    '--kit-root', $kit
)
if ($WithAgentstack) { $args += '--with-agentstack' }
if ($Strict) { $args += '--strict' }
if ($DryRun) { $args += '--dry-run' }
if ($MergePhilosophy) { $args += '--merge-philosophy' }
if ($ForcePhilosophy -or $Repair) { $args += '--force-philosophy' }
if ($Skills -eq 'global') { $args += '--skills', 'global' }
if ($GitignoreKit -eq 'full') { $args += '--gitignore-kit', 'full' }

Write-Host "Kit:    $kit"
Write-Host "Target: $targetPath"
Write-Host "Profile: $Profile"
Write-Host ''

& $nodeExe @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ''
Write-Host "Done. Open $targetPath in Cursor and read AGENTS.md + docs/ai/AI_NAVIGATION_MAP.md"
