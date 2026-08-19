@echo off
setlocal EnableExtensions
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
set PYTHONUTF8=1
set PYTHONUNBUFFERED=1

rem 始终切到仓库根目录（本 bat 在 scripts\ 下）
cd /d "%~dp0\.."

echo ========================================
echo  GitHub 可靠推送 + 远程核对
echo  仓库: %CD%
echo ========================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 git
  pause
  exit /b 1
)

set "PY="
where py >nul 2>&1 && set "PY=py -3"
if not defined PY where python >nul 2>&1 && set "PY=python"
if not defined PY (
  echo [错误] 未找到 Python。也可手动执行：
  echo   git -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push -u origin HEAD
  pause
  exit /b 1
)

%PY% "%~dp0git-push.py" %*
set ERR=%ERRORLEVEL%

echo.
if not "%ERR%"=="0" (
  echo [结果] 失败，退出码 %ERR%
) else (
  echo [结果] 成功。若网站仍旧，请 Ctrl+F5 硬刷新，并等 Pages 构建完成。
)
pause
exit /b %ERR%
