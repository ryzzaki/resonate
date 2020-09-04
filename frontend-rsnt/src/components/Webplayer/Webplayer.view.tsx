import React, { useState, useEffect } from 'react';
import { VideoSeekSlider } from 'react-video-seek-slider';
import playerStatus from '../../types/playerStatus';
import { ReactComponent as Play } from '../../assets/icons/play.svg';
import { ReactComponent as Pause } from '../../assets/icons/pause.svg';
import { ReactComponent as VolumeIcon } from '../../assets/icons/volume.svg';

type Props = {
  status: playerStatus;
  handleResync: () => void;
  handlePlayState: () => void;
  handleSliderPos: (progressMs: number) => void;
  handleVolume: (
    e: React.ChangeEvent<HTMLInputElement>,
    mute?: boolean
  ) => void;
};

export const WebplayerView: React.FC<Props> = (props) => {
  const {
    handleResync,
    handlePlayState,
    status,
    handleSliderPos,
    handleVolume,
  } = props;

  if (status.isInitializing)
    return (
      <div className="text-center text-grey p-20">
        <p>Connecting you to art...</p>
      </div>
    );

  if (status.errorType)
    return (
      <div className="text-center text-pink p-20">
        <p>{status.errorType}</p>
      </div>
    );

  const toggleVolume = () =>
    handleVolume(
      status.volume === 0
        ? (({ target: { value: 100 } } as unknown) as React.ChangeEvent<
            HTMLInputElement
          >)
        : (({ target: { value: 0 } } as unknown) as React.ChangeEvent<
            HTMLInputElement
          >)
    );

  return (
    <div className="relative">
      {status.unsync && (
        <button
          onClick={handleResync}
          className="absolute bg-black2 rounded left-1/2 -top-3 transform -translate-x-1/2 z-10 mx-auto text-white font-bold text-14 px-20 py-5 uppercase"
        >
          Player out of sync, resync with dj room
        </button>
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
        <div className="flex flex-col items-center pt-10">
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
            <VolumeIcon
              className="fill-current text-grey mr-20 cursor-pointer"
              onClick={toggleVolume}
            />
            <input type="range" value={status.volume} onChange={handleVolume} />
          </div>
        </div>
      </div>
    </div>
  );
};
