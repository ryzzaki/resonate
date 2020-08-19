import { User } from '../../auth/entities/user.entity';
import { RoomAccess } from './roomAccess.enum';

export interface Session {
  id: string;
  name: string;
  roomAccess: RoomAccess;
  description: string | undefined;
  currentDJ: Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'> | undefined;
  currentURI: string[] | undefined;
  connectedUsers: Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'>[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    isPlaying: boolean;
    songStartedAt: number | undefined;
    songPausedAt: number | undefined;
  };
}
