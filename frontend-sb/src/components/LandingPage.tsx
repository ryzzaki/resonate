import React, { useContext, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from '@reach/router';
import Header from './Header';
import Footer from './Footer';
import { UrlEnums } from '../enums/urls.enum';
import noPhoto from '../assets/images/noPhoto.png';
import roomGroup from '../assets/icons/roomGroup.svg';
import spotifyLogo from '../assets/icons/spotifyLogo.svg';
import { fetchSessions } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
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

  return (
    <section className="bg-darkgray text-white xl:px-200 xxl:px-700">
      <Header />
      <div className="min-h-screen flex flex-col text-center font-body">
        <div className="flex-grow w-full md:p-25">
          <div className="flex flex-wrap md:flex-no-wrap m-10 space-x-40">
            <div className="flex-auto w-full md:w-1/2 text-left ">
              <h1 className="font-heading text-30 font-bold leading-snug">
                Real time music sharing with your friends{' '}
              </h1>
              <p className="text-16 my-25">
                Stream songs from your Spotify account to anyone who is
                connected. Everyone listens to the same song.{' '}
              </p>
              <a href={`${UrlEnums.API_URL}/auth/spotify`}>
                <button className="bg-spotifyGreen hover:text-white py-5 px-10 rounded">
                  Login with Spotify
                </button>
              </a>
              <p>
                <span>Don't have Spotify premium?</span>{' '}
                <a href="#" className='underline'>Try it free for 2 months</a>
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/2 text-right">
              <img
                className="inline"
                src={noPhoto}
                alt="No Photo"
                width={500}
                height={500}
              />
            </div>
          </div>
          <h1 className="font-heading text-26 p-10 my-40">
            How does it work?{' '}
          </h1>
          <div className="flex flex-wrap md:flex-no-wrap p-5 m-15">
            <div className="flex-auto w-full md:w-1/3 text-center items-center">
              <div className="rounded-full h-60 w-60 flex items-center justify-center bg-spotifyGreen m-auto mb-10">1</div>
              <h1 className="font-heading text-25">Get Spotify Premium</h1>
              <p className="text-16 p-10 m-10">
                To use SonicBoom, you must be subscribed to <span className='underline'>Spotify Premium.</span>
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/3 text-center">
              <div className="rounded-full h-60 w-60 flex items-center justify-center bg-spotifyGreen m-auto mb-10">2</div>
              <h1 className="font-heading text-25">Login with Spotify</h1>
              <p className="text-16 p-10 m-10">
                <span className='underline'>Login to SonicBoom</span> with your Spotify account & consent to share
                basic information.
              </p>
            </div>
            <div className="flex-auto w-full md:w-1/3 text-center">
              <div className="rounded-full h-60 w-60 flex items-center justify-center bg-spotifyGreen m-auto mb-10">3</div>
              <h1 className="font-heading text-25">Play & Listen</h1>
              <p className="text-16 p-10 m-10">
                Start using the platform with friends & strangers to stream
                music collectively!
              </p>
            </div>
          </div>
          <h1 className="font-heading text-26 p-10 m-10">Explore Rooms </h1>

          <div className="flex flex-wrap content-center justify-center flex-1">
            {rooms.map((room: any) => {
              return (
              <Link
                key={room.id}
                to={`/party?sessionId=${room.id}`}
                className="cursor-pointer m-20 w-250"
              >
                <img className="pb-5" src="https://i.scdn.co/image/ab67706f00000002bf4545e8d7e6b7e377980995" />
                <div className="flex flex-wrap">
                  <p className="font-bold text-25 flex-1 text-left">
                    {room.name}
                  </p>
                  <div className="flex-1 text-right">
                    <p className='text-white inline mr-10'>
                     {room.connectedUsers.length}
                    </p>
                    <img
                      className="inline bg-transparent mb-5"
                      src={roomGroup}
                      alt="Room"
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
              </Link>)
            })}
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};
