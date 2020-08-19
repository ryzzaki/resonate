import React from 'react';

type Props = {
  results: any;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClickURIs: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export const SearchView: React.FC<Props> = (props) => {
  const { results, handleSearch, handleClickURIs } = props;

  return (
    <div>
      <div className="sticky top-0 bg-darkblue">
        <input
          placeholder="Search a song..."
          className="transition-colors duration-100 ease-in-out outline-none border-transparent bg-transparent placeholder-darkskinpink text-skinpink font-semibold text-40 rounded-md py-10 px-20 block w-full appearance-none leading-normal ds-input"
          onChange={handleSearch}
        />
      </div>
      <div className="px-20">
        {results?.tracks && (
          <>
            <div className="sticky top-4 bg-darkblue py-20">
              <h3 className="font-semibold text-skinpink text-30">Songs</h3>
            </div>
            <ul>
              {results.tracks.items.map((track: any) => (
                <li
                  data-uris={track.uri}
                  key={track.id}
                  className="group flex mb-10 cursor-pointer hover:bg-skinpink"
                  onClick={handleClickURIs}
                >
                  <img
                    className="h-60 w-60 object-cover mr-10"
                    src={track.album?.images[2]?.url}
                    alt="track cover"
                  />
                  <div className="pt-5">
                    <h5 className="font-semibold text-pink">{track.name}</h5>
                    <ul className="flex">
                      {track.artists?.map((artist: any) => (
                        <li
                          key={artist.id}
                          className="text-skinpink group-hover:text-darkblue text-14 mr-10 leading-none"
                        >
                          {artist.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {results && !results?.tracks.items.length && (
          <h4 className="text-skinpink font-semibold">
            No results (╯°□°)╯︵ ┻━┻
          </h4>
        )}
        {results?.albums && (
          <>
            <div className="sticky top-4 bg-darkblue py-20">
              <h3 className="sticky top-4 font-semibold text-skinpink text-30">
                Albums
              </h3>
            </div>
            <ul className="mb-30">
              {results.albums.items.map((album: any) => (
                <li
                  data-uris={album.uri}
                  key={album.id}
                  className="group flex mb-10 cursor-pointer hover:bg-skinpink"
                  onClick={handleClickURIs}
                >
                  <img
                    className="h-60 w-60 object-cover mr-10"
                    src={album.images[2]?.url}
                    alt="track cover"
                  />
                  <div className="pt-5">
                    <h5 className="font-semibold text-pink">{album.name}</h5>
                    <ul className="flex">
                      {album.artists?.map((artist: any) => (
                        <li
                          key={artist.id}
                          className="text-skinpink group-hover:text-darkblue text-14 mr-10 leading-none"
                        >
                          {artist.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
