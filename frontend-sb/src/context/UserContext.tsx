import React from 'react';

export const UserContext = React.createContext({
  user: {
    accessToken: '',
  },
  setUser: (user: any) => {},
});
