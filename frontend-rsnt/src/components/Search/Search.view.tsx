import React, { useState } from 'react';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';
import { SongItem } from './SongItem';

type Props = {
  results: any;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

enum activeState {
  SONGS = 'Songs',
  ALBUMS = 'Albums',
  PLAYLISTS = 'Playlists',
}

export const SearchView: React.FC<Props> = (props) => {
  const { results, handleSearch, handleClick } = props;

  const [active, setActive] = useState(activeState.SONGS);

  return (
    <div className="p-20 pr-0 relative">
      <div className="relative z-10">
        <SearchIcon className="absolute top-1/2 left-0.5 transform -translate-y-1/2 fill-current text-grey" />
        <input
          onChange={handleSearch}
          placeholder="Search a song/album/playlist"
          className="w-full p-5 pl-40 pr-15 rounded-md appearance-none bg-black2light placeholder-grey text-white"
        />
      </div>
      {results && (
        <div className="absolute top-0 h-screen w-full pt-80 pb-90 bg-black2">
          <div className="overflow-scroll h-full">
            <div className="flex sticky top-0 bg-black2 pb-20">
              {Object.keys(activeState).map((i) => (
                <button
                  key={i}
                  onClick={() => setActive(activeState[i])}
                  className={`${
                    active === activeState[i] ? 'text-white' : 'text-grey'
                  } font-bold uppercase mr-20 focus:outline-none`}
                >
                  {i}
                </button>
              ))}
            </div>
            {active === activeState.SONGS && results?.tracks && (
              <ul>
                {results.tracks.items.map((track: any) => (
                  <SongItem
                    key={track.id}
                    uri={track.uri}
                    cover={track.album?.images[2]?.url}
                    name={track.name}
                    artists={track.artists}
                    handleClick={handleClick}
                  />
                ))}
              </ul>
            )}
            {active === activeState.ALBUMS && results?.albums && (
              <ul>
                {results.albums.items.map((album: any) => (
                  <SongItem
                    key={album.id}
                    uri={album.uri}
                    cover={album.images[2]?.url}
                    name={album.name}
                    artists={album.artists}
                    handleClick={handleClick}
                  />
                ))}
              </ul>
            )}
            {active === activeState.PLAYLISTS && results?.playlists && (
              <ul>
                {results.playlists.items.map((playlist: any) => (
                  <SongItem
                    key={playlist.id}
                    uri={playlist.uri}
                    cover={playlist.images[2]?.url}
                    name={playlist.name}
                    owner={playlist.owner.display_name}
                    handleClick={handleClick}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
