@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\update-atlas.ps1"
echo.
pause
endlocal
