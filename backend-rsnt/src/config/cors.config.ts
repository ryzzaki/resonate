import mainConfig from './main.config';

export const corsConfig = {
  credentials: true,
  origin:
    mainConfig.serverSettings.serverMode === 'development'
      ? [`http://localhost:${mainConfig.serverSettings.frontendPort}`]
      : [`https://${mainConfig.serverSettings.baseUrl}`],
};
