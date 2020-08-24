import React from 'react';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

type Props = {
  results: any;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export const SearchView: React.FC<Props> = (props) => {
  const { results, handleSearch, handleClick } = props;

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
        <div className="absolute top-0 h-screen w-full py-80 bg-black2">
          <div className="overflow-scroll h-full">
            {results?.tracks && (
              <>
                <h3 className="font-bold uppercase mb-20 text-greylight">
                  Songs
                </h3>
                <ul>
                  {results.tracks.items.map((track: any) => (
                    <li
                      data-uris={track.uri}
                      key={track.id}
                      className="group flex mb-15 cursor-pointer hover:bg-skinpink"
                      onClick={handleClick}
                    >
                      <img
                        className="h-60 w-60 object-cover mr-10 rounded-md"
                        src={track.album?.images[2]?.url}
                        alt="track cover"
                      />
                      <div className="pt-5">
                        <h5 className="font-semibold text-greylight">
                          {track.name}
                        </h5>
                        <ul className="flex overflow-hidden">
                          {track.artists?.map((artist: any) => (
                            <li
                              key={artist.id}
                              className="whitespace-no-wrap text-grey group-hover:text-darkblue text-14 mr-10 leading-none"
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
            {results?.albums && (
              <>
                <h3 className="font-bold uppercase my-20 text-greylight">
                  Albums
                </h3>
                <ul className="mb-30">
                  {results.albums.items.map((album: any) => (
                    <li
                      data-album={album.uri}
                      key={album.id}
                      className="group flex mb-15 cursor-pointer hover:bg-skinpink"
                      onClick={handleClick}
                    >
                      <img
                        className="h-60 w-60 object-cover mr-10 rounded-md"
                        src={album.images[2]?.url}
                        alt="track cover"
                      />
                      <div className="pt-5">
                        <h5 className="font-semibold text-greylight">
                          {album.name}
                        </h5>
                        <ul className="flex overflow-hidden">
                          {album.artists?.map((artist: any) => (
                            <li
                              key={artist.id}
                              className="whitespace-no-wrap text-grey group-hover:text-darkblue text-14 mr-10 leading-none"
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
      )}
    </div>
  );

  // return (
  //   <div>
  //     <div className="sticky top-0">
  //       <input
  //         placeholder="Search a song..."
  //         className="transition-colors duration-100 ease-in-out outline-none border-transparent bg-transparent placeholder-darkskinpink text-skinpink font-semibold text-40 rounded-md py-10 px-20 block w-full appearance-none leading-normal ds-input"
  //         onChange={handleSearch}
  //       />
  //     </div>
  //     <div className="px-20">
  //       {results?.tracks && (
  //         <>
  //           <div className="sticky top-4 bg-darkblue py-20">
  //             <h3 className="font-semibold text-skinpink text-30">Songs</h3>
  //           </div>
  //           <ul>
  //             {results.tracks.items.map((track: any) => (
  //               <li
  //                 data-uris={track.uri}
  //                 key={track.id}
  //                 className="group flex mb-10 cursor-pointer hover:bg-skinpink"
  //                 onClick={handleClick}
  //               >
  //                 <img
  //                   className="h-60 w-60 object-cover mr-10"
  //                   src={track.album?.images[2]?.url}
  //                   alt="track cover"
  //                 />
  //                 <div className="pt-5">
  //                   <h5 className="font-semibold text-pink">{track.name}</h5>
  //                   <ul className="flex">
  //                     {track.artists?.map((artist: any) => (
  //                       <li
  //                         key={artist.id}
  //                         className="text-skinpink group-hover:text-darkblue text-14 mr-10 leading-none"
  //                       >
  //                         {artist.name}
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 </div>
  //               </li>
  //             ))}
  //           </ul>
  //         </>
  //       )}
  //       {results && !results?.tracks.items.length && (
  //         <h4 className="text-skinpink font-semibold">
  //           No results (╯°□°)╯︵ ┻━┻
  //         </h4>
  //       )}
  //       {results?.albums && (
  //         <>
  //           <div className="sticky top-4 bg-darkblue py-20">
  //             <h3 className="sticky top-4 font-semibold text-skinpink text-30">
  //               Albums
  //             </h3>
  //           </div>
  //           <ul className="mb-30">
  //             {results.albums.items.map((album: any) => (
  //               <li
  //                 data-album={album.uri}
  //                 key={album.id}
  //                 className="group flex mb-10 cursor-pointer hover:bg-skinpink"
  //                 onClick={handleClick}
  //               >
  //                 <img
  //                   className="h-60 w-60 object-cover mr-10"
  //                   src={album.images[2]?.url}
  //                   alt="track cover"
  //                 />
  //                 <div className="pt-5">
  //                   <h5 className="font-semibold text-pink">{album.name}</h5>
  //                   <ul className="flex">
  //                     {album.artists?.map((artist: any) => (
  //                       <li
  //                         key={artist.id}
  //                         className="text-skinpink group-hover:text-darkblue text-14 mr-10 leading-none"
  //                       >
  //                         {artist.name}
  //                       </li>
  //                     ))}
  //                   </ul>
  //                 </div>
  //               </li>
  //             ))}
  //           </ul>
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );
};
