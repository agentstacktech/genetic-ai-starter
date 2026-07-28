@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
title Genetic AI Starter — Setup
cd /d "%~dp0"

set "SKIP_PAUSE="
if defined CI set "SKIP_PAUSE=1"
echo %* | findstr /i /c:"--yes" /c:"-y" >nul && set "SKIP_PAUSE=1"

echo.
echo  Genetic AI Starter Kit — setup wizard
echo  =====================================
echo.

call "%~dp0scripts\lib\resolve-node.cmd"
if errorlevel 1 (
  echo.
  if not defined SKIP_PAUSE pause
  exit /b 2
)

"%NODE_EXE%" "%~dp0scripts\preflight.mjs" --quick --launcher setup.cmd --kit-root "%~dp0."
if errorlevel 1 (
  echo.
  if not defined SKIP_PAUSE pause
  exit /b 1
)

"%NODE_EXE%" "%~dp0scripts\init.mjs" %*
set "EC=%ERRORLEVEL%"

echo.
if %EC% NEQ 0 goto :failed
echo  Setup completed.
goto :done
:failed
echo  Setup failed - exit code %EC%
:done
echo.
if not defined SKIP_PAUSE pause
exit /b %EC%
