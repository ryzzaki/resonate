import React, { useContext } from 'react';
import { RouteComponentProps } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { ICallbackState } from 'react-spotify-web-playback/lib/types/common';
import { Search } from './Search';
import { refreshUser } from '../utils/api';

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const {} = props;

  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const handleCallback = async (res: ICallbackState) => {
    console.log(res);
    if (res.errorType === 'authentication_error') {
      try {
        const { data } = await refreshUser(token);
        setToken(data.accessToken);
        setUser({ ...user, accessToken: data.spotifyAccessToken });
      } catch (err) {
        console.log(err);
        handleSignOut();
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_key');
    setUser({});
    setToken('');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-30rem bg-skinpink flex flex-col px-20 py-40 fixed h-full">
        <h1 className="font-bold tracking-tighter text-40 text-pink">
          SonicBoom
        </h1>
        <ul className="mt-auto flex text-darkblue font-medium">
          <li className="mr-20">
            <a className="cursor-pointer">Settings</a>
          </li>
          <li className="mr-2 0">
            <a className="cursor-pointer" onClick={handleSignOut}>
              Logout
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
        <div className="p-20 pr-40 flex-1">
          <Search token={token} />
        </div>
        <div className="mt-auto sticky bottom-0">
          <SpotifyPlayer
            token={user.accessToken}
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
            }}
          />
        </div>
      </main>
    </div>
  );
};
