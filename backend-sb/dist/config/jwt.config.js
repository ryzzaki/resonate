"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("@nestjs/jwt");
const main_config_1 = require("./main.config");
const auth_enum_1 = require("../auth/enums/auth.enum");
exports.dynamicJwtConfig = {
    secretOrKeyProvider: (requestType, tokenOrPayload) => {
        switch (requestType) {
            case jwt_1.JwtSecretRequestType.SIGN:
                const signSecret = tokenOrPayload.type === auth_enum_1.AuthTypeEnums.REFRESH
                    ? Buffer.from(main_config_1.default.jwtSettings.refreshPrivateKey, 'base64')
                    : Buffer.from(main_config_1.default.jwtSettings.accessPrivateKey, 'base64');
                return signSecret;
            case jwt_1.JwtSecretRequestType.VERIFY:
                const verifySecret = Buffer.from(main_config_1.default.jwtSettings.refreshPublicKey, 'base64');
                return verifySecret;
            default:
                return 'hard!to-guess_secret';
        }
    },
    signOptions: {
        algorithm: main_config_1.default.jwtSettings.algorithm,
        notBefore: '500ms',
    },
    verifyOptions: {
        algorithms: [main_config_1.default.jwtSettings.algorithm],
    },
};
//# sourceMappingURL=jwt.config.js.map