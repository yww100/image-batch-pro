@echo off
chcp 65001 > nul
title Update Project on GitHub
cd /d "%~dp0"

echo Updating project on GitHub...
echo.

git add .
git commit -m "update %date% %time%" > nul 2>&1
git push origin main

if errorlevel 1 (
    echo.
    echo Update failed.
    pause
) else (
    echo.
    echo Update successful! https://github.com/yww100/image-batch-pro
    pause
)
