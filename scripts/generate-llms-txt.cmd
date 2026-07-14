@echo off
setlocal EnableExtensions
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%generate-llms-txt.mjs" %*
exit /b %ERRORLEVEL%
