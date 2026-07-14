@echo off
setlocal EnableExtensions
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%check-capability-contract.mjs" %*
exit /b %ERRORLEVEL%
