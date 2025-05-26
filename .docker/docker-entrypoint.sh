#!/bin/bash
set -e

./artisan migrate:fresh --seed
./artisan cache:clear
./artisan config:cache
./artisan route:cache

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- apache2-foreground "$@"
fi

exec "$@"