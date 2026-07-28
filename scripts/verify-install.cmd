@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
call "%SCRIPT_DIR%lib\resolve-node.cmd" || exit /b %ERRORLEVEL%

"%NODE_EXE%" "%SCRIPT_DIR%verify-install.mjs" %*
exit /b %ERRORLEVEL%
