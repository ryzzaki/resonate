import React, { useCallback, useState } from 'react';
import { searchSongs } from '../../utils/api';
import { SearchView } from './Search.view';
import debouncer from '../../utils/debouncer';
import { gaEvent } from '../../utils/analytics';

type Props = {
  token: string;
  emitSearchedURI: (uri: string) => void;
  emitAddQueue: (uri: string) => void;
};

export const Search: React.FC<Props> = (props) => {
  const { token, emitSearchedURI, emitAddQueue } = props;

  const [results, setResults] = useState<any>(null);

  const debounceSearch = useCallback(
    debouncer(async (e) => {
      if (!e.target.value) {
        setResults(null);
        return;
      }
      const { data } = await searchSongs(token, e.target.value);
      setResults(data);
      gaEvent('search_song', 'search');
    }, 300),
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
    gaEvent('select_song', 'search');
  };

  const handleNext = (uri: string) => {
    emitAddQueue(uri);
    closeSearch();
  };

  const closeSearch = () => setResults(null);

  return (
    <SearchView
      results={results}
      handleSearch={handleSearch}
      handleNext={handleNext}
      handleClick={handleClick}
      closeSearch={closeSearch}
    />
  );
};
