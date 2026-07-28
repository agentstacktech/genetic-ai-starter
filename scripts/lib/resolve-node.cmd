@echo off
setlocal EnableExtensions
REM Resolve NODE_EXE for Windows CMD launchers (S0/P0).
REM Must export NODE_EXE to caller via endlocal (setlocal would otherwise drop it).

set "NODE_EXE="
set "BOOT="

where node >nul 2>&1 && set "BOOT=node"
if not defined BOOT if exist "%ProgramFiles%\nodejs\node.exe" set "BOOT=%ProgramFiles%\nodejs\node.exe"
if not defined BOOT if exist "%LocalAppData%\Programs\nodejs\node.exe" set "BOOT=%LocalAppData%\Programs\nodejs\node.exe"

if defined BOOT (
  for /f "usebackq delims=" %%N in (`"%BOOT%" "%~dp0find-node-cli.mjs" 2^>nul`) do set "NODE_EXE=%%N"
)
if not defined NODE_EXE if defined BOOT set "NODE_EXE=%BOOT%"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LocalAppData%\Programs\nodejs\node.exe" set "NODE_EXE=%LocalAppData%\Programs\nodejs\node.exe"

if not defined NODE_EXE (
  echo [E_NODE_MISSING] Node.js not found in PATH.
  echo Install Node.js 18+ from https://nodejs.org
  echo Or: winget install OpenJS.NodeJS.LTS
  exit /b 2
)

"%NODE_EXE%" -e "const m=parseInt(process.versions.node.split('.')[0],10);if(m<18){console.error('[E_NODE_VERSION] Node 18+ required, found '+process.versions.node);process.exit(1)}"
if errorlevel 1 (
  endlocal
  exit /b 2
)

endlocal & set "NODE_EXE=%NODE_EXE%"
exit /b 0
