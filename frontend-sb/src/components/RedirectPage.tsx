import React, { useEffect, useContext } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { AuthContext } from '../context/AuthContext';

type Props = {};

export const RedirectPage: React.FC<RouteComponentProps<Props>> = (props) => {
  const { location } = props;

  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (location?.hash && !localStorage.getItem('access_key')) {
      const access_token = location?.hash.replace('#access_token=', '');
      localStorage.setItem('access_key', access_token);
      setToken(access_token);
      navigate('/dj');
    } else {
      navigate('/');
    }
  }, []);

  return <h1>loading...</h1>;
};
