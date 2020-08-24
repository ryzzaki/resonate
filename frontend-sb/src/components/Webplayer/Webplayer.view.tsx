import React from 'react';
import { VideoSeekSlider } from 'react-video-seek-slider';
import playerStatus from '../../types/playerStatus';
import { ReactComponent as Play } from '../../assets/icons/play.svg';
import { ReactComponent as Pause } from '../../assets/icons/pause.svg';
import { ReactComponent as VolumeIcon } from '../../assets/icons/volume.svg';

type Props = {
  isDJ: boolean;
  status: playerStatus;
  handleResync: () => void;
  handlePlayState: () => void;
  handleSliderPos: (progressMs: number) => void;
  handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const WebplayerView: React.FC<Props> = (props) => {
  const {
    isDJ,
    handleResync,
    handlePlayState,
    status,
    handleSliderPos,
    handleVolume,
  } = props;

  if (status.isInitializing)
    return (
      <div className="text-center text-grey p-20">
        <p>LOADING...</p>
      </div>
    );

  if (status.errorType)
    return (
      <div className="text-center text-pink p-20">
        <p>{status.errorType}</p>
      </div>
    );

  return (
    <div className="relative">
      {status.unsync && (
        <button
          onClick={handleResync}
          className="absolute left-1/2 -top-3 transform -translate-x-1/2 z-10 mx-auto text-white font-bold text-14 px-20 py-5 uppercase"
        >
          Player out of sync, resync with dj room
        </button>
      )}
      {!isDJ && (
        <div className="group bg-darkblue bg-opacity-0 hover:bg-opacity-75 flex cursor-not-allowed absolute z-10 w-full h-full">
          <span className="opacity-0 group-hover:opacity-100 m-auto text-pink font-semibold">
            Allowed for DJ only
          </span>
        </div>
      )}
      <div className="grid grid-cols-3 px-20 bg-black2">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-20">
            <img
              className="rounded-md"
              src={status.currentTrack.album?.images[1].url}
            />
          </div>
          <div className="w-full">
            <h3 className="text-white font-bold w-full whitespace-no-wrap overflow-hidden">
              {status.currentTrack.name}
            </h3>
            <ul className="text-14 text-grey flex leading-snug ">
              {status.currentTrack.artists?.map((artist) => (
                <li key={artist.name} className="pr-15">
                  {artist.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center pt-20">
          <div>
            {status.paused ? (
              <button onClick={handlePlayState}>
                <Play className="w-60 h-60 fill-current text-white" />
              </button>
            ) : (
              <button onClick={handlePlayState}>
                <Pause className="w-60 h-60 fill-current text-white" />
              </button>
            )}
          </div>
          <div className="pb-10 w-30rem">
            <VideoSeekSlider
              max={status.currentTrack.duration_ms}
              currentTime={status.progressMs}
              onChange={handleSliderPos}
              hideHoverTime
            />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center">
            <VolumeIcon className="fill-current text-grey mr-20" />
            <input type="range" value={status.volume} onChange={handleVolume} />
          </div>
        </div>
      </div>
    </div>
  );
};
