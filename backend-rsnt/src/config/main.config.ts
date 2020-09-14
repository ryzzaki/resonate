import * as dotenv from 'dotenv';
import { MainConfigInterface, Algorithm } from './mainConfig.interface';

dotenv.config();

const mainConfig: MainConfigInterface = {
  serverSettings: {
    serverMode: String(process.env.NODE_ENV),
    port: Number(process.env.PORT),
    frontendPort: Number(process.env.FE_PORT),
    cookieSecret: String(process.env.COOKIE_SECRET),
    refreshTokenAge: Number(process.env.REFRESH_TOKEN_AGE),
    baseUrl: String(process.env.BASE_URL),
  },
  typeOrmSettings: {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    name: String(process.env.DB_NAME),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    synchronize: Boolean(process.env.DB_SYNCHRONIZE),
    ca: String(process.env.SSL_CA),
  },
  redisModuleSettings: {
    url: String(process.env.REDIS_URL),
  },
  jwtSettings: {
    accessPublicKey: String(process.env.ACCESS_JWT_PUBLIC),
    accessPrivateKey: String(process.env.ACCESS_JWT_PRIVATE),
    refreshPublicKey: String(process.env.REFRESH_JWT_PUBLIC),
    refreshPrivateKey: String(process.env.REFRESH_JWT_PRIVATE),
    algorithm: process.env.JWT_HASHING_ALGORITHM as Algorithm,
  },
  spotifySettings: {
    clientId: String(process.env.SPOTIFY_CLIENT_ID),
    clientSecret: String(process.env.SPOTIFY_CLIENT_SECRET),
  },
  geniusSettings: {
    apiToken: String(process.env.GENIUS_API_TOKEN),
  },
};

export default mainConfig;
