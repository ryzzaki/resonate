import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { fetchUser } from './utils/api';
import { Routes } from './routes';
import { initGA } from './utils/ga';

function App() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>({});
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // initGA();
    setLoading(true);
    const access_token = localStorage.getItem('access_key');
    async function fetchUserAndRedirect() {
      try {
        const { data } = await fetchUser(access_token);
        setUser(data);
        setToken(access_token || '');
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
