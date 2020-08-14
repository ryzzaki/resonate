import React from 'react';
import { Search } from '../Search';
import { Webplayer } from '../Webplayer/Webplayer';
import roomStatus from '../../types/roomStatus';

const randomUserIcons = ['🎸', '🎹', '🎺', '🎻', '🪕', '🎷', '🥁', '🎤'];

type Props = {
  roomStatus: roomStatus;
  spotifyToken: string;
  token: string;
  handleSignOut: () => void;
  handleAuthError: () => void;
  emitPlayState: (state: boolean) => void;
  emitSearchedURIs: (uris: string[]) => void;
};

export const DJPageView: React.FC<Props> = (props) => {
  const {
    roomStatus,
    handleSignOut,
    handleAuthError,
    spotifyToken,
    token,
    emitPlayState,
    emitSearchedURIs,
  } = props;

  console.log(roomStatus);

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
        <ul className="mt-auto flex text-darkblue font-medium px-20">
          <li className="mr-20">
            <a className="cursor-pointer">Settings</a>
          </li>
          <li className="mr-2 0">
            <a className="cursor-pointer" onClick={handleSignOut}>
              Sign Out
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
        <div className="p-20 pr-40 flex-1">
          <Search token={token} emitSearchedURIs={emitSearchedURIs} />
        </div>
        <div className="mt-auto sticky bottom-0 bg-darkblue">
          {roomStatus.currentURI ? (
            <Webplayer
              roomStatus={roomStatus}
              spotifyToken={spotifyToken}
              handleAuthError={handleAuthError}
              emitPlayState={emitPlayState}
            />
          ) : (
            <p>connecting...</p>
          )}
        </div>
      </main>
    </div>
  );
};
