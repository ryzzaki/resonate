import React, { useCallback, useState } from 'react';
import { searchSongs } from '../utils/api';

function debouncer(func: (...params: any[]) => any, delay: number) {
  let timer: any | undefined = undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

type Props = {
  token: string;
};

export const Search: React.FC<Props> = (props) => {
  const { token } = props;

  const [results, setResults] = useState<any>(null);

  const debounceSearch = useCallback(
    debouncer(async (e) => {
      const { data } = await searchSongs(token, e.target.value);
      setResults(data);
      console.log(data);
    }, 600),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    debounceSearch(e);
  };

  return (
    <div>
      <div className="sticky top-0 bg-darkblue pb-20">
        <input
          placeholder="Search a song..."
          className="transition-colors duration-100 ease-in-out outline-none border-transparent bg-transparent placeholder-darkskinpink text-skinpink font-semibold text-40 rounded-md py-10 px-20 block w-full appearance-none leading-normal ds-input"
          onChange={handleSearch}
        />
      </div>
      <ul className="px-20">
        {results?.tracks.items.map((result: any) => (
          <li key={result.id} className="flex mb-15">
            <img
              className="h-60 w-60 object-cover mr-10"
              src={result.album?.images[2].url}
            />
            <div className="pt-5">
              <h5 className="font-semibold text-pink">{result.name}</h5>
              <ul className="flex">
                {result.artists?.map((artist: any) => (
                  <li key={artist.id} className="text-skinpink text-14 mr-10">
                    {artist.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
