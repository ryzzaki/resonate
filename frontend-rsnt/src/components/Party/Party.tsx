import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { UrlEnums } from '../../enums/urls.enum';
import { RouteComponentProps, navigate } from '@reach/router';
import { AuthContext } from '../../context/AuthContext';
import Session from '../../types/session';
import { PartyView } from './Party.view';
import { RoomAccess } from '../../enums/RoomAccess';

type Props = {};

export const Party: React.FC<RouteComponentProps<Props>> = () => {
  const { token, user } = useContext(AuthContext);

  const socket = useRef<any>({ current: null });

  const [roomState, setRoomState] = useState<Session>({
    id: window.location?.search?.replace('?sessionId=', ''),
    name: '',
    roomAccess: RoomAccess.PUBLIC,
    description: '',
    currentDJ: undefined,
    connectedUsers: [],
    uris: [],
    startsAt: 0,
    endsAt: 0,
    webplayer: {
      songStartedAt: 0,
    },
  });

  const isDJ = roomState.currentDJ?.id === user.id;

  // initializing socket connection
  useEffect(() => {
    if (!roomState.id) {
      navigate('/rooms');
    }

    socket.current = connectSocket();

    socket.current.on('connect_error', (err) => {
      console.error(err);
      if (err === `Session ID ${roomState.id} does not exist!`) {
        socket.current.disconnect();
        navigate('/rooms');
      }
    });
    socket.current.on('receiveCurrentSession', (session: any) =>
      setRoomState((state) => ({ state, ...session }))
    );
    socket.current.on('receiveNewDJ', (currentDJ: any) =>
      setRoomState((state) => ({ ...state, currentDJ }))
    );
    socket.current.on('receiveUsers', (connectedUsers: any) =>
      setRoomState((state) => ({ ...state, connectedUsers }))
    );
    socket.current.on('receiveCurrentSongStart', (songStartedAt: number) =>
      setRoomState((state) => ({
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
        sessionId: roomState.id,
      },
    });
  };

  const emitSearchedURI = (uri: string, startUri?: string) =>
    socket.current.emit('rebroadcastSelectedURI', { uri, startUri });

  const emitSliderPos = (progressMs: number) =>
    socket.current.emit('rebroadcastSongStartedAt', Date.now() - progressMs);

  const emitSelectNewDJ = () => socket.current.emit('selectNewDJ');

  const emitNextTrack = () => socket.current.emit('selectNextTrack');

  return (
    <PartyView
      spotifyToken={user.accessToken}
      token={token}
      isDJ={isDJ}
      roomState={roomState}
      emitSliderPos={emitSliderPos}
      emitSelectNewDJ={emitSelectNewDJ}
      emitSearchedURI={emitSearchedURI}
      emitNextTrack={emitNextTrack}
    />
  );
};
