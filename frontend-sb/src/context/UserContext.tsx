import React from 'react';

export const UserContext = React.createContext({
  user: {
    accessToken: '',
    id: '',
  },
  setUser: (user: any) => {},
});
