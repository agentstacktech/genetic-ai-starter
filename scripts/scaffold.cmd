@echo off
setlocal EnableExtensions
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%scaffold.mjs" %*
exit /b %ERRORLEVEL%
