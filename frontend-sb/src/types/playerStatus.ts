type playerStatus = {
  currentTrack: any;
  isInitializing: boolean;
  paused: boolean;
  unsync: boolean;
  deviceId: string;
  errorType: string;
  duration: number;
  progressMs: number;
};

export default playerStatus;
