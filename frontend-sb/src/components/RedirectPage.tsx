import React, { useEffect, useContext } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { fetchUser } from '../utils/api';

type Props = {};

export const RedirectPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const { location } = props;

  const { token, setToken } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchUserAndRedirect(token: string) {
      try {
        const { data } = await fetchUser(token);
        setUser(data);
        navigate('/party');
      } catch (err) {
        console.log(err);
      }
    }
    if (location?.hash) {
      const access_token = location?.hash.replace('#access_token=', '');
      localStorage.setItem('access_key', access_token);
      setToken(access_token);
      fetchUserAndRedirect(access_token);
    } else {
      navigate('/');
    }
  }, []);

  return <h1 className="mt-30 text-center text-white">loading...</h1>;
};
