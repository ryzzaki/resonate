import { AuthSourceEnums } from '../auth/enums/auth.enum';

export interface UserDataInterface {
  id: string;
  email: string;
  displayName: string;
  source: AuthSourceEnums;
}
