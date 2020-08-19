type playerStatus = {
  currentTrack: any;
  isInitializing: boolean;
  paused: boolean;
  unsync: boolean;
  errorType: string;
  deviceId: string;
  position: number;
  progressMs: number;
};

export default playerStatus;
