#!/bin/bash

# Anime Book Library - GitHub Pages Deployment Script

echo "=== Anime Book Library Deployment Script ==="
echo "This script helps deploy the website to GitHub Pages for atrajit-sarkar/AnimeBook."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Please run this script from the root of the repository."
    exit 1
fi

# Make sure we're on the main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Warning: You are not on the main branch. Currently on: $CURRENT_BRANCH"
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "Warning: You have uncommitted changes."
    read -p "Do you want to commit these changes before deploying? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " COMMIT_MSG
        git add .
        git commit -m "$COMMIT_MSG"
    else
        read -p "Do you want to continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "gh-pages branch exists. Will update it."
else
    echo "Creating gh-pages branch..."
    git checkout -b gh-pages
    git checkout main
fi

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
git push origin main

# Check if we should update the gh-pages branch
read -p "Do you want to update the gh-pages branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout gh-pages
    git merge main
    git push origin gh-pages
    git checkout main
    echo "Successfully deployed to GitHub Pages!"
else
    echo "Skipped gh-pages update. Only pushed to main branch."
fi

echo "Done!"