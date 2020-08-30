import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { refreshUser, signOutUser } from '../utils/api';

export const useRefresh = () => {
  const { token, setToken, setUser } = useContext(AuthContext);
  const signout = useSignout();
  async function refreshToken() {
    try {
      const { data } = await refreshUser(token);
      setToken(data.accessToken);
      setUser((state) => ({ ...state, accessToken: data.spotifyAccessToken }));
    } catch (err) {
      console.error(err);
      signout();
    }
  }
  return refreshToken;
};

export const useSignout = () => {
  function signout() {
    localStorage.removeItem('access_key');
    localStorage.removeItem('redirect_url');
    signOutUser();
  }

  return signout;
};
