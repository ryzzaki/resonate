import React, { useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ICallbackState } from 'react-spotify-web-playback/lib/types/common';
import { UrlEnums } from '../enums/urls.enum';
import { RouteComponentProps } from '@reach/router';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { refreshUser, signOutUser } from '../utils/api';
import { Search } from './Search';
import { Webplayer } from './Webplayer';

type Props = {};

// const connectSocket = (token: string): SocketIOClient.Socket => {
//   // socket testing
//   return io(UrlEnums.BASE_URL.toString(), {
//     transportOptions: {
//       extraHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   });
// };

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const [player, setPlayer] = useState({
    isPlaying: false,
    uris: [],
    socket: null,
  });

  // useEffect(() => {
  //   setSocket(connectSocket(token));
  // }, [token]);

  // if (socket) {
  //   // enumerate the events later
  //   socket.on('receiveSelectedURI', (data: string[]) => {
  //     setURIs(data);
  //   });
  // }

  // const emitSearchedURIs = (uris: string[]) => {
  //   if (socket) {
  //     socket.emit('rebroadcastSelectedURI', uris);
  //   }
  // };

  const handleCallback = async (res: ICallbackState) => {
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
          {/* <Search
            token={token}
            emitSearchedURIs={emitSearchedURIs}
            setIsPlaying={setIsPlaying}
          /> */}
        </div>
        <div className="mt-auto sticky bottom-0">
          <Webplayer
            token={user.accessToken}
            isPlaying={player.isPlaying}
            uris={player.uris}
            handleCallback={handleCallback}
          />
        </div>
      </main>
    </div>
  );
};
