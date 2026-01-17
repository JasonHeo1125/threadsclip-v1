#!/bin/bash

set -e

echo "🚀 ThreadClip 배포 시작..."

APP_DIR="/home/opc/threadsclip"
REPO_URL="https://github.com/JasonHeo1125/threadsclip-v1.git"

cd /home/opc

if [ -d "$APP_DIR" ]; then
    echo "📦 기존 코드 업데이트..."
    cd $APP_DIR
    git pull origin main
else
    echo "📦 코드 클론..."
    git clone $REPO_URL threadsclip
    cd $APP_DIR
fi

echo "📦 의존성 설치..."
npm ci --production=false

echo "🔨 빌드 중..."
npm run build

echo "📁 standalone 폴더에 static/public 복사..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "🔄 PM2 재시작..."
mkdir -p /home/opc/logs

if pm2 list | grep -q "threadclip"; then
    pm2 restart threadclip
else
    pm2 start ecosystem.config.js
fi

pm2 save

echo "✅ 배포 완료!"
echo "🌐 http://$(curl -s ifconfig.me):3000"
