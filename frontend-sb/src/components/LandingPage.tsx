import React, { useContext } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import Header from './Header';
import Footer from './Footer';
import spotifyLogo from '../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../enums/urls.enum';
import { AuthContext } from '../context/AuthContext';

type Props = {};

export const LandingPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const { token, setToken } = useContext(AuthContext);

  if (token) navigate('/dj');

  return (
    <section className="bg-white">
      <Header />
      <div className="min-h-screen flex flex-col text-center font-body">
        <div className="flex-grow w-full p-10 md:p-25">
          <div className="flex justify-center m-15">
            <div className="md:w-1/2 p-5">
              <h1 className="font-heading text-26 p-10 m-10">
                Real time music sharing with your{' '}
                <span className="text-green">friends</span>!{' '}
                <span role="img" aria-label="Smiling Emoji">
                  😁
                </span>
              </h1>
              <p className="text-16 p-10 m-10">
                Sonic Boom allows you to stream songs from your Spotify account
                to anyone who is connected. Everyone listens to the same song.{' '}
                <span className="font-heading">Maximum.</span>{' '}
                <span className="font-heading text-green">Synergy.</span>
              </p>
            </div>
          </div>
          <hr className="p-5 mx-40" />
          <h1 className="font-heading text-26 p-10 m-10">
            How does it work?{' '}
            <span role="img" aria-label="Thinking Emoji">
              🤔
            </span>
          </h1>
          <div className="flex flex-wrap md:flex-no-wrap p-5 m-15">
            <div className="flex-auto w-full md:w-1/3">
              <h1 className="font-heading text-18">
                <span className="text-green">1.</span> Spotify Premium
              </h1>
              <p className="text-16 p-10 m-10">
                To use Sonic Boom, you must be subscribed to Spotify Premium.
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/3">
              <h1 className="font-heading text-18">
                <span className="text-green">2.</span> Login with{' '}
                <span className="text-green">
                  {' '}
                  <img
                    className="inline mr-3"
                    src={spotifyLogo}
                    width="15"
                    height="15"
                    alt="Spotify Logo"
                  />
                  Spotify
                </span>
              </h1>
              <p className="text-16 p-10 m-10">
                Login to Sonic Boom with your Spotify account & consent to share
                basic information.
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/3">
              <h1 className="font-heading text-18">
                <span className="text-green">3.</span> Play & Listen
              </h1>
              <p className="text-16 p-10 m-10">
                Start using the platform with friends & strangers to stream
                music collectively!
              </p>
            </div>
          </div>
          <hr className="p-5 mx-40" />
          <div className="flex justify-center m-15">
            <div className="w-full md:w-1/2 p-5">
              <h1 className="font-heading text-26 p-10 m-10">
                Does it cost anything?{' '}
                <span role="img" aria-label="Money Emoji">
                  💸
                </span>
              </h1>
              <p className="text-16 p-10 m-10">
                <span className="font-heading">Nope!</span> Sonic Boom is{' '}
                <span className="font-heading text-green">completely free</span>{' '}
                to use! It is also{' '}
                <a
                  className="underline text-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/ryzzaki/SonicBoom/blob/master/LICENSE"
                >
                  MIT licensed
                </a>{' '}
                - feel free to contribute to the{' '}
                <a
                  className="underline text-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/ryzzaki/SonicBoom"
                >
                  open sourced code!
                </a>
              </p>
            </div>
          </div>
          <a href={`${UrlEnums.API_URL}/auth/spotify`}>
            <button className="bg-transparent hover:bg-darkgray text-green hover:text-green border border-green font-heading py-5 px-10 m-20 rounded">
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
        <Footer />
      </div>
    </section>
  );
};
