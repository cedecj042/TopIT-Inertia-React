#!/usr/bin/env bash
set -e

echo "🚀 Starting deployment..."

# Always run from project root
cd /var/www/topit/topit-web

echo "📥 Pulling latest code..."
git pull origin main

echo "🐳 Ensuring containers are up..."
./vendor/bin/sail up -d

echo "📦 Installing PHP dependencies..."
./vendor/bin/sail exec --user=root laravel.test composer install \
  --no-interaction \
  --prefer-dist \
  --optimize-autoloader

echo "📦 Installing Node dependencies..."
./vendor/bin/sail exec laravel.test npm install

echo "🎨 Building frontend assets..."
./vendor/bin/sail exec laravel.test npm run build

echo "🗄️ Running database migrations..."
./vendor/bin/sail artisan migrate:fresh --seed --force

echo "🧹 Clearing caches..."
./vendor/bin/sail artisan optimize:clear

echo "🔁 Restarting queue workers..."
./vendor/bin/sail artisan queue:restart

echo "✅ Deployment completed successfully!"

