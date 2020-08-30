type playerStatus = {
  currentTrack: any;
  isInitializing: boolean;
  paused: boolean;
  unsync: boolean;
  contextUri: string | null;
  deviceId: string | null;
  errorType: string | null;
  duration: number;
  progressMs: number;
  volume: number;
};

export default playerStatus;
