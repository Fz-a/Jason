@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"
call "%~dp0scripts\git-push.bat" %*
exit /b !ERRORLEVEL!
