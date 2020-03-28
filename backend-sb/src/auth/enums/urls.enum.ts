import mainConfig from '../../config/main.config';
import { InternalServerErrorException } from '@nestjs/common';

export enum UrlEnums {
  AUTH_API_URL = getServerModeApiUrl(mainConfig.serverSettings.serverMode),
  REDIRECT_URL = getServerModeRedirectUrl(mainConfig.serverSettings.serverMode),
}

export enum SpotifyUrlEnums {
  SPOTIFY_ACCOUNTS = 'https://accounts.spotify.com',
  SPOTIFY_API = 'https://api.spotify.com/v1',
}

function getServerModeApiUrl(serverMode: string): any {
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

function getServerModeRedirectUrl(serverMode: string): any {
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
