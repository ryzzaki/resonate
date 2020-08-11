import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import mainConfig from './main.config';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: mainConfig.typeOrmSettings.host,
  port: mainConfig.typeOrmSettings.port,
  username: mainConfig.typeOrmSettings.username,
  password: mainConfig.typeOrmSettings.password,
  database: mainConfig.typeOrmSettings.name,
  autoLoadEntities: true,
  entities: [join(__dirname, '..', '/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, '..', '..', 'migrations', '*.{js,ts}')],
  migrationsTransactionMode: 'all',
  synchronize: mainConfig.serverSettings.serverMode === 'test',
  dropSchema: mainConfig.serverSettings.serverMode === 'test',
  logging: false,
  cli: {
    migrationsDir: 'migrations',
  },
  ssl: mainConfig.serverSettings.serverMode === 'production' && {
    rejectUnauthorized: false,
  },
};
