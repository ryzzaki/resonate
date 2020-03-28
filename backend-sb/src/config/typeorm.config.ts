import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import mainConfig from './main.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: mainConfig.typeOrmSettings.host,
  port: mainConfig.typeOrmSettings.port,
  username: mainConfig.typeOrmSettings.username,
  password: mainConfig.typeOrmSettings.password,
  database: mainConfig.typeOrmSettings.name,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: mainConfig.typeOrmSettings.synchronize,
  logging: false,
  ssl:
    mainConfig.serverSettings.serverMode === 'development'
      ? false
      : {
          ca: Buffer.from(mainConfig.typeOrmSettings.ca, 'base64'),
        },
};
