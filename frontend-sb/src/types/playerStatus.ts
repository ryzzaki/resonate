import sessionUser from './sessionUser';

type playerStatus = {
  currentDJ: sessionUser | undefined;
  currentURI: string[] | undefined;
  connectedUsers: sessionUser[];
  startsAt: number;
  endsAt: number;
  webplayer: {
    isPlaying: boolean;
    positionMs: number;
  };
};

export default playerStatus;
