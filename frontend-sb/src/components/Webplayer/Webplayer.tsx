import React, { useState, useEffect, useRef, useCallback } from 'react';
import loadScript from '../../utils/loadScript';
import Session from '../../types/session';
import playData from '../../types/playData';
import playerStatus from '../../types/playerStatus';
import { playSong } from '../../utils/api';
import debouncer from '../../utils/debouncer';
import { WebplayerView } from './Webplayer.view';
import { useRefresh } from '../../utils/hooks';

type Props = {
  spotifyToken: string;
  token: string;
  isDJ: boolean;
  roomState: Session;
  emitSliderPos: (progressMs: number) => void;
  emitNextTrack: (uri: string) => void;
  emitSearchedURI: (uri: string) => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const {
    token,
    isDJ,
    spotifyToken,
    roomState,
    emitSliderPos,
    emitNextTrack,
    emitSearchedURI,
  } = props;

  const [status, setStatus] = useState<playerStatus>({
    currentTrack: {},
    isInitializing: true,
    paused: true,
    unsync: false,
    deviceId: '',
    errorType: '',
    duration: 0,
    progressMs: 0,
    volume: 0,
  });

  const player = useRef<any>(null);
  const playerInterval = useRef<any>(null);

  const handleRefresh = useRefresh();

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

  // on URI and songstart change from djroom, play the the updated song
  useEffect(() => {
    if (status.isInitializing) return;

    play(status.deviceId, {
      uris: roomState.uris,
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
      offset: {
        uri: roomState.webplayer.uri,
      },
    });
  }, [roomState.uris, roomState.webplayer.songStartedAt]);

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
    if (status.isInitializing) return;

    const currentTrack = status.currentTrack.uri;

    if (!roomState.uris.includes(currentTrack)) {
      if (isDJ) {
        emitSearchedURI(currentTrack);
      } else {
        setStatus((state) => ({ ...state, unsync: true }));
      }
      return;
    }

    if (
      isDJ &&
      roomState.webplayer.uri &&
      roomState.webplayer.uri !== currentTrack
    ) {
      emitNextTrack(currentTrack);
      return;
    }
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
      return handleRefresh();
    }

    setStatus((state) => ({
      ...state,
      errorType: message,
      isInitializing: false,
    }));
  };

  // Play the song at the right start on first load
  const handlePlayerReady = ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    // TODO: Test the gap
    play(device_id, {
      uris: roomState.uris,
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
      offset: {
        uri: roomState.webplayer.uri,
      },
    });
    setStatus((state) => ({
      ...state,
      deviceId: device_id,
      isInitializing: false,
      volume: player.current._options.volume * 100,
    }));
  };

  const handlePlayerStateChange = (songState: any) => {
    if (!songState) {
      setStatus((state) => ({ ...state, isInitializing: true }));
    } else {
      setStatus((state) => ({
        ...state,
        progressMs: songState.position,
        duration: songState.duration,
        currentTrack: songState.track_window.current_track,
        nextTracks: songState.track_window?.next_tracks[0],
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
    play(status.deviceId, {
      uris: roomState.uris,
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
      offset: {
        uri: roomState.webplayer.uri,
      },
    });
    setStatus((state) => ({ ...state, unsync: false }));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    setStatus((state) => ({ ...state, volume }));
    player.current.setVolume(volume / 100);
  };

  const play = async (deviceId: string, data: playData) => {
    const { offset, ...rest } = data;
    playSong(token, deviceId, offset?.uri ? data : rest);
  };

  return (
    <WebplayerView
      status={status}
      isDJ={isDJ}
      handleResync={handleResync}
      handlePlayState={handlePlayState}
      handleSliderPos={handleSliderPos}
      handleVolume={handleVolume}
    />
  );
};
