import React, { useContext } from 'react';
import Session from '../../types/session';
import { Search } from '../Search/Search';
import { Webplayer } from '../Webplayer/Webplayer';
import { Queue } from '../Queue/Queue';
import { UserList } from '../UserList/UserList';
import { AuthContext } from '../../context/AuthContext';
import { ReactComponent as AccountIcon } from '../../assets/icons/account.svg';
import { useSignout } from '../../utils/hooks';

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
          <div className="p-20 px-40 flex items-center text-greylight">
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

  // return (
  //   <div className="min-h-screen flex">
  //     <aside className="w-30rem bg-skinpink flex flex-col pt-40 pb-20 fixed h-full">
  //       <h1 className="font-bold tracking-tighter text-40 text-darkblue px-20">
  //         SonicBoom
  //       </h1>
  //       <div className="mt-40 bg-white p-20">
  //         <ul>
  //           {roomState?.connectedUsers.map((result: any) => (
  //             <li key={result.id} className="group flex mb-5">
  //               <div className="pt-5">
  //                 <h5 className="font-semibold text-darkblue w-full whitespace-no-wrap overflow-hidden">
  //                   {roomState?.currentDJ?.id === result.id ? (
  //                     <span className="text-black">
  //                       [DJ] 🎧 {result.displayName}
  //                     </span>
  //                   ) : (
  //                     `${
  //                       randomUserIcons[
  //                         Math.floor(Math.random() * randomUserIcons.length)
  //                       ]
  //                     } ${result.displayName}`
  //                   )}
  //                 </h5>
  //               </div>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //       {showDJChangeOption && (
  //         <div className="flex pt-10">
  //           <button
  //             className="mx-auto bg-pink text-white font-bold text-14
  //               px-20 py-5 rounded-full uppercase"
  //             onClick={emitSelectNewDJ}
  //           >
  //             shuffle DJ
  //           </button>
  //         </div>
  //       )}
  //       <ul className="mt-auto flex text-darkblue font-medium px-20 text-14">
  //         <li className="mr-20">
  //           <div className="cursor-pointer">
  //             <Link to="/rooms">Rooms</Link>
  //           </div>
  //         </li>
  //         <li className="mr-20">
  //           <div className="cursor-pointer">Settings</div>
  //         </li>
  //         <li className="mr-20">
  //           <a
  //             className="cursor-pointer"
  //             target="_blank"
  //             href="https://github.com/ryzzaki/SonicBoom/issues"
  //           >
  //             Report a bug
  //           </a>
  //         </li>
  //         <li>
  //           <div className="cursor-pointer" onClick={handleSignOut}>
  //             Sign Out
  //           </div>
  //         </li>
  //       </ul>
  //     </aside>
  //     <main className="flex-col flex flex-1 bg-darkblue ml-30rem">
  //       <div className="p-20 pr-40 flex-1">
  //         <Search token={token} emitSearchedURI={emitSearchedURI} />
  //       </div>
  //       <div className="mt-auto bottom-0 sticky bg-darkblue">
  //         {roomState.uris.length ? (
  //           <Webplayer
  //             isDJ={isDJ}
  //             token={token}
  //             spotifyToken={spotifyToken}
  //             roomState={roomState}
  //             emitSliderPos={emitSliderPos}
  //             emitNextTrack={emitNextTrack}
  //             emitSearchedURI={emitSearchedURI}
  //           />
  //         ) : (
  //           <p className="text-center text-pink p-20">Connecting...</p>
  //         )}
  //       </div>
  //     </main>
  //   </div>
  // );
};
