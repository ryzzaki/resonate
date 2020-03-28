import mainConfig from '../../config/main.config';
import { InternalServerErrorException } from '@nestjs/common';

export enum UrlEnums {
  AUTH_API_URL = getServerModeBasedApiUrl(mainConfig.serverSettings.serverMode),
  REDIRECT_URL = getServerModeBasedRedirectUrl(mainConfig.serverSettings.serverMode),
}

function getServerModeBasedApiUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return 'http://localhost:3000/v1';
    case 'staging':
      return 'https://staging.sonicboom.life/v1';
    case 'production':
      return 'https://sonicboom.life/v1';
    default:
      throw new InternalServerErrorException(`Server mode ${serverMode} for AUTH_API_URL is not supported`);
  }
}

function getServerModeBasedRedirectUrl(serverMode: string): any {
  switch (serverMode) {
    case 'development':
      return 'http://localhost:8000';
    case 'staging':
      return 'https://staging.sonicboom.life';
    case 'production':
      return 'https://sonicboom.life';
    default:
      throw new InternalServerErrorException(`Server mode ${serverMode} for REDIRECT_URL is not supported`);
  }
}
