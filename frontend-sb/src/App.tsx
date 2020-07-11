import React, { useState, useEffect } from 'react';
import { Router, navigate } from '@reach/router';
import { LandingPage } from './components/LandingPage';
import { RedirectPage } from './components/RedirectPage';
import { DJPage } from './components/DJPage';
import { AuthContext } from './context/AuthContext';
import { UserContext } from './context/UserContext';
import fetchUser from './utils/fetchUser';

function App() {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const access_token = localStorage.getItem('access_key');
    async function fetchUserAndRedirect() {
      try {
        const { data } = await fetchUser(access_token);
        setUser(data);
        navigate('/dj');
      } catch (err) {
        console.log(err);
        navigate('/');
      }
    }
    if (access_token) {
      setToken(access_token);
      fetchUserAndRedirect();
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken }}>
        <UserContext.Provider value={{ user, setUser }}>
          <Router>
            <DJPage path="/dj" />
            <RedirectPage path="/auth" />
            <LandingPage path="/" />
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
