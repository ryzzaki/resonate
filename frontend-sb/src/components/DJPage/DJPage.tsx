import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { UrlEnums } from '../../enums/urls.enum';
import { RouteComponentProps } from '@reach/router';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import {
  refreshUser,
  signOutUser,
  pauseSong,
  resumeSong,
} from '../../utils/api';
import roomStatus from '../../types/roomStatus';
import { DJPageView } from './DJPage.view';

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  const socket = useRef<any>(null);

  const [roomStatus, setRoomStatus] = useState<roomStatus>({
    currentDJ: undefined,
    connectedUsers: [],
    currentURI: undefined,
    startsAt: 0,
    endsAt: 0,
    webplayer: {
      isPlaying: false,
      songStartedAt: 0,
      songPausedAt: 0,
    },
  });

  const isDJ = roomStatus.currentDJ?.id === user.id;

  useEffect(() => {
    // initializing socket connection
    socket.current = connectSocket();
    socket.current.on('connect_error', (err) => {
      console.error(err);
    });
    socket.current.on('receiveCurrentSession', (session: any) => {
      setRoomStatus(session);
    });
    socket.current.on('receiveCurrentURI', (currentURI: string[]) => {
      setRoomStatus((state) => ({ ...state, currentURI }));
    });
    socket.current.on('receiveCurrentWebplayerState', (isPlaying: boolean) => {
      if (isPlaying) {
        resumeSong(token);
      } else {
        pauseSong(token);
      }
    });
    socket.current.on('receiveNewDJ', (currentDJ: any) => {
      setRoomStatus((state) => ({ ...state, currentDJ }));
    });
    // TODO: socket cleanup function
  }, []);

  const connectSocket = (): SocketIOClient.Socket => {
    return io(UrlEnums.BASE_URL.toString(), {
      transports: ['websocket'],
      path: '/v1/webplayer',
      query: {
        token: `Bearer ${token}`,
      },
    });
  };

  const emitSearchedURIs = (uris: string[]) =>
    socket.current.emit('rebroadcastSelectedURI', uris);

  const emitPlayState = (state: boolean) => {
    if (isDJ) {
      socket.current.emit('updateWebplayerState', state);
    }
  };

  const emitSliderPos = (e: any) => {};

  const emitSelectNewDJ = () => socket.current.emit('selectNewDJ');

  const handleAuthError = async () => {
    // Refresh token on error, if fail -> signout
    try {
      const { data } = await refreshUser(token);
      setToken(data.accessToken);
      setUser({ ...user, accessToken: data.spotifyAccessToken });
      // TODO: missing something here, a trigger to reinitialize the player
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
    <DJPageView
      spotifyToken={user.accessToken}
      token={token}
      isDJ={isDJ}
      handleAuthError={handleAuthError}
      handleSignOut={handleSignOut}
      emitSliderPos={emitSliderPos}
      emitPlayState={emitPlayState}
      emitSelectNewDJ={emitSelectNewDJ}
      emitSearchedURIs={emitSearchedURIs}
      roomStatus={roomStatus}
    />
  );
};
