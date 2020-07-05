import React, { useContext } from 'react';
import { RouteComponentProps, Redirect } from '@reach/router';
import { AuthContext } from '../context/AuthContext';
import SpotifyPlayer from 'react-spotify-web-playback';
import { ICallbackState } from 'react-spotify-web-playback/lib/types/common';
import decode from 'jwt-decode';

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const {} = props;

  const { token, setToken } = useContext(AuthContext);

  if (!token) return <Redirect noThrow to="/" />;

  const { accessToken } = decode(token);

  const handleCallback = (res: ICallbackState) => {
    if (res.errorType === 'authentication_error') {
      setToken('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="self-center gradient-text text-30 text-center pt-20">
        SonicBoom
      </h1>
      <div className="mt-auto">
        <SpotifyPlayer
          token={accessToken}
          callback={handleCallback}
          styles={{
            height: '70px',
            sliderColor: '#1cb954',
            sliderTrackColor: '#151b25',
            color: '#7e868c',
            bgColor: '#1d2638',
          }}
        />
      </div>
    </div>
  );
};
