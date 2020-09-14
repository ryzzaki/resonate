import React, { useState } from 'react';
import { getLyrics } from '../../utils/api';
import { ReactComponent as MusicIcon } from '../../assets/icons/music.svg';

type Props = {
  token: string;
  query: string;
};

export const Lyrics: React.FC<Props> = (props) => {
  const { token, query } = props;

  const [lyrics, setLyrics] = useState('No lyrics');

  const handleOnClick = async () => {
    try {
      setLyrics('Loading...');
      const { data } = await getLyrics(token, query);
      setLyrics(data);
    } catch (err) {
      setLyrics('No lyrics');
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-20">
        <button
          onClick={handleOnClick}
          className="text-greylight flex font-bold text-18 hover:text-white"
        >
          <MusicIcon className="w-25 fill-current mr-10" />
          Show lyrics
        </button>
      </div>
      <div className="px-20 pb-20 flex-1 overflow-auto">
        <div className="relative h-full overflow-y-auto">
          <p className="whitespace-pre-wrap absolute top-0 bottom-0 left-0 right-0 text-greylight leading-10 font-bold text-25">
            {lyrics.replace('  ', '')}
          </p>
        </div>
      </div>
    </>
  );
};
