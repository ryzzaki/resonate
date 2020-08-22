import React from 'react';
import Session from '../../types/session';
import { Link } from '@reach/router';
import { useSignout } from '../../utils/hooks';
import { Search } from '../Search/Search';
import { Webplayer } from '../Webplayer/Webplayer';

const randomUserIcons = ['🎸', '🎹', '🎺', '🎻', '🪕', '🎷', '🥁', '🎤'];

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

  const handleSignOut = useSignout();

  const showDJChangeOption = isDJ && roomState.connectedUsers.length > 1;

  return (
    <div className="min-h-screen flex">
      <aside className="w-30rem bg-skinpink flex flex-col pt-40 pb-20 fixed h-full">
        <h1 className="font-bold tracking-tighter text-40 text-darkblue px-20">
          SonicBoom
        </h1>
        <div className="mt-40 bg-white p-20">
          <ul>
            {roomState?.connectedUsers.map((result: any) => (
              <li key={result.id} className="group flex mb-5">
                <div className="pt-5">
                  <h5 className="font-semibold text-darkblue w-full whitespace-no-wrap overflow-hidden">
                    {roomState?.currentDJ?.id === result.id ? (
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
            <p className="text-center text-pink p-20">Connecting...</p>
          )}
        </div>
      </main>
    </div>
  );
};
