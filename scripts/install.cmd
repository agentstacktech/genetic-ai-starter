@echo off
setlocal EnableExtensions
REM Genetic AI Starter Kit — Windows CMD (ExecutionPolicy Bypass)
REM   install.cmd C:\Projects\AgentScreen
REM   set PROJECT_NAME=AgentScreen & set DOMAIN=app & set PROFILE=full & set GITIGNORE=full & install.cmd C:\Projects\AgentScreen

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=."

set "SCRIPT_DIR=%~dp0"
set "PS1=%SCRIPT_DIR%install.ps1"

if not exist "%PS1%" (
  echo ERROR: install.ps1 not found at %PS1%
  exit /b 1
)

where powershell >nul 2>&1
if errorlevel 1 (
  echo ERROR: PowerShell required. Or: node "%SCRIPT_DIR%install.mjs" --target "%TARGET%" ...
  exit /b 1
)

set "PN=%PROJECT_NAME%"
if "%PN%"=="" set "PN=My Project"
set "DM=%DOMAIN%"
if "%DM%"=="" set "DM=app"
set "PF=%PROFILE%"
if "%PF%"=="" set "PF=standard"

set "GI_ARG="
if /I "%GITIGNORE%"=="full" set "GI_ARG=-GitignoreKit full"

set "EXTRA_STRICT=-Strict"
if /I "%STRICT%"=="0" set "EXTRA_STRICT="

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS1%" -Target "%TARGET%" -ProjectName "%PN%" -Domain "%DM%" -Profile %PF% %EXTRA_STRICT% %GI_ARG% %*
exit /b %ERRORLEVEL%
