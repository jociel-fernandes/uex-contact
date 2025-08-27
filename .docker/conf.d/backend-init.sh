#!/bin/sh


chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel
cd /var/www/html

apply_var_env() {
  local key="$1"
  local value="$2"

  if grep -qE "^[# ]*${key}=" .env; then
    sed -i "s|^[# ]*${key}=.*|${key}=${value}|" .env
  else
    echo "${key}=${value}" >> .env
  fi
}

set_env(){

    apply_var_env "APP_NAME" "${APP_NAME:-StartProject}"
    apply_var_env "APP_ENV" "${APP_ENV:-development}"
#    apply_var_env "APP_KEY" "${APP_KEY}"
    apply_var_env "APP_PREVIOUS_KEY" "${APP_PREVIOUS_KEY}"
    apply_var_env "APP_DEBUG" "${APP_DEBUG:-true}"
    apply_var_env "APP_URL" "${APP_URL:-http://localhost:80}"
    apply_var_env "FRONTEND_URL" "${FRONTEND_URL:-http://localhost:4200}"

    apply_var_env "DB_CONNECTION" "${DB_CONNECTION:-mysql}"
    apply_var_env "DB_HOST" "${DB_HOST:-localhost}"
    apply_var_env "DB_PORT" "${DB_PORT:-3306}"
    apply_var_env "DB_DATABASE" "${DB_DATABASE:-development}"
    apply_var_env "DB_USERNAME" "${DB_USERNAME:-developer}"
    apply_var_env "DB_PASSWORD" "${DB_PASSWORD:-developer}"

    apply_var_env "REDIS_HOST" "${REDIS_HOST:-redis}"
    apply_var_env "REDIS_PORT" "${REDIS_PORT:-6379}"

    apply_var_env "SESSION_DRIVER" "${SESSION_DRIVER:-database}"
    apply_var_env "SESSION_LIFETIME" "${SESSION_LIFETIME:-120}"
    apply_var_env "SESSION_ENCRYPT" "${SESSION_ENCRYPT:-false}"
    apply_var_env "SESSION_PATH" "${SESSION_PATH:-/}"
    apply_var_env "SESSION_DOMAIN" "${SESSION_DOMAIN:-localhost}"
    apply_var_env "SESSION_SAME_SITE" "${SESSION_SAME_SITE:-Lax}"
    apply_var_env "SESSION_SECURE_COOKIE" "${SESSION_SECURE_COOKIE:-false}"

    apply_var_env "APP_LOCALE" "${LOCALE:-pt_BR}"
    apply_var_env "APP_FALLBACK_LOCALE" "${LOCALE:-pt_BR}"
    apply_var_env "APP_FAKER_LOCALE" "${LOCALE:-pt_BR}"
    apply_var_env "APP_TIMEZONE" "${LOCALE:-America/Sao_Paulo}"

    apply_var_env "MAIL_MAILER" "${MAIL_MAILER:-log}"
    apply_var_env "MAIL_HOST" "${MAIL_HOST:-null}"
    apply_var_env "MAIL_PORT" "${MAIL_PORT:-127.0.0.1}"
    apply_var_env "MAIL_USERNAME" "${MAIL_USERNAME:-2525}"
    apply_var_env "MAIL_PASSWORD" "${MAIL_PASSWORD:-null}"
    apply_var_env "MAIL_ENCRYPTION" "${MAIL_ENCRYPTION:-null}"
    apply_var_env "MAIL_FROM_ADDRESS" "${MAIL_FROM_ADDRESS:-null}"
    apply_var_env "MAIL_FROM_NAME" "${MAIL_FROM_NAME:-null}"

    apply_var_env "SANCTUM_STATEFUL_DOMAINS" "${SANCTUM_STATEFUL_DOMAINS:-localhost:4200}"

}

if [ ! -f ".env" ]; then
  cp .env.example .env

  set_env

  if [ ! -d "vendor" ]; then
      composer install --no-interaction --prefer-dist --optimize-autoloader --quiet
  fi

  php artisan key:generate --force --no-interaction

  until php artisan migrate --no-interaction; do
      echo "Waiting for database..."
      sleep 3
  done

  php artisan db:seed --no-interaction

fi

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf