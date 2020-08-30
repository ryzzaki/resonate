import React from 'react';
import { ReactComponent as SpotifyLogo } from '../../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../../enums/urls.enum';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="py-20 sticky top-0 bg-black2 bg-opacity-75">
      <div className="flex items-center">
        <div className="flex-auto w-auto md:w-1/2 text-center md:text-left">
          <h1 className="font-logoHeading text-34 text-white">SB</h1>
        </div>
        <div className="flex md:visible md:flex w-1/2 justify-end m-10 mr-25">
          <a
            href={`${UrlEnums.API_URL}/auth/spotify`}
            className="bg-black2light hover:bg-white  hover:text-black inline-flex items-center font-semibold p-10 pr-20 rounded-full"
          >
            <SpotifyLogo className="w-25 h-25 mr-10" />
            Login with spotify
          </a>
        </div>
      </div>
    </header>
  );
};
