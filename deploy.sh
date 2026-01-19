#!/usr/bin/env bash
set -e

echo "📥 Pulling latest code..."
git pull origin main

echo "🐳 Ensuring containers are up..."
# docker-compose up -d

echo "📦 Installing PHP dependencies (no scripts)..."
docker exec topit_laravel_1 composer install \
  --no-interaction \
  --prefer-dist \
  --optimize-autoloader \
  --no-scripts

echo "📦 Running composer post-install scripts..."
docker exec topit_laravel_1 composer run-script post-autoload-dump

echo "📂 Linking storage..."
docker exec topit_laravel_1 php artisan storage:link || true

echo "📦 Installing Node dependencies..."
docker exec topit_laravel_1 npm install

echo "🎨 Building frontend assets..."
docker exec topit_laravel_1 npm run build

echo "🗄️ Running database migrations (SAFE)..."
docker exec topit_laravel_1 php artisan migrate:fresh --force

echo "🧹 Clearing caches..."
docker exec topit_laravel_1 php artisan optimize:clear

echo " Seeding Database..."
#docker exec topit_laravel_1 php artisan db:seed

echo "✅ Deployment completed successfully!"