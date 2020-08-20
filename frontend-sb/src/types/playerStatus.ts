type playerStatus = {
  currentTrack: any;
  isInitializing: boolean;
  paused: boolean;
  unsync: boolean;
  errorType: string;
  deviceId: string;
  progressMs: number;
};

export default playerStatus;
