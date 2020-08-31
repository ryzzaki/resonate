import React from 'react';

type SongItemProps = {
  uri: string;
  cover: string;
  name: string;
  artists?: any;
  owner?: string;
  handleClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
};

export const SongItem: React.FC<SongItemProps> = ({
  uri,
  cover,
  name,
  artists,
  owner,
  handleClick,
}) => (
  <li
    data-uri={uri}
    className="group flex mb-15 cursor-pointer hover:bg-skinpink"
    onClick={handleClick}
  >
    <img
      className="h-60 w-60 object-cover mr-10 rounded-md"
      src={
        cover ||
        'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR3mgWUTlNp9JSAEWil_gOrG8ipWCMNLe_DJA&usqp=CAU'
      }
      alt="cover"
    />
    <div className="pt-5">
      <h5 className="font-semibold text-greylight">{name}</h5>
      <ul className="flex overflow-hidden">
        {artists?.map((artist: any) => (
          <li
            key={artist.id}
            className="whitespace-no-wrap text-grey group-hover:text-darkblue text-14 mr-10 leading-none"
          >
            {artist.name}
          </li>
        ))}
        {owner && (
          <li className="whitespace-no-wrap text-grey group-hover:text-darkblue text-14 mr-10 leading-none">
            {owner}
          </li>
        )}
      </ul>
    </div>
  </li>
);
