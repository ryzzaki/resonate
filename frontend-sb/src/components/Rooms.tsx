import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchSessions, createSession } from '../utils/api';
import { Link, navigate } from '@reach/router';

type Props = {};

export const Rooms: React.FC<Props> = (props) => {
  const {} = props;

  const { token } = useContext(AuthContext);

  const [rooms, setRooms] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    public: true,
  });

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

  const handleCheck = ({ target }) =>
    setForm((state) => ({ ...state, public: target.checked }));

  const handleInput = ({ target }) =>
    setForm((state) => ({ ...state, [target.name]: target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createSession(token, {
        ...form,
        roomAccess: form.public ? 'PUBLIC' : 'PRIVATE',
      });
      navigate(`/party?sessionId=${data.id}`);
    } catch (err) {
      console.log(err);
    }
    setModal(false);
  };
  return (
    <div className="bg-darkblue min-h-screen flex flex-col relative">
      {modal && (
        <>
          <div
            onClick={() => setModal(false)}
            className="absolute h-full w-full flex bg-black bg-opacity-50"
          />
          <form
            onSubmit={handleSubmit}
            className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white flex flex-col w-30rem p-30"
          >
            <input
              required
              name="name"
              onChange={handleInput}
              className="mb-20 text-30"
              placeholder="Name"
            />
            <input
              name="description"
              onChange={handleInput}
              className="mb-20 text-30"
              placeholder="Description"
            />
            <label>
              <input
                className="mb-40"
                type="checkbox"
                checked={form.public}
                onChange={handleCheck}
              />
              <span className="pl-5">{form.public ? 'Public' : 'Private'}</span>
            </label>
            <button
              type="submit"
              className="bg-pink text-white font-bold text-14
                px-20 py-5 rounded-full uppercase"
            >
              Create
            </button>
          </form>
        </>
      )}
      <nav className="bg-skinpink flex p-20">
        <h1 className="text-30 text-darkblue font-bold">Rooms</h1>
        <button
          onClick={() => setModal(true)}
          className="ml-auto bg-pink text-white font-bold text-14
                px-20 py-5 rounded-full uppercase"
        >
          Create a room
        </button>
      </nav>
      <div className="flex flex-wrap content-center justify-center flex-1">
        {!rooms.length && (
          <p className="text-pink text-30">No rooms (ノಠ益ಠ)ノ彡┻━┻</p>
        )}
        {rooms.map((room: any) => (
          <Link
            key={room.id}
            to={`/party?sessionId=${room.id}`}
            className="bg-skinpink group hover:bg-pink p-20 w-200 cursor-pointer m-20"
          >
            <img
              className="pb-20"
              src="https://i.scdn.co/image/ab67706f00000002bf4545e8d7e6b7e377980995"
            />
            <h4 className="font-bold text-30 pb-10 text-darkblue">
              {room.name}
            </h4>
            <p className="group-hover:text-darkblue text-pink">
              {room.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
