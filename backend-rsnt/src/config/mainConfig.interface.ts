export interface MainConfigInterface {
  serverSettings: {
    serverMode: string;
    port: number;
    frontendPort: number;
    cookieSecret: string;
    refreshTokenAge: number;
    baseUrl: string;
  };
  typeOrmSettings: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    synchronize: boolean;
    ca: string;
  };
  redisModuleSettings: {
    url: string;
  };
  jwtSettings: {
    accessPublicKey: string;
    accessPrivateKey: string;
    refreshPublicKey: string;
    refreshPrivateKey: string;
    algorithm: Algorithm;
  };
  spotifySettings: {
    clientId: string;
    clientSecret: string;
  };
  geniusSettings: {
    apiToken: string;
  };
}

export type Algorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';
