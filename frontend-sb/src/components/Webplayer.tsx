import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as Play } from '../assets/icons/play.svg';
import { ReactComponent as Pause } from '../assets/icons/pause.svg';
import loadScript from '../utils/loadScript';
import playerStatus from '../types/playerStatus';
import { playSong, pauseSong } from '../utils/api';

type Props = {
  playerStatus: playerStatus;
  token: string;
  handleAuthError: () => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const { playerStatus, token, handleAuthError } = props;

  const [status, setStatus] = useState<{
    isInitializing: boolean;
    paused: boolean;
    errorType: string;
    deviceId: string;
    currentTrack: any;
  }>({
    isInitializing: false,
    paused: true,
    errorType: '',
    deviceId: '',
    currentTrack: {},
  });

  const player = useRef<any>(null);

  useEffect(() => {
    setStatus((state) => ({ ...state, isInitializing: true }));

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = initialization;

    (async () => {
      await loadScript();
    })();
    // cleanup function for removing script
  }, []);

  useEffect(() => {
    play(status.deviceId);
  }, [playerStatus.uris]);

  const initialization = () => {
    // @ts-ignore
    player.current = new Spotify.Player({
      getOAuthToken: (cb) => {
        cb(token);
      },
      name: 'Web pleya',
    });

    // Error handling
    player.current.addListener('initialization_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({ ...state, errorType: 'initialization_error' }));
    });
    player.current.addListener('authentication_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({ ...state, errorType: 'authentication_error' }));
      handleAuthError();
    });
    player.current.addListener('account_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({ ...state, errorType: 'account_error' }));
    });
    player.current.addListener('playback_error', ({ message }) => {
      console.error(message);
      setStatus((state) => ({ ...state, errorType: 'playback_error' }));
    });

    // Status handling + connection
    player.current.addListener('player_state_changed', (songState) => {
      console.log(songState);
      if (!songState) {
        setStatus((state) => ({ ...state, paused: true }));
      } else {
        setStatus((state) => ({
          ...state,
          paused: songState.paused,
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
      play(device_id);
    });
    player.current.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.current.connect();
  };

  const play = (deviceId: string) =>
    playSong(token, deviceId, {
      uris: playerStatus.uris,
    });

  const pause = () => pauseSong(token);

  return (
    <div>
      <div className="">
        <div></div>
      </div>
      <div className="grid grid-cols-3 p-10">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-10">
            <img src={status.currentTrack.album?.images[1].url} />
          </div>
          <div className="w-full">
            <h3 className="text-pink font-semibold w-full whitespace-no-wrap overflow-hidden">
              {status.currentTrack.name}
            </h3>
            <ul className="text-14 text-skinpink flex leading-snug ">
              {status.currentTrack.artists?.map((artist) => (
                <li key={artist.name} className="pr-15">
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center">
          {status.paused ? (
            <button>
              <Play className="w-60 h-60 fill-current text-skinpink" />
            </button>
          ) : (
            <button onClick={pause}>
              <Pause className="w-60 h-60 fill-current text-skinpink" />
            </button>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};
