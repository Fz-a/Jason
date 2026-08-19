@echo off
rem 仓库根目录快捷入口：双击即可推送
cd /d "%~dp0"
call "%~dp0scripts\git-push.bat" %*
