import React, { useContext, useEffect, useState } from 'react';
import { Link, RouteComponentProps, navigate } from '@reach/router';
import { Header } from './Header';
import { Footer } from './Footer';
import { ReactComponent as RoomGroup } from '../../assets/icons/roomGroup.svg';
import { ReactComponent as Person } from '../../assets/images/Person.svg';
import { ReactComponent as SpotifyLogo } from '../../assets/icons/spotifyLogo.svg';
import { UrlEnums } from '../../enums/urls.enum';
import { fetchSessions } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { CTASection } from './CTASection';

type Props = {};

export const LandingPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const { token } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await fetchSessions(token);
        setRooms(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchRooms();
  }, []);

  const joinRoom = (id: string) => {
    if (token) {
      navigate(`/party?sessionId=${id}`);
    } else {
      localStorage.removeItem('redirect_url');
      localStorage.setItem('redirect_url', `/party?sessionId=${id}`);
      window.location.href = `${UrlEnums.API_URL}/auth/spotify`;
    }
  };

  return (
    <div className="bg-black2 text-white flex">
      <div className="mx-auto max-w-6xl xl:px-80">
        <Header />
        <main className="min-h-screen flex flex-col">
          <section className="flex flex-wrap md:flex-no-wrap py-80">
            <div>
              <h1 className="font-heading text-60 font-bold leading-none gradient-text">
                Real time <br />
                music sharing <br />
                with your friends{' '}
              </h1>
              <p className="text-20 my-40 leading-normal ">
                Stream songs from your Spotify account to anyone who is
                connected. <br />
                Everyone listens to the same song.{' '}
              </p>
              <a
                href={`${UrlEnums.API_URL}/auth/spotify`}
                className="bg-black2light hover:bg-white hover:text-black inline-flex items-center font-semibold text-18 p-10 pr-30 rounded-full"
              >
                <SpotifyLogo className="w-35 h-35 mr-20" />
                Login with Spotify
              </a>
              <p className="text-greylight text-14 mt-20">
                <span>Don't have Spotify premium?</span>{' '}
                <a
                  href="https://www.spotify.com/premium/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Try it for free for 2 months
                </a>
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/2 text-right">
              <Person />
            </div>
          </section>
          <section className="py-80">
            <h2 className="text-center text-40 font-bold mb-80">
              How does it work?{' '}
            </h2>
            <div className="text-center grid grid-cols-3 gap-20">
              <div className="bg-black2light rounded-lg p-20">
                <div className="rounded-full h-60 w-60 flex items-center justify-center border-green text-green border-4 m-auto mb-30 text-20 font-bold">
                  1
                </div>
                <h3 className="font-semibold text-25">Get Spotify Premium</h3>
                <p className="text-greylight text-16 p-10 m-10">
                  To use Resonate, you must be subscribed to{' '}
                  <span className="text-white">Spotify Premium.</span>
                </p>
              </div>
              <div className="bg-black2light rounded-lg p-20">
                <div className="rounded-full h-60 w-60 flex items-center justify-center border-green text-green border-4 m-auto mb-30 text-20 font-bold">
                  2
                </div>
                <h3 className="font-semibold text-25">Login with Spotify</h3>
                <p className="text-greylight text-16 p-10 m-10">
                  <span className="text-white">Login to Resonate</span> with
                  your Spotify account & consent to share basic information.
                </p>
              </div>
              <div className="bg-black2light rounded-lg p-20">
                <div className="rounded-full h-60 w-60 flex items-center justify-center border-green text-green border-4 m-auto mb-30 text-20 font-bold">
                  3
                </div>
                <h3 className="font-semibold text-25">Play & Listen</h3>
                <p className="text-greylight text-16 p-10 m-10">
                  Start using the platform with friends & strangers to stream
                  music collectively!
                </p>
              </div>
            </div>
          </section>
          <section className="py-80" id="rooms">
            <h2 className="text-center text-40 font-bold mb-40">
              {!rooms.length ? 'There are no rooms yet...' : 'Explore Rooms'}
            </h2>
            <div className="flex flex-wrap content-center justify-center flex-1 overscroll-auto max-h-30rem">
              {rooms.map((room: any) => (
                <div
                  key={room.id}
                  className="m-20 max-w-250 bg-black2light rounded-lg group group hover:bg-white p-20 cursor-pointer"
                  onClick={() => joinRoom(room.id)}
                >
                  <img
                    className="rounded-lg"
                    src="https://i.scdn.co/image/ab67706f00000002bf4545e8d7e6b7e377980995"
                  />
                  <div className="py-10">
                    <div className="flex item-center">
                      <h4 className="group-hover:text-black font-bold text-24 text-white overflow-hidden">
                        {room.name}
                      </h4>
                      <div className="flex items-center ml-auto text-greylight">
                        <p className="inline mr-10">
                          {room.connectedUsers.length}
                        </p>
                        <RoomGroup className="fill-current" />
                      </div>
                    </div>
                    <p className="group-hover:text-darkblue pt-10 text-greylight max-h-40 truncate">
                      {room.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};
