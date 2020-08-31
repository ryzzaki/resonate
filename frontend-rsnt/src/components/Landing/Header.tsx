import React from 'react';
import { ReactComponent as SpotifyLogo } from '../../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../../enums/urls.enum';
import { useSignout } from '../../utils/hooks';

interface HeaderProps {
  noLogin?: boolean;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const { noLogin } = props;

  const handleSignout = useSignout();

  return (
    <header className="mt-25 py-15 sticky top-0 text-greylight bg-black2">
      <div className="flex items-center">
        <div className="font-logoHeading text-34 text-white">
          <a href="/#">Resonate</a>
        </div>
        <ul className="ml-auto flex items-center">
          {!noLogin && (
            <li className="mr-30 hover:text-white">
              <a href="#rooms">Rooms</a>
            </li>
          )}
          <li className="mr-30 hover:text-white">
            <a href="#kickstarter">Support us</a>
          </li>
          <li className="mr-30 hover:text-white">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSd0CSe90QMNGb0BrsQzpfZVfuiZRlhHKr3NpTfsP71Qpb54Xg/viewform?usp=sf_link"
              target="_blank"
            >
              Bugs/Feedback
            </a>
          </li>
          {!noLogin ? (
            <li>
              <a
                href={`${UrlEnums.API_URL}/auth/spotify`}
                className="bg-black2lighter hover:bg-white text-white  hover:text-black inline-flex items-center font-semibold p-10 pr-20 rounded-full"
              >
                <SpotifyLogo className="w-25 h-25 mr-10" />
                Login with Spotify
              </a>
            </li>
          ) : (
            <li>
              <div
                className="cursor-pointer hover:text-white"
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
