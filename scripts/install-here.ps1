#Requires -Version 5.1
<#
.SYNOPSIS
  Install Genetic AI Starter Kit into the CURRENT directory.

.EXAMPLE
  cd C:\Projects\AgentScreen
  C:\Projects\AgentStack\genetic-ai-starter\scripts\install-here.ps1 -ProjectName "Agent Screen"
#>
[CmdletBinding()]
param(
    [string] $ProjectName = '',
    [string] $Domain = 'app',
    [ValidateSet('minimal', 'standard', 'full', 'founder')]
    [string] $Profile = 'standard',
    [switch] $WithAgentstack,
    [switch] $Strict
)

if (-not $ProjectName) {
    $ProjectName = Split-Path (Get-Location) -Leaf
}

$params = @{
    Target      = (Get-Location).Path
    ProjectName = $ProjectName
    Domain      = $Domain
    Profile     = $Profile
}
if ($WithAgentstack) { $params.WithAgentstack = $true }
if ($Strict) { $params.Strict = $true }

. (Join-Path $PSScriptRoot 'lib\Invoke-KitPs1.ps1')
$child = @(
    '-Target', $params.Target,
    '-ProjectName', $params.ProjectName,
    '-Domain', $params.Domain,
    '-Profile', $params.Profile
)
if ($params.WithAgentstack) { $child += '-WithAgentstack' }
if ($params.Strict) { $child += '-Strict' }
Invoke-KitPs1 -RelativeScript 'install.ps1' -ChildArgs $child
exit $LASTEXITCODE
