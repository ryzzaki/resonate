import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { fetchUser } from './utils/api';
import { Routes } from './routes';
import { gaSetUser, initGA } from './utils/analytics';
import { globalHistory } from '@reach/router';
import AppConfig from './config/app.config';

declare global {
  interface Window {
    gtag: any;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    if (AppConfig.serverSettings.serverMode !== 'development') {
      initGA();
      globalHistory.listen(({ location }) => {
        window.gtag('config', 'UA-175957253-1', {
          page_title: location.pathname,
          page_path: location.pathname,
        });
      });
    }
    setLoading(true);
    const access_token = localStorage.getItem('access_key');
    async function fetchUserAndRedirect() {
      try {
        const { data } = await fetchUser(access_token);
        setUser(data);
        setToken(access_token || '');
        gaSetUser(data.id);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    if (access_token && window.location.pathname !== '/auth/') {
      fetchUserAndRedirect();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken, user, setUser }}>
        {loading ? <p>Loading...</p> : <Routes token={token} />}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
