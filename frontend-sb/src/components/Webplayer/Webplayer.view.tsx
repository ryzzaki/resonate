import React from 'react';
import playerStatus from '../../types/playerStatus';
import { ReactComponent as Play } from '../../assets/icons/play.svg';
import { ReactComponent as Pause } from '../../assets/icons/pause.svg';

type Props = {
  emitPlayState: (state: boolean) => void;
  status: playerStatus;
};

export const WebplayerView: React.FC<Props> = (props) => {
  const { emitPlayState, status } = props;

  return (
    <div>
      <div></div>
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
            <button onClick={() => emitPlayState(true)}>
              <Play className="w-60 h-60 fill-current text-skinpink" />
            </button>
          ) : (
            <button onClick={() => emitPlayState(false)}>
              <Pause className="w-60 h-60 fill-current text-skinpink" />
            </button>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};
