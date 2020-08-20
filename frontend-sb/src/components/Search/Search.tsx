import React, { useCallback, useState } from 'react';
import { searchSongs } from '../../utils/api';
import { SearchView } from './Search.view';
import debouncer from '../../utils/debouncer';

type Props = {
  token: string;
  emitSearchedURIs: (uris: string[]) => void;
};

export const Search: React.FC<Props> = (props) => {
  const { token, emitSearchedURIs } = props;

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

  const handleClickURIs = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const { uris } = e.currentTarget.dataset;
    if (uris) {
      emitSearchedURIs(uris.split(','));
    }
  };

  return (
    <SearchView
      results={results}
      handleClickURIs={handleClickURIs}
      handleSearch={handleSearch}
    />
  );
};
