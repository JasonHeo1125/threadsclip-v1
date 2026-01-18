#!/bin/bash
set -e

echo "🚀 Docker 배포 시작..."

cd /home/opc/threadsclip

echo "📥 최신 코드 받기..."
git pull origin main

echo "🐳 Docker 이미지 빌드..."
docker build -t ghcr.io/jasonheo1125/threadsclip-v1:latest .

echo "♻️  컨테이너 재시작..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

echo "✅ 배포 완료!"
docker logs threadsclip --tail 10
