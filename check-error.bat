@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Running upload diagnostics... > upload-error.log 2>&1

git --version >> upload-error.log 2>&1
echo --- >> upload-error.log

git rev-parse --git-dir >> upload-error.log 2>&1
echo --- >> upload-error.log

git remote -v >> upload-error.log 2>&1
echo --- >> upload-error.log

git add . >> upload-error.log 2>&1
git commit -m "diagnostic" >> upload-error.log 2>&1
git branch -M main >> upload-error.log 2>&1
git push -u origin main >> upload-error.log 2>&1

echo.
echo Done. The file upload-error.log has been created.
echo Please tell the assistant to read: D:\claude工作区\image-batch-pro\upload-error.log
pause
