#Requires -Version 5.1
<#
  Run another kit .ps1 with ExecutionPolicy Bypass (avoids PSSecurityException when parent used &).
#>
function Invoke-KitPs1 {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string] $RelativeScript,
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]] $ChildArgs
    )

    $scriptsDir = Split-Path $PSScriptRoot -Parent
    $file = Join-Path $scriptsDir $RelativeScript
    if (-not (Test-Path -LiteralPath $file)) {
        throw "Kit script not found: $file"
    }

    $ps = (Get-Command powershell.exe -ErrorAction Stop).Source
    $all = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $file) + $ChildArgs
    & $ps @all
    if ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
