import { RedisModuleOptions } from 'nestjs-redis';
import mainConfig from './main.config';

export const redisModuleConfig: RedisModuleOptions = {
  host: mainConfig.redisModuleSettings.host,
  port: mainConfig.redisModuleSettings.port,
  db: mainConfig.redisModuleSettings.db,
  password: mainConfig.redisModuleSettings.password,
};
