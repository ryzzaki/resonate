import { User } from '../../auth/entities/user.entity';
import { RoomAccess } from './roomAccess.enum';

type BasicUser = Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'>;

export interface Session {
  id: string;
  name: string;
  roomAccess: RoomAccess;
  description: string | undefined;
  currentDJ: BasicUser | null;
  uris: UriMetadata[];
  connectedUsers: BasicUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    songStartedAt: number | undefined;
  };
  chat: Message[];
}

interface Message {
  sentAt: number;
  sender: BasicUser;
  message: string;
}

export interface UriMetadata {
  uri: string;
  title: string;
  artists: any[];
  cover: string;
}
