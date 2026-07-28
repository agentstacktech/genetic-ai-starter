@echo off
setlocal EnableExtensions
REM Repair install — Node-only

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=."
set "SCRIPT_DIR=%~dp0"

call "%SCRIPT_DIR%lib\resolve-node.cmd" || exit /b %ERRORLEVEL%

"%NODE_EXE%" "%SCRIPT_DIR%run-repair-from-env.mjs" --target "%TARGET%" %*
exit /b %ERRORLEVEL%
