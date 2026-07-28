@echo off
setlocal EnableExtensions
chcp 65001 >nul 2>&1
title Genetic AI Starter — Setup
set GENETIC_AI_LOCALE=en
cd /d "%~dp0"
call "%~dp0SETUP.cmd" %*
