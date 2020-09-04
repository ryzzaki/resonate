import React, { useState } from 'react';
import { getLyrics } from '../../utils/api';

type Props = {
  token: string;
  query: string;
};

export const Lyrics: React.FC<Props> = (props) => {
  const { token, query } = props;
  const [lyrics, setLyrics] = useState('');

  const handleOnClick = () => {
    getLyrics(token, query).then((res) => {
      setLyrics(res.data);
    });
  };

  return (
    <div className="px-20">
      <h3
        className="text-greylight hover:text-white font-bold uppercase text-14 transition duration-300 ease-in-out cursor-pointer"
        onClick={handleOnClick}
      >
        View Lyrics
      </h3>
      <div>
        <p className="text-greylight w-full">{lyrics}</p>
      </div>
    </div>
  );
};
