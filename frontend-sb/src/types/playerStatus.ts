type playerStatus = {
  currentURI: string[];
  currentDJ: any;
  connectedUsers: any;
  startsAt: number;
  endsAt: number;
  webplayer: {
    isPlaying: boolean;
    positionMs: number;
  };
};

export default playerStatus;
