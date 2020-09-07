import sessionUser from './sessionUser';
import { RoomAccess } from '../enums/RoomAccess';

type session = {
  id: string;
  name: string;
  roomAccess: RoomAccess;
  description: string | undefined;
  currentDJ: sessionUser | undefined;
  uris: string[];
  connectedUsers: sessionUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    uri: string;
    songStartedAt: number;
  };
  metadata: { [key: string]: UriMetadata };
};

export interface UriMetadata {
  title: string;
  artists: any[];
  cover: string;
}

export default session;
