#!/bin/bash

# รอให้ Postgres พร้อม
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  echo "Waiting for Postgres to be ready..."
  sleep 1
done

# รันคำสั่ง Laravel
php artisan config:cache
php artisan route:cache
php artisan migrate --force

# เริ่ม PHP-FPM และ Nginx
php-fpm -D
nginx -g "daemon off;"
