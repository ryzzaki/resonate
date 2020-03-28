import mainConfig from './main.config';

export const cookieConfig = {
  maxAge: mainConfig.serverSettings.refreshTokenAge * 1000,
  secure: false,
  signed: true,
  httpOnly: true,
  overwrite: true,
  domain: mainConfig.serverSettings.serverMode === 'development' ? '' : '.sonicboom.life',
};
