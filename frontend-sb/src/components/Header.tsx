import React from 'react';
import spotifyLogo from '../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../enums/urls.enum';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="p-10">
      <div className="flex flex-no-wrap justify-between">
        <div className="flex-auto w-auto md:w-1/2 text-center md:text-left">
          <h1 className="font-logoHeading text-34 text-white px-30 py-15">
            SonicBoom
          </h1>
        </div>
        <div className="flex md:visible md:flex w-1/2 justify-end m-10 mr-25">
          <a href={`${UrlEnums.API_URL}/auth/spotify`}>
            <button className="bg-spotifyGreen text-white hover:text-white py-5 px-10 rounded">
              Login with Spotify
            </button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
