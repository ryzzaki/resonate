import sessionUser from './sessionUser';

type roomStatus = {
  currentDJ: sessionUser | undefined;
  currentURI: string[];
  connectedUsers: sessionUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    isPlaying: boolean;
    songPausedAt: number;
    songStartedAt: number;
  };
};

export default roomStatus;
