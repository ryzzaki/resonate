import React from 'react';
import { navigate } from '@reach/router';
import { ReactComponent as RoomGroup } from '../../assets/icons/roomGroup.svg';
import { UrlEnums } from '../../enums/urls.enum';
import Session from '../../types/session';

type Props = {
  logged: boolean;
  room: Session;
};

export const RoomCard: React.FC<Props> = (props) => {
  const { logged, room } = props;

  const joinRoom = (id: string) => {
    if (logged) {
      navigate(`/party?sessionId=${id}`);
    } else {
      localStorage.removeItem('redirect_url');
      localStorage.setItem('redirect_url', `/party?sessionId=${id}`);
      window.location.href = `${UrlEnums.API_URL}/auth/spotify`;
    }
  };

  return (
    <div
      key={room.id}
      className="bg-black2light rounded-lg group group hover:bg-white p-20 cursor-pointer transition duration-300 ease-in-out"
      onClick={() => joinRoom(room.id)}
    >
      <img
        className="rounded-lg"
        alt="song cover"
        src="https://i.scdn.co/image/ab67706f00000002bf4545e8d7e6b7e377980995"
      />
      <div className="py-10">
        <div className="flex item-center">
          <h4 className="group-hover:text-black font-bold text-24 text-white overflow-hidden">
            {room.name}
          </h4>
          <div className="flex items-center ml-auto text-greylight">
            <p className="inline mr-10">{room.connectedUsers.length}</p>
            <RoomGroup className="fill-current" />
          </div>
        </div>
        <p className="group-hover:text-darkblue pt-10 text-greylight max-h-40 truncate">
          {room.description}
        </p>
      </div>
    </div>
  );
};
