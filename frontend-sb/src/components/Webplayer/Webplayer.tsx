import React, { useState, useEffect, useRef } from 'react';
import loadScript from '../../utils/loadScript';
import roomStatus from '../../types/roomStatus';
import playerStatus from '../../types/playerStatus';
import { playSong } from '../../utils/api';
import { WebplayerView } from './Webplayer.view';
import { stat } from 'fs';

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  handleAuthError: () => void;
  emitPlayState: (state: boolean) => void;
  emitSliderPos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const {
    roomStatus,
    token,
    spotifyToken,
    handleAuthError,
    emitPlayState,
    emitSliderPos,
  } = props;

  const [status, setStatus] = useState<playerStatus>({
    currentTrack: {},
    isInitializing: true,
    paused: true,
    errorType: '',
    deviceId: '',
    position: 0,
    progressMs: 0,
  });

  const player = useRef<any>(null);
  const playerInterval = useRef<any>(null);

  // initializing the spotify SDK
  useEffect(() => {
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = initialization;
    (async () => await loadScript())();
    // TODO: cleanup function to remove script element
  }, []);

  // on URI change from djroom play the new song
  useEffect(() => {
    if (status.isInitializing) return;

    play(status.deviceId);
  }, [roomStatus.currentURI]);

  // player slider logic, setInterval on play / clearInterval of pause
  useEffect(() => {
    if (status.isInitializing) return;

    if (status.paused) {
      window.clearInterval(playerInterval.current);
    } else {
      playerInterval.current = window.setInterval(handleIntervalUpdate, 100);
    }
  }, [status.paused]);

  // on change track restarts progressMs for player slider
  useEffect(() => {
    setStatus((state) => ({ ...state, progressMs: 0 }));
  }, [status.currentTrack.id]);

  const initialization = () => {
    // @ts-ignore
    player.current = new Spotify.Player({
      getOAuthToken: (cb) => {
        cb(spotifyToken);
      },
      name: 'SonicBoom',
    });

    // Error handling
    player.current.addListener('initialization_error', handlePlayerError);
    player.current.addListener('authentication_error', handlePlayerError);
    player.current.addListener('account_error', handlePlayerError);
    player.current.addListener('playback_error', handlePlayerError);

    // Status handling + connection
    player.current.addListener('player_state_changed', handlePlayerStateChange);
    player.current.addListener('ready', handlePlayerReady);
    player.current.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.current.connect();
  };

  const handlePlayerError = ({ message }) => {
    console.error(message);
    if (message === 'Authentication failed') {
      handleAuthError();
    }

    setStatus((state) => ({
      ...state,
      errorType: message,
      isInitializing: false,
    }));
  };

  const handlePlayerReady = ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    if (roomStatus.webplayer.isPlaying) {
      play(device_id);
    }
    setStatus((state) => ({
      ...state,
      deviceId: device_id,
      isInitializing: false,
    }));
  };

  const handlePlayerStateChange = (songState: any) => {
    // TODO: Check this logic for disconection from other device
    if (!songState) {
      setStatus((state) => ({ ...state, isInitializing: true }));
    } else {
      setStatus((state) => ({
        ...state,
        currentTrack: songState.track_window.current_track,
        paused: songState.paused,
      }));
    }
  };

  const handleIntervalUpdate = (e: number | undefined) => {
    setStatus((state) => {
      const progressMs = state.progressMs + 100;
      const progressInDuration =
        state.progressMs / state.currentTrack.duration_ms;

      // max length = 100 slider input value -> find the (current ms / the track length) * 100
      return {
        ...state,
        progressMs,
        position: progressInDuration > 100 ? 1000 : progressInDuration * 100,
      };
    });
  };

  const handlePlayState = (state: boolean) => {
    if (!status.currentTrack.id) {
      play(status.deviceId);
    } else {
      emitPlayState(state);
    }
  };

  const play = async (deviceId: string) => {
    if (roomStatus.currentURI) {
      playSong(token, deviceId, {
        uris: roomStatus.currentURI,
      });
    }
  };

  return (
    <WebplayerView
      status={status}
      paused={status.paused}
      emitPlayState={handlePlayState}
      emitSliderPos={emitSliderPos}
    />
  );
};
