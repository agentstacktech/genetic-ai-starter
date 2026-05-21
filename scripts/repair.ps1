#Requires -Version 5.1
<#
.SYNOPSIS
  Repair a partial or broken genetic-ai-starter install (Windows).

.EXAMPLE
  & "C:\Projects\genetic-ai-starter\scripts\repair.ps1" -Target "C:\Projects\AgentScreen"
#>
[CmdletBinding()]
param(
    [Parameter()]
    [string] $Target = '.',
    [string] $KitRoot = ''
)

. (Join-Path $PSScriptRoot 'lib\Invoke-KitPs1.ps1')
$child = @('-Target', $Target, '-Repair', '-Strict')
if ($KitRoot) { $child += @('-KitRoot', $KitRoot) }
Invoke-KitPs1 -RelativeScript 'install.ps1' -ChildArgs $child
exit $LASTEXITCODE
