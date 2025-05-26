FROM php:8.4-cli
SHELL ["/bin/bash", "-c"]
ADD --chmod=+x https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN apt-get update && apt-get full-upgrade -y\
    && apt-get install nodejs git 7zip -y\
    && apt-get clean
# install php extensions
RUN install-php-extensions pdo_pgsql xdebug intl pcntl
ARG WORKING_DIR=/app
ENV PHPRC=${WORKING_DIR}/dev-php.ini
WORKDIR ${WORKING_DIR}
COPY . .
VOLUME [ "${WORKING_DIR}" ]
# CMD php -S 0.0.0.0:80 -t ./public