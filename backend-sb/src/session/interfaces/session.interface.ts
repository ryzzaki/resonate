import { User } from '../../auth/entities/user.entity';
import { RoomAccess } from './roomAccess.enum';

export interface Session {
  id: string;
  name: string;
  roomAccess: RoomAccess;
  description: string | undefined;
  currentDJ: Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'> | null;
  currentURI: string[] | undefined;
  connectedUsers: Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'>[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    songStartedAt: number | undefined;
  };
}
