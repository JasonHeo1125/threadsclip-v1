#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /home/opc/threadsclip

echo "📥 Pulling latest code..."
git pull origin main

PACKAGE_CHANGED=false
if git diff HEAD@{1} HEAD --name-only | grep -q "package-lock.json"; then
  PACKAGE_CHANGED=true
fi

if [ "$PACKAGE_CHANGED" = true ]; then
  echo "📦 package-lock.json changed, running npm ci..."
  npm ci --include=dev
else
  echo "✅ Checking node_modules integrity..."
  if ! npm ls --depth=0 >/dev/null 2>&1; then
    echo "⚠️  node_modules corrupted, reinstalling..."
    npm ci --include=dev
  else
    echo "✅ node_modules OK, skipping npm install"
  fi
fi

echo "🔨 Building application..."
rm -f .next/lock

if pm2 list | grep -q "threadclip.*online"; then
  echo "⏸  Stopping PM2 before build..."
  pm2 stop threadclip --silent
fi

npm run build

echo "♻️  Restarting PM2..."
pm2 restart threadclip --update-env

echo "✅ Deployment complete!"
pm2 logs threadclip --lines 10 --nostream
