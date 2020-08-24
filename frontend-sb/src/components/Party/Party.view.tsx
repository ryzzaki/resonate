import React, { useContext } from 'react';
import Session from '../../types/session';
import { Search } from '../Search/Search';
import { Webplayer } from '../Webplayer/Webplayer';
import { Queue } from '../Queue/Queue';
import { UserList } from '../UserList/UserList';
import { AuthContext } from '../../context/AuthContext';
import { useSignout } from '../../utils/hooks';
import { ReactComponent as AccountIcon } from '../../assets/icons/account.svg';

type Props = {
  isDJ: boolean;
  spotifyToken: string;
  token: string;
  roomState: Session;
  emitSelectNewDJ: () => void;
  emitSearchedURI: (uri: string) => void;
  emitSliderPos: (progressMs: number) => void;
  emitNextTrack: (uri: string) => void;
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
          <Queue />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-20 px-40 flex items-center text-grey">
            <div>
              <h2 className="text-30 font-bold text-greylight">
                {roomState.name}
              </h2>
            </div>
            <div
              className="mr-20 ml-auto cursor-pointer"
              onClick={handleSignOut}
            >
              Logout
            </div>
            <div className="inline-flex pr-20 items-center bg-black2light rounded-full">
              <AccountIcon className="fill-current text-grey w-40 h-40" />
              <span className="pl-10">{user.displayName}</span>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex flex-1 px-40">
              <div className="flex-1 bg-black2light rounded-md"></div>
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
