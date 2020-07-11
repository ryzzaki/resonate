import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { ICallbackState } from 'react-spotify-web-playback/lib/types/common';

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const {} = props;

  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const handleCallback = (res: ICallbackState) => {
    if (res.errorType === 'authentication_error') {
      console.log(res);
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_key');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="relative p-30">
        <h1 className="self-center gradient-text text-30 text-center">
          SonicBoom
        </h1>
        <a
          className="absolute right-0 top-0 p-30 text-blue cursor-pointer"
          onClick={handleSignOut}
        >
          Logout
        </a>
      </nav>
      <div className="mt-auto">
        <SpotifyPlayer
          token={user.accessToken}
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
