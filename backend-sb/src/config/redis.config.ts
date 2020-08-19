import { RedisModuleOptions } from 'nestjs-redis';
import mainConfig from './main.config';

export const redisModuleConfig: RedisModuleOptions = {
  url: mainConfig.redisModuleSettings.url,
};
