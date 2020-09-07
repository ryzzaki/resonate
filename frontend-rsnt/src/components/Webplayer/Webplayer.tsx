import React, { useState, useEffect, useRef, useCallback } from 'react';
import loadScript from '../../utils/loadScript';
import Session from '../../types/session';
import playData from '../../types/playData';
import playerStatus from '../../types/playerStatus';
import { playSong, repeatSong } from '../../utils/api';
import debouncer from '../../utils/debouncer';
import { WebplayerView } from './Webplayer.view';
import { useRefresh } from '../../utils/hooks';

type Props = {
  spotifyToken: string;
  token: string;
  isDJ: boolean;
  roomState: Session;
  emitNextTrack: () => void;
  emitSliderPos: (progressMs: number) => void;
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
    contextUri: null,
    deviceId: null,
    errorType: null,
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
      uris: [roomState.uris[0].uri],
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
    });
  }, [roomState.uris[0].uri, roomState.webplayer.songStartedAt]);

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

  // logic for setting songs from spotify, propagate to the dj room
  useEffect(() => {
    if (status.isInitializing) return;

    if (isDJ && status.contextUri) {
      emitSearchedURI(status.contextUri as string);
    } else {
      setStatus((state) => ({ ...state, unsync: true }));
    }
  }, [status.contextUri]);

  const initialization = () => {
    // @ts-ignore
    player.current = new Spotify.Player({
      getOAuthToken: (cb) => {
        cb(spotifyToken);
      },
      name: 'Resonate',
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
    const volume = localStorage.getItem('volume');
    if (volume) {
      player.current.setVolume(Number(volume) / 100);
    }
    // TODO: Test the gap
    play(device_id, {
      uris: [roomState.uris[0].uri],
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
    });
    setStatus((state) => ({
      ...state,
      deviceId: device_id,
      isInitializing: false,
      volume: volume ? Number(volume) : player.current._options.volume * 100,
    }));
  };

  const handlePlayerStateChange = (songState: any) => {
    console.log(songState);
    // set on repeat mode if therers only one song
    if (!songState) {
      setStatus((state) => ({ ...state, isInitializing: true }));
    } else {
      setStatus((state) => ({
        ...state,
        progressMs: songState.position,
        duration: songState.duration,
        contextUri: songState.context.uri,
        currentTrack: songState.track_window.current_track,
        paused: songState.paused,
        unsync: songState.paused,
      }));
    }
  };

  const handleIntervalUpdate = (e: number | undefined) =>
    setStatus((state) => {
      // emits the next song 1s before the current one ends
      if (isDJ && state.progressMs && state.duration - state.progressMs < 800) {
        emitNextTrack();
        return { ...state, progressMs: 0 };
      }
      return { ...state, progressMs: state.progressMs + 100 };
    });

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
      uris: [roomState.uris[0].uri],
      position_ms: Date.now() - roomState.webplayer.songStartedAt,
    });
    setStatus((state) => ({ ...state, unsync: false }));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    setStatus((state) => ({ ...state, volume }));
    player.current.setVolume(volume / 100);
    localStorage.setItem('volume', volume.toString());
  };

  const play = (deviceId: string | null, data: playData) => {
    playSong(token, deviceId, data);
  };

  return (
    <WebplayerView
      status={status}
      handleResync={handleResync}
      handlePlayState={handlePlayState}
      handleSliderPos={handleSliderPos}
      handleVolume={handleVolume}
    />
  );
};
