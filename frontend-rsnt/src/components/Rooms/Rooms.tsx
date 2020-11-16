import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchSessions } from '../../utils/api';
import { Modal } from './Modal';
import { Header } from '../Landing/Header';
import { Footer } from '../Landing/Footer';
import { CTASection } from '../Landing/CTASection';
import { RoomCard } from './RoomCard';
import { MobileWarning } from '../MobileWarning';

export const Rooms: React.FC = () => {
  const { token } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);

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
    <div className="bg-black2 text-white px-80 min-h-screen flex flex-col relative">
      {modal && <Modal token={token} closeModal={() => setModal(false)} />}
      <MobileWarning />
      <Header noLogin />
      <main className="flex-wrap content-center justify-center flex-1 pt-20 pb-80">
        <div className="flex items-center">
          <h1 className="text-40 font-bold my-40">Explore rooms</h1>
          <button
            onClick={() => setModal(true)}
            className="ml-auto bg-white text-black font-bold text-14 px-20 py-5 rounded-full uppercase transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            Create a room
          </button>
        </div>
        {!rooms.length && (
          <p className="text-greylight text-30">No rooms (ノಠ益ಠ)ノ彡┻━┻</p>
        )}
        <div className="grid grid-cols-5 gap-30">
          {rooms.map((room: any) => (
            <RoomCard key={room.id} logged={!!token} room={room} />
          ))}
        </div>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
};
