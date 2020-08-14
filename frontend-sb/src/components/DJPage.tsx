import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { UrlEnums } from '../enums/urls.enum';
import { RouteComponentProps } from '@reach/router';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { refreshUser, signOutUser } from '../utils/api';
import { Search } from './Search';
import { Webplayer } from './Webplayer';
import playerStatus from '../types/playerStatus';

const connectSocket = (token: string): SocketIOClient.Socket => {
  return io(UrlEnums.BASE_URL.toString(), {
    transports: ['websocket'],
    path: '/v1/webplayer',
    query: {
      token: `Bearer ${token}`,
    },
  });
};

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const [playerStatus, setPlayerStatus] = useState<playerStatus>({
    currentDJ: undefined,
    connectedUsers: [],
    currentURI: undefined,
    startsAt: 0,
    endsAt: 0,
    webplayer: {
      isPlaying: false,
      positionMs: 0,
    },
  });
  const randomUserIcons = ['🎸', '🎹', '🎺', '🎻', '🪕', '🎷', '🥁', '🎤'];

  const socket = useRef<any>(null);

  console.log(playerStatus);

  useEffect(() => {
    socket.current = connectSocket(token);
    socket.current.on('connect_error', (err) => {
      console.error(err);
    });
    socket.current.on('receiveCurrentSession', (session: any) => {
      setPlayerStatus(session);
    });
    socket.current.on('receiveCurrentURI', (currentURI: string[]) => {
      setPlayerStatus((state) => ({ ...state, currentURI }));
    });
    socket.current.on('receiveCurrentWebplayerState', (isPlaying: boolean) => {
      setPlayerStatus((state) => ({
        ...state,
        webplayer: {
          ...state.webplayer,
          isPlaying,
        },
      }));
    });
  }, []);

  const emitSearchedURIs = (uris: string[]) =>
    socket.current.emit('rebroadcastSelectedURI', uris);

  const emitPlayState = (state: boolean) =>
    socket.current.emit('updateWebplayerState', state);

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
        <h2 className="pt-25 p-1 text-darkblue font-bold">
          Connected Listeners ♥️
        </h2>
        <div className="py-5">
          <ul>
            {playerStatus?.connectedUsers.map((result: any) => (
              <li key={result.id} className="group flex mb-5">
                <div className="pt-5">
                  <h5 className="font-semibold text-darkblue w-full whitespace-no-wrap overflow-hidden">
                    {playerStatus?.currentDJ?.id === result.id ? (
                      <span className="text-blue">
                        [DJ] 🎧 {result.displayName}
                      </span>
                    ) : (
                      `${
                        randomUserIcons[
                          Math.floor(Math.random() * randomUserIcons.length)
                        ]
                      } ${result.displayName}`
                    )}
                  </h5>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
          <Search token={token} emitSearchedURIs={emitSearchedURIs} />
        </div>
        <div className="mt-auto sticky bottom-0 bg-darkblue">
          {socket.current && (
            <Webplayer
              playerStatus={playerStatus}
              token={user.accessToken}
              handleAuthError={handleAuthError}
              emitPlayState={emitPlayState}
            />
          )}
        </div>
      </main>
    </div>
  );
};
