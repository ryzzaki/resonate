import React, { useState, useEffect, useRef } from 'react';
import loadScript from '../../utils/loadScript';
import roomStatus from '../../types/roomStatus';
import playerStatus from '../../types/playerStatus';
import { playSong, resumeSong, pauseSong } from '../../utils/api';
import { WebplayerView } from './Webplayer.view';

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  handleAuthError: () => void;
  emitPlayState: (state: boolean) => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const {
    roomStatus,
    token,
    spotifyToken,
    handleAuthError,
    emitPlayState,
  } = props;

  const [status, setStatus] = useState<playerStatus>({
    isInitializing: false,
    errorType: '',
    deviceId: '',
    currentTrack: {},
  });

  const player = useRef<any>(null);

  useEffect(() => {
    // initializing the spotify SDK
    setStatus((state) => ({ ...state, isInitializing: true }));
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = initialization;

    (async () => await loadScript())();
    // TODO: cleanup function to remove script element
  }, []);

  useEffect(() => {
    if (status.deviceId) {
      play(status.deviceId);
    }
  }, [roomStatus.currentURI, status.deviceId]);

  useEffect(() => {
    // ignore first load
    if (!status.deviceId) return;

    if (roomStatus.webplayer.isPlaying) {
      resumeSong(token);
    } else {
      pauseSong(token);
    }
  }, [roomStatus.webplayer.isPlaying]);

  const initialization = () => {
    // @ts-ignore
    player.current = new Spotify.Player({
      getOAuthToken: (cb) => {
        cb(spotifyToken);
      },
      name: 'SonicBoom',
    });

    // Error handling
    player.current.addListener('initialization_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({
        ...state,
        errorType: 'initialization_error',
        isInitializing: false,
      }));
    });
    player.current.addListener('authentication_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({
        ...state,
        errorType: 'authentication_error',
        isInitializing: false,
      }));
      handleAuthError();
    });
    player.current.addListener('account_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({
        ...state,
        errorType: 'account_error',
        isInitializing: false,
      }));
    });
    player.current.addListener('playback_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({
        ...state,
        errorType: 'playback_error',
        isInitializing: false,
      }));
    });

    // Status handling + connection
    player.current.addListener('player_state_changed', (songState) => {
      // TODO: Check this logic for disconection from other device
      if (!songState) {
        setStatus((state) => ({ ...state, isInitializing: true }));
      } else {
        setStatus((state) => ({
          ...state,
          currentTrack: songState.track_window.current_track,
        }));
      }
    });
    player.current.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setStatus((state) => ({
        ...state,
        deviceId: device_id,
        isInitializing: false,
      }));
    });
    player.current.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.current.connect();
  };

  const play = (deviceId: string) => {
    if (roomStatus.currentURI) {
      playSong(token, deviceId, {
        uris: roomStatus.currentURI,
      });
    }
  };

  return (
    <WebplayerView
      status={status}
      paused={!roomStatus.webplayer.isPlaying}
      emitPlayState={emitPlayState}
    />
  );
};
