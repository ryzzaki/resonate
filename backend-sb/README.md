### SETUP

Installing dependencies

```bash
yarn install
```

## Configuration

# Connecting a PostgreSQL DB

Configure the DB in the src/config/typeorm.config.ts file for your own development server.

# Configuration for .env

```bash
# Server setup
PORT=3000
COOKIES_SECRET='So long and thanks for all the fish.'
# Refresh Max Age is in seconds
REFRESH_TOKEN_AGE=30000

# Postgres Database setup
DB_HOST="localhost"
DB_PORT=5432
DB_NAME="sonic_boom"
DB_USERNAME="postgres"
DB_PASSWORD="admin"
DB_SYNCHRONIZE=true

# Redis Database setup
RDS_HOST=127.0.0.1
RDS_PORT=6379
RDS_DB=0
RDS_PASSWORD=

# Facebook passport strategy configuration
FACEBOOK_ID=
FACEBOOK_SECRET=
FACEBOOK_CALLBACK=http://localhost:3000/api/v1/auth/facebook/callback

# Facebook passport strategy configuration
GOOGLE_ID=
GOOGLE_SECRET=
GOOGLE_CALLBACK=http://localhost:3000/api/v1/auth/google/callback

# JWT Secrets
ACCESS_JWT_PUBLIC=
ACCESS_JWT_PRIVATE=
REFRESH_JWT_PUBLIC=
REFRESH_JWT_PRIVATE=
JWT_HASHING_ALGORITHM=

# Spotify Settings
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
```

## Running the app

```bash
# development
yarn start:dev

# build
yarn prestart:prod

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```
