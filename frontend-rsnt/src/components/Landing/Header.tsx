import React from 'react';
import { ReactComponent as SpotifyLogo } from '../../assets/icons/spotifyLogo.svg';
import { ReactComponent as Logo } from '../../assets/icons/Logo.svg';
import { UrlEnums } from '../../enums/urls.enum';
import { useSignout } from '../../utils/hooks';

interface HeaderProps {
  noLogin?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { noLogin } = props;

  const handleSignout = useSignout();

  return (
    <header className="-mx-80 px-80 mt-25 py-15 sticky z-10 top-0 text-greylight bg-black2">
      <div className="flex items-center">
        <a
          href="/#"
          className="font-logoHeading text-34 text-white flex items-center"
        >
          <Logo className="w-30 mr-15 pb-5" />
          Resonate
        </a>
        <ul className="ml-auto flex items-center">
          {!noLogin && (
            <li className="mr-30 hover:text-white transition duration-300 ease-in-out">
              <a href="#rooms">Rooms</a>
            </li>
          )}
          <li className="mr-30 hover:text-white transition duration-300 ease-in-out">
            <a href="#kickstarter">Support us</a>
          </li>
          <li className="mr-30 hover:text-white transition duration-300 ease-in-out">
            <a
              href="https://musicxp.typeform.com/to/WgGETI7v"
              rel="noopener noreferrer"
              target="_blank"
            >
              Bugs/Feedback
            </a>
          </li>
          {!noLogin ? (
            <li>
              <a
                href={`${UrlEnums.API_URL}/auth/spotify`}
                className="bg-black2lighter hover:bg-white text-white hover:text-black inline-flex items-center font-semibold p-10 pr-20 rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
              >
                <SpotifyLogo className="w-25 h-25 mr-10" />
                Login with Spotify
              </a>
            </li>
          ) : (
            <li>
              <div
                className="cursor-pointer hover:text-white transition duration-300 ease-in-out"
                onClick={handleSignout}
              >
                Sign out
              </div>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};
