import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { ICallbackState } from 'react-spotify-web-playback/lib/types/common';

type Props = {
  token: string;
  isPlaying: boolean;
  uris: string[];
  handleCallback: (res: ICallbackState) => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const { token, isPlaying, uris, handleCallback } = props;

  return (
    <SpotifyPlayer
      autoPlay
      showSaveIcon
      token={token}
      play={isPlaying}
      uris={uris}
      callback={handleCallback}
      styles={{
        height: '70px',
        sliderColor: '#f453a9',
        sliderTrackColor: '#f8ccd2',
        sliderHandleColor: '#f453a9',
        color: '#f8ccd2',
        errorColor: '#f8ccd2',
        bgColor: '#203264',
        loaderSize: 50,
        trackNameColor: '#f453a9',
        trackArtistColor: '#f8ccd2',
      }}
    />
  );
};
