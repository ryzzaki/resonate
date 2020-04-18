import appConfig from '../config/app.config';

export enum UrlEnums {
  API_URL = getServerModeApiUrl(appConfig.serverSettings.serverMode),
  BASE_URL = getServerModeRedirectUrl(appConfig.serverSettings.serverMode),
}

function getServerModeApiUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return `http://localhost:4000/v1`;
    case 'staging':
      return 'https://staging.sonicboom.life/v1';
    case 'production':
      return 'https://sonicboom.life/v1';
  }
}

function getServerModeRedirectUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return 'http://localhost:3000';
    case 'staging':
      return 'https://staging.sonicboom.life';
    case 'production':
      return 'https://sonicboom.life';
  }
}
