@echo off

setlocal EnableExtensions

chcp 65001 >nul 2>&1

title Genetic AI Starter — Setup

cd /d "%~dp0"



echo.

echo  Genetic AI Starter Kit — мастер установки

echo  ==========================================

echo.



where node >nul 2>&1

if errorlevel 1 (

  echo  [ОШИБКА] Node.js не найден.

  echo  Установите Node.js 18+ с https://nodejs.org и запустите SETUP.cmd снова.

  echo.

  pause

  exit /b 1

)



node "%~dp0scripts\init.mjs" %*

set "EC=%ERRORLEVEL%"

echo.

if %EC% neq 0 (

  echo  Установка завершилась с ошибкой (код %EC%).

) else (

  echo  Установка завершена.

)

echo.

pause

exit /b %EC%

