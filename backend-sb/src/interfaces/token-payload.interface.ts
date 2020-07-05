import { AuthTypeEnums } from '../auth/enums/auth.enum';

export interface TokenPayloadInterface {
  id: string;
  type: AuthTypeEnums;
  ver?: number;
  accessToken?: string;
  iat?: number;
  nbf?: number;
  exp?: number;
  jti?: string;
}
