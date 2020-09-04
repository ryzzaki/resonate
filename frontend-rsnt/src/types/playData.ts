type playData = {
  uris: string[];
  position_ms: number | undefined;
  offset?: {
    uri: string | undefined;
  };
};

export default playData;
