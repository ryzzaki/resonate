import React from 'react';

export const UserContext = React.createContext({
  user: {
    spotifyAccessToken: '',
  },
  setUser: (user: any) => {},
});
