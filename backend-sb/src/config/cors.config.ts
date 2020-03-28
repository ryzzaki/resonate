import mainConfig from './main.config';

export const corsConfig = {
  credentials: true,
  origin: mainConfig.serverSettings.serverMode === 'development' ? ['http://localhost:8080'] : ['https://sonicboom.life'],
};
