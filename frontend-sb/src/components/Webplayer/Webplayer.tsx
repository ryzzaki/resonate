import React, { useState, useEffect, useRef, useCallback } from 'react';
import loadScript from '../../utils/loadScript';
import roomStatus from '../../types/roomStatus';
import playerStatus from '../../types/playerStatus';
import { playSong } from '../../utils/api';
import { WebplayerView } from './Webplayer.view';
import debouncer from '../../utils/debouncer';

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  isDJ: boolean;
  handleAuthError: () => void;
  emitSliderPos: (progressMs: number) => void;
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
    progressMs: 0,
  });

  const player = useRef<any>(null);
  const playerInterval = useRef<any>(null);

  // initializing the spotify SDK
  useEffect(() => {
    // @ts-ignore
    if (window.Spotify) {
      // reiniatizale on spotify token refresh
      initialization();
    } else {
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = initialization;
    }

    (async () => await loadScript())();

    // player cleanup
    return () => {
      if (player.current) {
        player.current.removeListener('initialization_error');
        player.current.removeListener('authentication_error');
        player.current.removeListener('account_error');
        player.current.removeListener('playback_error');
        player.current.removeListener('player_state_changed');
        player.current.removeListener('ready');
        player.current.removeListener('not_ready');
        player.current.disconnect();
      }
    };
  }, [spotifyToken]);

  // on URI change from djroom play the new song
  // on songStartedAt change the play position
  useEffect(() => {
    if (status.isInitializing) return;

    play(status.deviceId, Date.now() - roomStatus.webplayer.songStartedAt);
  }, [roomStatus.currentURI, roomStatus.webplayer.songStartedAt]);

  // player slider logic, setInterval on play / clearInterval of pause
  useEffect(() => {
    if (status.isInitializing) return;

    if (status.paused) {
      window.clearInterval(playerInterval.current);
    } else {
      playerInterval.current = window.setInterval(handleIntervalUpdate, 100);
    }
    return () => window.clearInterval(playerInterval.current);
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
    // TODO: Test the gap
    play(device_id, Date.now() - roomStatus.webplayer.songStartedAt);
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
        progressMs: songState.position,
        currentTrack: songState.track_window.current_track,
        paused: songState.paused,
        unsync: songState.paused ? true : state.unsync,
      }));
    }
  };

  const handleIntervalUpdate = (e: number | undefined) =>
    setStatus((state) => ({ ...state, progressMs: state.progressMs + 100 }));

  const debounceSlider = useCallback(
    debouncer((progressMs: number) => {
      emitSliderPos(progressMs);
    }, 100),
    [status.deviceId]
  );

  const handleSliderPos = (progressMs: number) => {
    if (isDJ) {
      debounceSlider(progressMs);
    }
  };

  const handlePlayState = () => {
    if (status.paused) {
      handleResync();
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
      handleSliderPos={handleSliderPos}
    />
  );
};
