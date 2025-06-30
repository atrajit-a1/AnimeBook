@echo off
REM Anime Book Library - GitHub Pages Deployment Script for Windows

echo === Anime Book Library Deployment Script ===
echo This script helps deploy the website to GitHub Pages for atrajit-sarkar/AnimeBook.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed. Please install git first.
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo Error: Not a git repository. Please run this script from the root of the repository.
    exit /b 1
)

REM Make sure we're on the main branch
for /f "tokens=*" %%a in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%a
if not "%CURRENT_BRANCH%"=="main" (
    echo Warning: You are not on the main branch. Currently on: %CURRENT_BRANCH%
    set /p CONTINUE=Do you want to continue anyway? (y/n) 
    if /i not "%CONTINUE%"=="y" exit /b 1
)

REM Check for uncommitted changes
git status --porcelain > temp.txt
set /p HAS_CHANGES=<temp.txt
del temp.txt

if defined HAS_CHANGES (
    echo Warning: You have uncommitted changes.
    set /p COMMIT=Do you want to commit these changes before deploying? (y/n) 
    if /i "%COMMIT%"=="y" (
        set /p COMMIT_MSG=Enter commit message: 
        git add .
        git commit -m "%COMMIT_MSG%"
    ) else (
        set /p CONTINUE=Do you want to continue anyway? (y/n) 
        if /i not "%CONTINUE%"=="y" exit /b 1
    )
)

REM Check if gh-pages branch exists
git show-ref --verify --quiet refs/heads/gh-pages
if %ERRORLEVEL% equ 0 (
    echo gh-pages branch exists. Will update it.
) else (
    echo Creating gh-pages branch...
    git checkout -b gh-pages
    git checkout main
)

REM Deploy to gh-pages
echo Deploying to GitHub Pages...
git push origin main

REM Check if we should update the gh-pages branch
set /p UPDATE_PAGES=Do you want to update the gh-pages branch? (y/n) 
if /i "%UPDATE_PAGES%"=="y" (
    git checkout gh-pages
    git merge main
    git push origin gh-pages
    git checkout main
    echo Successfully deployed to GitHub Pages!
) else (
    echo Skipped gh-pages update. Only pushed to main branch.
)

echo Done!
pause