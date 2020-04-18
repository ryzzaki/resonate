import mainConfig from './main.config';

export const corsConfig = {
  credentials: true,
  origin: mainConfig.serverSettings.serverMode === 'development' ? ['http://localhost:3000'] : ['https://sonicboom.life'],
};
