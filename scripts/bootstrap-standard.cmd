@echo off
setlocal
cd /d "%~dp0.."
if "%~1"=="" (
  node scripts\bootstrap-standard.mjs --target "%CD%" %*
) else (
  node scripts\bootstrap-standard.mjs %*
)
exit /b %ERRORLEVEL%
