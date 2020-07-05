import React, { useState, useEffect } from 'react';
import { Router, navigate } from '@reach/router';
import { LandingPage } from './components/LandingPage';
import { RedirectPage } from './components/RedirectPage';
import { DJPage } from './components/DJPage';
import { AuthContext } from './context/AuthContext';

function App() {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const access_token = localStorage.getItem('access_key');
    if (access_token) {
      setToken(access_token);
      navigate('/dj');
    }
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken }}>
        <Router>
          <DJPage path="/dj" />
          <RedirectPage path="/auth" />
          <LandingPage path="/" />
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
