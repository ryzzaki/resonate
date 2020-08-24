import React from 'react';
import sessionUser from '../../types/sessionUser';

const randomUserIcons = ['🎸', '🎹', '🎺', '🎻', '🪕', '🎷', '🥁', '🎤'];

type Props = {
  users: sessionUser[];
  currentDJ: sessionUser | undefined;
  isDJ: boolean;
};

export const UserList: React.FC<Props> = (props) => {
  const { users, currentDJ, isDJ } = props;

  return (
    <div className="px-20 flex flex-col h-full">
      <h3 className="text-greylight font-bold uppercase text-14">PARTY DJ</h3>
      <div className="flex mb-20">
        <div className="pr-10 text-20">🎧</div>
        <h5 className="font-semibold text-white w-full whitespace-no-wrap overflow-hidden">
          {currentDJ?.displayName}
        </h5>
      </div>
      <h3 className="text-greylight font-bold uppercase text-14">
        Users
        <span>({users.length})</span>
      </h3>
      <ul className="flex-1">
        {users
          .filter((i) => i.id !== currentDJ?.id)
          .map((user: any) => (
            <li key={user.id} className="group flex mb-5">
              <div className="pt-5 flex">
                <div className="pr-10 text-20">
                  {
                    randomUserIcons[
                      Math.floor(Math.random() * randomUserIcons.length)
                    ]
                  }
                </div>
                <h5 className="text-greylight w-full whitespace-no-wrap overflow-hidden">
                  {user.displayName}
                </h5>
              </div>
            </li>
          ))}
      </ul>
      {isDJ && users.length > 0 && (
        <div className="flex">
          <button className="text-grey font-bold text-center bg-black2light hover:bg-white hover:text-black2 px-30 py-5 rounded-full">
            Leave DJ set
          </button>
        </div>
      )}
    </div>
  );
};
