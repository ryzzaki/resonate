import { JwtModuleOptions, JwtSecretRequestType } from '@nestjs/jwt';
import mainConfig from './main.config';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';
import { AuthTypeEnums } from '../auth/enums/auth.enum';

export const dynamicJwtConfig: JwtModuleOptions = {
  secretOrKeyProvider: (requestType: JwtSecretRequestType, tokenOrPayload: TokenPayloadInterface) => {
    switch (requestType) {
      case JwtSecretRequestType.SIGN:
        // retrieve signing key dynamically
        const signSecret =
          tokenOrPayload.type === AuthTypeEnums.REFRESH
            ? Buffer.from(mainConfig.jwtSettings.refreshPrivateKey, 'base64')
            : Buffer.from(mainConfig.jwtSettings.accessPrivateKey, 'base64');
        return signSecret;
      case JwtSecretRequestType.VERIFY:
        // retrieve public key for verification dynamically
        const verifySecret = Buffer.from(mainConfig.jwtSettings.refreshPublicKey, 'base64');
        return verifySecret;
      default:
        return 'hard!to-guess_secret';
    }
  },
  signOptions: {
    algorithm: mainConfig.jwtSettings.algorithm,
    notBefore: '500ms',
  },
  verifyOptions: {
    algorithms: [mainConfig.jwtSettings.algorithm],
  },
};
