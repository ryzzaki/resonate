import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as Play } from '../assets/icons/play.svg';
import { ReactComponent as Pause } from '../assets/icons/pause.svg';
import loadScript from '../utils/loadScript';
import playerStatus from '../types/playerStatus';

type Props = {
  token: string;
  playerStatus: playerStatus;
  handleAuthError: () => void;
  handlePlay: (deviceId: string) => void;
  handlePause: () => void;
};

export const Webplayer: React.FC<Props> = (props) => {
  const {
    token,
    playerStatus,
    handleAuthError,
    handlePlay,
    handlePause,
  } = props;

  const [status, setStatus] = useState({
    isInitializing: false,
    errorType: '',
    deviceId: '',
  });

  const player = useRef<any>(null);

  useEffect(() => {
    setStatus((state) => ({ ...state, isInitializing: true }));

    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = initialization;

    (async () => {
      await loadScript();
      // await play();
    })();
    // cleanup function
  }, []);

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
    player.current.addListener('player_state_changed', (state) => {
      console.log(state);
    });
    player.current.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setStatus((state) => ({ ...state, isInitializing: false }));
      setStatus((state) => ({ ...state, deviceId: device_id }));
      handlePlay(device_id);
    });
    player.current.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    player.current.connect();
  };

  console.log(status);

  return (
    <div>
      <div className="">
        <div></div>
      </div>
      <div className="grid grid-cols-3 py-10 px-20">
        <div className="flex items-center">
          <div>
            <img />
          </div>
          <div className="text-skinpink ">
            <h3>Song name</h3>
            <p className="text-14	leading-none">artist</p>
          </div>
        </div>
        <div className="flex justify-center">
          {!playerStatus.play ? (
            <button>
              <Play className="w-60 h-60 fill-current text-skinpink" />
            </button>
          ) : (
            <button onClick={handlePause}>
              <Pause className="w-60 h-60 fill-current text-skinpink" />
            </button>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};
