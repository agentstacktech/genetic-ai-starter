@echo off
setlocal EnableExtensions
REM Install into CURRENT directory. First: cd C:\Projects\YourApp

set "SCRIPT_DIR=%~dp0"
call "%SCRIPT_DIR%lib\resolve-node.cmd" || exit /b %ERRORLEVEL%

set "TARGET=%CD%"
"%NODE_EXE%" "%SCRIPT_DIR%run-install-from-env.mjs" --target "%TARGET%" %*
exit /b %ERRORLEVEL%
