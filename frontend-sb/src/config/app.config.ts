import * as dotenv from 'dotenv';
import { IGlobalConfig } from './app-config.interface';

dotenv.config();

const AppConfig: IGlobalConfig = {
  serverSettings: {
    serverMode: String(process.env.NODE_ENV),
    port: Number(process.env.PORT),
  },
};

export default AppConfig;
