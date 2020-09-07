import React from 'react';
import { UriMetadata } from '../../types/session';
import { SongItem } from '../Search/SongItem';

type Props = {
  uris: UriMetadata[];
};

export const Queue: React.FC<Props> = (props) => {
  const { uris } = props;

  return (
    <div className="pl-20 flex flex-col h-full">
      <h3 className="text-grey font-bold uppercase text-14 transition duration-300 ease-in-out cursor-pointer mb-20">
        Next in queue
      </h3>
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 bottom-0 right-0 overflow-y-scroll pb-100">
          {uris.slice(1).map((song) => (
            <SongItem
              key={song.uri}
              uri={song.uri}
              name={song.title}
              cover={song.cover}
              artists={song.artists}
              handleClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
