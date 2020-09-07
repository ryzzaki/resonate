import React, { useContext } from 'react';
import Session, { UriMetadata } from '../../types/session';
import { Search } from '../Search/Search';
import { Webplayer } from '../Webplayer/Webplayer';
import { Queue } from '../Queue/Queue';
import { Lyrics } from '../Lyrics/Lyrics';
import { UserList } from '../UserList/UserList';
import { AuthContext } from '../../context/AuthContext';
import { useSignout } from '../../utils/hooks';
import { Link } from '@reach/router';
import { ReactComponent as AccountIcon } from '../../assets/icons/account.svg';

type Props = {
  isDJ: boolean;
  spotifyToken: string;
  token: string;
  roomState: Session;
  emitSelectNewDJ: () => void;
  emitSearchedURI: (uri: string) => void;
  emitSliderPos: (progressMs: number) => void;
  emitNextTrack: () => void;
};

export const PartyView: React.FC<Props> = (props) => {
  const {
    isDJ,
    spotifyToken,
    token,
    roomState,
    emitSearchedURI,
    emitSelectNewDJ,
    emitSliderPos,
    emitNextTrack,
  } = props;

  const { user } = useContext(AuthContext);
  const handleSignOut = useSignout();

  return (
    <div className="min-h-screen bg-black2 flex flex-col">
      <div className="flex-1 flex">
        <div className="w-20rem">
          <Search token={token} emitSearchedURI={emitSearchedURI} />
          <Queue uris={roomState.uris} />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-20 px-40 flex items-center text-grey">
            <div className="flex items-baseline">
              <h2 className="text-30 font-bold text-greylight">
                {roomState.name}
              </h2>
              <p className="pl-15">{roomState.description}</p>
            </div>
            <Link
              className="mr-20 ml-auto cursor-pointer hover:text-white transition duration-300 ease-in-out"
              to="/rooms"
            >
              Rooms
            </Link>
            <div
              className="mr-20 cursor-pointer hover:text-white transition duration-300 ease-in-out"
              onClick={handleSignOut}
            >
              Sign Out
            </div>
            <div className="inline-flex pr-20 items-center border-2 border-black2light rounded-full hover:text-white hover:bg-black2light transition duration-300 ease-in-out">
              <AccountIcon className="fill-current text-grey w-30 h-30" />
              <span className="pl-5">{user.displayName}</span>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex flex-1 px-40">
              <div className="flex-1 flex flex-col bg-black2light rounded-md">
                <Lyrics
                  token={token}
                  query={`${
                    roomState.uris[0]?.title
                  }%20${roomState.uris[0]?.artists.join('%20')}`}
                />
              </div>
            </div>
            <div className="w-15rem">
              <UserList
                users={roomState.connectedUsers}
                currentDJ={roomState.currentDJ}
                isDJ={isDJ}
                emitSelectNewDJ={emitSelectNewDJ}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {roomState.uris.length ? (
          <Webplayer
            isDJ={isDJ}
            token={token}
            spotifyToken={spotifyToken}
            roomState={roomState}
            emitSliderPos={emitSliderPos}
            emitNextTrack={emitNextTrack}
            emitSearchedURI={emitSearchedURI}
          />
        ) : (
          <p className="text-center text-grey p-20">Connecting...</p>
        )}
      </div>
    </div>
  );
};
