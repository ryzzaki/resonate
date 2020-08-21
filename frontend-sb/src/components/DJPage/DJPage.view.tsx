import React from 'react';
import { Search } from '../Search/Search';
import { Webplayer } from '../Webplayer/Webplayer';
import roomStatus from '../../types/roomStatus';
import { Link } from '@reach/router';

const randomUserIcons = ['🎸', '🎹', '🎺', '🎻', '🪕', '🎷', '🥁', '🎤'];

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  isDJ: boolean;
  handleSignOut: () => void;
  handleAuthError: () => void;
  emitSelectNewDJ: () => void;
  emitSearchedURI: (uri: string) => void;
  emitSliderPos: (progressMs: number) => void;
};

export const DJPageView: React.FC<Props> = (props) => {
  const {
    roomStatus,
    isDJ,
    handleSignOut,
    handleAuthError,
    spotifyToken,
    token,
    emitSliderPos,
    emitSearchedURI,
    emitSelectNewDJ,
  } = props;

  const showDJChangeOption = isDJ && roomStatus.connectedUsers.length > 1;

  return (
    <div className="min-h-screen flex">
      <aside className="w-30rem bg-skinpink flex flex-col pt-40 pb-20 fixed h-full">
        <h1 className="font-bold tracking-tighter text-40 text-darkblue px-20">
          SonicBoom
        </h1>
        <div className="mt-40 bg-white p-20">
          <ul>
            {roomStatus?.connectedUsers.map((result: any) => (
              <li key={result.id} className="group flex mb-5">
                <div className="pt-5">
                  <h5 className="font-semibold text-darkblue w-full whitespace-no-wrap overflow-hidden">
                    {roomStatus?.currentDJ?.id === result.id ? (
                      <span className="text-black">
                        [DJ] 🎧 {result.displayName}
                      </span>
                    ) : (
                      `${
                        randomUserIcons[
                          Math.floor(Math.random() * randomUserIcons.length)
                        ]
                      } ${result.displayName}`
                    )}
                  </h5>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {showDJChangeOption && (
          <div className="flex pt-10">
            <button
              className="mx-auto bg-pink text-white font-bold text-14
                px-20 py-5 rounded-full uppercase"
              onClick={emitSelectNewDJ}
            >
              shuffle DJ
            </button>
          </div>
        )}
        <ul className="mt-auto flex text-darkblue font-medium px-20 text-14">
          <li className="mr-20">
            <div className="cursor-pointer">
              <Link to="/rooms">Rooms</Link>
            </div>
          </li>
          <li className="mr-20">
            <div className="cursor-pointer">Settings</div>
          </li>
          <li className="mr-20">
            <a
              className="cursor-pointer"
              target="_blank"
              href="https://github.com/ryzzaki/SonicBoom/issues"
            >
              Report a bug
            </a>
          </li>
          <li>
            <div className="cursor-pointer" onClick={handleSignOut}>
              Sign Out
            </div>
          </li>
        </ul>
      </aside>
      <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
        <div className="p-20 pr-40 flex-1">
          <Search token={token} emitSearchedURI={emitSearchedURI} />
        </div>
        <div className="mt-auto bottom-0 sticky bg-darkblue">
          {roomStatus.currentURI.length ? (
            <Webplayer
              isDJ={isDJ}
              roomStatus={roomStatus}
              token={token}
              spotifyToken={spotifyToken}
              handleAuthError={handleAuthError}
              emitSliderPos={emitSliderPos}
            />
          ) : (
            <p className="text-center text-pink p-20">Connecting...</p>
          )}
        </div>
      </main>
    </div>
  );
};
