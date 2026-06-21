@echo off
chcp 65001 > nul
title Deploy to Vercel
cd /d "%~dp0"

echo Checking Node.js...
node --version > nul 2>&1
if errorlevel 1 (
    echo.
    echo Node.js not found. Please install it from https://nodejs.org/
    echo Download the LTS version and run the installer.
    pause
    exit /b
)

echo.
echo Checking Vercel CLI...
vercel --version > nul 2>&1
if errorlevel 1 (
    echo.
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo ============================================================
echo  Starting deployment. A browser window will open.
echo  Please click "Authorize" in the browser. That is the ONLY
echo  step you need to do. Then come back here.
echo ============================================================
echo.

vercel --prod --yes

if errorlevel 1 (
    echo.
    echo Deployment failed.
    pause
) else (
    echo.
    echo Deployment complete! Check the URL above.
    pause
)
