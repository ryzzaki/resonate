"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_config_1 = require("./main.config");
exports.cookieConfig = {
    maxAge: main_config_1.default.serverSettings.refreshTokenAge * 1000,
    secure: false,
    signed: true,
    httpOnly: true,
    overwrite: true,
    domain: main_config_1.default.serverSettings.serverMode === 'development' ? '' : '.sonicboom.life',
};
//# sourceMappingURL=cookie.config.js.map