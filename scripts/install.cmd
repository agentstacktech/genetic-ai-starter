@echo off
setlocal EnableExtensions
REM Genetic AI Starter Kit — Windows CMD (Node-only, no PowerShell)
REM   install.cmd C:\Projects\AgentScreen
REM   set PROJECT_NAME=AgentScreen & set DOMAIN=app & set PROFILE=full & install.cmd C:\Projects\AgentScreen

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=."
set "TARGET=%TARGET%"
set "SCRIPT_DIR=%~dp0"

call "%SCRIPT_DIR%lib\resolve-node.cmd" || exit /b %ERRORLEVEL%
set "PROJECT_NAME=%PROJECT_NAME%"
set "DOMAIN=%DOMAIN%"
set "PROFILE=%PROFILE%"

"%NODE_EXE%" "%SCRIPT_DIR%run-install-from-env.mjs" --target "%TARGET%" %*
exit /b %ERRORLEVEL%
