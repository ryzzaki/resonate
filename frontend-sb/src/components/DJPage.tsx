import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { UrlEnums } from '../enums/urls.enum';
import { RouteComponentProps } from '@reach/router';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { refreshUser, signOutUser, playSong, pauseSong } from '../utils/api';
import { Search } from './Search';
import { Webplayer } from './Webplayer';
import playerStatus from '../types/playerStatus';

const connectSocket = (token: string): SocketIOClient.Socket => {
  return io(UrlEnums.BASE_URL.toString(), {
    transportOptions: {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const [playerStatus, setPlayerStatus] = useState<playerStatus>({
    play: false,
    uris: [],
  });

  const socket = useRef<any>(null);

  console.log(playerStatus);

  useEffect(() => {
    socket.current = connectSocket(token);
    socket.current.on('connect_error', (err) => {
      console.error(err);
    });
    socket.current.on('receiveSelectedURI', (uris: string[]) => {
      setPlayerStatus((state) => ({ ...state, uris, play: true }));
    });
  }, []);

  // const emitSearchedURIs = (uris: string[]) => {
  //   if (socket) {
  //     socket.emit('rebroadcastSelectedURI', uris);
  //   }
  // };

  // const setIsPlaying = (playState: boolean) => {
  //   setPlayer((state) => ({ ...state, isPlaying: playState }));
  // };

  const handlePlay = (deviceId: string) =>
    playSong(user.accessToken, deviceId, {
      uris: playerStatus.uris,
    });

  const handlePause = () => {
    pauseSong(user.accessToken);
    setPlayerStatus((state) => ({ ...state, play: false }));
  };

  const handleAuthError = async () => {
    try {
      const { data } = await refreshUser(token);
      setToken(data.accessToken);
      setUser({ ...user, accessToken: data.spotifyAccessToken });
    } catch (err) {
      console.log(err);
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_key');
    setUser({});
    setToken('');
    return signOutUser();
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-30rem bg-skinpink flex flex-col px-20 py-40 fixed h-full">
        <h1 className="font-bold tracking-tighter text-40 text-darkblue">
          SonicBoom
        </h1>
        <ul className="mt-auto flex text-darkblue font-medium">
          <li className="mr-20">
            <a className="cursor-pointer">Settings</a>
          </li>
          <li className="mr-2 0">
            <a className="cursor-pointer" onClick={handleSignOut}>
              Sign Out
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
        <div className="p-20 pr-40 flex-1">
          {/* <Search
            token={token}
            emitSearchedURIs={emitSearchedURIs}
            setIsPlaying={setIsPlaying}
          /> */}
        </div>
        <div className="mt-auto sticky bottom-0">
          {socket.current && playerStatus.uris.length && (
            <Webplayer
              token={user.accessToken}
              playerStatus={playerStatus}
              handleAuthError={handleAuthError}
              handlePlay={handlePlay}
              handlePause={handlePause}
            />
          )}
        </div>
      </main>
    </div>
  );
};
