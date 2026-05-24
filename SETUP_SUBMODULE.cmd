@echo off
REM Run from consumer repo root after cloning (or from kit folder with --target)
cd /d "%~dp0"
node scripts\remote-bootstrap.mjs --target "%CD%" %*
exit /b %ERRORLEVEL%
