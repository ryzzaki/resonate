"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_config_1 = require("./main.config");
exports.typeOrmConfig = {
    type: 'postgres',
    host: main_config_1.default.typeOrmSettings.host,
    port: main_config_1.default.typeOrmSettings.port,
    username: main_config_1.default.typeOrmSettings.username,
    password: main_config_1.default.typeOrmSettings.password,
    database: main_config_1.default.typeOrmSettings.name,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: main_config_1.default.typeOrmSettings.synchronize,
    logging: false,
    ssl: main_config_1.default.serverSettings.serverMode === 'development'
        ? false
        : {
            ca: Buffer.from(main_config_1.default.typeOrmSettings.ca, 'base64'),
        },
};
//# sourceMappingURL=typeorm.config.js.map