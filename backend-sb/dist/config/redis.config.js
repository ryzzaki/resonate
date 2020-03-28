"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_config_1 = require("./main.config");
exports.redisModuleConfig = {
    host: main_config_1.default.redisModuleSettings.host,
    port: main_config_1.default.redisModuleSettings.port,
    db: main_config_1.default.redisModuleSettings.db,
    password: main_config_1.default.redisModuleSettings.password,
};
//# sourceMappingURL=redis.config.js.map