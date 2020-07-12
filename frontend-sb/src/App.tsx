import React, { useState, useEffect } from 'react';
import { Router, navigate, Redirect } from '@reach/router';
import { LandingPage } from './components/LandingPage';
import { RedirectPage } from './components/RedirectPage';
import { DJPage } from './components/DJPage';
import { AuthContext } from './context/AuthContext';
import { UserContext } from './context/UserContext';
import { fetchUser } from './utils/api';

type Props = {
  component: React.FC;
  path: string;
  allowed: boolean;
};

const ProtectedRoute: React.FC<Props> = ({
  component: Component,
  allowed,
  ...props
}) => (allowed ? <Component {...props} /> : <Redirect to="/" noThrow />);

const PublicRoute: React.FC<Props> = ({
  component: Component,
  allowed,
  ...props
}) => (allowed ? <Component {...props} /> : <Redirect to="/party" noThrow />);

function App() {
  const [token, setToken] = useState<string>('');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const access_token = localStorage.getItem('access_key');
    async function fetchUserAndRedirect() {
      try {
        const { data } = await fetchUser(access_token);
        setUser(data);
        navigate('/party');
      } catch (err) {
        console.log(err);
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
            <ProtectedRoute
              path="/party"
              allowed={!!token}
              component={DJPage}
            />
            <PublicRoute
              path="/auth"
              allowed={!token}
              component={RedirectPage}
            />
            <PublicRoute path="/" allowed={!token} component={LandingPage} />
          </Router>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
