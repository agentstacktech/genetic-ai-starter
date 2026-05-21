#Requires -Version 5.1
<#
.SYNOPSIS
  Install Genetic AI Starter Kit into a project (Windows).

.EXAMPLE
  # From AgentStack monorepo — install into another folder:
  .\genetic-ai-starter\scripts\install.ps1 -Target C:\Projects\AgentScreen -ProjectName "Agent Screen" -Domain app

.EXAMPLE
  # Install into current directory (run from target project, pass kit path):
  C:\Projects\AgentStack\genetic-ai-starter\scripts\install.ps1 -Target . -KitRoot C:\Projects\AgentStack\genetic-ai-starter

.EXAMPLE
  Set env once, then from any project:
  $env:GENETIC_AI_STARTER_KIT = 'C:\Projects\AgentStack\genetic-ai-starter'
  & "$env:GENETIC_AI_STARTER_KIT\scripts\install.ps1" -Target .

.NOTES
  Profile comparison: meta/docs/PROFILE_COMPARISON.md

  If you see PSSecurityException (unsigned script), do NOT use bare "& install.ps1". Use:
    install.cmd <target>
    powershell -NoProfile -ExecutionPolicy Bypass -File "<kit>\scripts\install.ps1" ...
    node "<kit>\scripts\install.mjs" ...
#>
[CmdletBinding()]
param(
    [Parameter()]
    [string] $Target = '.',

    [Parameter()]
    [string] $KitRoot = '',

    [Parameter()]
    [ValidateSet('minimal', 'standard', 'full', 'founder')]
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

function Resolve-KitRoot {
    param([string] $Explicit)
    $candidates = @()
    if ($Explicit) { $candidates += $Explicit }
    if ($env:GENETIC_AI_STARTER_KIT) { $candidates += $env:GENETIC_AI_STARTER_KIT }
  # Script lives in <kit>/scripts/install.ps1
    $fromScript = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
    $candidates += $fromScript
    $candidates += 'C:\Projects\AgentStack\genetic-ai-starter'
    $candidates += (Join-Path (Split-Path $PSScriptRoot -Parent) 'genetic-ai-starter')

    foreach ($c in $candidates) {
        if (-not $c) { continue }
        try {
            $full = [System.IO.Path]::GetFullPath($c)
        } catch {
            continue
        }
        $installMjs = Join-Path $full 'scripts\install.mjs'
        if (Test-Path -LiteralPath $installMjs) {
            return $full
        }
    }
    throw @"
Cannot find genetic-ai-starter (install.mjs missing).

You are probably inside the target project only (e.g. C:\Projects\AgentScreen).
The kit lives in the AgentStack monorepo, e.g.:
  C:\Projects\AgentStack\genetic-ai-starter

Run:
  C:\Projects\AgentStack\genetic-ai-starter\scripts\install.ps1 -Target C:\Projects\AgentScreen -ProjectName "My App"

Or set:
  `$env:GENETIC_AI_STARTER_KIT = 'C:\Projects\AgentStack\genetic-ai-starter'
"@
}

function Find-Node {
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        throw 'Node.js not found. Install Node 18+ from https://nodejs.org and reopen PowerShell.'
    }
    return $node.Source
}

$kit = Resolve-KitRoot -Explicit $KitRoot
if ([System.IO.Path]::IsPathRooted($Target)) {
    $targetPath = [System.IO.Path]::GetFullPath($Target)
} else {
    $targetPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location).Path $Target))
}
$installMjs = Join-Path $kit 'scripts\install.mjs'

if (-not (Test-Path -LiteralPath $targetPath)) {
    New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    Write-Host "Created target directory: $targetPath"
}

$nodeExe = Find-Node
$args = @(
    $installMjs,
    '--target', $targetPath,
    '--profile', $Profile,
    '--project-name', $ProjectName,
    '--domain', $Domain
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
Write-Host ""

& $nodeExe @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not $DryRun) {
    $validate = Join-Path $kit 'scripts\validate-installed.mjs'
    if (Test-Path -LiteralPath $validate) {
        Write-Host ""
        Write-Host "Validating install..."
        & $nodeExe $validate '--target' $targetPath
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
}

Write-Host ""
Write-Host "Done. Open $targetPath in Cursor and read AGENTS.md + docs/ai/AI_NAVIGATION_MAP.md"
