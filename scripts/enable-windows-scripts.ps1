#Requires -Version 5.1
<#
.SYNOPSIS
  Optional: allow local .ps1 via & (CurrentUser). Not required if you use .cmd or -ExecutionPolicy Bypass.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\enable-windows-scripts.ps1
#>
[CmdletBinding()]
param(
    [ValidateSet('RemoteSigned', 'Bypass', 'Unrestricted')]
    [string] $Policy = 'RemoteSigned'
)

$current = Get-ExecutionPolicy -Scope CurrentUser
Set-ExecutionPolicy -ExecutionPolicy $Policy -Scope CurrentUser -Force
Write-Host "CurrentUser execution policy: $current -> $Policy"
Write-Host "You can now run: & '<kit>\scripts\install.ps1' -Target ..."
Write-Host "Or keep using install.cmd / node install.mjs (no policy change needed)."
