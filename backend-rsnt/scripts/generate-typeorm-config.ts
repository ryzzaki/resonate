import * as fs from 'fs';
import { typeOrmConfig } from '../src/config/typeorm.config';

fs.writeFileSync('ormconfig.json', JSON.stringify(typeOrmConfig, null, 1));
