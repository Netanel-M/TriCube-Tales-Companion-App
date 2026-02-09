#!/bin/bash

# Ensure we are in the project root
if [ ! -d "tricube-companion" ]; then
    echo "Error: Please run this script from the project root."
    exit 1
fi

echo "🚀 Starting Deployment..."

# 1. Build the project
echo "📦 Building project..."
cd tricube-companion
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed."
    exit 1
fi
cd ..

# 2. Deploy to production branch
echo "📤 Deploying to production branch..."

# Commit the build artifacts (dist folder) to a temporary branch
# We use git subtree logic manually or via the command to avoid cluttering main
# But simplest robust way for GH Pages from a subfolder is:

# Force add dist
git add tricube-companion/dist -f
git commit -m "Deploy: $(date)"

# Push subtree
git subtree split --prefix tricube-companion/dist -b gh-pages-deploy
git push origin gh-pages-deploy:production --force

# Cleanup
git branch -D gh-pages-deploy
git reset HEAD~1 # Undo the commit on main to keep it clean
rm -rf tricube-companion/dist # Optional: clean up local build

echo "✅ Deployment Complete!"
echo "glhf!"
