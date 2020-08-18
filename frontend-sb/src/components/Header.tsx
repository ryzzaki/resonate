import React from 'react';
import spotifyLogo from '../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../enums/urls.enum';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header className="bg-darkgray p-5">
      <div className="flex flex-no-wrap justify-between">
        <div className="flex-auto w-auto md:w-1/2 text-center md:text-left">
          <h1 className="font-logoHeading text-34 text-white px-25 py-15">
            SonicBoom <span className="font-body text-14 md:text-18">v1.0</span>
          </h1>
        </div>
        <div className="flex hidden md:visible md:flex w-1/2 justify-end m-10 mr-25">
          <a href={`${UrlEnums.API_URL}/auth/spotify`}>
            <button className="bg-transparent hover:bg-verydarkgray text-green hover:text-green border border-green font-heading py-5 px-10 rounded">
              <img
                className="inline mr-3 bg-transparent rounded-full"
                src={spotifyLogo}
                width="15"
                height="15"
                alt="Spotify Logo"
              />
              Login with Spotify
            </button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
