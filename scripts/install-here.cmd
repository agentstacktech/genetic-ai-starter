@echo off

setlocal EnableExtensions

REM Install into CURRENT directory. First: cd C:\Projects\YourApp

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-here.ps1" %*

exit /b %ERRORLEVEL%

