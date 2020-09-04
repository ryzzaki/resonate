import appConfig from '../config/app.config';

export enum UrlEnums {
  API_URL = getServerModeApiUrl(appConfig.serverSettings.serverMode),
  BASE_URL = getServerModeRedirectUrl(appConfig.serverSettings.serverMode),
}

function getServerModeApiUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return `http://localhost:${appConfig.serverSettings.backendPort}/v1`;
    case 'production':
      return `${appConfig.serverSettings.baseUrl}/v1`;
  }
}

function getServerModeRedirectUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return `http://localhost:${appConfig.serverSettings.backendPort}`;
    case 'production':
      return `${appConfig.serverSettings.baseUrl}`;
  }
}
