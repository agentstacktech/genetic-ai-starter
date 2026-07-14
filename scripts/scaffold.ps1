#Requires -Version 5.1
<#
.SYNOPSIS
  Run scaffold.mjs (Windows).

.EXAMPLE
  & ".\scripts\scaffold.ps1" --generator subsystem --name billing --target .
#>
[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $ChildArgs
)

$node = (Get-Command node.exe -ErrorAction Stop).Source
$script = Join-Path $PSScriptRoot 'scaffold.mjs'
& $node $script @ChildArgs
if ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
