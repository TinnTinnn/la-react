FROM php:8.2-fpm


RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git libmariadb-dev && docker-php-ext-configure mysqli && docker-php-ext-install pdo pdo_mysql mysqli



RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www


COPY . .


RUN composer install --no-dev --optimize-autoloader


RUN php artisan key:generate


RUN php artisan migrate --force

EXPOSE 9000

CMD ["php-fpm"]
