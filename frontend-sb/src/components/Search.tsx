import React, { useCallback } from 'react';

function debouncer(func: (...params: any[]) => any, delay: number) {
  let timer: any | undefined = undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

type Props = {};

export const Search: React.FC<Props> = (props) => {
  const debounceSearch = useCallback(
    debouncer((e) => {}, 600),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    debounceSearch(e);
  };

  return (
    <div>
      <input
        placeholder="Search a song..."
        className="transition-colors duration-100 ease-in-out outline-none border-transparent bg-transparent placeholder-darkskinpink text-skinpink font-semibold text-40 rounded-md py-10 px-20 block w-full appearance-none leading-normal ds-input"
        onChange={handleSearch}
      />
      <ul></ul>
    </div>
  );
};
