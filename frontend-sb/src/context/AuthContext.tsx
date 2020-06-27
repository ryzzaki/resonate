import React from 'react';

export const AuthContext = React.createContext({
  token: '',
  setToken: (token: string) => {},
});
