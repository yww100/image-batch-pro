@echo off
chcp 65001 > nul
cd /d "%~dp0"

echo Upload script started > upload.log 2>&1
echo Current folder: %CD% >> upload.log 2>&1

echo Checking Git... >> upload.log 2>&1
git --version >> upload.log 2>&1

echo. >> upload.log
echo Init check... >> upload.log 2>&1
git rev-parse --git-dir >> upload.log 2>&1
if errorlevel 1 (
    echo Initializing git... >> upload.log
    git init >> upload.log 2>&1
)

echo. >> upload.log
echo Configuring user... >> upload.log 2>&1
git config user.email "yww100@users.noreply.github.com" >> upload.log 2>&1
git config user.name "yww100" >> upload.log 2>&1

echo. >> upload.log
echo Adding remote... >> upload.log 2>&1
git remote get-url origin >> upload.log 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/yww100/image-batch-pro.git >> upload.log 2>&1
)

echo. >> upload.log
echo Adding files... >> upload.log 2>&1
git add . >> upload.log 2>&1

echo. >> upload.log
echo Committing... >> upload.log 2>&1
git commit -m "Initial upload" >> upload.log 2>&1

echo. >> upload.log
echo Branches: >> upload.log 2>&1
git branch -a >> upload.log 2>&1

echo. >> upload.log
echo Pushing... >> upload.log 2>&1
git branch -M main >> upload.log 2>&1
git push -u origin main >> upload.log 2>&1

echo. >> upload.log
echo DONE >> upload.log

pause
