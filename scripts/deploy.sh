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
  
  NEEDS_INSTALL=false
  
  if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules missing"
    NEEDS_INSTALL=true
  elif [ ! -f "node_modules/.package-lock.json" ]; then
    echo "⚠️  node_modules/.package-lock.json missing"
    NEEDS_INSTALL=true
  elif ! node -e "require('@ducanh2912/next-pwa')" 2>/dev/null; then
    echo "⚠️  Critical dependency missing: @ducanh2912/next-pwa"
    NEEDS_INSTALL=true
  elif ! node -e "require('next')" 2>/dev/null; then
    echo "⚠️  Critical dependency missing: next"
    NEEDS_INSTALL=true
  elif ! node -e "require('next-auth')" 2>/dev/null; then
    echo "⚠️  Critical dependency missing: next-auth"
    NEEDS_INSTALL=true
  fi
  
  if [ "$NEEDS_INSTALL" = true ]; then
    echo "🔄 Reinstalling dependencies..."
    rm -rf node_modules 2>/dev/null || find node_modules -delete 2>/dev/null || true
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
