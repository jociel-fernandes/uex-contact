#!/bin/sh
set -e

cd /app

if [ -f "package.json" ]; then

    npm install --legacy-peer-deps --loglevel=error
    # npm install --legacy-peer-deps --quiet

    if [ ! -d "src/environments" ]; then
        mkdir -p src/environments
    fi
    if [ ! -f "src/environments/environment.ts" ]; then
        cat > src/environments/environment.ts <<EOL
export const environment = {
    production: false,
    appName: "${APP_NAME:-AppAplication}",
    base_backend: "${APP_URL:-http://localhost:80}",
    gcp_api_maps: "${GCP_MAPS_API_KEY:-null}"
};
EOL
    fi

    ng serve --host 0.0.0.0 --port 4200

fi