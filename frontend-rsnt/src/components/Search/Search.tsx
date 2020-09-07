import React, { useCallback, useState } from 'react';
import { searchSongs } from '../../utils/api';
import { SearchView } from './Search.view';
import debouncer from '../../utils/debouncer';

type Props = {
  token: string;
  emitSearchedURI: (uri: string) => void;
};

export const Search: React.FC<Props> = (props) => {
  const { token, emitSearchedURI } = props;

  const [results, setResults] = useState<any>(null);

  const debounceSearch = useCallback(
    debouncer(async (e) => {
      if (!e.target.value) {
        setResults(null);
        return;
      }
      const { data } = await searchSongs(token, e.target.value);
      setResults(data);
    }, 600),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    debounceSearch(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const { uri } = e.currentTarget.dataset;
    emitSearchedURI(uri as string);
    closeSearch();
  };

  const closeSearch = () => setResults(null);

  return (
    <SearchView
      results={results}
      handleSearch={handleSearch}
      handleClick={handleClick}
      closeSearch={closeSearch}
    />
  );
};
