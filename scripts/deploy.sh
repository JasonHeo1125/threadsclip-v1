#!/bin/bash
set -e

echo "🚀 Starting deployment..."

cd /home/opc/threadsclip

echo "📥 Pulling latest code..."
git pull origin main

if git diff HEAD@{1} HEAD --name-only | grep -q "package-lock.json"; then
  echo "📦 package-lock.json changed, running npm ci..."
  npm ci --include=dev
else
  echo "✅ No package changes, skipping npm install"
fi

echo "🔨 Building application..."
rm -f .next/lock
npm run build

echo "♻️  Restarting PM2..."
pm2 restart threadclip --update-env

echo "✅ Deployment complete!"
pm2 logs threadclip --lines 10 --nostream
