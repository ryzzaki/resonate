import React from 'react';

export const AuthContext = React.createContext({
  token: '',
  user: {
    accessToken: '',
    id: '',
    displayName: '',
  },
  setToken: (token: string) => {},
  setUser: (user: any) => {},
});
