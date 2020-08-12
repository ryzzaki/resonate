import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import SpotifyPlayer from 'react-spotify-web-playback';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { CallbackState } from 'react-spotify-web-playback/lib/types/common';
import { Search } from './Search';
import { refreshUser, signOutUser } from '../utils/api';
import { UrlEnums } from '../enums/urls.enum';
import io from 'socket.io-client';

type Props = {};

const connectSocket = (token: string): SocketIOClient.Socket => {
  // socket testing
  return io(UrlEnums.BASE_URL.toString(), {
    transportOptions: {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [URIs, setURIs] = useState<string[] | undefined>(undefined);
  const [socket, setSocket] = useState<SocketIOClient.Socket | undefined>(
    undefined
  );

  useEffect(() => {
    setSocket(connectSocket(token));
  }, [token]);

  if (socket) {
    // enumerate the events later
    socket.on('receiveSelectedURI', (data: string[]) => {
      setURIs(data);
    });
  }

  const handleCallback = async (res: CallbackState) => {
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
    return signOutUser();
  };

  const emitSearchedURIs = (uris: string[]) => {
    if (socket) {
      socket.emit('rebroadcastSelectedURI', uris);
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-30rem bg-skinpink flex flex-col px-20 py-40 fixed h-full">
        <h1 className="font-bold tracking-tighter text-40 text-darkblue">
          SonicBoom
        </h1>
        <ul className="mt-auto flex text-darkblue font-medium">
          <li className="mr-20">
            <u className="cursor-pointer">Settings</u>
          </li>
          <li className="mr-2 0">
            <u className="cursor-pointer" onClick={handleSignOut}>
              Sign Out
            </u>
          </li>
        </ul>
      </aside>
      <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
        <div className="p-20 pr-40 flex-1">
          <Search
            token={token}
            emitSearchedURIs={emitSearchedURIs}
            setIsPlaying={setIsPlaying}
          />
        </div>
        <div className="mt-auto sticky bottom-0">
          <SpotifyPlayer
            autoPlay
            showSaveIcon
            token={user.accessToken}
            play={isPlaying}
            uris={URIs}
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
        </div>
      </main>
    </div>
  );
};
