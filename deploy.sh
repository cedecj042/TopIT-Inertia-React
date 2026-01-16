#!/usr/bin/env bash
set -e

echo "📥 Pulling latest code..."
git pull origin main

echo "🐳 Ensuring containers are up..."
./vendor/bin/sail up -d

echo "📦 Installing PHP dependencies (no scripts)..."
./vendor/bin/sail exec laravel.test composer install \
  --no-interaction \
  --prefer-dist \
  --optimize-autoloader \
  --no-scripts

echo "📦 Running composer post-install scripts..."
./vendor/bin/sail exec laravel.test composer run-script post-autoload-dump

echo "📂 Linking storage..."
./vendor/bin/sail exec laravel.test php artisan storage:link || true

echo "📦 Installing Node dependencies..."
./vendor/bin/sail exec laravel.test npm install

echo "🎨 Building frontend assets..."
./vendor/bin/sail exec laravel.test npm run build

echo "🗄️ Running database migrations (SAFE)..."
./vendor/bin/sail exec laravel.test php artisan migrate --force

echo "🧹 Clearing caches..."
./vendor/bin/sail exec laravel.test php artisan optimize:clear

echo "🔁 Restarting queue workers..."
./vendor/bin/sail exec laravel.test php artisan queue:restart

echo " Seeding Database..."
#./vendor/bin/sail exec laravel.test php artisan db:seed

echo "✅ Deployment completed successfully!"
