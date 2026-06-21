@echo off
chcp 65001 > nul
title Upload to GitHub
cd /d "%~dp0"

echo Checking Git installation...
git --version > nul 2>&1
if errorlevel 1 (
    echo.
    echo Git not found. Please install Git from https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b
)

echo.
echo Git found. Starting upload...
echo.

:: Initialize git if not already
git rev-parse --git-dir > nul 2>&1
if errorlevel 1 (
    echo Initializing repository...
    git init
)

:: Set default user info (only needed first time)
git config user.email "yww100@users.noreply.github.com" > nul 2>&1
git config user.name "yww100" > nul 2>&1

:: Add remote origin if not already set
git remote get-url origin > nul 2>&1
if errorlevel 1 (
    echo Connecting to GitHub repository...
    git remote add origin https://github.com/yww100/image-batch-pro.git
)

echo.
echo Adding files...
git add .

echo.
echo Committing changes...
git commit -m "Initial upload from local"

if errorlevel 1 (
    echo.
    echo Commit failed. Check messages above.
    pause
    exit /b
)

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed. A browser window may open to log in to GitHub.
    echo If not, run this command and try again:
    echo   git credential-manager configure
    pause
) else (
    echo.
    echo Upload successful! Visit: https://github.com/yww100/image-batch-pro
    pause
)
