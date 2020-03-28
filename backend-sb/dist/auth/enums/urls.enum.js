"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_config_1 = require("../../config/main.config");
const common_1 = require("@nestjs/common");
var UrlEnums;
(function (UrlEnums) {
    UrlEnums[UrlEnums["AUTH_API_URL"] = getServerModeBasedApiUrl(main_config_1.default.serverSettings.serverMode)] = "AUTH_API_URL";
    UrlEnums[UrlEnums["REDIRECT_URL"] = getServerModeBasedRedirectUrl(main_config_1.default.serverSettings.serverMode)] = "REDIRECT_URL";
})(UrlEnums = exports.UrlEnums || (exports.UrlEnums = {}));
function getServerModeBasedApiUrl(serverMode) {
    switch (serverMode) {
        case 'development':
            return 'http://localhost:3000/v1';
        case 'staging':
            return 'https://staging.sonicboom.life/v1';
        case 'production':
            return 'https://sonicboom.life/v1';
        default:
            throw new common_1.InternalServerErrorException(`Server mode ${serverMode} for AUTH_API_URL is not supported`);
    }
}
function getServerModeBasedRedirectUrl(serverMode) {
    switch (serverMode) {
        case 'development':
            return 'http://localhost:8000';
        case 'staging':
            return 'https://staging.sonicboom.life';
        case 'production':
            return 'https://sonicboom.life';
        default:
            throw new common_1.InternalServerErrorException(`Server mode ${serverMode} for REDIRECT_URL is not supported`);
    }
}
//# sourceMappingURL=urls.enum.js.map