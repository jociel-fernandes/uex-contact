#!/usr/bin/env bash

set -e

LARAVEL_VERSION="12.0"
BACK_DIR="./back-end"
FRONT_DIR="./front-end"

if [ ! -d "$BACK_DIR" ]; then
    mkdir -p "$BACK_DIR" && \
    docker compose run --rm backend sh -c "\
        composer create-project laravel/laravel:^12.0 /var/www/html --prefer-dist --no-install --remove-vcs --dev --no-scripts \
    "
fi

if [ ! -d "$FRONT_DIR" ]; then
    mkdir -p "$FRONT_DIR" && \
    docker compose run --rm app sh -c "\
        ng new application \
        --directory=/app \
        --routing \
        --style=scss \
        --skip-git \
        --skip-install \
        --strict 
    "
fi

echo ">>>>> Projeto criado com sucesso!"
