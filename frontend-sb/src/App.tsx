import React, { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { UserContext } from './context/UserContext';
import { fetchUser } from './utils/api';
import { Routes } from './routes';

function App() {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    console.log('app');
    const access_token = localStorage.getItem('access_key');
    async function fetchUserAndRedirect() {
      try {
        console.log('userfetching');
        const { data } = await fetchUser(access_token);
        setUser(data);
        setToken(access_token || '');
      } catch (err) {
        console.error(err);
      }
    }
    if (access_token) {
      fetchUserAndRedirect();
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Routes token={token} />
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
