# use PHP 8.2
FROM php:8.2-fpm

# Install common php extension dependencies
RUN apt-get update && apt-get install -y \
    libfreetype-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    zlib1g-dev \
    libzip-dev \
    libpq-dev \
    postgresql-client \
    unzip \
    nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd zip pdo_pgsql

# Set the working directory
WORKDIR /var/www/app

# Copy all project file
COPY la-react/ /var/www/app/

RUN chown -R www-data:www-data /var/www/app \
    && chmod -R 775 /var/www/app/storage

# install composer
COPY --from=composer:2.6.5 /usr/bin/composer /usr/local/bin/composer

# install dependencies of laravel
RUN composer install --no-dev --optimize-autoloader

# copy file Nginx config
COPY la-react/nginx.conf /etc/nginx/sites-available/default

# สคริปต์สำหรับเริ่มบริการ
COPY la-react/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# เปิด port 80 สำหรับ Nginx
EXPOSE 80

# รันสคริปต์เริ่มต้น
CMD ["/usr/local/bin/start.sh"]
