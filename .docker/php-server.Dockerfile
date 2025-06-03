FROM php:8.4-apache
SHELL ["/bin/bash", "-c"]
ADD --chmod=+x https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN apt-get update\
    && apt-get install nodejs 7zip -y\
    && apt-get clean
# install php extensions
RUN install-php-extensions pdo_pgsql xdebug pcntl
ENV DOCUMENT_ROOT=/app/public PHPRC=/app/php.ini
WORKDIR /app
RUN a2enmod rewrite headers
COPY /.docker/server.conf /etc/apache2/sites-available/000-default.conf
COPY --chown=www-data:www-data --chmod=775 . .
RUN chmod -R 775 ./storage
RUN composer install
COPY --chmod=+x ./.docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]
CMD ["apache2-foreground"]