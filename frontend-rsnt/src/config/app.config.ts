import * as dotenv from 'dotenv';
import { IGlobalConfig } from './app-config.interface';

dotenv.config();

const AppConfig: IGlobalConfig = {
  serverSettings: {
    serverMode: String(process.env.NODE_ENV),
    backendPort: String(process.env.REACT_APP_BE_PORT),
    baseUrl: String(process.env.REACT_APP_BASE_URL),
  },
};

export default AppConfig;
