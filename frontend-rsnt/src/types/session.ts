import sessionUser from './sessionUser';
import { RoomAccess } from '../enums/RoomAccess';

type session = {
  id: string;
  name: string;
  roomAccess: RoomAccess;
  description: string | undefined;
  currentDJ: sessionUser | undefined;
  uris: UriMetadata[];
  connectedUsers: sessionUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    songStartedAt: number;
  };
};

export interface UriMetadata {
  uri: string;
  title: string;
  artists: any;
  cover: string;
}

export default session;
