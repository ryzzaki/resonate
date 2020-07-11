import React from 'react';

type Props = {};

export const Search: React.FC<Props> = (props) => {
  const {} = props;

  return (
    <div>
      <input
        placeholder="Search a song..."
        className="transition-colors duration-100 ease-in-out outline-none border-transparent bg-transparent placeholder-darkskinpink text-skinpink font-semibold text-40 rounded-md py-10 px-20 block w-full appearance-none leading-normal ds-input"
      />
      <ul></ul>
    </div>
  );
};
