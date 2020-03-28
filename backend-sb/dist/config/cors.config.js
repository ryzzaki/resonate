"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_config_1 = require("./main.config");
exports.corsConfig = {
    credentials: true,
    origin: main_config_1.default.serverSettings.serverMode === 'development' ? ['http://localhost:8080'] : ['https://sonicboom.life'],
};
//# sourceMappingURL=cors.config.js.map