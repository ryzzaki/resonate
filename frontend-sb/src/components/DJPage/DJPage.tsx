import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { UrlEnums } from '../../enums/urls.enum';
import { RouteComponentProps, navigate } from '@reach/router';
import { AuthContext } from '../../context/AuthContext';
import { refreshUser, signOutUser } from '../../utils/api';
import roomStatus from '../../types/roomStatus';
import { DJPageView } from './DJPage.view';

type Props = {};

export const DJPage: React.FC<RouteComponentProps<Props>> = () => {
  const { token, setToken, user, setUser } = useContext(AuthContext);

  const socket = useRef<any>({ current: null });

  const [roomStatus, setRoomStatus] = useState<roomStatus>({
    sessionId: window.location?.search?.replace('?sessionId=', ''),
    name: '',
    description: '',
    currentDJ: undefined,
    connectedUsers: [],
    currentURI: [],
    startsAt: 0,
    endsAt: 0,
    webplayer: {
      songStartedAt: 0,
      songPausedAt: 0,
    },
  });

  const isDJ = roomStatus.currentDJ?.id === user.id;

  // initializing socket connection
  useEffect(() => {
    if (!roomStatus.sessionId) {
      navigate('/rooms');
    }

    socket.current = connectSocket();
    socket.current.on('connect_error', (err) => console.error(err));
    socket.current.on('receiveCurrentSession', (session: any) =>
      setRoomStatus((state) => ({ state, ...session }))
    );
    socket.current.on('receiveCurrentURI', (currentURI: string[]) =>
      setRoomStatus((state) => ({ ...state, currentURI }))
    );
    socket.current.on('receiveNewDJ', (currentDJ: any) =>
      setRoomStatus((state) => ({ ...state, currentDJ }))
    );
    socket.current.on('receiveUsers', (connectedUsers: any) =>
      setRoomStatus((state) => ({ ...state, connectedUsers }))
    );
    socket.current.on('receiveCurrentSongStart', (songStartedAt: number) =>
      setRoomStatus((state) => ({
        ...state,
        webplayer: { ...state.webplayer, songStartedAt },
      }))
    );

    return () => socket.current.disconnect();
  }, []);

  const connectSocket = (): SocketIOClient.Socket => {
    return io(UrlEnums.BASE_URL.toString(), {
      transports: ['websocket'],
      path: '/v1/webplayer',
      query: {
        token: `Bearer ${token}`,
        sessionId: roomStatus.sessionId,
      },
    });
  };

  const emitSearchedURI = (uri: string) =>
    socket.current.emit('rebroadcastSelectedURI', uri);

  const emitSliderPos = (progressMs: number) =>
    socket.current.emit('rebroadcastSongStartedAt', Date.now() - progressMs);

  const emitSelectNewDJ = () => socket.current.emit('selectNewDJ');

  // Refresh token on error, if fail -> signout
  const handleAuthError = async () => {
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
      emitSelectNewDJ={emitSelectNewDJ}
      emitSearchedURI={emitSearchedURI}
      roomStatus={roomStatus}
    />
  );
};
