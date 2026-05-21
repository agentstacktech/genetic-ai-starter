@echo off

setlocal EnableExtensions

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0verify-install.ps1" %*

exit /b %ERRORLEVEL%

