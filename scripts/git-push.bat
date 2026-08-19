@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0\.."

set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set PYTHONUNBUFFERED=1

echo ========================================
echo  GitHub push helper
echo  Repo: %CD%
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] git not found. Install Git for Windows.
  pause
  exit /b 1
)

set "PY_CMD="
where py >nul 2>&1
if not errorlevel 1 set "PY_CMD=py"

if not defined PY_CMD (
  where python >nul 2>&1
  if not errorlevel 1 set "PY_CMD=python"
)

if not defined PY_CMD (
  echo [ERROR] Python not found.
  echo Manual:
  echo   git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push -u origin HEAD
  pause
  exit /b 1
)

echo Using: %PY_CMD%
echo.

if /I "%PY_CMD%"=="py" (
  py -3 -u "%~dp0git-push.py" %*
) else (
  python -u "%~dp0git-push.py" %*
)
set "PUSH_EXIT=!ERRORLEVEL!"

echo.
if not "!PUSH_EXIT!"=="0" (
  echo [RESULT] FAILED  exit=!PUSH_EXIT!
) else (
  echo [RESULT] OK
  echo If site looks old: Ctrl+F5 hard refresh, wait for Pages build.
)
pause
exit /b !PUSH_EXIT!
