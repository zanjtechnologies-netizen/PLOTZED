@echo off
REM Sync with latest dev branch
REM Usage: Run this before starting work each day

echo ========================================
echo Syncing with latest dev branch...
echo ========================================
echo.

REM Save current branch name
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

echo Current branch: %CURRENT_BRANCH%
echo.

REM Stash any uncommitted changes
echo Stashing uncommitted changes...
git stash
echo.

REM Switch to dev and pull
echo Switching to dev branch...
git checkout dev
echo.

echo Pulling latest changes from origin/dev...
git pull origin dev
echo.

REM Go back to your branch
echo Switching back to %CURRENT_BRANCH%...
git checkout %CURRENT_BRANCH%
echo.

REM Merge dev into your branch
echo Merging dev into %CURRENT_BRANCH%...
git merge dev --no-edit
echo.

REM Restore stashed changes
echo Restoring your uncommitted changes...
git stash pop
echo.

echo ========================================
echo Sync complete!
echo ========================================
echo.
echo Next steps:
echo 1. Resolve any conflicts if shown above
echo 2. Continue working on your features
echo 3. Commit and push when ready
echo.

pause
