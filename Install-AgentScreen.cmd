@echo off

REM One-click install into AgentScreen (edit TARGET if needed)

setlocal

cd /d "%~dp0"



if exist "C:\Projects\genetic-ai-starter\scripts\init.mjs" (

  set "KIT_ROOT=C:\Projects\genetic-ai-starter"

) else (

  set "KIT_ROOT=%~dp0"

)



set "TARGET=C:\Projects\AgentScreen"

set "PROJECT_NAME=AgentScreen"

set "PROFILE=full"

set "DOMAIN=app"



where node >nul 2>&1

if errorlevel 1 (

  echo Node.js 18+ required: https://nodejs.org

  pause

  exit /b 1

)



echo Installing profile %PROFILE% into %TARGET% ...

node "%KIT_ROOT%scripts\init.mjs" --yes --target "%TARGET%" --profile %PROFILE% --project-name "%PROJECT_NAME%" --domain %DOMAIN% --gitignore-kit full

echo.

pause

exit /b %ERRORLEVEL%

