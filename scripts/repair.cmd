@echo off

setlocal EnableExtensions

REM Repair install — same Bypass as install.cmd

set "TARGET=%~1"

if "%TARGET%"=="" set "TARGET=."



set "SCRIPT_DIR=%~dp0"

set "PS1=%SCRIPT_DIR%repair.ps1"



if not exist "%PS1%" (

  echo ERROR: repair.ps1 not found

  exit /b 1

)



powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Target "%TARGET%" %*

exit /b %ERRORLEVEL%

