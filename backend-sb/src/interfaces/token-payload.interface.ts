import { AuthTypeEnums } from '../auth/enums/auth.enum';

export interface TokenPayloadInterface {
  id: string;
  ver: number;
  type: AuthTypeEnums;
  iat?: number;
  nbf?: number;
  exp?: number;
  jti?: string;
}
