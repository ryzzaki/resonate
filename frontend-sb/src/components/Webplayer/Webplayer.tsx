import React, { useState, useEffect, useRef } from 'react';
import loadScript from '../../utils/loadScript';
import roomStatus from '../../types/roomStatus';
import playerStatus from '../../types/playerStatus';
import { playSong } from '../../utils/api';
import { WebplayerView } from './Webplayer.view';

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  isDJ: boolean;
  handleAuthError: () => void;
  emitSliderPos: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const {
    roomStatus,
    token,
    isDJ,
    spotifyToken,
    handleAuthError,
    emitSliderPos,
  } = props;

  const [status, setStatus] = useState<playerStatus>({
    currentTrack: {},
    isInitializing: true,
    paused: true,
    unsync: false,
    errorType: '',
    deviceId: '',
    position: 0,
    progressMs: 0,
  });

  const player = useRef<any>(null);
  const playerInterval = useRef<any>(null);

  // initializing the spotify SDK
  useEffect(() => {
    if (player.current) {
      // reiniatizale on spotify token refresh
      initialization();
    } else {
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = initialization;
    }

    (async () => await loadScript())();

    return () => player.current.disconnect();
  }, [spotifyToken]);

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
      setStatus((state) => ({ ...state, unsync: true }));
    } else {
      playerInterval.current = window.setInterval(handleIntervalUpdate, 100);
    }
  }, [status.paused]);

  useEffect(() => {
    // on track change, check if its not from spotify player
    setStatus((state) => ({
      ...state,
      unsync:
        status.currentTrack.uri &&
        roomStatus.currentURI[0] !== status.currentTrack.uri,
    }));
  }, [status.currentTrack.uri]);

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
      return;
    }

    setStatus((state) => ({
      ...state,
      errorType: message,
      isInitializing: false,
    }));
  };

  const handlePlayerReady = ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    // Play the song at the right start
    const songStart = roomStatus.webplayer.songStartedAt
      ? Date.now() - roomStatus.webplayer.songStartedAt
      : 0;
    play(device_id, songStart);
    setStatus((state) => ({
      ...state,
      deviceId: device_id,
      isInitializing: false,
    }));
  };

  const handlePlayerStateChange = (songState: any) => {
    console.log(songState);
    if (!songState) {
      setStatus((state) => ({ ...state, isInitializing: true }));
    } else {
      setStatus((state) => ({
        ...state,
        progressMs: roomStatus.webplayer.songStartedAt
          ? songState.position
          : !songState.position
          ? 0
          : state.progressMs,
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
        position: progressInDuration > 100 ? 100 : progressInDuration * 100,
      };
    });
  };

  const handlePlayState = () => {
    if (status.paused) {
      player.current.resume();
    } else {
      player.current.pause();
    }
  };

  const handleResync = () => {
    play(status.deviceId, Date.now() - roomStatus.webplayer.songStartedAt);
    setStatus((state) => ({ ...state, unsync: false }));
  };

  const play = async (deviceId: string, position_ms?: number) => {
    playSong(token, deviceId, {
      uris: roomStatus.currentURI,
      position_ms,
    });
  };

  return (
    <WebplayerView
      status={status}
      isDJ={isDJ}
      handleResync={handleResync}
      handlePlayState={handlePlayState}
      emitSliderPos={emitSliderPos}
    />
  );
};
