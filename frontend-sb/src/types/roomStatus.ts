import sessionUser from './sessionUser';

type roomStatus = {
  name: string;
  description: string | undefined;
  sessionId: string;
  currentDJ: sessionUser | undefined;
  currentURI: string[];
  connectedUsers: sessionUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    songPausedAt: number;
    songStartedAt: number;
  };
};

export default roomStatus;
